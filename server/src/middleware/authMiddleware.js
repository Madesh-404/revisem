
import jwt from "jsonwebtoken";

export const authenticateUser = (request, response, next) => {
  const token = request.cookies?.token;

  if (!token) {
    return response.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId = decodedToken.userId;

    const isValidUserId =
      typeof userId === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId
      );

    if (!isValidUserId) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    request.userId = userId;

    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
