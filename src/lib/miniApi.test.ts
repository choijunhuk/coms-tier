import { afterEach, describe, expect, it, vi } from "vitest";
import { createDefaultRows } from "./tierEngine";
import { getCurrentUser, loginComsUser, logoutComsUser, toMiniDocumentRequest, uploadMediaFile } from "./miniApi";
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

  it("logs in through the COMS auth API inside the app", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ studentId: "20250001", name: "홍길동", role: "USER" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = await loginComsUser({ identifier: "20250001", password: "pw", rememberMe: true });

    expect(user).toEqual({ studentId: "20250001", name: "홍길동", role: "USER" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ identifier: "20250001", password: "pw", rememberMe: true }),
      }),
    );
  });

  it("logs out through the COMS auth API inside the app", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await logoutComsUser();

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", expect.objectContaining({ method: "POST", credentials: "include" }));
  });

  it("refreshes an expired session before returning the current user", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 403 })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ studentId: "20250001", name: "홍길동" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const user = await getCurrentUser();

    expect(user).toEqual({ studentId: "20250001", name: "홍길동" });
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/auth/me", { credentials: "include" });
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/auth/refresh", { method: "POST", credentials: "include" });
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/auth/me", { credentials: "include" });
  });
});
