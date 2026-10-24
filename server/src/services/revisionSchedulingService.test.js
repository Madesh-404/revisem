

import test from "node:test";
import assert from "node:assert/strict";

import {
  getRevisionInterval,
  calculateNextRevisionDate,
  getInitialRevisionDate,
} from "./revisionSchedulingService.js";

test("AGAIN schedules the next revision after 1 day", () => {
  assert.equal(getRevisionInterval("AGAIN"), 1);
});

test("HARD schedules the next revision after 2 days", () => {
  assert.equal(getRevisionInterval("HARD"), 2);
});

test("GOOD schedules the next revision after 4 days", () => {
  assert.equal(getRevisionInterval("GOOD"), 4);
});

test("EASY schedules the next revision after 7 days", () => {
  assert.equal(getRevisionInterval("EASY"), 7);
});

test("next revision date is calculated from the completion date", () => {
  assert.equal(
    calculateNextRevisionDate("2026-10-19", "GOOD"),
    "2026-10-23"
  );
});

test("initial revision is scheduled for the following day", () => {
  assert.equal(
    getInitialRevisionDate("2026-10-19"),
    "2026-10-20"
  );
});
