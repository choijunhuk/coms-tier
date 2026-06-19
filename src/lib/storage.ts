import type { TierPlacement, TierResult, TierTemplate } from "../types/tier";

const TEMPLATE_KEY = "coms-tier:templates";
const RESULT_KEY = "coms-tier:results";
const DRAFT_KEY_PREFIX = "coms-tier:draft:";

const storage = (): Storage | undefined => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";

const isTierRow = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return isString(value.id) && isString(value.name) && isString(value.color) && isString(value.description);
};

const isTierItem = (value: unknown): boolean => {
  if (!isRecord(value)) {
    return false;
  }
  return isString(value.id) && isString(value.name) && isString(value.description) && Array.isArray(value.tags);
};

const isTierTemplate = (value: unknown): value is TierTemplate => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isString(value.id) &&
    isString(value.title) &&
    isString(value.description) &&
    isString(value.category) &&
    Array.isArray(value.rows) &&
    value.rows.every(isTierRow) &&
    Array.isArray(value.items) &&
    value.items.every(isTierItem) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
};

const isTierPlacement = (value: unknown): value is TierPlacement => {
  if (!isRecord(value)) {
    return false;
  }
  return isString(value.itemId) && isString(value.tierId) && isString(value.placedAt);
};

const isTierResult = (value: unknown): value is TierResult => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    isString(value.id) &&
    isString(value.templateId) &&
    isString(value.templateTitle) &&
    Array.isArray(value.rows) &&
    Array.isArray(value.unplacedItems) &&
    Array.isArray(value.placements) &&
    value.placements.every(isTierPlacement) &&
    isString(value.completedAt)
  );
};

const removeKey = (key: string): void => {
  const target = storage();
  if (!target) {
    return;
  }
  try {
    target.removeItem(key);
  } catch {
    // Blocked storage cleanup should not break rendering.
  }
};

const readArray = <T>(key: string, validate: (value: unknown) => value is T): T[] => {
  const target = storage();
  if (!target) {
    return [];
  }

  let raw: string | null;
  try {
    raw = target.getItem(key);
  } catch {
    return [];
  }

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(validate)) {
      removeKey(key);
      return [];
    }
    return parsed;
  } catch {
    removeKey(key);
    return [];
  }
};

const writeJson = <T>(key: string, value: T): boolean => {
  const target = storage();
  if (!target) {
    return false;
  }

  try {
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const getStoredTemplates = (): TierTemplate[] => readArray(TEMPLATE_KEY, isTierTemplate);

export const saveTemplate = (template: TierTemplate): boolean => {
  const templates = getStoredTemplates().filter((item) => item.id !== template.id);
  return writeJson(TEMPLATE_KEY, [template, ...templates]);
};

export const getStoredResults = (): TierResult[] => readArray(RESULT_KEY, isTierResult);

export const saveResult = (result: TierResult): boolean => {
  const results = getStoredResults().filter((item) => item.id !== result.id);
  return writeJson(RESULT_KEY, [result, ...results]);
};

export const getResultById = (id: string): TierResult | undefined =>
  getStoredResults().find((result) => result.id === id);

export const getDraftPlacements = (templateId: string): TierPlacement[] =>
  readArray(`${DRAFT_KEY_PREFIX}${templateId}`, isTierPlacement);

export const saveDraftPlacements = (templateId: string, placements: TierPlacement[]): boolean =>
  writeJson(`${DRAFT_KEY_PREFIX}${templateId}`, placements);

export const clearDraftPlacements = (templateId: string): void => {
  removeKey(`${DRAFT_KEY_PREFIX}${templateId}`);
};
