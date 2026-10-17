
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

  const responseText = await response.text();

  let responseData = {};

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = {
        message: responseText,
      };
    }
  }

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

// Plans API

const createPlan = async (planData) => {
  return await apiRequest("/plans", {
    method: "POST",
    body: JSON.stringify(planData),
  });
};

const getPlans = async () => {
  return await apiRequest("/plans");
};

const updatePlan = async (planId, planData) => {
  return await apiRequest(`/plans/${encodeURIComponent(planId)}`, {
    method: "PUT",
    body: JSON.stringify(planData),
  });
};

const archivePlan = async (planId) => {
  return await apiRequest(
    `/plans/${encodeURIComponent(planId)}/archive`,
    {
      method: "PATCH",
    }
  );
};

export {
  checkServerHealth,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  createPlan,
  getPlans,
  updatePlan,
  archivePlan,
};
