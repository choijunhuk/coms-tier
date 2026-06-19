import { afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultRows } from "./tierEngine";
import { toMiniDocumentRequest, uploadMediaFile } from "./miniApi";
import type { TierResult } from "../types/tier";

const rows = createDefaultRows();
const topRow = rows[0]!;
const result: TierResult = {
  id: "result-a",
  templateId: "template-a",
  templateTitle: "개발 언어 티어표",
  rows: [
    { row: topRow, items: [{ id: "ts", name: "TypeScript", description: "타입", tags: ["lang"] }] },
    ...rows.slice(1).map((row) => ({ row, items: [] })),
  ],
  unplacedItems: [],
  placements: [{ itemId: "ts", tierId: topRow.id, placedAt: "now" }],
  completedAt: "now",
};

describe("tier mini API helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("wraps results as mini-app document payloads", () => {
    expect(toMiniDocumentRequest(result, false)).toEqual({
      title: "개발 언어 티어표",
      description: "S티어: TypeScript",
      shared: false,
      payload: result,
    });
  });

  it("uploads media through the COMS file API and returns an inline URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 42 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const url = await uploadMediaFile(new File(["gif"], "clip.gif", { type: "image/gif" }), "테스트");

    expect(url).toBe("/api/files/42/inline");
    expect(fetchMock).toHaveBeenCalledWith("/api/files", expect.objectContaining({ method: "POST", credentials: "include" }));
  });
});
