import type {
  ColorRGBA,
  DropShadowEffect,
  EffectDefinition,
  ShapeStyle,
} from '../ir'
import { parseColor } from '../ir'
import type { FigmaEffect, FigmaPaint, IFigmaFrameNode, IFigmaRectangleNode } from './adapter'

export interface ValidationNotice {
  level: 'warning' | 'error';
  property: string;
  nodeName: string;
  reason: string;
}

export class ShapeRenderer {
  notices: ValidationNotice[] = [];

  reportNotice(nodeName: string, property: string, reason: string, level: 'warning' | 'error' = 'warning'): void {
    this.notices.push({ level, nodeName, property, reason });
  }

  toFigmaPaint(color: string | ColorRGBA | undefined): FigmaPaint[] {
    if (!color) return [];
    const parsed = parseColor(color);
    if (!parsed) return [];

    return [
      {
        type: 'SOLID',
        color: { r: parsed.r, g: parsed.g, b: parsed.b },
        opacity: parsed.a !== undefined ? parsed.a : 1,
      },
    ];
  }

  toFigmaEffects(effects: EffectDefinition[] | undefined, nodeName: string): FigmaEffect[] {
    if (!effects || effects.length === 0) return [];
    const result: FigmaEffect[] = [];

    for (const eff of effects) {
      if (eff.type === 'drop-shadow') {
        const shadow = eff as DropShadowEffect;
        result.push({
          type: 'DROP_SHADOW',
          color: {
            r: shadow.color.r,
            g: shadow.color.g,
            b: shadow.color.b,
            a: shadow.color.a ?? 1,
          },
          offset: { x: shadow.offset.x, y: shadow.offset.y },
          radius: shadow.radius,
          spread: shadow.spread ?? 0,
          visible: true,
        });
      } else {
        this.reportNotice(nodeName, (eff as { type: string }).type, 'Effect type is not currently supported by Figma renderer.');
      }
    }

    return result;
  }

  applyShapeStyle(
    node: IFigmaFrameNode | IFigmaRectangleNode,
    style: ShapeStyle | undefined,
    nodeName: string,
  ): void {
    if (!style) return;

    // Fill
    if (style.fill) {
      node.fills = this.toFigmaPaint(style.fill);
    }

    // Stroke
    if (style.stroke) {
      node.strokes = this.toFigmaPaint(style.stroke);
      node.strokeWeight = style.strokeWidth ?? 1;
    }

    // Corner Radius
    if (style.cornerRadius !== undefined) {
      if (typeof style.cornerRadius === 'number') {
        node.cornerRadius = style.cornerRadius;
      } else if (Array.isArray(style.cornerRadius)) {
        // Uniform fallback or primary radius
        node.cornerRadius = style.cornerRadius[0];
      }
    }

    // Opacity
    if (style.opacity !== undefined) {
      node.opacity = Math.max(0, Math.min(1, style.opacity));
    }

    // Effects
    if (style.effects && style.effects.length > 0) {
      node.effects = this.toFigmaEffects(style.effects, nodeName);
    }
  }
}
