const API_URL = "http://localhost:5000/api";

export async function checkServerHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("Server health check failed");
  }

  return response.json();
}