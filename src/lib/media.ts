import type { ImageMetadata } from 'astro';

/** One media item as a component sees it, once image() has resolved `src`. */
export interface MediaItem {
  src?: ImageMetadata;
  alt?: string;
  videoUrl?: string;
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

export interface VimeoVideo {
  id: string;
  /** The privacy hash an unlisted video needs, from a vimeo.com/<id>/<hash> link. */
  hash?: string;
}

/** The numeric id, and privacy hash if present, out of any Vimeo URL. */
export function vimeoVideo(url: string): VimeoVideo | undefined {
  const match = url.match(
    /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)(?:\/(\w+))?/,
  );
  if (!match) return undefined;
  return { id: match[1], hash: match[2] };
}

export const vimeoEmbedUrl = ({ id, hash }: VimeoVideo) =>
  `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;

export type VideoProvider = 'youtube' | 'vimeo';

export function videoProvider(url: string): VideoProvider | undefined {
  if (/(?:youtube\.com|youtu\.be)\//.test(url)) return 'youtube';
  if (/vimeo\.com\//.test(url)) return 'vimeo';
  return undefined;
}

export const hasMedia = (media: MediaItem | undefined): boolean =>
  Boolean(media && (media.src || media.videoUrl || media.sketch));
