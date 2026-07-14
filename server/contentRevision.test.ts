import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertContentRevisionMatches,
  ContentConflictError,
  createNextUpdatedAt,
} from "./contentRevision.ts";

describe("content revisions", () => {
  it("allows matching revisions", () => {
    assert.doesNotThrow(() => assertContentRevisionMatches("2026-07-14T11:00:00.000Z", "2026-07-14T11:00:00.000Z"));
  });

  it("rejects missing or stale revisions", () => {
    assert.throws(() => assertContentRevisionMatches(null, "2026-07-14T11:00:00.000Z"), ContentConflictError);
    assert.throws(
      () => assertContentRevisionMatches("2026-07-14T11:00:00.000Z", "2026-07-14T11:00:01.000Z"),
      ContentConflictError,
    );
  });

  it("creates a revision newer than the previous value", () => {
    const previous = new Date(Date.now() + 60_000).toISOString();
    const next = createNextUpdatedAt(previous);

    assert.ok(Date.parse(next) > Date.parse(previous));
  });
});
