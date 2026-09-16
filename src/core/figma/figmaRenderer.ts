import type {
  AppDefinition,
  ScreenDefinition,
  UINodeIR,
} from '../ir'
import type {
  FigmaAdapter,
  IFigmaBaseNode,
  IFigmaComponentNode,
  IFigmaFrameNode,
  IFigmaPageNode,
} from './adapter'
import { HeadlessFigmaAdapter } from './adapter'
import { ComponentRenderer } from './componentRenderer'
import { FrameRenderer } from './frameRenderer'
import type { PrototypeConnectionInfo } from './prototypeRenderer'
import { PrototypeRenderer } from './prototypeRenderer'
import type { ValidationNotice } from './shapeRenderer'
import { ShapeRenderer } from './shapeRenderer'
import { TextRenderer } from './textRenderer'

export interface RenderStats {
  totalNodes: number
  screensCount: number
  componentsCount: number
  connectionsCount: number
}

export interface RenderResult {
  page: IFigmaPageNode
  screens: Map<string, IFigmaFrameNode>
  components: Map<string, IFigmaComponentNode>
  connections: PrototypeConnectionInfo[]
  notices: ValidationNotice[]
  stats: RenderStats
}

export class FigmaRenderer {
  readonly adapter: FigmaAdapter
  readonly shapeRenderer: ShapeRenderer
  readonly textRenderer: TextRenderer
  readonly frameRenderer: FrameRenderer
  readonly componentRenderer: ComponentRenderer
  readonly prototypeRenderer: PrototypeRenderer

  constructor(adapter: FigmaAdapter = new HeadlessFigmaAdapter()) {
    this.adapter = adapter
    this.shapeRenderer = new ShapeRenderer()
    this.textRenderer = new TextRenderer(this.adapter, this.shapeRenderer)
    this.frameRenderer = new FrameRenderer(this.adapter, this.shapeRenderer)
    this.componentRenderer = new ComponentRenderer(
      this.adapter,
      this.frameRenderer,
      this.shapeRenderer,
    )
    this.prototypeRenderer = new PrototypeRenderer(this.shapeRenderer)
  }

  async renderNode(irNode: UINodeIR): Promise<IFigmaBaseNode> {
    let createdNode: IFigmaBaseNode

    switch (irNode.type) {
      case 'frame': {
        const frame = this.frameRenderer.renderFrame(irNode)
        for (const childIR of irNode.children) {
          const childNode = await this.renderNode(childIR)
          frame.appendChild(childNode)
        }
        createdNode = frame
        break
      }

      case 'text': {
        createdNode = await this.textRenderer.renderText(irNode.content, {
          name: irNode.name,
          style: irNode.style,
        })
        break
      }

      case 'rectangle': {
        createdNode = this.frameRenderer.renderRectangle(irNode)
        break
      }

      case 'component': {
        const comp = this.componentRenderer.renderComponent(irNode)
        for (const childIR of irNode.children) {
          const childNode = await this.renderNode(childIR)
          comp.appendChild(childNode)
        }
        createdNode = comp
        break
      }

      case 'instance': {
        const inst = this.componentRenderer.renderInstance(irNode)
        createdNode = inst
        break
      }
    }

    if (irNode.interaction) {
      this.prototypeRenderer.registerInteractiveNode(
        createdNode,
        irNode.interaction,
        irNode.name || createdNode.name,
      )
    }

    return createdNode
  }

  async renderScreen(screenDef: ScreenDefinition): Promise<IFigmaFrameNode> {
    const screenFrame = (await this.renderNode(screenDef.root)) as IFigmaFrameNode
    screenFrame.name = screenDef.name
    this.prototypeRenderer.registerScreen(screenDef.id, screenFrame)
    return screenFrame
  }

  async renderApp(appDef: AppDefinition): Promise<RenderResult> {
    const page = this.adapter.createPage()
    page.name = appDef.name

    const screenMap = new Map<string, IFigmaFrameNode>()
    let currentX = 0
    let totalNodes = 0

    // 1. Render reusable components first
    if (appDef.components && appDef.components.length > 0) {
      let compX = 0
      for (const compDef of appDef.components) {
        const compNode = (await this.renderNode(compDef)) as IFigmaComponentNode
        compNode.x = compX
        compNode.y = -200 // Position components above screens
        page.appendChild(compNode)
        compX += compNode.width + 40
        totalNodes++
      }
    }

    // 2. Render screens
    for (const screenDef of appDef.screens) {
      const screenNode = await this.renderScreen(screenDef)
      screenNode.x = currentX
      screenNode.y = 0
      page.appendChild(screenNode)

      screenMap.set(screenDef.id, screenNode)
      currentX += screenNode.width + 120
      totalNodes += this.countNodes(screenNode)
    }

    // 3. Resolve Prototype Connections (Phase 7 & 8)
    const connections = this.prototypeRenderer.resolvePrototypeConnections()

    return {
      page,
      screens: screenMap,
      components: this.componentRenderer.componentRegistry,
      connections,
      notices: this.shapeRenderer.notices,
      stats: {
        totalNodes,
        screensCount: appDef.screens.length,
        componentsCount: this.componentRenderer.componentRegistry.size,
        connectionsCount: connections.length,
      },
    }
  }

  private countNodes(node: IFigmaBaseNode): number {
    let count = 1
    if ('children' in node && Array.isArray((node as unknown as { children: IFigmaBaseNode[] }).children)) {
      for (const child of (node as unknown as { children: IFigmaBaseNode[] }).children) {
        count += this.countNodes(child)
      }
    }
    return count
  }
}
