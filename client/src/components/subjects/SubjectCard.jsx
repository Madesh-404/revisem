
const SubjectCard = ({
  subject,
  onOpen,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <article className="subject-card">
      <div className="subject-card__content">
        <h3 className="subject-card__title">
          {subject.name}
        </h3>

        <p className="subject-card__description">
          {subject.description || "No description added yet."}
        </p>
      </div>

      <div className="subject-card__actions">
        <button
          type="button"
          onClick={() => onOpen(subject)}
        >
          Open Subject
        </button>

        <button
          type="button"
          onClick={() => onEdit(subject)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(subject)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
};

export default SubjectCard;
