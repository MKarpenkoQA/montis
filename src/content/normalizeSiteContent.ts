import type { SiteContent } from "./types";
import { defaultSiteContent } from "./defaults";

type JsonRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is JsonRecord =>
  Object.prototype.toString.call(value) === "[object Object]";

const canMergeValue = (fallback: unknown, value: unknown): boolean => {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return false;
    if (fallback.length === 0) return true;
    return value.every((item) => canMergeValue(fallback[0], item));
  }

  if (isPlainObject(fallback)) {
    return isPlainObject(value);
  }

  return typeof value === typeof fallback;
};

const mergeValue = (fallback: unknown, value: unknown): unknown => {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback;
    if (fallback.length === 0) return value;

    const sample = fallback[0];
    if (!value.every((item) => canMergeValue(sample, item))) {
      return fallback;
    }

    return value.map((item) => mergeValue(sample, item));
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(value)) return fallback;

    return Object.fromEntries(
      Object.entries(fallback).map(([key, fallbackValue]) => [
        key,
        mergeValue(fallbackValue, value[key]),
      ]),
    );
  }

  return typeof value === typeof fallback ? value : fallback;
};

export const normalizeSiteContent = (value: unknown): SiteContent =>
  mergeValue(defaultSiteContent, value) as SiteContent;
