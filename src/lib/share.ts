import type { TierResult } from "../types/tier";
import { createTierShareText } from "./tierEngine";

export const createResultShareText = (result: TierResult): string => createTierShareText(result);

export const copyText = async (text: string): Promise<boolean> => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
