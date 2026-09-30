import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db/database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Connected to DB",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "DB connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Revisem API is running on ${PORT}`);
});
