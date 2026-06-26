// dump-layout: 导出 Figma 选中节点的完整设计数据

interface DumpResult {
  name: string;
  id: string;
  type: string;
  autoLayout?: {
    mode: string;
    gap: number;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    primaryAlign: string;
    counterAlign: string;
    wrap: string;
  };
  sizing?: {
    horizontal: string;
    vertical: string;
  };
  constraints?: { horizontal: string; vertical: string };
  corners?: { tl: number; tr: number; bl: number; br: number };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  strokeAlign?: string;
  effects?: any[];
  text?: any;
  componentId?: string;
  mainComponentId?: string;
  componentPropertyDefinitions?: any;
  boundVariables?: Record<string, any>;
  opacity?: number;
  blendMode?: string;
  clipsContent?: boolean;
  children?: DumpResult[];
}

async function dumpNode(node: SceneNode): Promise<DumpResult> {
  const result: DumpResult = {
    name: node.name,
    id: node.id,
    type: node.type,
  };

  // opacity
  if ("opacity" in node) {
    result.opacity = node.opacity;
  }

  // blendMode
  if ("blendMode" in node && node.blendMode !== "PASS_THROUGH") {
    result.blendMode = node.blendMode;
  }

  // clipsContent
  if ("clipsContent" in node && node.clipsContent) {
    result.clipsContent = true;
  }

  // ---- Auto Layout (核心盲区) ----
  if ("layoutMode" in node && node.layoutMode !== "NONE") {
    result.autoLayout = {
      mode: node.layoutMode,
      gap: node.itemSpacing,
      paddingTop: node.paddingTop,
      paddingRight: node.paddingRight,
      paddingBottom: node.paddingBottom,
      paddingLeft: node.paddingLeft,
      primaryAlign: node.primaryAxisAlignItems,
      counterAlign: node.counterAxisAlignItems,
      wrap: node.layoutWrap,
    };
  }

  // ---- 尺寸模式 ----
  if ("layoutSizingHorizontal" in node) {
    result.sizing = {
      horizontal: node.layoutSizingHorizontal,
      vertical: node.layoutSizingVertical,
    };
  }

  // ---- 约束 ----
  if ("constraints" in node) {
    result.constraints = node.constraints;
  }

  // ---- 圆角（独立四角） ----
  if ("topLeftRadius" in node) {
    result.corners = {
      tl: node.topLeftRadius,
      tr: node.topRightRadius,
      bl: node.bottomLeftRadius,
      br: node.bottomRightRadius,
    };
  }

  // ---- 填充 ----
  if ("fills" in node && node.fills !== figma.mixed) {
    result.fills = (node.fills as readonly Paint[]).map((f: Paint) => ({
      type: f.type,
      visible: f.visible,
      opacity: f.opacity ?? 1,
      color:
        f.type === "SOLID"
          ? { r: f.color.r, g: f.color.g, b: f.color.b }
          : undefined,
      gradientStops:
        f.type === "GRADIENT_LINEAR" || f.type === "GRADIENT_RADIAL"
          ? f.gradientStops.map((s: ColorStop) => ({
              position: s.position,
              color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a },
            }))
          : undefined,
      gradientTransform:
        f.type === "GRADIENT_LINEAR" || f.type === "GRADIENT_RADIAL"
          ? f.gradientTransform
          : undefined,
    }));
  }

  // ---- 描边 ----
  if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    result.strokes = (node.strokes as readonly Paint[]).map((s: Paint) => ({
      type: s.type,
      color:
        s.type === "SOLID"
          ? { r: s.color.r, g: s.color.g, b: s.color.b }
          : undefined,
    }));
    result.strokeWeight = (node as any).strokeWeight as number;
    result.strokeAlign = (node as any).strokeAlign as string;
  }

  // ---- 阴影/效果 ----
  if ("effects" in node) {
    const effectsArray = [...node.effects].filter((e: Effect) => e.visible);
    if (effectsArray.length > 0) {
      result.effects = effectsArray.map((e: Effect) => ({
        type: e.type,
        radius: (e as DropShadowEffect).radius,
        offset: (e as DropShadowEffect).offset
          ? {
              x: (e as DropShadowEffect).offset.x,
              y: (e as DropShadowEffect).offset.y,
            }
          : undefined,
        color: (e as DropShadowEffect).color
          ? {
              r: (e as DropShadowEffect).color.r,
              g: (e as DropShadowEffect).color.g,
              b: (e as DropShadowEffect).color.b,
              a: (e as DropShadowEffect).color.a,
            }
          : undefined,
        spread: (e as DropShadowEffect).spread,
      }));
    }
  }

  // ---- 文本 ----
  if (node.type === "TEXT") {
    result.text = {
      characters: node.characters,
      fontSize: node.fontSize,
      fontName: node.fontName,
      fontWeight: node.fontWeight,
      lineHeight: node.lineHeight,
      letterSpacing: node.letterSpacing,
      textAlignHorizontal: node.textAlignHorizontal,
      textAlignVertical: node.textAlignVertical,
      textAutoResize: node.textAutoResize,
      textDecoration: node.textDecoration,
      textCase: node.textCase,
      leadingTrim: node.leadingTrim,
      hasMixedFontSize: (node as any).hasMixedFontSize,
      hasMixedFontWeight: (node as any).hasMixedFontWeight,
      hasMixedFontStyle: (node as any).hasMixedFontStyle,
    };
  }

  // ---- 组件 ----
  if (node.type === "INSTANCE") {
    result.componentId = (node as any).componentId;
    if (node.mainComponent) {
      result.mainComponentId = node.mainComponent.id;
    }
  }
  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    result.componentPropertyDefinitions = Object.fromEntries(
      Object.entries(node.componentPropertyDefinitions).map(([k, v]) => [
        k,
        { type: v.type, defaultValue: v.defaultValue },
      ])
    );
  }

  // ---- 变量绑定 ----
  const boundVars = (node as any).boundVariables;
  if (boundVars) {
    result.boundVariables = {};
    let hasVars = false;
    for (const [key, val] of Object.entries(boundVars)) {
      if (val) {
        result.boundVariables![key] = val;
        hasVars = true;
      }
    }
    if (!hasVars) delete result.boundVariables;
  }

  // ---- 子节点 ----
  if ("children" in node) {
    result.children = [];
    for (const child of node.children) {
      result.children.push(await dumpNode(child));
    }
  }

  // 清理空字段
  for (const key of Object.keys(result)) {
    if (result[key as keyof DumpResult] === undefined) {
      delete result[key as keyof DumpResult];
    }
  }

  return result;
}

export {};

(async function main() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.closePlugin("❌ 请先选中一个 Frame / Section / Group");
    return;
  }

  const data: DumpResult[] = [];
  for (const node of selection) {
    data.push(await dumpNode(node));
  }

  const jsonStr = JSON.stringify(
    selection.length === 1 ? data[0] : data,
    null,
    2
  );

  figma.showUI(__html__, {
    width: 600,
    height: 520,
    title: "dump-layout",
  });
  figma.ui.postMessage(jsonStr);
})();
