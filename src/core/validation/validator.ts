import type {
  IFigmaBaseNode,
  IFigmaFrameNode,
  IFigmaInstanceNode,
  IFigmaTextNode,
  RenderResult,
} from '../figma'

export interface ExpectedValidationSchema {
  expectedScreens?: string[]
  expectedComponents?: string[]
  expectedConnections?: Array<{ from: string; to: string }>
}

export interface ValidationReport {
  passed: boolean
  errors: string[]
  warnings: string[]
  checks: {
    screensExist: boolean
    componentsValid: boolean
    hierarchyValid: boolean
    prototypeConnectionsValid: boolean
    autoLayoutValid: boolean
  }
  stats: {
    totalNodes: number
    frameCount: number
    textCount: number
    instanceCount: number
    componentCount: number
    reactionsCount: number
  }
}

export function validateFigmaDocument(
  result: RenderResult,
  schema: ExpectedValidationSchema = {},
): ValidationReport {
  const errors: string[] = []
  const warnings: string[] = []

  let frameCount = 0
  let textCount = 0
  let instanceCount = 0
  let componentCount = 0
  let reactionsCount = 0

  const allScreenIds = new Set<string>()
  for (const [, screen] of result.screens) {
    allScreenIds.add(screen.id)
  }

  // 1. Check Expected Screens
  let screensExist = true
  if (schema.expectedScreens) {
    for (const expected of schema.expectedScreens) {
      const found = Array.from(result.screens.values()).some(
        (s) => s.name.toLowerCase() === expected.toLowerCase(),
      )
      if (!found) {
        errors.push(`Missing expected screen: "${expected}".`)
        screensExist = false
      }
    }
  }

  // 2. Check Expected Components
  let componentsValid = true
  if (schema.expectedComponents) {
    for (const expected of schema.expectedComponents) {
      const comp = result.components.get(expected)
      if (!comp) {
        errors.push(`Missing expected component: "${expected}".`)
        componentsValid = false
      } else if (comp.type !== 'COMPONENT') {
        errors.push(`Node "${expected}" is registered as a component but has type "${comp.type}".`)
        componentsValid = false
      }
    }
  }

  // Helper to traverse and validate node tree
  let hierarchyValid = true
  let autoLayoutValid = true

  function inspectNode(node: IFigmaBaseNode, depth = 0, path = ''): void {
    const currentPath = path ? `${path} > ${node.name}` : node.name

    if (node.reactions && node.reactions.length > 0) {
      reactionsCount += node.reactions.length
      for (const reaction of node.reactions) {
        if (reaction.action.type === 'NODE') {
          const destId = reaction.action.destinationId
          if (!destId || !allScreenIds.has(destId)) {
            errors.push(
              `Broken prototype reaction on node "${currentPath}": Destination ID "${destId}" does not resolve to any screen.`,
            )
          }
        }
      }
    }

    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      frameCount++
      const frame = node as IFigmaFrameNode

      if (node.type === 'COMPONENT') componentCount++
      if (node.type === 'INSTANCE') {
        instanceCount++
        const inst = node as IFigmaInstanceNode
        if (!inst.mainComponent || inst.mainComponent.type !== 'COMPONENT') {
          errors.push(`Instance "${currentPath}" does not link to a valid mainComponent.`)
          hierarchyValid = false
        }
      }

      // Check Auto Layout properties
      if (frame.layoutMode === 'HORIZONTAL' || frame.layoutMode === 'VERTICAL') {
        if (frame.itemSpacing < 0) {
          warnings.push(`Negative itemSpacing (${frame.itemSpacing}) on Auto Layout frame "${currentPath}".`)
          autoLayoutValid = false
        }
        if (
          frame.paddingTop < 0 ||
          frame.paddingRight < 0 ||
          frame.paddingBottom < 0 ||
          frame.paddingLeft < 0
        ) {
          warnings.push(`Negative padding on Auto Layout frame "${currentPath}".`)
          autoLayoutValid = false
        }
      }

      if ('children' in frame && Array.isArray(frame.children)) {
        for (const child of frame.children) {
          inspectNode(child, depth + 1, currentPath)
        }
      }
    } else if (node.type === 'TEXT') {
      textCount++
      const text = node as IFigmaTextNode
      if (text.characters.trim().length === 0) {
        warnings.push(`Empty text node characters at "${currentPath}".`)
      }
    }
  }

  // Inspect all screens
  for (const [, screenNode] of result.screens) {
    inspectNode(screenNode)
  }

  // 3. Check Expected Prototype Connections
  let prototypeConnectionsValid = true
  if (schema.expectedConnections) {
    for (const expectedConn of schema.expectedConnections) {
      const found = result.connections.some(
        (c) =>
          c.fromNodeName.toLowerCase().includes(expectedConn.from.toLowerCase()) &&
          c.toScreenName.toLowerCase().includes(expectedConn.to.toLowerCase()),
      )
      if (!found) {
        prototypeConnectionsValid = false
        warnings.push(
          `Expected prototype connection from "${expectedConn.from}" to "${expectedConn.to}" was not established.`,
        )
      }
    }
  }

  // Collect notices from ShapeRenderer
  for (const notice of result.notices) {
    const formatted = `Unsupported property: ${notice.property}\nNode: ${notice.nodeName}\nReason: ${notice.reason}`
    if (notice.level === 'error') {
      errors.push(formatted)
    } else {
      warnings.push(formatted)
    }
  }

  const passed = errors.length === 0

  return {
    passed,
    errors,
    warnings,
    checks: {
      screensExist,
      componentsValid,
      hierarchyValid,
      prototypeConnectionsValid,
      autoLayoutValid,
    },
    stats: {
      totalNodes: result.stats.totalNodes,
      frameCount,
      textCount,
      instanceCount,
      componentCount,
      reactionsCount,
    },
  }
}
