import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import pool from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`REVISEM server running on port ${PORT}`);
});
