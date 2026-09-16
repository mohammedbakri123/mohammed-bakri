/**
 * Figma Adapter Interface and In-Memory Document Model
 *
 * This enables the Figma Renderer to execute:
 * 1. Inside real Figma (via PluginFigmaAdapter)
 * 2. In Node.js / Browser / Unit Tests (via HeadlessFigmaAdapter)
 * 3. In automated validation suites
 */

export interface FigmaColor {
  r: number; // 0..1
  g: number; // 0..1
  b: number; // 0..1
}

export interface FigmaPaint {
  type: 'SOLID' | 'IMAGE';
  color?: FigmaColor;
  opacity?: number;
  visible?: boolean;
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR';
  color?: { r: number; g: number; b: number; a: number };
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
}

export interface FigmaFontName {
  family: string;
  style: string;
}

export interface FigmaReaction {
  trigger: {
    type: 'ON_CLICK' | 'ON_HOVER' | 'ON_PRESS' | 'ON_DRAG';
  };
  action: {
    type: 'NODE';
    destinationId?: string;
    navigation?: 'NAVIGATE' | 'SWAP' | 'OVERLAY' | 'SCROLL_TO';
    transition?: {
      type: 'SMART_ANIMATE' | 'INSTANT' | 'DISSOLVE' | 'SLIDE_IN';
      duration?: number;
      easing?: { type: 'EASE_IN_AND_OUT' | 'EASE_IN' | 'EASE_OUT' | 'LINEAR' };
    };
  };
}

export interface IFigmaBaseNode {
  id: string;
  name: string;
  type: string;
  parent?: IFigmaBaseNode;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  reactions: FigmaReaction[];
  remove(): void;
}

export interface IFigmaChildrenMixin {
  children: IFigmaBaseNode[];
  appendChild(child: IFigmaBaseNode): void;
  insertChild(index: number, child: IFigmaBaseNode): void;
}

export type FigmaFrameType = 'FRAME' | 'COMPONENT' | 'INSTANCE';

export interface IFigmaFrameNode extends IFigmaBaseNode, IFigmaChildrenMixin {
  type: FigmaFrameType;
  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  itemSpacing: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  primaryAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems: 'MIN' | 'CENTER' | 'MAX';
  primaryAxisSizingMode: 'FIXED' | 'AUTO';
  counterAxisSizingMode: 'FIXED' | 'AUTO';
  layoutSizingHorizontal?: 'FIXED' | 'HUG' | 'FILL';
  layoutSizingVertical?: 'FIXED' | 'HUG' | 'FILL';
  layoutGrow: number;
  layoutAlign: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
  cornerRadius: number;
  fills: FigmaPaint[];
  strokes: FigmaPaint[];
  strokeWeight: number;
  opacity: number;
  effects: FigmaEffect[];
  resize(width: number, height: number): void;
}

export interface IFigmaTextNode extends IFigmaBaseNode {
  type: 'TEXT';
  characters: string;
  fontName: FigmaFontName;
  fontSize: number;
  lineHeight: { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing: { value: number; unit: 'PIXELS' | 'PERCENT' };
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  fills: FigmaPaint[];
  opacity: number;
}

export interface IFigmaRectangleNode extends IFigmaBaseNode {
  type: 'RECTANGLE';
  cornerRadius: number;
  fills: FigmaPaint[];
  strokes: FigmaPaint[];
  strokeWeight: number;
  opacity: number;
  effects: FigmaEffect[];
  layoutGrow: number;
  layoutAlign: 'INHERIT' | 'STRETCH';
  resize(width: number, height: number): void;
}

export interface IFigmaComponentNode extends IFigmaFrameNode {
  type: 'COMPONENT';
  createInstance(): IFigmaInstanceNode;
}

export interface IFigmaInstanceNode extends IFigmaFrameNode {
  type: 'INSTANCE';
  mainComponent: IFigmaComponentNode;
}

export interface IFigmaPageNode extends IFigmaBaseNode, IFigmaChildrenMixin {
  type: 'PAGE';
}

export interface FigmaAdapter {
  createFrame(): IFigmaFrameNode;
  createText(): IFigmaTextNode;
  createRectangle(): IFigmaRectangleNode;
  createComponent(): IFigmaComponentNode;
  createPage(): IFigmaPageNode;
  loadFontAsync(fontName: FigmaFontName): Promise<void>;
  listAvailableFontsAsync(): Promise<FigmaFontName[]>;
}

// ---------------------------------------------------------------------------
// Headless (In-Memory) Implementation for testing, validation & UI preview
// ---------------------------------------------------------------------------

let idCounter = 1;
function genId(prefix = 'node'): string {
  return `${prefix}:${idCounter++}`;
}

export class HeadlessBaseNode implements IFigmaBaseNode {
  id: string;
  name: string;
  type = 'BASE';
  parent?: IFigmaBaseNode;
  visible = true;
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  reactions: FigmaReaction[] = [];

  constructor(name = 'Node', prefix = 'node') {
    this.id = genId(prefix);
    this.name = name;
  }

  remove(): void {
    if (this.parent && 'children' in this.parent) {
      const p = this.parent as unknown as IFigmaChildrenMixin;
      p.children = p.children.filter((c) => c !== this);
    }
  }
}

export class HeadlessFrameNode extends HeadlessBaseNode implements IFigmaFrameNode {
  override type: FigmaFrameType = 'FRAME';
  children: IFigmaBaseNode[] = [];
  layoutMode: 'NONE' | 'HORIZONTAL' | 'VERTICAL' = 'NONE';
  itemSpacing = 0;
  paddingTop = 0;
  paddingRight = 0;
  paddingBottom = 0;
  paddingLeft = 0;
  primaryAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN' = 'MIN';
  counterAxisAlignItems: 'MIN' | 'CENTER' | 'MAX' = 'MIN';
  primaryAxisSizingMode: 'FIXED' | 'AUTO' = 'AUTO';
  counterAxisSizingMode: 'FIXED' | 'AUTO' = 'AUTO';
  layoutSizingHorizontal?: 'FIXED' | 'HUG' | 'FILL' = 'HUG';
  layoutSizingVertical?: 'FIXED' | 'HUG' | 'FILL' = 'HUG';
  layoutGrow = 0;
  layoutAlign: 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX' = 'INHERIT';
  cornerRadius = 0;
  fills: FigmaPaint[] = [];
  strokes: FigmaPaint[] = [];
  strokeWeight = 0;
  opacity = 1;
  effects: FigmaEffect[] = [];

  constructor(name = 'Frame') {
    super(name, 'frame');
  }

  appendChild(child: IFigmaBaseNode): void {
    child.parent = this;
    this.children.push(child);
  }

  insertChild(index: number, child: IFigmaBaseNode): void {
    child.parent = this;
    this.children.splice(index, 0, child);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}

export class HeadlessTextNode extends HeadlessBaseNode implements IFigmaTextNode {
  override type = 'TEXT' as const;
  characters = '';
  fontName: FigmaFontName = { family: 'Inter', style: 'Regular' };
  fontSize = 14;
  lineHeight: { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' } = { value: 0, unit: 'AUTO' };
  letterSpacing: { value: number; unit: 'PIXELS' | 'PERCENT' } = { value: 0, unit: 'PIXELS' };
  textAlignHorizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED' = 'LEFT';
  fills: FigmaPaint[] = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  opacity = 1;

  constructor(name = 'Text') {
    super(name, 'text');
  }
}

export class HeadlessRectangleNode extends HeadlessBaseNode implements IFigmaRectangleNode {
  override type = 'RECTANGLE' as const;
  cornerRadius = 0;
  fills: FigmaPaint[] = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  strokes: FigmaPaint[] = [];
  strokeWeight = 0;
  opacity = 1;
  effects: FigmaEffect[] = [];
  layoutGrow = 0;
  layoutAlign: 'INHERIT' | 'STRETCH' = 'INHERIT';

  constructor(name = 'Rectangle') {
    super(name, 'rect');
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}

export class HeadlessComponentNode extends HeadlessFrameNode implements IFigmaComponentNode {
  override type = 'COMPONENT' as const;

  constructor(name = 'Component') {
    super(name);
    this.id = genId('comp');
  }

  createInstance(): IFigmaInstanceNode {
    const inst = new HeadlessInstanceNode(this);
    inst.name = this.name;
    inst.width = this.width;
    inst.height = this.height;
    inst.layoutMode = this.layoutMode;
    inst.itemSpacing = this.itemSpacing;
    inst.paddingTop = this.paddingTop;
    inst.paddingRight = this.paddingRight;
    inst.paddingBottom = this.paddingBottom;
    inst.paddingLeft = this.paddingLeft;
    inst.primaryAxisAlignItems = this.primaryAxisAlignItems;
    inst.counterAxisAlignItems = this.counterAxisAlignItems;
    inst.fills = [...this.fills];
    inst.cornerRadius = this.cornerRadius;
    return inst;
  }
}

export class HeadlessInstanceNode extends HeadlessFrameNode implements IFigmaInstanceNode {
  override type = 'INSTANCE' as const;
  mainComponent: IFigmaComponentNode;

  constructor(mainComponent: IFigmaComponentNode) {
    super(mainComponent.name);
    this.id = genId('inst');
    this.mainComponent = mainComponent;
  }
}

export class HeadlessPageNode extends HeadlessBaseNode implements IFigmaPageNode {
  override type = 'PAGE' as const;
  children: IFigmaBaseNode[] = [];

  constructor(name = 'Page') {
    super(name, 'page');
  }

  appendChild(child: IFigmaBaseNode): void {
    child.parent = this;
    this.children.push(child);
  }

  insertChild(index: number, child: IFigmaBaseNode): void {
    child.parent = this;
    this.children.splice(index, 0, child);
  }
}

export class HeadlessFigmaAdapter implements FigmaAdapter {
  loadedFonts: Set<string> = new Set();

  createFrame(): IFigmaFrameNode {
    return new HeadlessFrameNode();
  }

  createText(): IFigmaTextNode {
    return new HeadlessTextNode();
  }

  createRectangle(): IFigmaRectangleNode {
    return new HeadlessRectangleNode();
  }

  createComponent(): IFigmaComponentNode {
    return new HeadlessComponentNode();
  }

  createPage(): IFigmaPageNode {
    return new HeadlessPageNode();
  }

  async loadFontAsync(fontName: FigmaFontName): Promise<void> {
    this.loadedFonts.add(`${fontName.family}:${fontName.style}`);
  }

  async listAvailableFontsAsync(): Promise<FigmaFontName[]> {
    return [
      { family: 'Inter', style: 'Regular' },
      { family: 'Inter', style: 'Bold' },
      { family: 'Roboto', style: 'Regular' },
      { family: 'Roboto', style: 'Bold' },
    ];
  }
}
