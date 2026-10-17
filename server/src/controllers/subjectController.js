
import {
  createSubject as createSubjectService,
  getSubjectsByPlan,
  getSubjectById,
  updateSubject as updateSubjectService,
  deleteSubject as deleteSubjectService,
} from "../services/subjectService.js";

const isValidSubjectData = (subjectData) => {
  if (
    typeof subjectData.name !== "string" ||
    subjectData.name.trim().length === 0 ||
    subjectData.name.trim().length > 150
  ) {
    return false;
  }

  if (
    subjectData.description !== undefined &&
    subjectData.description !== null &&
    typeof subjectData.description !== "string"
  ) {
    return false;
  }

  return true;
};

const createSubject = async (request, response) => {
  try {
    if (!isValidSubjectData(request.body)) {
      return response.status(400).json({
        success: false,
        message: "A valid subject name is required",
      });
    }

    const subject = await createSubjectService(
      request.userId,
      request.params.planId,
      request.body
    );

    if (!subject) {
      return response.status(404).json({
        success: false,
        message: "Active plan not found",
      });
    }

    return response.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        success: false,
        message: "This subject already exists in the plan",
      });
    }

    console.error("Create subject error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to create subject",
    });
  }
};

const getAllSubjects = async (request, response) => {
  try {
    const subjects = await getSubjectsByPlan(
      request.userId,
      request.params.planId
    );

    return response.json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to retrieve subjects",
    });
  }
};

const getSingleSubject = async (request, response) => {
  try {
    const subject = await getSubjectById(
      request.userId,
      request.params.subjectId
    );

    if (!subject) {
      return response.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return response.json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error("Get subject error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to retrieve subject",
    });
  }
};

const updateSubject = async (request, response) => {
  try {
    if (!isValidSubjectData(request.body)) {
      return response.status(400).json({
        success: false,
        message: "A valid subject name is required",
      });
    }

    const subject = await updateSubjectService(
      request.userId,
      request.params.subjectId,
      request.body
    );

    if (!subject) {
      return response.status(404).json({
        success: false,
        message: "Subject not found in an active plan",
      });
    }

    return response.json({
      success: true,
      subject,
    });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        success: false,
        message: "This subject already exists in the plan",
      });
    }

    console.error("Update subject error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to update subject",
    });
  }
};

const deleteSubject = async (request, response) => {
  try {
    const subject = await deleteSubjectService(
      request.userId,
      request.params.subjectId
    );

    if (!subject) {
      return response.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return response.json({
      success: true,
      message: "Subject deleted successfully",
      subject,
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    return response.status(500).json({
      success: false,
      message: "Unable to delete subject",
    });
  }
};

export {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};
