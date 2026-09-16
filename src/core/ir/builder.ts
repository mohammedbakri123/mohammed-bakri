import type {
  ColorRGBA,
  ComponentNodeIR,
  FrameNodeIR,
  InstanceNodeIR,
  LayoutStyle,
  RectangleNodeIR,
  ShapeStyle,
  TextNodeIR,
  TextStyle,
  UINodeIR,
} from './types'

/**
 * Converts a hex string ('#1D9BF0', '1D9BF0', '#FFF') or RGBA string/object into normalized 0..1 ColorRGBA.
 */
export function parseColor(color: string | ColorRGBA | undefined): ColorRGBA | undefined {
  if (!color) return undefined
  if (typeof color === 'object') {
    return {
      r: Math.min(1, Math.max(0, color.r)),
      g: Math.min(1, Math.max(0, color.g)),
      b: Math.min(1, Math.max(0, color.b)),
      a: color.a !== undefined ? Math.min(1, Math.max(0, color.a)) : 1,
    }
  }

  const str = color.trim()
  if (str.startsWith('#')) {
    const raw = str.slice(1)
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16) / 255
      const g = parseInt(raw[1] + raw[1], 16) / 255
      const b = parseInt(raw[2] + raw[2], 16) / 255
      return { r, g, b, a: 1 }
    }
    if (raw.length === 6) {
      const r = parseInt(raw.slice(0, 2), 16) / 255
      const g = parseInt(raw.slice(2, 4), 16) / 255
      const b = parseInt(raw.slice(4, 6), 16) / 255
      return { r, g, b, a: 1 }
    }
    if (raw.length === 8) {
      const r = parseInt(raw.slice(0, 2), 16) / 255
      const g = parseInt(raw.slice(2, 4), 16) / 255
      const b = parseInt(raw.slice(4, 6), 16) / 255
      const a = parseInt(raw.slice(6, 8), 16) / 255
      return { r, g, b, a }
    }
  }

  const rgbaMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10) / 255
    const g = parseInt(rgbaMatch[2], 10) / 255
    const b = parseInt(rgbaMatch[3], 10) / 255
    const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1
    return { r, g, b, a }
  }

  // Fallback defaults
  if (str.toLowerCase() === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }
  if (str.toLowerCase() === 'white') {
    return { r: 1, g: 1, b: 1, a: 1 }
  }
  if (str.toLowerCase() === 'black') {
    return { r: 0, g: 0, b: 0, a: 1 }
  }

  return undefined
}

export function toHexColor(color: ColorRGBA): string {
  const toHex = (n: number) =>
    Math.round(Math.min(1, Math.max(0, n)) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

export function createFrame(
  name: string,
  options: {
    layout?: LayoutStyle
    style?: ShapeStyle
    children?: UINodeIR[]
    id?: string
  } = {},
): FrameNodeIR {
  return {
    type: 'frame',
    name,
    id: options.id,
    layout: options.layout,
    style: options.style,
    children: options.children || [],
  }
}

export function createText(
  content: string,
  options: {
    name?: string
    style?: TextStyle
    id?: string
  } = {},
): TextNodeIR {
  return {
    type: 'text',
    name: options.name || content.slice(0, 20),
    id: options.id,
    content,
    style: options.style,
  }
}

export function createRectangle(
  name: string,
  options: {
    width?: number | 'fill' | 'hug'
    height?: number | 'fill' | 'hug'
    style?: ShapeStyle
    id?: string
  } = {},
): RectangleNodeIR {
  return {
    type: 'rectangle',
    name,
    id: options.id,
    width: options.width,
    height: options.height,
    style: options.style,
  }
}

export function createComponent(
  componentName: string,
  options: {
    name?: string
    variant?: string
    layout?: LayoutStyle
    style?: ShapeStyle
    children?: UINodeIR[]
    id?: string
  } = {},
): ComponentNodeIR {
  return {
    type: 'component',
    name: options.name || componentName,
    componentName,
    variant: options.variant,
    id: options.id,
    layout: options.layout,
    style: options.style,
    children: options.children || [],
  }
}

export function createInstance(
  componentName: string,
  options: {
    name?: string
    variant?: string
    props?: Record<string, unknown>
    overrides?: {
      text?: Record<string, string>
      style?: Partial<ShapeStyle>
    }
    layout?: LayoutStyle
    id?: string
  } = {},
): InstanceNodeIR {
  return {
    type: 'instance',
    name: options.name || componentName,
    componentName,
    variant: options.variant,
    props: options.props,
    overrides: options.overrides,
    layout: options.layout,
    id: options.id,
  }
}
