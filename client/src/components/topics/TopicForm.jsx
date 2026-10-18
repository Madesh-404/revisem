
import { useEffect, useState } from "react";

const TopicForm = ({
  initialTopic,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [priority, setPriority] = useState("MEDIUM");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTopic) {
      setName(initialTopic.name || "");
      setDescription(initialTopic.description || "");
      setDifficulty(initialTopic.difficulty || "MEDIUM");
      setPriority(initialTopic.priority || "MEDIUM");
      setDurationMinutes(
        String(initialTopic.duration_minutes ?? initialTopic.durationMinutes ?? 30)
      );
    } else {
      setName("");
      setDescription("");
      setDifficulty("MEDIUM");
      setPriority("MEDIUM");
      setDurationMinutes("30");
    }

    setError("");
  }, [initialTopic]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedDuration = Number(durationMinutes);

    if (!trimmedName) {
      setError("Topic name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Topic name cannot exceed 150 characters.");
      return;
    }

    if (
      !Number.isInteger(parsedDuration) ||
      parsedDuration < 1 ||
      parsedDuration > 1440
    ) {
      setError("Duration must be a whole number between 1 and 1440 minutes.");
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
        difficulty,
        priority,
        durationMinutes: parsedDuration,
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <form className="topic-form" onSubmit={handleSubmit}>
      <div className="topic-form__field">
        <label htmlFor="topic-name">Topic name</label>
        <input
          id="topic-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. JavaScript Closures"
          maxLength={150}
          required
        />
      </div>

      <div className="topic-form__field">
        <label htmlFor="topic-description">
          Description <span>(optional)</span>
        </label>
        <textarea
          id="topic-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What should you learn in this topic?"
          rows={3}
        />
      </div>

      <div className="topic-form__field">
        <label htmlFor="topic-difficulty">Difficulty</label>
        <select
          id="topic-difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>

      <div className="topic-form__field">
        <label htmlFor="topic-priority">Priority</label>
        <select
          id="topic-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="topic-form__field">
        <label htmlFor="topic-duration">
          Estimated study time (minutes)
        </label>
        <input
          id="topic-duration"
          type="number"
          min="1"
          max="1440"
          step="1"
          value={durationMinutes}
          onChange={(event) => setDurationMinutes(event.target.value)}
          required
        />
      </div>

      {error && (
        <p className="topic-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="topic-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialTopic
              ? "Save Changes"
              : "Create Topic"}
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

export default TopicForm;
