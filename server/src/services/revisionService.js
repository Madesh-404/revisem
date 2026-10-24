
import pool from "../db/database.js";
import {
  calculateNextRevisionDate,
  getRevisionInterval,
} from "./revisionSchedulingService.js";

const getTodayRevisions = async (userId) => {
  const result = await pool.query(
    `SELECT
       revisions.id,
       revisions.topic_id,
       revisions.scheduled_date,
       revisions.status,
       revisions.started_at,
       topics.name AS topic_name,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       subjects.name AS subject_name,
       plans.id AS plan_id,
       plans.name AS plan_name
     FROM revisions
     INNER JOIN topics
       ON topics.id = revisions.topic_id
     INNER JOIN subjects
       ON subjects.id = topics.subject_id
     INNER JOIN plans
       ON plans.id = subjects.plan_id
     WHERE plans.user_id = $1
       AND revisions.scheduled_date = CURRENT_DATE
       AND revisions.status NOT IN ('COMPLETED', 'SKIPPED')
     ORDER BY
       CASE topics.priority
         WHEN 'HIGH' THEN 1
         WHEN 'MEDIUM' THEN 2
         WHEN 'LOW' THEN 3
       END,
       revisions.id`,
    [userId]
  );

  return result.rows;
};


const getUpcomingRevisions = async (userId) => {
  const result = await pool.query(
    `SELECT
       revisions.id,
       revisions.topic_id,
       revisions.scheduled_date,
       revisions.status,
       topics.name AS topic_name,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       subjects.name AS subject_name,
       plans.id AS plan_id,
       plans.name AS plan_name
     FROM revisions
     INNER JOIN topics
       ON topics.id = revisions.topic_id
     INNER JOIN subjects
       ON subjects.id = topics.subject_id
     INNER JOIN plans
       ON plans.id = subjects.plan_id
     WHERE plans.user_id = $1
       AND revisions.scheduled_date > CURRENT_DATE
       AND revisions.status NOT IN ('COMPLETED', 'SKIPPED')
     ORDER BY
       revisions.scheduled_date ASC,
       CASE topics.priority
         WHEN 'HIGH' THEN 1
         WHEN 'MEDIUM' THEN 2
         WHEN 'LOW' THEN 3
       END`,
    [userId]
  );

  return result.rows;
};

const getOverdueRevisions = async (userId) => {
  const result = await pool.query(
    `SELECT
       revisions.id,
       revisions.topic_id,
       revisions.scheduled_date,
       revisions.status,
       topics.name AS topic_name,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       subjects.name AS subject_name,
       plans.id AS plan_id,
       plans.name AS plan_name
     FROM revisions
     INNER JOIN topics
       ON topics.id = revisions.topic_id
     INNER JOIN subjects
       ON subjects.id = topics.subject_id
     INNER JOIN plans
       ON plans.id = subjects.plan_id
     WHERE plans.user_id = $1
       AND revisions.scheduled_date < CURRENT_DATE
       AND revisions.status NOT IN ('COMPLETED', 'SKIPPED')
     ORDER BY
       revisions.scheduled_date ASC,
       CASE topics.priority
         WHEN 'HIGH' THEN 1
         WHEN 'MEDIUM' THEN 2
         WHEN 'LOW' THEN 3
       END`,
    [userId]
  );

  return result.rows;
};


const startRevision = async (userId, revisionId) => {
  const result = await pool.query(
    `UPDATE revisions
     SET
       status = 'IN_PROGRESS',
       started_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status = 'SCHEDULED'
       AND topic_id IN (
         SELECT topics.id
         FROM topics
         INNER JOIN subjects
           ON subjects.id = topics.subject_id
         INNER JOIN plans
           ON plans.id = subjects.plan_id
         WHERE plans.user_id = $2
       )
     RETURNING
       id,
       topic_id,
       scheduled_date,
       status,
       started_at`,
    [revisionId, userId]
  );

  return result.rows[0] || null;
};


const completeRevision = async (
  userId,
  revisionId,
  performance
) => {
  const validPerformances = ["AGAIN", "HARD", "GOOD", "EASY"];

  if (!validPerformances.includes(performance)) {
    throw new Error("INVALID_PERFORMANCE");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Lock the revision and verify ownership.

const revisionResult = await client.query(
  `SELECT
     revisions.id,
     revisions.topic_id,
     revisions.scheduled_date,
     revisions.status,
     COALESCE(
       (
         SELECT revision_history.next_interval
         FROM revision_history
         WHERE revision_history.topic_id = revisions.topic_id
           AND revision_history.scheduled_date = revisions.scheduled_date
         ORDER BY revision_history.created_at DESC
         LIMIT 1
       ),
       1
     ) AS previous_interval
   FROM revisions
   INNER JOIN topics
     ON topics.id = revisions.topic_id
   INNER JOIN subjects
     ON subjects.id = topics.subject_id
   INNER JOIN plans
     ON plans.id = subjects.plan_id
   WHERE revisions.id = $1
     AND plans.user_id = $2
   FOR UPDATE OF revisions`,
  [revisionId, userId]
);


    const revision = revisionResult.rows[0];

    if (!revision) {
      await client.query("ROLLBACK");
      return null;
    }

    // 2. Only scheduled or in-progress revisions can be completed.
    if (
      revision.status !== "SCHEDULED" &&
      revision.status !== "IN_PROGRESS"
    ) {
      const error = new Error("REVISION_NOT_COMPLETABLE");
      throw error;
    }

    // 3. Calculate the next revision date from today,
    // not the original scheduled date.
    const dateResult = await client.query(
      "SELECT CURRENT_DATE::text AS today"
    );

    const today = dateResult.rows[0].today;

    const nextRevisionDate = calculateNextRevisionDate(
      today,
      performance
    );

    const nextInterval = getRevisionInterval(performance);

    // 4. Complete the current revision.
    const completedResult = await client.query(
      `UPDATE revisions
       SET
         status = 'COMPLETED',
         performance = $2,
         completed_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, topic_id, scheduled_date, status,
                 performance, completed_at`,
      [revisionId, performance]
    );

    const completedRevision = completedResult.rows[0];

    // 5. Schedule the next revision.
    const nextRevisionResult = await client.query(
      `INSERT INTO revisions (
         topic_id,
         scheduled_date,
         status
       )
       VALUES ($1, $2, 'SCHEDULED')
       ON CONFLICT (topic_id, scheduled_date) DO NOTHING
       RETURNING id, topic_id, scheduled_date, status`,
      [revision.topic_id, nextRevisionDate]
    );

    // 6. Record the performance and scheduling decision.
    await client.query(
      `INSERT INTO revision_history (
         revision_id,
         topic_id,
         performance,
         previous_interval,
         next_interval,
         scheduled_date,
         completed_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
[
  completedRevision.id,
  revision.topic_id,
  performance,
  revision.previous_interval,
  nextInterval,
  nextRevisionDate,
  completedRevision.completed_at,
]
    );

    await client.query("COMMIT");

    return {
      completedRevision,
      nextRevision: nextRevisionResult.rows[0] || null,
      nextRevisionDate,
      nextInterval,
    };
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Transaction rollback failed:", rollbackError);
    }

    throw error;
  } finally {
    client.release();
  }
};


const skipRevision = async (userId, revisionId) => {
  const result = await pool.query(
    `UPDATE revisions
     SET
       status = 'SKIPPED',
       skipped_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status IN ('SCHEDULED', 'IN_PROGRESS')
       AND topic_id IN (
         SELECT topics.id
         FROM topics
         INNER JOIN subjects
           ON subjects.id = topics.subject_id
         INNER JOIN plans
           ON plans.id = subjects.plan_id
         WHERE plans.user_id = $2
       )
     RETURNING
       id,
       topic_id,
       scheduled_date,
       status,
       skipped_at`,
    [revisionId, userId]
  );

  return result.rows[0] || null;
};


export {
  getTodayRevisions,
  getUpcomingRevisions,
  getOverdueRevisions,
  startRevision,
  completeRevision,
  skipRevision,
};