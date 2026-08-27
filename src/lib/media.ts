import type { ImageMetadata } from 'astro';

/** One media item as a component sees it, once image() has resolved `src`. */
export interface MediaItem {
  src?: ImageMetadata;
  alt?: string;
  youtubeUrl?: string;
  sketch?: string;
}

/**
 * The 11-character video id out of any YouTube URL the schema accepts: a watch
 * link, a youtu.be short link, a /shorts or /live path, or an /embed URL.
 */
export function youtubeId(url: string): string | undefined {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1];
}

/**
 * youtube-nocookie.com rather than youtube.com: it sets no tracking cookie
 * until the visitor plays the video.
 */
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}`;

export const hasMedia = (media: MediaItem | undefined): boolean =>
  Boolean(media && (media.src || media.youtubeUrl || media.sketch));
