import { describe, expect, it } from "vitest";
import { mediaFromInput, youtubeEmbedUrl } from "./media";

describe("tier media helpers", () => {
  it("detects uploaded/static images and gifs", () => {
    expect(mediaFromInput("/api/files/1/inline")).toEqual({ type: "image", url: "/api/files/1/inline" });
    expect(mediaFromInput("https://example.com/demo.gif")).toEqual({ type: "gif", url: "https://example.com/demo.gif" });
  });

  it("converts youtube links to embeds", () => {
    expect(youtubeEmbedUrl("https://youtube.com/shorts/dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(mediaFromInput("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
      type: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  });
});
