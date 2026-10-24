
import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getDashboardSummaryController,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/summary", getDashboardSummaryController);

export default router;
