import type { FrameNodeIR, LayoutStyle, RectangleNodeIR } from '../ir'
import type { FigmaAdapter, IFigmaFrameNode, IFigmaRectangleNode } from './adapter'
import type { ShapeRenderer } from './shapeRenderer'

export class FrameRenderer {
  private adapter: FigmaAdapter
  private shapeRenderer: ShapeRenderer

  constructor(adapter: FigmaAdapter, shapeRenderer: ShapeRenderer) {
    this.adapter = adapter
    this.shapeRenderer = shapeRenderer
  }

  applyLayout(node: IFigmaFrameNode, layout?: LayoutStyle): void {
    if (!layout) {
      node.layoutMode = 'NONE'
      return
    }

    // Direction -> Auto Layout Mode
    if (layout.direction === 'vertical') {
      node.layoutMode = 'VERTICAL'
    } else if (layout.direction === 'horizontal') {
      node.layoutMode = 'HORIZONTAL'
    } else {
      node.layoutMode = 'NONE'
    }

    if (node.layoutMode !== 'NONE') {
      // Gap
      node.itemSpacing = layout.gap ?? 0

      // Padding
      node.paddingTop = layout.paddingTop ?? 0
      node.paddingRight = layout.paddingRight ?? 0
      node.paddingBottom = layout.paddingBottom ?? 0
      node.paddingLeft = layout.paddingLeft ?? 0

      // Alignment
      if (layout.alignItems === 'start') node.counterAxisAlignItems = 'MIN'
      else if (layout.alignItems === 'center') node.counterAxisAlignItems = 'CENTER'
      else if (layout.alignItems === 'end') node.counterAxisAlignItems = 'MAX'

      if (layout.justifyContent === 'start') node.primaryAxisAlignItems = 'MIN'
      else if (layout.justifyContent === 'center') node.primaryAxisAlignItems = 'CENTER'
      else if (layout.justifyContent === 'end') node.primaryAxisAlignItems = 'MAX'
      else if (layout.justifyContent === 'space-between') node.primaryAxisAlignItems = 'SPACE_BETWEEN'

      // Horizontal sizing
      if (layout.width === 'fill') {
        node.layoutSizingHorizontal = 'FILL'
        node.layoutGrow = 1
      } else if (layout.width === 'hug') {
        node.layoutSizingHorizontal = 'HUG'
      } else if (typeof layout.width === 'number') {
        node.layoutSizingHorizontal = 'FIXED'
        node.resize(layout.width, node.height || 40)
      }

      // Vertical sizing
      if (layout.height === 'fill') {
        node.layoutSizingVertical = 'FILL'
      } else if (layout.height === 'hug') {
        node.layoutSizingVertical = 'HUG'
      } else if (typeof layout.height === 'number') {
        node.layoutSizingVertical = 'FIXED'
        node.resize(node.width || 40, layout.height)
      }
    } else {
      // Non-auto-layout fixed dimensions
      const w = typeof layout.width === 'number' ? layout.width : node.width
      const h = typeof layout.height === 'number' ? layout.height : node.height
      node.resize(w, h)
    }
  }

  renderFrame(irNode: FrameNodeIR): IFigmaFrameNode {
    const frame = this.adapter.createFrame()
    frame.name = irNode.name

    this.applyLayout(frame, irNode.layout)
    this.shapeRenderer.applyShapeStyle(frame, irNode.style, irNode.name)

    return frame
  }

  renderRectangle(irNode: RectangleNodeIR): IFigmaRectangleNode {
    const rect = this.adapter.createRectangle()
    rect.name = irNode.name

    const w = typeof irNode.width === 'number' ? irNode.width : 100
    const h = typeof irNode.height === 'number' ? irNode.height : 100
    rect.resize(w, h)

    if (irNode.width === 'fill') {
      rect.layoutAlign = 'STRETCH'
      rect.layoutGrow = 1
    }

    this.shapeRenderer.applyShapeStyle(rect, irNode.style, irNode.name)

    return rect
  }
}
