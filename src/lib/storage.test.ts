import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyText } from "./share";
import { getStoredTemplates, saveTemplate } from "./storage";
import { createDefaultRows } from "./tierEngine";
import type { TierTemplate } from "../types/tier";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const template: TierTemplate = {
  id: "custom",
  title: "테스트 티어표",
  description: "저장 테스트",
  category: "custom",
  rows: createDefaultRows(),
  items: [{ id: "a", name: "A", description: "A", tags: [] }],
  createdAt: "now",
  updatedAt: "now",
};

describe("tier storage resilience", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new MemoryStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("drops valid JSON with the wrong template schema", () => {
    window.localStorage.setItem("coms-tier:templates", "{}");

    expect(getStoredTemplates()).toEqual([]);
    expect(window.localStorage.getItem("coms-tier:templates")).toBeNull();
  });

  it("does not throw when localStorage writes are blocked", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
        removeItem: () => {
          throw new Error("blocked");
        },
      },
    });

    expect(getStoredTemplates()).toEqual([]);
    expect(() => saveTemplate(template)).not.toThrow();
  });

  it("returns false when clipboard permission rejects writes", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: () => Promise.reject(new Error("denied")),
      },
    });

    await expect(copyText("COMS")).resolves.toBe(false);
  });
});
