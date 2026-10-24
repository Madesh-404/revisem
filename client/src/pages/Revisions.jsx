
import React, { useCallback, useEffect, useState } from "react";

import {
  getTodayRevisions,
  getUpcomingRevisions,
  getOverdueRevisions,
  completeRevision,
  skipRevision,
  startRevision,
} from "../services/api.js";

import RevisionCard from "../components/revisions/RevisionCard.jsx";
import "../styles/revisions.css";

const Revisions = () => {
  const [todayRevisions, setTodayRevisions] = useState([]);
  const [upcomingRevisions, setUpcomingRevisions] = useState([]);
  const [overdueRevisions, setOverdueRevisions] = useState([]);

  const [selectedRevision, setSelectedRevision] = useState(null);
  const [performance, setPerformance] = useState("GOOD");

  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRevisions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [
        todayResponse,
        upcomingResponse,
        overdueResponse,
      ] = await Promise.all([
        getTodayRevisions(),
        getUpcomingRevisions(),
        getOverdueRevisions(),
      ]);

      setTodayRevisions(todayResponse.revisions);
      setUpcomingRevisions(upcomingResponse.revisions);
      setOverdueRevisions(overdueResponse.revisions);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRevisions();
  }, [loadRevisions]);

  const handleStart = async (revisionId) => {
  setProcessingId(revisionId);
  setError("");
  setSuccess("");

  try {
    await startRevision(revisionId);

    setSuccess("Revision started successfully.");
    await loadRevisions();
  } catch (requestError) {
    setError(requestError.message);
  } finally {
    setProcessingId(null);
  }
};

  const handleComplete = async () => {
    if (!selectedRevision) {
      return;
    }

    setProcessingId(selectedRevision.id);
    setError("");
    setSuccess("");

    try {
      await completeRevision(
        selectedRevision.id,
        performance
      );

      setSelectedRevision(null);
      setSuccess("Revision completed and next revision scheduled.");
      await loadRevisions();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSkip = async (revisionId) => {
    const shouldSkip = window.confirm(
      "Are you sure you want to skip this revision?"
    );

    if (!shouldSkip) {
      return;
    }

    setProcessingId(revisionId);
    setError("");
    setSuccess("");

    try {
      await skipRevision(revisionId);

      setSuccess("Revision skipped successfully.");
      await loadRevisions();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessingId(null);
    }
  };

  const renderRevisionSection = (title, revisions, emptyMessage) => (
    <section className="revisions-section">
      <div className="revisions-section__header">
        <h2>{title}</h2>
        <span>{revisions.length}</span>
      </div>

      {revisions.length === 0 ? (
        <p className="revisions-section__empty">
          {emptyMessage}
        </p>
      ) : (
        <div className="revisions-section__grid">
          {revisions.map((revision) => (
            <RevisionCard
  key={revision.id}
  revision={revision}
  onStart={handleStart}
  onComplete={setSelectedRevision}
  onSkip={handleSkip}
  isProcessing={processingId === revision.id}
/>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <main className="revisions-page">
      <header className="revisions-page__header">
        <div>
          <p className="revisions-page__eyebrow">
            YOUR STUDY SCHEDULE
          </p>
          <h1>Revisions</h1>
          <p>Stay consistent, review what you've learned, and track your recall.</p>
        </div>

        <button
          type="button"
          onClick={loadRevisions}
          disabled={isLoading}
        >
          Refresh
        </button>
      </header>

      {error && (
        <p className="revisions-message revisions-message--error">
          {error}
        </p>
      )}

      {success && (
        <p className="revisions-message revisions-message--success">
          {success}
        </p>
      )}

      {selectedRevision && (
        <section className="revision-rating">
          <h2>How well did you recall this topic?</h2>
          <p>{selectedRevision.topic_name}</p>

          <label htmlFor="revision-performance">
            Recall rating
          </label>

          <select
            id="revision-performance"
            value={performance}
            onChange={(event) => setPerformance(event.target.value)}
          >
            <option value="AGAIN">Again — couldn't recall</option>
            <option value="HARD">Hard — struggled to recall</option>
            <option value="GOOD">Good — recalled correctly</option>
            <option value="EASY">Easy — recalled effortlessly</option>
          </select>

          <div className="revision-rating__actions">
            <button
              type="button"
              onClick={handleComplete}
              disabled={processingId !== null}
            >
              Confirm completion
            </button>

            <button
              type="button"
              onClick={() => setSelectedRevision(null)}
              disabled={processingId !== null}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {isLoading ? (
        <p>Loading revisions...</p>
      ) : (
        <>
          {renderRevisionSection(
            "Today's revisions",
            todayRevisions,
            "You're all caught up for today."
          )}

          {renderRevisionSection(
            "Overdue revisions",
            overdueRevisions,
            "No overdue revisions."
          )}

          {renderRevisionSection(
            "Upcoming revisions",
            upcomingRevisions,
            "No upcoming revisions scheduled."
          )}
        </>
      )}
    </main>
  );
};

export default Revisions;
