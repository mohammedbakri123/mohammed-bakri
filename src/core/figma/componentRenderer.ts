import type { ComponentNodeIR, InstanceNodeIR } from '../ir'
import type {
  FigmaAdapter,
  IFigmaComponentNode,
  IFigmaInstanceNode,
  IFigmaTextNode,
} from './adapter'
import type { FrameRenderer } from './frameRenderer'
import type { ShapeRenderer } from './shapeRenderer'

export class ComponentRenderer {
  private adapter: FigmaAdapter
  private frameRenderer: FrameRenderer
  private shapeRenderer: ShapeRenderer
  readonly componentRegistry: Map<string, IFigmaComponentNode> = new Map()

  constructor(adapter: FigmaAdapter, frameRenderer: FrameRenderer, shapeRenderer: ShapeRenderer) {
    this.adapter = adapter
    this.frameRenderer = frameRenderer
    this.shapeRenderer = shapeRenderer
  }

  registerComponent(name: string, componentNode: IFigmaComponentNode): void {
    this.componentRegistry.set(name, componentNode)
  }

  renderComponent(irNode: ComponentNodeIR): IFigmaComponentNode {
    const comp = this.adapter.createComponent()
    comp.name = irNode.name || irNode.componentName

    this.frameRenderer.applyLayout(comp, irNode.layout)
    this.shapeRenderer.applyShapeStyle(comp, irNode.style, irNode.name)

    this.registerComponent(irNode.componentName, comp)
    return comp
  }

  renderInstance(irNode: InstanceNodeIR): IFigmaInstanceNode {
    const mainComponent = this.componentRegistry.get(irNode.componentName)

    if (!mainComponent) {
      this.shapeRenderer.reportNotice(
        irNode.name,
        irNode.componentName,
        `Component "${irNode.componentName}" not found in component registry. Creating fallback component.`,
        'warning',
      )
      // Auto-create a placeholder component so prototype doesn't break
      const fallback = this.adapter.createComponent()
      fallback.name = irNode.componentName
      this.frameRenderer.applyLayout(fallback, irNode.layout)
      this.registerComponent(irNode.componentName, fallback)
      return fallback.createInstance()
    }

    const instance = mainComponent.createInstance()
    instance.name = irNode.name || mainComponent.name

    if (irNode.layout) {
      this.frameRenderer.applyLayout(instance, irNode.layout)
    }

    // Apply Overrides
    if (irNode.overrides?.style) {
      this.shapeRenderer.applyShapeStyle(instance, irNode.overrides.style, instance.name)
    }

    if (irNode.overrides?.text) {
      // Find matching text child in instance to override
      for (const [key, text] of Object.entries(irNode.overrides.text)) {
        const textChild = instance.children.find(
          (c): c is IFigmaTextNode =>
            c.type === 'TEXT' && (c.name.toLowerCase() === key.toLowerCase() || key === 'label'),
        )
        if (textChild) {
          textChild.characters = text
        }
      }
    }

    return instance
  }
}
