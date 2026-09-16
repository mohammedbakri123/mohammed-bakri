import type { Interaction } from '../ir'
import type { IFigmaBaseNode, IFigmaFrameNode } from './adapter'
import type { ShapeRenderer } from './shapeRenderer'

export interface InteractiveNodeEntry {
  node: IFigmaBaseNode
  interaction: Interaction
  sourceName: string
}

export interface PrototypeConnectionInfo {
  fromNodeId: string
  fromNodeName: string
  toScreenId: string
  toScreenName: string
  trigger: string
  action: string
  transition?: string
}

export class PrototypeRenderer {
  private shapeRenderer: ShapeRenderer
  readonly screenRegistry: Map<string, IFigmaFrameNode> = new Map()
  readonly interactiveNodes: InteractiveNodeEntry[] = []
  readonly resolvedConnections: PrototypeConnectionInfo[] = []

  constructor(shapeRenderer: ShapeRenderer) {
    this.shapeRenderer = shapeRenderer
  }

  registerScreen(idOrName: string, frame: IFigmaFrameNode): void {
    this.screenRegistry.set(idOrName.toLowerCase(), frame)
    this.screenRegistry.set(frame.name.toLowerCase(), frame)
  }

  registerInteractiveNode(node: IFigmaBaseNode, interaction: Interaction, sourceName: string): void {
    this.interactiveNodes.push({ node, interaction, sourceName })
  }

  resolvePrototypeConnections(): PrototypeConnectionInfo[] {
    this.resolvedConnections.length = 0

    for (const { node, interaction, sourceName } of this.interactiveNodes) {
      if (!interaction.destination) {
        this.shapeRenderer.reportNotice(
          sourceName,
          'interaction.destination',
          'Interaction specified without a destination.',
          'warning',
        )
        continue
      }

      const destKey = interaction.destination.toLowerCase()
      const destFrame = this.screenRegistry.get(destKey)

      if (!destFrame) {
        this.shapeRenderer.reportNotice(
          sourceName,
          'interaction.destination',
          `Broken interaction: destination "${interaction.destination}" not found in screens registry. Available screens: ${Array.from(this.screenRegistry.keys()).join(', ')}`,
          'error',
        )
        continue
      }

      const trigger = interaction.trigger || 'click'
      const action = interaction.action || interaction.type || 'navigate'

      // Create native Figma Reaction
      node.reactions = [
        {
          trigger: {
            type: trigger === 'hover' ? 'ON_HOVER' : 'ON_CLICK',
          },
          action: {
            type: 'NODE',
            destinationId: destFrame.id,
            navigation: action === 'open-overlay' ? 'OVERLAY' : 'NAVIGATE',
            transition: {
              type: interaction.transition === 'instant' ? 'INSTANT' : 'SMART_ANIMATE',
              duration: 0.3,
              easing: { type: 'EASE_IN_AND_OUT' },
            },
          },
        },
      ]

      this.resolvedConnections.push({
        fromNodeId: node.id,
        fromNodeName: sourceName,
        toScreenId: destFrame.id,
        toScreenName: destFrame.name,
        trigger,
        action,
        transition: interaction.transition,
      })
    }

    return this.resolvedConnections
  }
}
