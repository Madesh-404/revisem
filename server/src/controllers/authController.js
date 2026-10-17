import bcrypt from "bcrypt";
import pool from "../db/database.js";
import jwt from "jsonwebtoken";

export const registerUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Name, Email and Password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (existingUser.rows.length > 0) {
      return response.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
            INSERT INTO users(
            name,
            email,
            password_hash
            )
            VALUES($1, $2, $3)
            RETURNING id, name, email, created_at`,
      [normalizedName, email, passwordHash],
    );

    const user = result.rows[0];

    response.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("Registration error", error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const loginUser = async(request, response) => {
    try{
        const {email, password} = request.body
        const normalizedEmail = email.trim().toLowerCase()
        if(!normalizedEmail || !password){
            response.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const result = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [normalizedEmail]);
        if(result.rows.length === 0) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = result.rows[0]
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if(!isPasswordCorrect){
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
        response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    } catch(error) {
        console.log("server error", error);
        response.status(500).json({
            success: false,
            message:"Internal server error"
        });
    }
} 

export const getCurrentUser = async (request, response) => {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          created_at
        FROM users
        WHERE id = $1
      `,
      [request.userId]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    response.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);

    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  response.json({
    success: true,
    message: "Logout successful",
  });
};