
import { getDashboardSummary } from "../services/dashboardService.js";

const getDashboardSummaryController = async (request, response) => {
  try {
    const summary = await getDashboardSummary(request.userId);

    return response.status(200).json({ summary });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return response.status(500).json({
      message: "Unable to load dashboard summary.",
    });
  }
};

export { getDashboardSummaryController };
