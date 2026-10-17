
import pool from "../db/database.js";

const createTopic = async (userId, subjectId, topicData) => {
  const {
    name,
    description,
    difficulty,
    priority,
    durationMinutes,
  } = topicData;

  const result = await pool.query(
    `INSERT INTO topics (
       subject_id,
       name,
       description,
       difficulty,
       priority,
       duration_minutes
     )
     SELECT
       subjects.id,
       $3,
       $4,
       $5,
       $6,
       $7
     FROM subjects
     INNER JOIN plans ON plans.id = subjects.plan_id
     WHERE subjects.id = $1
       AND plans.user_id = $2
       AND plans.status = 'ACTIVE'
     RETURNING
       id,
       subject_id,
       name,
       description,
       difficulty,
       priority,
       duration_minutes,
       created_at,
       updated_at`,
    [
      subjectId,
      userId,
      name.trim(),
      description?.trim() || null,
      difficulty,
      priority,
      durationMinutes,
    ]
  );

  return result.rows[0] || null;
};

const getTopicsBySubject = async (userId, subjectId) => {
  const result = await pool.query(
    `SELECT
       topics.id,
       topics.subject_id,
       topics.name,
       topics.description,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       topics.created_at,
       topics.updated_at
     FROM topics
     INNER JOIN subjects ON subjects.id = topics.subject_id
     INNER JOIN plans ON plans.id = subjects.plan_id
     WHERE subjects.id = $1
       AND plans.user_id = $2
     ORDER BY topics.created_at DESC`,
    [subjectId, userId]
  );

  return result.rows;
};

const getTopicById = async (userId, topicId) => {
  const result = await pool.query(
    `SELECT
       topics.id,
       topics.subject_id,
       topics.name,
       topics.description,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       topics.created_at,
       topics.updated_at
     FROM topics
     INNER JOIN subjects ON subjects.id = topics.subject_id
     INNER JOIN plans ON plans.id = subjects.plan_id
     WHERE topics.id = $1
       AND plans.user_id = $2`,
    [topicId, userId]
  );

  return result.rows[0] || null;
};

const updateTopic = async (userId, topicId, topicData) => {
  const {
    name,
    description,
    difficulty,
    priority,
    durationMinutes,
  } = topicData;

  const result = await pool.query(
    `UPDATE topics
     SET
       name = $1,
       description = $2,
       difficulty = $3,
       priority = $4,
       duration_minutes = $5,
       updated_at = NOW()
     FROM subjects, plans
     WHERE topics.id = $6
       AND subjects.id = topics.subject_id
       AND plans.id = subjects.plan_id
       AND plans.user_id = $7
       AND plans.status = 'ACTIVE'
     RETURNING
       topics.id,
       topics.subject_id,
       topics.name,
       topics.description,
       topics.difficulty,
       topics.priority,
       topics.duration_minutes,
       topics.updated_at`,
    [
      name.trim(),
      description?.trim() || null,
      difficulty,
      priority,
      durationMinutes,
      topicId,
      userId,
    ]
  );

  return result.rows[0] || null;
};

const deleteTopic = async (userId, topicId) => {
  const result = await pool.query(
    `DELETE FROM topics
     USING subjects, plans
     WHERE topics.id = $1
       AND subjects.id = topics.subject_id
       AND plans.id = subjects.plan_id
       AND plans.user_id = $2
       AND plans.status = 'ACTIVE'
     RETURNING topics.id, topics.name`,
    [topicId, userId]
  );

  return result.rows[0] || null;
};

export {
  createTopic,
  getTopicsBySubject,
  getTopicById,
  updateTopic,
  deleteTopic,
};
