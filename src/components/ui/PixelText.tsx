import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Pixel letterforms in opencode's logo style.
 *
 * `#` is a stroke cell, `o` a light inner cell, `.` an empty cell. Columns are
 * 6px wide and 6px tall in the source art.
 *
 * O, P, E, N, C and D are transcribed cell-for-cell from the wordmark served at
 * opencode.ai. The rest (M, H, A, B, K, R, I) are drawn in that same block
 * language, because opencode's logo only contains the letters of "OPENCODE".
 */
const GLYPHS: Record<string, string[]> = {
  // Transcribed from opencode.ai's own logo.
  O: ["....", "####", "#..#", "#oo#", "#oo#", "####", "...."],
  P: ["....", "####", "#..#", "#oo#", "#oo#", "####", "#..."],
  E: ["....", "####", "#..#", "####", "#ooo", "####", "...."],
  N: ["....", "###.", "#..#", "#oo#", "#oo#", "#oo#", "...."],
  C: ["....", "####", "#...", "#ooo", "#ooo", "####", "...."],
  D: ["...#", "####", "#..#", "#oo#", "#oo#", "####", "...."],

  // Drawn to match.
  M: [".....", "#...#", "##.##", "#o#o#", "#...#", "#...#", "....."],
  H: ["....", "#..#", "#..#", "####", "#oo#", "#oo#", "...."],
  A: ["....", ".##.", "#..#", "####", "#oo#", "#..#", "...."],
  B: ["....", "####", "#oo#", "####", "#oo#", "####", "...."],
  K: ["....", "#..#", "#.#.", "##..", "#o#.", "#..#", "...."],
  R: ["....", "####", "#..#", "####", "#o#.", "#..#", "...."],
  I: ["....", "#...", "#...", "#...", "#o..", "#...", "...."],
  F: ["....", "####", "#..#", "####", "#ooo", "#..#", "...."],
  G: ["....", "####", "#...", "#ooo", "#o##", "####", "...."],
  J: ["....", "...#", "...#", "...#", "#oo#", "####", "...."],
  L: ["....", "#...", "#...", "#...", "#ooo", "####", "...."],
  Q: ["....", "####", "#..#", "#oo#", "#oo#", "####", "...#"],
  S: ["....", "####", "#oo#", "##..", "##oo", "####", "...."],
  T: ["....", "####", ".#o.", ".#o.", ".#o.", ".#o.", "...."],
  U: ["....", "#..#", "#..#", "#oo#", "#oo#", "####", "...."],
  V: ["....", "#..#", "#oo#", "#oo#", "#oo#", ".##.", "...."],
  W: [".....", "#...#", "#...#", "#o#o#", "##.##", "#...#", "....."],
  X: ["....", "#..#", "#oo#", ".##.", "#oo#", "#..#", "...."],
  Y: ["....", "#..#", "#oo#", "####", "..#.", "..#.", "...."],
  Z: ["....", "####", "#oo#", ".##.", "#oo#", "####", "...."],
};

const ROWS = 7;
const SPACE_COLUMNS = 3;

interface PlacedCell {
  col: number;
  row: number;
  shade: "#" | "o";
}

interface Layout {
  cells: PlacedCell[];
  columns: number;
}

/** Positions every cell of `text` on the shared block grid. */
function layout(text: string, letterGap: number): Layout {
  const cells: PlacedCell[] = [];
  let cursor = 0;
  let columns = 0;

  for (const rawChar of text.toUpperCase()) {
    if (rawChar === " ") {
      cursor += SPACE_COLUMNS;
      columns = cursor;
      continue;
    }

    const glyph = GLYPHS[rawChar];

    if (!glyph) {
      // Unknown character (digits, punctuation) falls back to a space.
      cursor += SPACE_COLUMNS;
      columns = cursor;
      continue;
    }

    for (let row = 0; row < glyph.length; row += 1) {
      const glyphRow = glyph[row];

      for (let col = 0; col < glyphRow.length; col += 1) {
        const shade = glyphRow[col];

        if (shade === "#" || shade === "o") {
          cells.push({ col: cursor + col, row, shade });
        }
      }
    }

    // M and W are a column wider than the rest, so measure the glyph rather
    // than trusting the first row (the padding rows are trimmed).
    const glyphWidth = glyph.reduce((widest, row) => Math.max(widest, row.length), 0);

    cursor += glyphWidth + letterGap;
    columns = cursor - letterGap;
  }

  return { cells, columns };
}

interface PixelTextProps {
  /** Letters, spaces allowed. Case-insensitive; unknown characters are ignored. */
  text: string;
  /** Block size in SVG units. Higher = chunkier pixels at the same size. */
  cell?: number;
  /** Gap between letters, measured in blocks. */
  letterGap?: number;
  /** Accessible name; falls back to the rendered text. */
  label?: string;
  className?: string;
}

/**
 * Renders text as pixel blocks in the opencode wordmark style.
 *
 * The stroke colour sweeps from translucent to solid left-to-right (the
 * gradient opencode use) and is built from `currentColor`, so the component
 * follows whatever text colour it inherits. The SVG is fluid: control its size
 * by constraining the parent's width.
 */
export function PixelText({
  text,
  cell = 6,
  letterGap = 1,
  label,
  className,
}: PixelTextProps) {
  const gradientId = useId();
  const { cells, columns } = layout(text, letterGap);

  if (cells.length === 0) {
    return null;
  }

  const width = columns * cell;
  const height = ROWS * cell;

  const stroke = cells
    .filter((entry) => entry.shade === "#")
    .map((entry) => `M${entry.col * cell} ${entry.row * cell}h${cell}v${cell}h-${cell}Z`)
    .join("");

  const inner = cells
    .filter((entry) => entry.shade === "o")
    .map((entry) => `M${entry.col * cell} ${entry.row * cell}h${cell}v${cell}h-${cell}Z`)
    .join("");

  return (
    <svg
      role="img"
      aria-label={label ?? text}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMid meet"
      className={cn("block h-auto w-full", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="1" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>

      <path d={stroke} fill={`url(#${gradientId})`} />
      <path d={inner} fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}