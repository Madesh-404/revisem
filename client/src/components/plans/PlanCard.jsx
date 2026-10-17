
const PlanCard = ({
  plan,
  onEdit,
  onArchive,
  onOpen,
  isArchiving,
}) => {
  const targetDate = plan.target_date || plan.targetDate;
  const dailyCapacity = plan.daily_capacity ?? plan.dailyCapacity;

  const formattedDate = targetDate
    ? new Date(`${targetDate.slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "No target date";

  const formattedCapacity = Number(dailyCapacity);
  const hours = Math.floor(formattedCapacity / 60);
  const minutes = formattedCapacity % 60;

  let capacityLabel = "";

  if (hours > 0) {
    capacityLabel = `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  if (minutes > 0) {
    capacityLabel = capacityLabel
      ? `${capacityLabel} ${minutes} min`
      : `${minutes} min`;
  }

  const isActive = plan.status === "ACTIVE";

  return (
    <article className="plan-card">
      <div className="plan-card__top">
        <span
          className={`plan-card__status ${
            isActive
              ? "plan-card__status--active"
              : "plan-card__status--archived"
          }`}
        >
          {isActive ? "Active" : "Archived"}
        </span>

        <button
          type="button"
          className="plan-card__open"
          onClick={() => onOpen(plan)}
          aria-label={`Open ${plan.name}`}
        >
          Open plan →
        </button>
      </div>

      <div className="plan-card__content">
        <h3 className="plan-card__title">{plan.name}</h3>

        <p className="plan-card__description">
          {plan.description || "No description added yet."}
        </p>
      </div>

      <div className="plan-card__details">
        <div className="plan-card__detail">
          <span className="plan-card__detail-label">Target date</span>
          <span className="plan-card__detail-value">
            {formattedDate}
          </span>
        </div>

        <div className="plan-card__detail">
          <span className="plan-card__detail-label">Daily capacity</span>
          <span className="plan-card__detail-value">
            {capacityLabel || "Not set"}
          </span>
        </div>
      </div>

      <div className="plan-card__actions">
        <button
          type="button"
          className="plan-card__edit"
          onClick={() => onEdit(plan)}
          disabled={!isActive || isArchiving}
        >
          Edit
        </button>

        {isActive && (
          <button
            type="button"
            className="plan-card__archive"
            onClick={() => onArchive(plan)}
            disabled={isArchiving}
          >
            {isArchiving ? "Archiving..." : "Archive"}
          </button>
        )}
      </div>
    </article>
  );
};

export default PlanCard;
