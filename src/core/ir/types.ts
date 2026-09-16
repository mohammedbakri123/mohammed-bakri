/**
 * Phase 1: Intermediate UI Representation (IR)
 *
 * This representation is completely decoupled from React DOM and Figma APIs.
 * It describes WHAT the interface is, allowing different renderers (Web React, Figma, Remotion)
 * to interpret it for their specific target environments.
 */

export type LayoutDirection = 'vertical' | 'horizontal' | 'none';
export type Alignment = 'start' | 'center' | 'end' | 'space-between';
export type SizingMode = 'hug' | 'fill' | 'fixed';

export interface LayoutStyle {
  direction?: LayoutDirection;
  gap?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  alignItems?: Alignment;
  justifyContent?: Alignment;
  width?: number | SizingMode;
  height?: number | SizingMode;
}

export interface ColorRGBA {
  r: number; // 0..1
  g: number; // 0..1
  b: number; // 0..1
  a?: number; // 0..1
}

export interface DropShadowEffect {
  type: 'drop-shadow';
  color: ColorRGBA;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
}

export type EffectDefinition = DropShadowEffect;

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string | ColorRGBA;
}

export interface ShapeStyle {
  fill?: string | ColorRGBA;
  stroke?: string | ColorRGBA;
  strokeWidth?: number;
  cornerRadius?: number | [number, number, number, number];
  opacity?: number;
  effects?: EffectDefinition[];
}

export interface Interaction {
  trigger?: 'click' | 'hover';
  action?: 'navigate' | 'open-overlay';
  type?: 'navigate' | 'open-overlay'; // Convenience alias matching React spec
  destination?: string; // Target Screen ID / Name
  transition?: 'smart-animate' | 'instant' | 'dissolve';
}

export interface BaseNodeIR {
  id?: string;
  name: string;
  interaction?: Interaction;
}

export interface FrameNodeIR extends BaseNodeIR {
  type: 'frame';
  layout?: LayoutStyle;
  style?: ShapeStyle;
  children: UINodeIR[];
}

export interface TextNodeIR extends BaseNodeIR {
  type: 'text';
  content: string;
  style?: TextStyle;
}

export interface RectangleNodeIR extends BaseNodeIR {
  type: 'rectangle';
  width?: number | SizingMode;
  height?: number | SizingMode;
  style?: ShapeStyle;
}

export interface ComponentNodeIR extends BaseNodeIR {
  type: 'component';
  componentName: string;
  variant?: string;
  layout?: LayoutStyle;
  style?: ShapeStyle;
  children: UINodeIR[];
}

export interface InstanceNodeIR extends BaseNodeIR {
  type: 'instance';
  componentName: string;
  variant?: string;
  props?: Record<string, unknown>;
  overrides?: {
    text?: Record<string, string>; // child name or path -> new text
    style?: Partial<ShapeStyle>;
  };
  layout?: LayoutStyle;
}

export type UINodeIR =
  | FrameNodeIR
  | TextNodeIR
  | RectangleNodeIR
  | ComponentNodeIR
  | InstanceNodeIR;

export interface ScreenDefinition {
  id: string;
  name: string;
  root: FrameNodeIR;
}

export interface AppDefinition {
  name: string;
  components?: ComponentNodeIR[];
  screens: ScreenDefinition[];
}
