
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import pool from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import revisionRoutes from "./routes/revisionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/revisions", revisionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", async (request, response) => {
  try {
    const result = await pool.query("SELECT NOW()");

    response.json({
      success: true,
      message: "REVISEM API is running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;
