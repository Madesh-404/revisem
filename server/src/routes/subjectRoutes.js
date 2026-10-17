
import express from "express";

import {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import {
  createTopic,
  getAllTopics,
} from "../controllers/topicController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/:subjectId/topics", createTopic);
router.get("/:subjectId/topics", getAllTopics);

router.get("/:subjectId", getSingleSubject);
router.put("/:subjectId", updateSubject);
router.delete("/:subjectId", deleteSubject);

export default router;
