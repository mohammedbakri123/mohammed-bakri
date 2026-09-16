import React from 'react'
import type {
  ColorRGBA,
  Interaction,
  LayoutStyle,
  ShapeStyle,
} from '../ir'

export const UI_PRIMITIVE_SYMBOL = Symbol.for('ui.primitive')

export type PrimitiveType =
  | 'frame'
  | 'stack'
  | 'row'
  | 'text'
  | 'rectangle'
  | 'button'
  | 'component'
  | 'instance'

export interface BasePrimitiveProps {
  id?: string
  name?: string
  onPress?: Interaction | (() => void)
  children?: React.ReactNode
}

export interface FrameProps extends BasePrimitiveProps {
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  gap?: number
  direction?: 'vertical' | 'horizontal' | 'none'
  alignItems?: 'start' | 'center' | 'end' | 'space-between'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between'
  width?: number | 'fill' | 'hug'
  height?: number | 'fill' | 'hug'
  background?: string | ColorRGBA
  stroke?: string | ColorRGBA
  strokeWidth?: number
  radius?: number | [number, number, number, number]
  opacity?: number
  className?: string
  style?: React.CSSProperties
}

export interface TextProps extends BasePrimitiveProps {
  size?: number
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | number
  color?: string | ColorRGBA
  family?: string
  align?: 'left' | 'center' | 'right'
  lineHeight?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export interface RectangleProps extends BasePrimitiveProps {
  width?: number | 'fill' | 'hug'
  height?: number | 'fill' | 'hug'
  fill?: string | ColorRGBA
  stroke?: string | ColorRGBA
  strokeWidth?: number
  radius?: number | [number, number, number, number]
  opacity?: number
  className?: string
  style?: React.CSSProperties
}

export interface ButtonProps extends BasePrimitiveProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  width?: number | 'fill' | 'hug'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export interface ComponentDefProps extends BasePrimitiveProps {
  componentName: string
  variant?: string
  layout?: LayoutStyle
  style?: ShapeStyle
}

export interface InstanceProps extends BasePrimitiveProps {
  componentName: string
  variant?: string
  overrides?: {
    text?: Record<string, string>
    style?: Partial<ShapeStyle>
  }
  layout?: LayoutStyle
}
