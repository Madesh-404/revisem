
const API_URL = "http://localhost:5000/api";

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || "Something went wrong"
    );
  }

  return responseData;
};

const checkServerHealth = async () => {
  return await apiRequest("/health");
};

const registerUser = async (userData) => {
  return await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

const loginUser = async (credentials) => {
  return await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

const getCurrentUser = async () => {
  return await apiRequest("/auth/me");
};

const logoutUser = async () => {
  return await apiRequest("/auth/logout", {
    method: "POST",
  });
};

export {
  checkServerHealth,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
