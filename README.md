# dump-layout

> 一键导出 Figma 选中节点的**全部设计数据**为 JSON。Auto Layout、圆角、阴影、文本样式、组件属性、变量绑定……一个不落。

> One-click export **all design data** of selected Figma nodes as JSON. Auto Layout, corners, shadows, text styles, component props, variable bindings — nothing left behind.

---

## 这插件是干啥的？ / What does it do?

你在 Figma 里选中一个 Frame / Section / Group，点一下运行 —— 插件把它所有的设计属性递归导出成一个结构化的 JSON 文件，可以直接复制或下载。

**导出内容包括：**
- 📐 **Auto Layout**（方向、间距、内边距、对齐、换行）
- 📏 **尺寸模式**（Fixed / Hug / Fill）
- 🔗 **约束**（Constraints）
- ⭕ **独立四角圆角**（不是统一的 corner radius，是四个角分别的值）
- 🎨 **填充**（纯色、渐变，含渐变 stops 和 transform）
- ✏️ **描边**（颜色、粗细、对齐）
- 🌑 **阴影 & 效果**（Drop shadow、blur 等，含颜色、偏移、扩展）
- 🔤 **文本属性**（字号、字体、行高、字间距、对齐、装饰、大小写等）
- 🧩 **组件**（实例的 componentId / mainComponentId，组件的 property definitions）
- 🔗 **变量绑定**（Design tokens / variables）
- 👶 **子节点**（递归导出全部层级）

Select a Frame / Section / Group in Figma, run the plugin — it recursively extracts all design properties into structured JSON. Copy to clipboard or download as `.json`.

**Exported data includes:**
- 📐 **Auto Layout** (direction, gap, padding, alignment, wrap)
- 📏 **Sizing** (Fixed / Hug / Fill)
- 🔗 **Constraints**
- ⭕ **Individual corner radius** (four independent values)
- 🎨 **Fills** (solid, gradients with stops & transform)
- ✏️ **Strokes** (color, weight, alignment)
- 🌑 **Effects** (drop shadow, blur, etc.)
- 🔤 **Text properties** (font, size, weight, line height, spacing, alignment, decoration, case)
- 🧩 **Components** (instance IDs, property definitions)
- 🔗 **Variable bindings** (design tokens)
- 👶 **Children** (full recursive tree)

---

## 安装 / Installation

### 方式一：Figma Community（推荐）
> *即将上线 / Coming soon*

### 方式二：本地开发模式
1. 打开 Figma 桌面端 → 右键画布 → `Plugins` → `Development` → `Import plugin from manifest...`
2. 选择本项目里的 `manifest.json`
3. 完成。右键菜单里会出现 `dump-layout`。

---

### 1. Figma Community (Recommended)
> *Coming soon*

### 2. Local Dev Mode
1. Open Figma Desktop → right-click canvas → `Plugins` → `Development` → `Import plugin from manifest...`
2. Select `manifest.json` from this project
3. Done. `dump-layout` will appear in your plugin menu.

---

## 使用 / Usage

<div align="center">
  <img src="https://img.shields.io/badge/Figma-Plugin-0d99ff?logo=figma" alt="Figma Plugin">
</div>

### 三步搞定 / 3 Steps

| Step | 操作 | 说明 |
|------|------|------|
| ① | 在 Figma 里选中一个 **Frame / Section / Group** | 可以多选 |
| ② | 右键 → `Plugins` → `dump-layout` | 或菜单栏 `Plugins` → `dump-layout` |
| ③ | 在弹出的面板里 **复制 JSON** 或 **下载 .json 文件** | 完事 ✌️ |

### 导出 JSON 示例 / Example Output

```json
{
  "name": "Hero Section",
  "id": "123:456",
  "type": "FRAME",
  "autoLayout": {
    "mode": "VERTICAL",
    "gap": 24,
    "paddingTop": 48,
    "paddingRight": 32,
    "paddingBottom": 48,
    "paddingLeft": 32,
    "primaryAlign": "CENTER",
    "counterAlign": "CENTER"
  },
  "sizing": { "horizontal": "FILL", "vertical": "HUG" },
  "corners": { "tl": 16, "tr": 16, "bl": 0, "br": 0 },
  "children": [ ... ]
}
```

---

## 为什么做这个？ / Why?

Figma 的 Dev Mode 很好，但很多设计细节（比如独立四角圆角、渐变 transform、变量绑定）在 Inspect 面板里看不到或者很难复制。**这个插件把一切摊开来给你。**

Figma Dev Mode is great, but many design details (individual corner radius, gradient transforms, variable bindings) are hidden or hard to copy from the Inspect panel. **This plugin lays everything bare.**

---

## 开发 / Development

```bash
# 安装依赖
npm install

# 开发模式（自动编译）
npm run watch

# 构建
npm run build

# Lint
npm run lint
```

在 Figma 桌面端用 "Import plugin from manifest..." 导入本地的 `manifest.json`，然后每次改完 `code.ts` 后重新运行插件即可看到效果。

After importing via "Import plugin from manifest...", re-run the plugin after each code change to see updates.

---

## 技术栈 / Tech Stack

- TypeScript
- Figma Plugin API
- No external runtime dependencies（零运行时依赖）

---

## 许可证 / License

MIT — 随便用，开心就好。 / Use it however you like.
