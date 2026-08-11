import { getEntry } from "astro:content";
import type { Footer } from "@/schemas/footer.ts";

/** Null when src/content/footer/footer.json is missing, so a page still renders. */
export async function getFooter(): Promise<Footer | null> {
  const footer = await getEntry("footer", "footer");
  return footer?.data ?? null;
}
