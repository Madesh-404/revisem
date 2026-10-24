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
    throw new Error(responseData.message || "Something went wrong");
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
  return await apiRequest(`/plans/${encodeURIComponent(planId)}/archive`, {
    method: "PATCH",
  });
};

const createSubject = async (planId, subjectData) => {
  return await apiRequest(`/plans/${encodeURIComponent(planId)}/subjects`, {
    method: "POST",
    body: JSON.stringify(subjectData),
  });
};

const getSubjects = async (planId) => {
  return await apiRequest(`/plans/${encodeURIComponent(planId)}/subjects`);
};

const getSubject = async (subjectId) => {
  return await apiRequest(`/subjects/${encodeURIComponent(subjectId)}`);
};

const updateSubject = async (subjectId, subjectData) => {
  return await apiRequest(`/subjects/${encodeURIComponent(subjectId)}`, {
    method: "PUT",
    body: JSON.stringify(subjectData),
  });
};

const deleteSubject = async (subjectId) => {
  return await apiRequest(`/subjects/${encodeURIComponent(subjectId)}`, {
    method: "DELETE",
  });
};


const createTopic = async (subjectId, topicData) => {
  return await apiRequest(
    `/subjects/${encodeURIComponent(subjectId)}/topics`,
    {
      method: "POST",
      body: JSON.stringify(topicData),
    }
  );
};

const getTopics = async (subjectId) => {
  return await apiRequest(
    `/subjects/${encodeURIComponent(subjectId)}/topics`
  );
};

const getTopic = async (topicId) => {
  return await apiRequest(
    `/topics/${encodeURIComponent(topicId)}`
  );
};

const updateTopic = async (topicId, topicData) => {
  return await apiRequest(
    `/topics/${encodeURIComponent(topicId)}`,
    {
      method: "PUT",
      body: JSON.stringify(topicData),
    }
  );
};

const deleteTopic = async (topicId) => {
  return await apiRequest(
    `/topics/${encodeURIComponent(topicId)}`,
    {
      method: "DELETE",
    }
  );
};


const getTodayRevisions = async () => {
  return await apiRequest("/revisions/today");
};

const getUpcomingRevisions = async () => {
  return await apiRequest("/revisions/upcoming");
};

const getOverdueRevisions = async () => {
  return await apiRequest("/revisions/overdue");
};

const startRevision = async (revisionId) => {
  return await apiRequest(
    `/revisions/${encodeURIComponent(revisionId)}/start`,
    {
      method: "PATCH",
    }
  );
};

const completeRevision = async (revisionId, performance) => {
  return await apiRequest(
    `/revisions/${encodeURIComponent(revisionId)}/complete`,
    {
      method: "PATCH",
      body: JSON.stringify({ performance }),
    }
  );
};

const skipRevision = async (revisionId) => {
  return await apiRequest(
    `/revisions/${encodeURIComponent(revisionId)}/skip`,
    {
      method: "PATCH",
    }
  );
};


const getDashboardSummary = async () => {
  return await apiRequest("/dashboard/summary");
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
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
  createTopic,
  getTopics,
  getTopic, 
  updateTopic,
  deleteTopic,
  getTodayRevisions,
  getUpcomingRevisions,
  getOverdueRevisions,
  startRevision,
  completeRevision,
  skipRevision,
  getDashboardSummary,
};
