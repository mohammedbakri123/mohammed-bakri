import React from 'react'
import type {
  Interaction,
  LayoutStyle,
  ShapeStyle,
  TextStyle,
  UINodeIR,
} from '../ir'
import { parseColor } from '../ir'
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

/**
 * Extracts pure string content from React children (e.g. "Hello", ["Count: ", 5]).
 */
export function extractTextContent(children: React.ReactNode): string {
  if (children === null || children === undefined || typeof children === 'boolean') {
    return ''
  }
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(extractTextContent).join('')
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    return extractTextContent(props.children)
  }
  return ''
}

/**
 * Parses interaction from onPress prop.
 */
function resolveInteraction(onPress: unknown): Interaction | undefined {
  if (!onPress) return undefined
  if (typeof onPress === 'object' && onPress !== null) {
    const p = onPress as {
      type?: string
      action?: string
      trigger?: string
      destination?: string
      transition?: string
    }
    const action = p.action || p.type || 'navigate'
    const trigger = p.trigger || 'click'

    if (p.destination) {
      return {
        trigger: trigger === 'hover' ? 'hover' : 'click',
        action: action === 'open-overlay' ? 'open-overlay' : 'navigate',
        destination: p.destination,
        transition: (p.transition as Interaction['transition']) || 'smart-animate',
      }
    }
  }
  return undefined
}

/**
 * Parses padding from padding prop into individual values.
 */
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

/**
 * Recursively translates supported React elements into the intermediate representation (UINodeIR).
 */
export function renderToUINode(element: React.ReactNode): UINodeIR | null {
  if (!React.isValidElement(element)) {
    if (typeof element === 'string' || typeof element === 'number') {
      return {
        type: 'text',
        name: String(element).slice(0, 20),
        content: String(element),
      }
    }
    return null
  }

  const { type, props } = element

  // Check if type is a React Fragment
  if (type === React.Fragment) {
    const fragmentProps = props as { children?: React.ReactNode }
    const childrenNodes = React.Children.toArray(fragmentProps.children)
      .map(renderToUINode)
      .filter((n): n is UINodeIR => n !== null)

    if (childrenNodes.length === 1) return childrenNodes[0]

    return {
      type: 'frame',
      name: 'Fragment',
      children: childrenNodes,
    }
  }

  // Check for primitive symbol
  const primitiveType: PrimitiveType | undefined =
    typeof type === 'function' || typeof type === 'object'
      ? ((type as unknown as Record<symbol, unknown>)[UI_PRIMITIVE_SYMBOL] as PrimitiveType | undefined)
      : undefined

  if (primitiveType) {
    switch (primitiveType) {
      case 'frame':
      case 'stack':
      case 'row': {
        const frameProps = props as FrameProps
        const p = resolvePadding(frameProps.padding)
        const direction =
          primitiveType === 'stack'
            ? 'vertical'
            : primitiveType === 'row'
              ? 'horizontal'
              : frameProps.direction || 'none'

        const layout: LayoutStyle = {
          direction,
          gap: frameProps.gap,
          paddingTop: p.paddingTop,
          paddingRight: p.paddingRight,
          paddingBottom: p.paddingBottom,
          paddingLeft: p.paddingLeft,
          alignItems:
            primitiveType === 'row' && !frameProps.alignItems ? 'center' : frameProps.alignItems,
          justifyContent: frameProps.justifyContent,
          width: frameProps.width,
          height: frameProps.height,
        }

        const style: ShapeStyle = {
          fill: parseColor(frameProps.background),
          stroke: parseColor(frameProps.stroke),
          strokeWidth: frameProps.strokeWidth,
          cornerRadius: frameProps.radius,
          opacity: frameProps.opacity,
        }

        const children = React.Children.toArray(frameProps.children)
          .map(renderToUINode)
          .filter((n): n is UINodeIR => n !== null)

        return {
          type: 'frame',
          id: frameProps.id,
          name: frameProps.name || (primitiveType === 'stack' ? 'Stack' : primitiveType === 'row' ? 'Row' : 'Frame'),
          interaction: resolveInteraction(frameProps.onPress),
          layout,
          style,
          children,
        }
      }

      case 'text': {
        const textProps = props as TextProps
        const content = extractTextContent(textProps.children)
        const style: TextStyle = {
          fontSize: textProps.size,
          fontWeight: textProps.weight,
          color: parseColor(textProps.color),
          fontFamily: textProps.family,
          textAlign: textProps.align,
          lineHeight: textProps.lineHeight,
        }

        return {
          type: 'text',
          id: textProps.id,
          name: textProps.name || content.slice(0, 24) || 'Text',
          interaction: resolveInteraction(textProps.onPress),
          content,
          style,
        }
      }

      case 'rectangle': {
        const rectProps = props as RectangleProps
        const style: ShapeStyle = {
          fill: parseColor(rectProps.fill),
          stroke: parseColor(rectProps.stroke),
          strokeWidth: rectProps.strokeWidth,
          cornerRadius: rectProps.radius,
          opacity: rectProps.opacity,
        }

        return {
          type: 'rectangle',
          id: rectProps.id,
          name: rectProps.name || 'Rectangle',
          interaction: resolveInteraction(rectProps.onPress),
          width: rectProps.width,
          height: rectProps.height,
          style,
        }
      }

      case 'button': {
        const btnProps = props as ButtonProps
        const text = extractTextContent(btnProps.children)
        const variant = btnProps.variant || 'primary'

        const bgMap: Record<string, string> = {
          primary: '#1D9BF0',
          secondary: '#27272A',
          outline: '#00000000',
          danger: '#EF4444',
        }

        return {
          type: 'instance',
          id: btnProps.id,
          name: btnProps.name || `Button / ${variant}`,
          componentName: 'Button',
          variant,
          interaction: resolveInteraction(btnProps.onPress),
          overrides: {
            text: { label: text },
            style: { fill: parseColor(bgMap[variant]) },
          },
          layout: {
            direction: 'horizontal',
            gap: 8,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingRight: 24,
            alignItems: 'center',
            justifyContent: 'center',
            width: btnProps.width,
          },
        }
      }

      case 'component': {
        const compProps = props as ComponentDefProps
        const children = React.Children.toArray(compProps.children)
          .map(renderToUINode)
          .filter((n): n is UINodeIR => n !== null)

        return {
          type: 'component',
          id: compProps.id,
          name: compProps.name || compProps.componentName,
          componentName: compProps.componentName,
          variant: compProps.variant,
          layout: compProps.layout,
          style: compProps.style,
          children,
        }
      }

      case 'instance': {
        const instProps = props as InstanceProps
        return {
          type: 'instance',
          id: instProps.id,
          name: instProps.name || instProps.componentName,
          componentName: instProps.componentName,
          variant: instProps.variant,
          interaction: resolveInteraction(instProps.onPress),
          overrides: instProps.overrides,
          layout: instProps.layout,
        }
      }
    }
  }

  // If type is a functional component, execute it to unpack its primitives
  if (typeof type === 'function') {
    try {
      const rendered = (type as (p: unknown) => React.ReactNode)(props)
      return renderToUINode(rendered)
    } catch (e) {
      console.warn('Error expanding custom component:', e)
      return null
    }
  }

  return null
}
