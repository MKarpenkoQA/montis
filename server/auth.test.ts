import assert from "node:assert/strict";
import test from "node:test";
import {
  clearLoginAttempts,
  getLoginRetryAfterMs,
  recordFailedLoginAttempt,
} from "./auth.js";

test("failed login attempts are locked after repeated failures and clear on reset", () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  clearLoginAttempts(key);

  assert.equal(getLoginRetryAfterMs(key), null);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    assert.equal(recordFailedLoginAttempt(key), null);
  }

  const retryAfterMs = recordFailedLoginAttempt(key);
  if (retryAfterMs === null) {
    assert.fail("expected lockout after repeated failures");
  }
  assert.ok(retryAfterMs > 0);
  assert.ok(getLoginRetryAfterMs(key)! > 0);

  clearLoginAttempts(key);
  assert.equal(getLoginRetryAfterMs(key), null);
});
