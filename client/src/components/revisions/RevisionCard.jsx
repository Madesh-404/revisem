
import React from "react";

const RevisionCard = ({
  revision,
  onStart,
  onComplete,
  onSkip,
  isProcessing,
}) => {

 const formatScheduledDate = (dateString) => {
  if (typeof dateString !== "string" || dateString.length === 0) {
    return "Date unavailable";
  }

  // Handle PostgreSQL DATE values returned as ISO timestamps.
  const dateOnly = dateString.slice(0, 10);
  const dateParts = dateOnly.split("-");

  if (dateParts.length !== 3) {
    return "Date unavailable";
  }

  const [year, month, day] = dateParts.map(Number);

  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const scheduledDate = formatScheduledDate(revision.scheduled_date);
console.log("Scheduled date:", revision.scheduled_date);
console.log("Full revision:", revision);
  return (
    <article className="revision-card">
      <div className="revision-card__header">
        <div>
          <p className="revision-card__subject">
            {revision.subject_name}
          </p>

          <h3 className="revision-card__title">
            {revision.topic_name}
          </h3>
        </div>

        <span
          className={`revision-card__status revision-card__status--${revision.status.toLowerCase()}`}
        >
          {revision.status.replace("_", " ")}
        </span>
      </div>

      <div className="revision-card__details">
        <span>Due: {scheduledDate}</span>
        <span>Difficulty: {revision.difficulty}</span>
        <span>Priority: {revision.priority}</span>
        <span>{revision.duration_minutes} min</span>
      </div>

      <div className="revision-card__actions">

        {(revision.status === "SCHEDULED" ||
          revision.status === "IN_PROGRESS") && (
          <>
            <button
              type="button"
              onClick={() => onComplete(revision)}
              disabled={isProcessing}
            >
              Complete
            </button>

            <button
              type="button"
              onClick={() => onSkip(revision.id)}
              disabled={isProcessing}
            >
              Skip
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default RevisionCard;
