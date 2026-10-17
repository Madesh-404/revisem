
import pool from "../db/database.js";

const createPlan = async (userId, planData) => {
  const {
    name,
    description,
    targetDate,
    dailyCapacity,
  } = planData;

  const result = await pool.query(
    `
      INSERT INTO plans (
        user_id,
        name,
        description,
        target_date,
        daily_capacity
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        description,
        target_date,
        daily_capacity,
        status,
        created_at
    `,
    [
      userId,
      name.trim(),
      description?.trim() || null,
      targetDate,
      dailyCapacity,
    ]
  );

  return result.rows[0];
};

const getPlansByUser = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        description,
        target_date,
        daily_capacity,
        status,
        created_at,
        updated_at
      FROM plans
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

const getPlanById = async (userId, planId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        description,
        target_date,
        daily_capacity,
        status,
        created_at,
        updated_at
      FROM plans
      WHERE id = $1
        AND user_id = $2
    `,
    [planId, userId]
  );

  return result.rows[0] || null;
};

const updatePlan = async (userId, planId, planData) => {
  const {
    name,
    description,
    targetDate,
    dailyCapacity,
  } = planData;

  const result = await pool.query(
    `
      UPDATE plans
      SET
        name = $1,
        description = $2,
        target_date = $3,
        daily_capacity = $4,
        updated_at = NOW()
      WHERE id = $5
        AND user_id = $6
      RETURNING
        id,
        name,
        description,
        target_date,
        daily_capacity,
        status,
        updated_at
    `,
    [
      name.trim(),
      description?.trim() || null,
      targetDate,
      dailyCapacity,
      planId,
      userId,
    ]
  );

  return result.rows[0] || null;
};

const archivePlan = async (userId, planId) => {
  const result = await pool.query(
    `
      UPDATE plans
      SET
        status = 'ARCHIVED',
        updated_at = NOW()
      WHERE id = $1
        AND user_id = $2
        AND status = 'ACTIVE'
      RETURNING id, name, status
    `,
    [planId, userId]
  );

  return result.rows[0] || null;
};

export {
  createPlan,
  getPlansByUser,
  getPlanById,
  updatePlan,
  archivePlan,
};
