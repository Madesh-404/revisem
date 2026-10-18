
import { useEffect, useState } from "react";

const SubjectForm = ({
  initialSubject,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name || "");
      setDescription(initialSubject.description || "");
    } else {
      setName("");
      setDescription("");
    }

    setError("");
  }, [initialSubject]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Subject name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Subject name cannot exceed 150 characters.");
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <form className="subject-form" onSubmit={handleSubmit}>
      <div className="subject-form__field">
        <label htmlFor="subject-name">Subject name</label>

        <input
          id="subject-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. JavaScript"
          maxLength={150}
          required
        />
      </div>

      <div className="subject-form__field">
        <label htmlFor="subject-description">
          Description <span>(optional)</span>
        </label>

        <textarea
          id="subject-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What do you want to study in this subject?"
          rows={3}
        />
      </div>

      {error && (
        <p className="subject-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="subject-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialSubject
              ? "Save Changes"
              : "Create Subject"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
