import { cn } from "@/lib/cn";

/**
 * Pixel letterforms in opencode's logo style.
 *
 * `#` is a stroke cell, `o` a light inner cell, `.` an empty cell. Columns are
 * 6px wide and 6px tall in the source art.
 *
 * O, P, E, N, C and D are transcribed cell-for-cell from the wordmark served at
 * opencode.ai. The rest (M, H, A, B, K, R, I) are drawn in that same block
 * language, matching opencode's exact 6x6 pixel grid.
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
const SPACE_COLUMNS = 2;

interface PlacedCell {
  col: number;
  row: number;
  shade: "#" | "o";
  letterIndex: number;
  totalLetters: number;
}

interface Layout {
  cells: PlacedCell[];
  columns: number;
  rows: number;
}

/** Positions every cell of `text` on the shared block grid. */
function layout(lines: string[], letterGap: number, lineGap: number): Layout {
  const cells: PlacedCell[] = [];
  let maxColumns = 0;

  // Count total valid letters across all lines
  let totalLetters = 0;
  for (const line of lines) {
    for (const char of line.toUpperCase()) {
      if (GLYPHS[char]) totalLetters++;
    }
  }

  let letterCount = 0;

  lines.forEach((line, lineIndex) => {
    let cursor = 0;
    const rowOffset = lineIndex * (ROWS + lineGap);

    for (const rawChar of line.toUpperCase()) {
      if (rawChar === " ") {
        cursor += SPACE_COLUMNS;
        continue;
      }

      const glyph = GLYPHS[rawChar];

      if (!glyph) {
        cursor += SPACE_COLUMNS;
        continue;
      }

      const currentLetterIndex = letterCount++;

      for (let row = 0; row < glyph.length; row += 1) {
        const glyphRow = glyph[row];

        for (let col = 0; col < glyphRow.length; col += 1) {
          const shade = glyphRow[col];

          if (shade === "#" || shade === "o") {
            cells.push({
              col: cursor + col,
              row: rowOffset + row,
              shade,
              letterIndex: currentLetterIndex,
              totalLetters,
            });
          }
        }
      }

      const glyphWidth = glyph.reduce((widest, row) => Math.max(widest, row.length), 0);
      cursor += glyphWidth + letterGap;
    }

    const lineWidth = cursor > 0 ? cursor - letterGap : 0;
    maxColumns = Math.max(maxColumns, lineWidth);
  });

  const totalRows = lines.length * ROWS + (lines.length - 1) * lineGap;

  return { cells, columns: maxColumns, rows: totalRows };
}

interface PixelTextProps {
  /** Letters, spaces allowed. Case-insensitive. */
  text?: string;
  /** Multiple lines stacked vertically */
  lines?: string[];
  /** Block size in SVG units. Higher = chunkier pixels. Default 6 (OpenCode source art). */
  cell?: number;
  /** Gap between letters, measured in blocks. Default 1. */
  letterGap?: number;
  /** Gap between lines if multiline, measured in blocks. Default 2. */
  lineGap?: number;
  /** Accessible label */
  label?: string;
  className?: string;
}

/**
 * Renders text as pixel blocks in OpenCode's exact production logo style:
 * - Inner cells: #4B4646 (crisp warm charcoal)
 * - Stroke: sweeping from #8E8B8B / #B7B1B1 (warm mid-gray) to #F1ECEC (bright warm white)
 * - Zero blurry gradients: crisp, discrete vector pixel squares.
 */
export function PixelText({
  text,
  lines,
  cell = 6,
  letterGap = 1,
  lineGap = 2,
  label,
  className,
}: PixelTextProps) {
  const lineArray = lines ?? (text ? [text] : []);
  const { cells, columns, rows } = layout(lineArray, letterGap, lineGap);

  if (cells.length === 0) {
    return null;
  }

  const width = columns * cell;
  const height = rows * cell;

  // Inner cells: #4B4646 (opencode logo standard)
  const innerPath = cells
    .filter((entry) => entry.shade === "o")
    .map((entry) => `M${entry.col * cell} ${entry.row * cell}h${cell}v${cell}h-${cell}Z`)
    .join("");

  // Stroke cells: opencode two-tone / three-tone sweep
  // First half of letters -> #B7B1B1 (mid warm gray)
  // Second half of letters -> #F1ECEC (bright warm white)
  const strokeMuted = cells
    .filter((entry) => entry.shade === "#" && entry.letterIndex < Math.ceil(entry.totalLetters / 2))
    .map((entry) => `M${entry.col * cell} ${entry.row * cell}h${cell}v${cell}h-${cell}Z`)
    .join("");

  const strokeBright = cells
    .filter((entry) => entry.shade === "#" && entry.letterIndex >= Math.ceil(entry.totalLetters / 2))
    .map((entry) => `M${entry.col * cell} ${entry.row * cell}h${cell}v${cell}h-${cell}Z`)
    .join("");

  return (
    <svg
      role="img"
      aria-label={label ?? text ?? lineArray.join(" ")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMid meet"
      className={cn("block h-auto", className)}
    >
      {innerPath ? <path d={innerPath} fill="var(--pixel-inner, #4B4646)" /> : null}
      {strokeMuted ? <path d={strokeMuted} fill="var(--pixel-stroke-muted, #B7B1B1)" /> : null}
      {strokeBright ? <path d={strokeBright} fill="var(--pixel-stroke-bright, #F1ECEC)" /> : null}
    </svg>
  );
}