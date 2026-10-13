import jwt from "jsonwebtoken";

export const authenticateUser = (request, response, next) => {
  const token = request.cookies.token;

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

    request.userId = decodedToken.userId;

    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
