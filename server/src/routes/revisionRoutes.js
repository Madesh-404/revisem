
import express from "express";

import {
  getTodayRevisions,
  getUpcomingRevisions,
  getOverdueRevisions,
  completeRevision,
  skipRevision,
} from "../controllers/revisionController.js";

import {
  authenticateUser,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/today", getTodayRevisions);
router.get("/upcoming", getUpcomingRevisions);
router.get("/overdue", getOverdueRevisions);
router.patch("/:revisionId/complete", completeRevision);
router.patch("/:revisionId/skip", skipRevision);

export default router;
