
import express from "express";

import {
  getSingleTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topicController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/:topicId", getSingleTopic);
router.put("/:topicId", updateTopic);
router.delete("/:topicId", deleteTopic);

export default router;
