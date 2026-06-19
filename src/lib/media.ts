export type MiniMedia =
  | { type: "image"; url: string }
  | { type: "gif"; url: string }
  | { type: "youtube"; url: string; embedUrl: string };

const YOUTUBE_ID = /^[a-zA-Z0-9_-]{11}$/;

export const youtubeEmbedUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v") ?? "";
      } else if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
        id = url.pathname.split("/").filter(Boolean)[1] ?? "";
      }
    }
    return YOUTUBE_ID.test(id) ? `https://www.youtube.com/embed/${id}` : undefined;
  } catch {
    return undefined;
  }
};

export const mediaFromInput = (value: string | undefined): MiniMedia | undefined => {
  const url = value?.trim();
  if (!url) {
    return undefined;
  }
  const embedUrl = youtubeEmbedUrl(url);
  if (embedUrl) {
    return { type: "youtube", url, embedUrl };
  }
  if (/\.gif($|[?#])/i.test(url)) {
    return { type: "gif", url };
  }
  return { type: "image", url };
};

export const mediaUrl = (media: MiniMedia | undefined, fallbackUrl?: string): string | undefined =>
  media?.url ?? fallbackUrl;
