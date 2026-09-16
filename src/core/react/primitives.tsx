import React from 'react'
import type { ColorRGBA } from '../ir'
import { toHexColor } from '../ir'
import type {
  ButtonProps,
  ComponentDefProps,
  FrameProps,
  InstanceProps,
  PrimitiveType,
  RectangleProps,
  TextProps,
} from './types'
import { UI_PRIMITIVE_SYMBOL } from './types'

function resolveColorString(color: string | ColorRGBA | undefined): string | undefined {
  if (!color) return undefined
  if (typeof color === 'string') return color
  return toHexColor(color)
}

function resolvePadding(
  padding: number | { top?: number; right?: number; bottom?: number; left?: number } | undefined,
) {
  if (typeof padding === 'number') {
    return {
      paddingTop: padding,
      paddingRight: padding,
      paddingBottom: padding,
      paddingLeft: padding,
    }
  }
  return {
    paddingTop: padding?.top,
    paddingRight: padding?.right,
    paddingBottom: padding?.bottom,
    paddingLeft: padding?.left,
  }
}

export const Frame: React.FC<FrameProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  children,
  padding,
  gap,
  direction = 'none',
  alignItems,
  justifyContent,
  width,
  height,
  background,
  stroke,
  strokeWidth,
  radius,
  opacity,
  className = '',
  style,
  onPress,
  ...rest
}) => {
  const p = resolvePadding(padding)
  const isFlex = direction === 'vertical' || direction === 'horizontal'

  const domStyle: React.CSSProperties = {
    display: isFlex ? 'flex' : 'block',
    flexDirection: direction === 'vertical' ? 'column' : direction === 'horizontal' ? 'row' : undefined,
    gap: gap !== undefined ? `${gap}px` : undefined,
    paddingTop: p.paddingTop !== undefined ? `${p.paddingTop}px` : undefined,
    paddingRight: p.paddingRight !== undefined ? `${p.paddingRight}px` : undefined,
    paddingBottom: p.paddingBottom !== undefined ? `${p.paddingBottom}px` : undefined,
    paddingLeft: p.paddingLeft !== undefined ? `${p.paddingLeft}px` : undefined,
    alignItems: alignItems === 'start' ? 'flex-start' : alignItems === 'end' ? 'flex-end' : alignItems,
    justifyContent:
      justifyContent === 'start' ? 'flex-start' : justifyContent === 'end' ? 'flex-end' : justifyContent,
    width: width === 'fill' ? '100%' : typeof width === 'number' ? `${width}px` : undefined,
    height: height === 'fill' ? '100%' : typeof height === 'number' ? `${height}px` : undefined,
    backgroundColor: resolveColorString(background),
    borderColor: resolveColorString(stroke),
    borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
    borderStyle: stroke ? 'solid' : undefined,
    borderRadius:
      typeof radius === 'number'
        ? `${radius}px`
        : Array.isArray(radius)
          ? `${radius[0]}px ${radius[1]}px ${radius[2]}px ${radius[3]}px`
          : undefined,
    opacity,
    boxSizing: 'border-box',
    ...style,
  }

  const handleClick = typeof onPress === 'function' ? onPress : undefined

  return (
    <div style={domStyle} className={className} onClick={handleClick} {...rest}>
      {children}
    </div>
  )
}
Frame[UI_PRIMITIVE_SYMBOL] = 'frame'

export const Stack: React.FC<FrameProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = (props) => {
  return <Frame direction="vertical" {...props} />
}
Stack[UI_PRIMITIVE_SYMBOL] = 'stack'

export const Row: React.FC<FrameProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = (props) => {
  return <Frame direction="horizontal" alignItems="center" {...props} />
}
Row[UI_PRIMITIVE_SYMBOL] = 'row'

export const Text: React.FC<TextProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  children,
  size = 14,
  weight = 'regular',
  color = '#111827',
  family,
  align = 'left',
  lineHeight,
  className = '',
  style,
  ...rest
}) => {
  const numericWeight =
    typeof weight === 'number'
      ? weight
      : weight === 'bold'
        ? 700
        : weight === 'semibold'
          ? 600
          : weight === 'medium'
            ? 500
            : 400

  const domStyle: React.CSSProperties = {
    fontSize: `${size}px`,
    fontWeight: numericWeight,
    color: resolveColorString(color),
    fontFamily: family || 'inherit',
    textAlign: align,
    lineHeight: lineHeight ? `${lineHeight}px` : 1.4,
    margin: 0,
    ...style,
  }

  return (
    <span style={domStyle} className={className} {...rest}>
      {children}
    </span>
  )
}
Text[UI_PRIMITIVE_SYMBOL] = 'text'

export const Rectangle: React.FC<RectangleProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  width = 100,
  height = 100,
  fill = '#E5E7EB',
  stroke,
  strokeWidth,
  radius,
  opacity,
  className = '',
  style,
  ...rest
}) => {
  const domStyle: React.CSSProperties = {
    width: width === 'fill' ? '100%' : typeof width === 'number' ? `${width}px` : undefined,
    height: height === 'fill' ? '100%' : typeof height === 'number' ? `${height}px` : undefined,
    backgroundColor: resolveColorString(fill),
    borderColor: resolveColorString(stroke),
    borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
    borderStyle: stroke ? 'solid' : undefined,
    borderRadius:
      typeof radius === 'number'
        ? `${radius}px`
        : Array.isArray(radius)
          ? `${radius[0]}px ${radius[1]}px ${radius[2]}px ${radius[3]}px`
          : undefined,
    opacity,
    boxSizing: 'border-box',
    ...style,
  }

  return <div style={domStyle} className={className} {...rest} />
}
Rectangle[UI_PRIMITIVE_SYMBOL] = 'rectangle'

export const Button: React.FC<ButtonProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  children,
  variant = 'primary',
  width = 'hug',
  disabled = false,
  onPress,
  className = '',
  style,
  ...rest
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#1D9BF0',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#27272A',
      color: '#F4F4F5',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1D9BF0',
      border: '1px solid #1D9BF0',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
    },
  }

  const domStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: width === 'fill' ? '100%' : typeof width === 'number' ? `${width}px` : undefined,
    boxSizing: 'border-box',
    transition: 'all 0.15s ease',
    ...variantStyles[variant],
    ...style,
  }

  const handleClick = () => {
    if (disabled) return
    if (typeof onPress === 'function') onPress()
  }

  return (
    <button style={domStyle} className={className} onClick={handleClick} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
Button[UI_PRIMITIVE_SYMBOL] = 'button'

export const ComponentDef: React.FC<ComponentDefProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  children,
}) => {
  return <>{children}</>
}
ComponentDef[UI_PRIMITIVE_SYMBOL] = 'component'

export const Instance: React.FC<InstanceProps> & { [UI_PRIMITIVE_SYMBOL]: PrimitiveType } = ({
  children,
}) => {
  return <>{children}</>
}
Instance[UI_PRIMITIVE_SYMBOL] = 'instance'
