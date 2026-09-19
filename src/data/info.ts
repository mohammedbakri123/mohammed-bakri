import raw from "./info.json";
import type { Info } from "./types";

/**
 * Single source of truth for personal content.
 *
 * Edit `info.json` — no component changes required. Every section in the site
 * reads from this object.
 */
export const info = raw as Info;