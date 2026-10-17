
import {
  createPlan as createPlanService,
  getPlansByUser,
  getPlanById,
  updatePlan as updatePlanService,
  archivePlan as archivePlanService,
} from "../services/planService.js";

const isValidPlanData = (planData) => {
  const {
    name,
    targetDate,
    dailyCapacity,
  } = planData;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 150
  ) {
    return false;
  }

  if (
    typeof targetDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)
  ) {
    return false;
  }

  const parsedDate = new Date(`${targetDate}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== targetDate
  ) {
    return false;
  }

  if (
    !Number.isInteger(dailyCapacity) ||
    dailyCapacity <= 0 ||
    dailyCapacity > 1440
  ) {
    return false;
  }

  if (
    planData.description !== undefined &&
    planData.description !== null &&
    typeof planData.description !== "string"
  ) {
    return false;
  }

  return true;
};

const createPlan = async (request, response) => {
  try {
    const planData = request.body;

    if (!isValidPlanData(planData)) {
      return response.status(400).json({
        success: false,
        message: "Please provide valid plan details",
      });
    }

    const plan = await createPlanService(
      request.userId,
      planData
    );

    return response.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Create plan error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to create plan",
    });
  }
};

const getAllPlans = async (request, response) => {
  try {
    const plans = await getPlansByUser(request.userId);

    return response.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error("Get plans error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to retrieve plans",
    });
  }
};

const getSinglePlan = async (request, response) => {
  try {
    const plan = await getPlanById(
      request.userId,
      request.params.planId
    );

    if (!plan) {
      return response.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return response.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Get plan error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to retrieve plan",
    });
  }
};

const updatePlan = async (request, response) => {
  try {
    if (!isValidPlanData(request.body)) {
      return response.status(400).json({
        success: false,
        message: "Please provide valid plan details",
      });
    }

    const plan = await updatePlanService(
      request.userId,
      request.params.planId,
      request.body
    );

    if (!plan) {
      return response.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return response.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to update plan",
    });
  }
};

const archivePlan = async (request, response) => {
  try {
    const plan = await archivePlanService(
      request.userId,
      request.params.planId
    );

    if (!plan) {
      return response.status(404).json({
        success: false,
        message: "Active plan not found",
      });
    }

    return response.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Archive plan error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to archive plan",
    });
  }
};

export {
  createPlan,
  getAllPlans,
  getSinglePlan,
  updatePlan,
  archivePlan,
};
