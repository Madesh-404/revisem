
const REVISION_INTERVALS = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 4,
  EASY: 7,
};

const isValidDate = (dateString) => {
  if (typeof dateString !== "string") {
    return false;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const addDays = (dateString, numberOfDays) => {
  if (!isValidDate(dateString)) {
    throw new Error("A valid date in YYYY-MM-DD format is required.");
  }

  if (!Number.isInteger(numberOfDays) || numberOfDays < 0) {
    throw new Error("Number of days must be a non-negative integer.");
  }

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + numberOfDays);

  return date.toISOString().slice(0, 10);
};

const getInitialRevisionDate = (today) => {
  return addDays(today, 1);
};

const calculateNextRevisionDate = (completedDate, performance) => {
  const interval = REVISION_INTERVALS[performance];

  if (interval === undefined) {
    throw new Error(
      "Performance must be AGAIN, HARD, GOOD, or EASY."
    );
  }

  return addDays(completedDate, interval);
};

const getRevisionInterval = (performance) => {
  const interval = REVISION_INTERVALS[performance];

  if (interval === undefined) {
    throw new Error(
      "Performance must be AGAIN, HARD, GOOD, or EASY."
    );
  }

  return interval;
};

export {
  REVISION_INTERVALS,
  isValidDate,
  addDays,
  getInitialRevisionDate,
  calculateNextRevisionDate,
  getRevisionInterval,
};
