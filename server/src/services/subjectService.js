
import pool from "../db/database.js";

const createSubject = async (userId, planId, subjectData) => {
  const { name, description } = subjectData;

  const result = await pool.query(
    `
      INSERT INTO subjects (
        plan_id,
        name,
        description
      )
      SELECT
        plans.id,
        $3,
        $4
      FROM plans
      WHERE plans.id = $1
        AND plans.user_id = $2
        AND plans.status = 'ACTIVE'
      RETURNING
        id,
        plan_id,
        name,
        description,
        created_at,
        updated_at
    `,
    [
      planId,
      userId,
      name.trim(),
      description?.trim() || null,
    ]
  );

  return result.rows[0] || null;
};

const getSubjectsByPlan = async (userId, planId) => {
  const result = await pool.query(
    `
      SELECT
        subjects.id,
        subjects.plan_id,
        subjects.name,
        subjects.description,
        subjects.created_at,
        subjects.updated_at
      FROM subjects
      INNER JOIN plans
        ON plans.id = subjects.plan_id
      WHERE plans.id = $1
        AND plans.user_id = $2
      ORDER BY subjects.created_at DESC
    `,
    [planId, userId]
  );

  return result.rows;
};

const getSubjectById = async (userId, subjectId) => {
  const result = await pool.query(
    `
      SELECT
        subjects.id,
        subjects.plan_id,
        subjects.name,
        subjects.description,
        subjects.created_at,
        subjects.updated_at
      FROM subjects
      INNER JOIN plans
        ON plans.id = subjects.plan_id
      WHERE subjects.id = $1
        AND plans.user_id = $2
    `,
    [subjectId, userId]
  );

  return result.rows[0] || null;
};

const updateSubject = async (
  userId,
  subjectId,
  subjectData
) => {
  const { name, description } = subjectData;

  const result = await pool.query(
    `
      UPDATE subjects
      SET
        name = $1,
        description = $2,
        updated_at = NOW()
      FROM plans
      WHERE subjects.id = $3
        AND plans.id = subjects.plan_id
        AND plans.user_id = $4
        AND plans.status = 'ACTIVE'
      RETURNING
        subjects.id,
        subjects.plan_id,
        subjects.name,
        subjects.description,
        subjects.updated_at
    `,
    [
      name.trim(),
      description?.trim() || null,
      subjectId,
      userId,
    ]
  );

  return result.rows[0] || null;
};

const deleteSubject = async (userId, subjectId) => {
  const result = await pool.query(
    `
      DELETE FROM subjects
      USING plans
      WHERE subjects.id = $1
        AND plans.id = subjects.plan_id
        AND plans.user_id = $2
      RETURNING subjects.id, subjects.name
    `,
    [subjectId, userId]
  );

  return result.rows[0] || null;
};

export {
  createSubject,
  getSubjectsByPlan,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
