
import {
  getTodayRevisions as getTodayRevisionsService,
  getUpcomingRevisions as getUpcomingRevisionsService,
  getOverdueRevisions as getOverdueRevisionsService,
  skipRevision as skipRevisionService,
   completeRevision as completeRevisionService,
} from "../services/revisionService.js";



const getTodayRevisions = async (request, response) => {
  try {
    const revisions = await getTodayRevisionsService(
      request.userId
    );

    return response.status(200).json({ revisions });
  } catch (error) {
    console.error("Get today's revisions error:", error);

    return response.status(500).json({
      message: "Failed to retrieve today's revisions.",
    });
  }
};

const getUpcomingRevisions = async (request, response) => {
  try {
    const revisions = await getUpcomingRevisionsService(
      request.userId
    );

    return response.status(200).json({ revisions });
  } catch (error) {
    console.error("Get upcoming revisions error:", error);

    return response.status(500).json({
      message: "Failed to retrieve upcoming revisions.",
    });
  }
};

const getOverdueRevisions = async (request, response) => {
  try {
    const revisions = await getOverdueRevisionsService(
      request.userId
    );

    return response.status(200).json({ revisions });
  } catch (error) {
    console.error("Get overdue revisions error:", error);

    return response.status(500).json({
      message: "Failed to retrieve overdue revisions.",
    });
  }
};

const completeRevision = async (request, response) => {
  try {
    const { performance } = request.body;

    const result = await completeRevisionService(
      request.userId,
      request.params.revisionId,
      performance
    );

    if (!result) {
      return response.status(404).json({
        message: "Revision not found.",
      });
    }

    return response.status(200).json({
      message: "Revision completed successfully.",
      ...result,
    });
  } catch (error) {
    if (error.message === "INVALID_PERFORMANCE") {
      return response.status(400).json({
        message: "Performance must be AGAIN, HARD, GOOD, or EASY.",
      });
    }

    if (error.message === "REVISION_NOT_COMPLETABLE") {
      return response.status(409).json({
        message: "This revision cannot be completed in its current state.",
      });
    }

    console.error("Complete revision error:", error);

    return response.status(500).json({
      message: "Failed to complete revision.",
    });
  }
};


const skipRevision = async (request, response) => {
  try {
    const revision = await skipRevisionService(
      request.userId,
      request.params.revisionId
    );

    if (!revision) {
      return response.status(404).json({
        message:
          "Revision not found or cannot be skipped in its current state.",
      });
    }

    return response.status(200).json({
      message: "Revision skipped successfully.",
      revision,
    });
  } catch (error) {
    console.error("Skip revision error:", error);

    return response.status(500).json({
      message: "Failed to skip revision.",
    });
  }
};


export {
  getTodayRevisions,
  getUpcomingRevisions,
  completeRevision,
  getOverdueRevisions,
  skipRevision,
};
