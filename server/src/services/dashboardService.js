
import pool from "../db/database.js";

const getDashboardSummary = async (userId) => {
  const result = await pool.query(
    `WITH active_plans AS (
      SELECT
        id,
        name,
        daily_capacity
      FROM plans
      WHERE user_id = $1
        AND status = 'ACTIVE'
    ),
    revision_stats AS (
      SELECT
        COUNT(revisions.id) AS total_revisions,
        COUNT(revisions.id) FILTER (
          WHERE revisions.status = 'COMPLETED'
        ) AS completed_revisions
      FROM active_plans
      INNER JOIN subjects
        ON subjects.plan_id = active_plans.id
      INNER JOIN topics
        ON topics.subject_id = subjects.id
      INNER JOIN revisions
        ON revisions.topic_id = topics.id
    ),
    overdue_stats AS (
      SELECT COUNT(revisions.id) AS overdue_revisions
      FROM active_plans
      INNER JOIN subjects
        ON subjects.plan_id = active_plans.id
      INNER JOIN topics
        ON topics.subject_id = subjects.id
      INNER JOIN revisions
        ON revisions.topic_id = topics.id
      WHERE revisions.scheduled_date < CURRENT_DATE
        AND revisions.status NOT IN ('COMPLETED', 'SKIPPED')
    ),
    today_by_plan AS (
      SELECT
        active_plans.id AS plan_id,
        active_plans.name AS plan_name,
        active_plans.daily_capacity,
        COUNT(revisions.id) AS due_revisions,
        COALESCE(SUM(topics.duration_minutes), 0) AS estimated_minutes
      FROM active_plans
      LEFT JOIN subjects
        ON subjects.plan_id = active_plans.id
      LEFT JOIN topics
        ON topics.subject_id = subjects.id
      LEFT JOIN revisions
        ON revisions.topic_id = topics.id
        AND revisions.scheduled_date = CURRENT_DATE
        AND revisions.status NOT IN ('COMPLETED', 'SKIPPED')
      GROUP BY
        active_plans.id,
        active_plans.name,
        active_plans.daily_capacity
    )
    SELECT
      revision_stats.total_revisions,
      revision_stats.completed_revisions,
      overdue_stats.overdue_revisions,
      COALESCE(
        (
          SELECT SUM(today_by_plan.due_revisions)
          FROM today_by_plan
        ),
        0
      ) AS today_revisions,
      COALESCE(
        (
          SELECT SUM(today_by_plan.estimated_minutes)
          FROM today_by_plan
        ),
        0
      ) AS today_estimated_minutes,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'plan_id', today_by_plan.plan_id,
              'plan_name', today_by_plan.plan_name,
              'daily_capacity', today_by_plan.daily_capacity,
              'due_revisions', today_by_plan.due_revisions,
              'estimated_minutes', today_by_plan.estimated_minutes,
              'capacity_exceeded',
                today_by_plan.estimated_minutes >
                today_by_plan.daily_capacity
            )
            ORDER BY today_by_plan.plan_name
          )
          FROM today_by_plan
        ),
        '[]'::json
      ) AS workload_by_plan
    FROM revision_stats
    CROSS JOIN overdue_stats`,
    [userId]
  );

  const row = result.rows[0];

  const totalRevisions = Number(row.total_revisions);
  const completedRevisions = Number(row.completed_revisions);

  const completionPercentage =
    totalRevisions === 0
      ? 0
      : Math.round((completedRevisions / totalRevisions) * 100);

  return {
    totalRevisions,
    completedRevisions,
    completionPercentage,
    overdueRevisions: Number(row.overdue_revisions),
    todayRevisions: Number(row.today_revisions),
    todayEstimatedMinutes: Number(row.today_estimated_minutes),
    workloadByPlan: row.workload_by_plan,
  };
};

export { getDashboardSummary };
