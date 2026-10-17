
import { useEffect, useState } from "react";

const PlanForm = ({
  initialPlan,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dailyCapacity, setDailyCapacity] = useState("120");
  const [error, setError] = useState("");

  const isEditing = Boolean(initialPlan);

  useEffect(() => {
    if (initialPlan) {
      setName(initialPlan.name || "");
      setDescription(initialPlan.description || "");
      setTargetDate(initialPlan.target_date || initialPlan.targetDate || "");
      setDailyCapacity(
        String(initialPlan.daily_capacity ?? initialPlan.dailyCapacity ?? 120)
      );
    } else {
      setName("");
      setDescription("");
      setTargetDate("");
      setDailyCapacity("120");
    }

    setError("");
  }, [initialPlan]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const capacity = Number(dailyCapacity);

    if (!trimmedName) {
      setError("Plan name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setError("Plan name cannot exceed 150 characters.");
      return;
    }

    if (!targetDate) {
      setError("Please select a target date.");
      return;
    }

    const selectedDate = new Date(`${targetDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate < today
    ) {
      setError("Target date cannot be in the past.");
      return;
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 1440
    ) {
      setError("Daily capacity must be between 1 and 1440 minutes.");
      return;
    }

    const planData = {
      name: trimmedName,
      description: description.trim(),
      targetDate,
      dailyCapacity: capacity,
    };

    try {
      await onSubmit(planData);
    } catch (requestError) {
      setError(requestError.message || "Unable to save the plan.");
    }
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
      <div className="plan-form__header">
        <h2>{isEditing ? "Edit plan" : "Create a new plan"}</h2>

        <p>
          {isEditing
            ? "Update your revision plan details."
            : "Set a goal and decide how much time you can study each day."}
        </p>
      </div>

      {error && (
        <p className="plan-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="plan-form__field">
        <label htmlFor="plan-name">Plan name</label>

        <input
          id="plan-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full-Stack Interview Preparation"
          maxLength={150}
          required
        />
      </div>

      <div className="plan-form__field">
        <label htmlFor="plan-description">Description (optional)</label>

        <textarea
          id="plan-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What do you want to revise?"
          rows={3}
        />
      </div>

      <div className="plan-form__field">
        <label htmlFor="plan-target-date">Target date</label>

        <input
          id="plan-target-date"
          type="date"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          min={new Date().toLocaleDateString("en-CA")}
          required
        />
      </div>

      <div className="plan-form__field">
        <label htmlFor="plan-daily-capacity">
          Daily study capacity (minutes)
        </label>

        <input
          id="plan-daily-capacity"
          type="number"
          min="1"
          max="1440"
          step="1"
          value={dailyCapacity}
          onChange={(event) => setDailyCapacity(event.target.value)}
          required
        />

        <p className="plan-form__hint">
          Example: 120 minutes = 2 hours per day.
        </p>
      </div>

      <div className="plan-form__actions">
        <button
          type="button"
          className="plan-form__cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="plan-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Create plan"}
        </button>
      </div>
    </form>
  );
};

export default PlanForm;
