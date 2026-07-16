import assert from "node:assert/strict";
import { test } from "node:test";
import { isSecureAdminPassword } from "./auth.js";

test("rejects blank and known insecure admin passwords", () => {
  for (const password of ["", "   ", "montis-admin", " change-me-in-production "]) {
    assert.equal(isSecureAdminPassword(password), false);
  }
});

test("accepts private non-empty admin passwords", () => {
  assert.equal(isSecureAdminPassword("unique-production-secret"), true);
});
