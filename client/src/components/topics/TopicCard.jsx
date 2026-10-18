
const TopicCard = ({
  topic,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const duration =
    topic.duration_minutes ?? topic.durationMinutes;

  const difficultyLabel =
    topic.difficulty?.toLowerCase();

  const priorityLabel =
    topic.priority?.toLowerCase();

  return (
    <article className="topic-card">
      <div className="topic-card__header">
        <h3 className="topic-card__title">
          {topic.name}
        </h3>
      </div>

      <p className="topic-card__description">
        {topic.description || "No description added yet."}
      </p>

      <div className="topic-card__details">
        <span
          className={`topic-card__badge topic-card__badge--${difficultyLabel}`}
        >
          Difficulty: {difficultyLabel}
        </span>

        <span
          className={`topic-card__badge topic-card__badge--${priorityLabel}`}
        >
          Priority: {priorityLabel}
        </span>
      </div>

      <p className="topic-card__duration">
        <span aria-hidden="true">◷</span>{" "}
        Estimated study time: {duration} minutes
      </p>

      <div className="topic-card__actions">
        <button
          type="button"
          onClick={() => onEdit(topic)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(topic)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default TopicCard;
