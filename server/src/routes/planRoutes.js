
import express from "express";

import {
  createPlan,
  getAllPlans,
  getSinglePlan,
  updatePlan,
  archivePlan,
} from "../controllers/planController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

import {
  createSubject,
  getAllSubjects,
} from "../controllers/subjectController.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", createPlan);
router.get("/", getAllPlans);
router.get("/:planId", getSinglePlan);
router.put("/:planId", updatePlan);
router.patch("/:planId/archive", archivePlan);

router.post("/:planId/subjects", createSubject);
router.get("/:planId/subjects", getAllSubjects);


export default router;
