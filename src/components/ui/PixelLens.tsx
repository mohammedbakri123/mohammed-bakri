import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { cn } from "@/lib/cn";

/** Diameter of the pixel lens, in CSS pixels. */
const LENS_RADIUS = 60;

/** Width of the pre-rendered pixel layer, in blocks across. */
const BLOCKS = 44;

const LENS_MASK = `radial-gradient(circle ${LENS_RADIUS}px at var(--px) var(--py), #000 0 58%, transparent 100%)`;

interface PixelLensProps {
  /** Image to show. Rendered crisp, with a pixelated copy under the lens. */
  src: string;
  alt: string;
  className?: string;
  /** Fired if the image fails to load — callers usually swap in a fallback. */
  onError?: () => void;
}

/**
 * Portrait that answers the cursor: the photo stays sharp while a soft
 * circular lens drags a low-resolution copy across it — the pixel wordmark
 * logic applied to photography.
 *
 * The pixel layer is rasterised once at load (a ~44px canvas), then upscaled
 * by the browser with nearest-neighbour sampling. Pointer moves only write CSS
 * custom properties, so nothing re-renders during tracking.
 */
export function PixelLens({ src, alt, className, onError }: PixelLensProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [pixelSrc, setPixelSrc] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled || image.naturalWidth === 0) {
        return;
      }

      const height = Math.max(
        1,
        Math.round((image.naturalHeight / image.naturalWidth) * BLOCKS),
      );
      const canvas = document.createElement("canvas");
      canvas.width = BLOCKS;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.drawImage(image, 0, 0, BLOCKS, height);
      setPixelSrc(canvas.toDataURL("image/png"));
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    frame.style.setProperty("--px", `${event.clientX - rect.left}px`);
    frame.style.setProperty("--py", `${event.clientY - rect.top}px`);

    if (!active) {
      setActive(true);
    }
  };

  return (
    <div
      ref={frameRef}
      className={cn("relative overflow-hidden border border-border bg-surface", className)}
      style={{ "--px": "-300px", "--py": "-300px" } as CSSProperties}
      onPointerMove={track}
      onPointerLeave={() => setActive(false)}
    >
      <img
        src={src}
        alt={alt}
        width={520}
        height={520}
        loading="lazy"
        decoding="async"
        onError={onError}
        className="block aspect-square w-full object-cover"
      />

      {pixelSrc ? (
        <img
          src={pixelSrc}
          alt=""
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0",
          )}
          style={{
            imageRendering: "pixelated",
            filter: "contrast(1.08) saturate(1.05)",
            WebkitMaskImage: LENS_MASK,
            maskImage: LENS_MASK,
          }}
        />
      ) : null}
    </div>
  );
}
