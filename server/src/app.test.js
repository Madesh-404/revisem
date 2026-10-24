
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";


import app from "./app.js";

test("GET /api/plans rejects requests without authentication", async () => {
  const response = await request(app).get("/api/plans");

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Authentication required");
});

test("GET /api/plans/:planId rejects requests without authentication", async () => {
  const response = await request(app).get(
    "/api/plans/00000000-0000-4000-8000-000000000001"
  );

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Authentication required");
});


test("GET /api/plans rejects an invalid authentication token", async () => {
  const response = await request(app)
    .get("/api/plans")
    .set("Cookie", "token=invalid-token");

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    "Invalid or expired authentication token"
  );
});

test("GET /api/plans rejects an expired authentication token", async () => {
  const expiredToken = jwt.sign(
    { userId: "00000000-0000-4000-8000-000000000001" },
    process.env.JWT_SECRET,
    { expiresIn: -1 }
  );

  const response = await request(app)
    .get("/api/plans")
    .set("Cookie", `token=${expiredToken}`);

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    "Invalid or expired authentication token"
  );
});


test("GET /api/plans rejects a token without a userId claim", async () => {
  const tokenWithoutUserId = jwt.sign(
    { role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  const response = await request(app)
    .get("/api/plans")
    .set("Cookie", `token=${tokenWithoutUserId}`);

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});


const validTestToken = jwt.sign(
  { userId: "00000000-0000-4000-8000-000000000001" },
  process.env.JWT_SECRET,
  { expiresIn: "5m" }
);

test("POST /api/plans rejects an empty plan name", async () => {
  const response = await request(app)
    .post("/api/plans")
    .set("Cookie", `token=${validTestToken}`)
    .send({
      name: "   ",
      targetDate: "2026-12-31",
      dailyCapacity: 60,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(
    response.body.message,
    "Please provide valid plan details"
  );
});

test("POST /api/plans rejects an invalid calendar date", async () => {
  const response = await request(app)
    .post("/api/plans")
    .set("Cookie", `token=${validTestToken}`)
    .send({
      name: "DSA Revision",
      targetDate: "2026-02-30",
      dailyCapacity: 60,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});

test("POST /api/plans rejects daily capacity above 1440 minutes", async () => {
  const response = await request(app)
    .post("/api/plans")
    .set("Cookie", `token=${validTestToken}`)
    .send({
      name: "DSA Revision",
      targetDate: "2026-12-31",
      dailyCapacity: 1441,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});
