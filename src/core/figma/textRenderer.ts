import type { TextStyle } from '../ir'
import type { FigmaAdapter, FigmaFontName, IFigmaTextNode } from './adapter'
import type { ShapeRenderer } from './shapeRenderer'

export class TextRenderer {
  private adapter: FigmaAdapter
  private shapeRenderer: ShapeRenderer
  private loadedFonts: Set<string> = new Set()

  constructor(adapter: FigmaAdapter, shapeRenderer: ShapeRenderer) {
    this.adapter = adapter
    this.shapeRenderer = shapeRenderer
  }

  resolveFont(style?: TextStyle): FigmaFontName {
    const family = style?.fontFamily || 'Inter'
    const weight = style?.fontWeight

    let fontStyle = 'Regular'
    if (weight === 'bold' || weight === 700 || weight === 800 || weight === 900) {
      fontStyle = 'Bold'
    } else if (weight === 'semibold' || weight === 600) {
      fontStyle = 'Semi Bold'
    } else if (weight === 'medium' || weight === 500) {
      fontStyle = 'Medium'
    }

    return { family, style: fontStyle }
  }

  async ensureFontLoaded(font: FigmaFontName): Promise<FigmaFontName> {
    const key = `${font.family}:${font.style}`
    if (this.loadedFonts.has(key)) return font

    try {
      await this.adapter.loadFontAsync(font)
      this.loadedFonts.add(key)
      return font
    } catch {
      // Fallback to Inter Regular or Roboto Regular
      const fallback: FigmaFontName = { family: 'Inter', style: 'Regular' }
      try {
        await this.adapter.loadFontAsync(fallback)
        this.loadedFonts.add(`${fallback.family}:${fallback.style}`)
        return fallback
      } catch {
        return font
      }
    }
  }

  async renderText(
    content: string,
    options: {
      name?: string
      style?: TextStyle
    } = {},
  ): Promise<IFigmaTextNode> {
    const textNode = this.adapter.createText()
    textNode.name = options.name || content.slice(0, 24) || 'Text'

    const font = this.resolveFont(options.style)
    const actualFont = await this.ensureFontLoaded(font)
    textNode.fontName = actualFont

    textNode.characters = content

    if (options.style?.fontSize) {
      textNode.fontSize = options.style.fontSize
    }

    if (options.style?.lineHeight) {
      textNode.lineHeight = { value: options.style.lineHeight, unit: 'PIXELS' }
    }

    if (options.style?.letterSpacing) {
      textNode.letterSpacing = { value: options.style.letterSpacing, unit: 'PIXELS' }
    }

    if (options.style?.textAlign) {
      const alignMap: Record<string, 'LEFT' | 'CENTER' | 'RIGHT'> = {
        left: 'LEFT',
        center: 'CENTER',
        right: 'RIGHT',
      }
      textNode.textAlignHorizontal = alignMap[options.style.textAlign] || 'LEFT'
    }

    if (options.style?.color) {
      textNode.fills = this.shapeRenderer.toFigmaPaint(options.style.color)
    }

    return textNode
  }
}
