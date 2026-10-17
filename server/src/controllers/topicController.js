
import {
  createTopic as createTopicService,
  getTopicsBySubject,
  getTopicById,
  updateTopic as updateTopicService,
  deleteTopic as deleteTopicService,
} from "../services/topicService.js";

const allowedDifficulties = ["EASY", "MEDIUM", "HARD"];
const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

const isValidTopicData = (topicData) => {
  const {
    name,
    description,
    difficulty,
    priority,
    durationMinutes,
  } = topicData;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 150
  ) {
    return false;
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return false;
  }

  if (
    typeof difficulty !== "string" ||
    !allowedDifficulties.includes(difficulty)
  ) {
    return false;
  }

  if (
    typeof priority !== "string" ||
    !allowedPriorities.includes(priority)
  ) {
    return false;
  }

  if (
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 1 ||
    durationMinutes > 1440
  ) {
    return false;
  }

  return true;
};

const createTopic = async (request, response) => {
  if (!isValidTopicData(request.body)) {
    return response.status(400).json({
      message:
        "Provide a valid name, description, difficulty, priority, and durationMinutes.",
    });
  }

  try {
    const topic = await createTopicService(
      request.userId,
      request.params.subjectId,
      request.body
    );

    if (!topic) {
      return response.status(404).json({
        message: "Active subject and plan not found.",
      });
    }

    return response.status(201).json({
      message: "Topic created successfully.",
      topic,
    });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        message: "A topic with this name already exists in this subject.",
      });
    }

    console.error("Create topic error:", error);

    return response.status(500).json({
      message: "Failed to create topic.",
    });
  }
};

const getAllTopics = async (request, response) => {
  try {
    const topics = await getTopicsBySubject(
      request.userId,
      request.params.subjectId
    );

    return response.status(200).json({ topics });
  } catch (error) {
    console.error("Get topics error:", error);

    return response.status(500).json({
      message: "Failed to retrieve topics.",
    });
  }
};

const getSingleTopic = async (request, response) => {
  try {
    const topic = await getTopicById(
      request.userId,
      request.params.topicId
    );

    if (!topic) {
      return response.status(404).json({
        message: "Topic not found.",
      });
    }

    return response.status(200).json({ topic });
  } catch (error) {
    console.error("Get topic error:", error);

    return response.status(500).json({
      message: "Failed to retrieve topic.",
    });
  }
};

const updateTopic = async (request, response) => {
  if (!isValidTopicData(request.body)) {
    return response.status(400).json({
      message:
        "Provide a valid name, description, difficulty, priority, and durationMinutes.",
    });
  }

  try {
    const topic = await updateTopicService(
      request.userId,
      request.params.topicId,
      request.body
    );

    if (!topic) {
      return response.status(404).json({
        message: "Topic or active parent plan not found.",
      });
    }

    return response.status(200).json({
      message: "Topic updated successfully.",
      topic,
    });
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).json({
        message: "A topic with this name already exists in this subject.",
      });
    }

    console.error("Update topic error:", error);

    return response.status(500).json({
      message: "Failed to update topic.",
    });
  }
};

const deleteTopic = async (request, response) => {
  try {
    const topic = await deleteTopicService(
      request.userId,
      request.params.topicId
    );

    if (!topic) {
      return response.status(404).json({
        message: "Topic or active parent plan not found.",
      });
    }

    return response.status(200).json({
      message: "Topic deleted successfully.",
      topic,
    });
  } catch (error) {
    console.error("Delete topic error:", error);

    return response.status(500).json({
      message: "Failed to delete topic.",
    });
  }
};

export {
  createTopic,
  getAllTopics,
  getSingleTopic,
  updateTopic,
  deleteTopic,
};
