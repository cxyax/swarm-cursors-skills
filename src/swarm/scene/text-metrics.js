import { FontKind } from "./theme.js";

const textMeasureCache = new Map();
let measureContext;
const graphemeSegmenter = typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter("zh-CN", { granularity: "grapheme" })
  : null;

/**
 * 获取文字样式对应的CSS字体栈，供DOM渲染和Canvas测量共用。
 * @param {import("./theme.js").TextStyle} style 文字样式。
 * @returns {string} CSS font-family值。
 */
export function fontFamily(style) {
  // 测量与展示必须使用同一字体栈，避免选框宽度与文字实际宽度不一致。
  return style.font === FontKind.MONO
    ? '"JetBrains Mono", "PingFang SC", "Microsoft YaHei", ui-monospace, monospace'
    : 'Inter, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif';
}

/**
 * 按完整字形拆分字符串，避免把代理对或组合字符分到不同的测量行。
 * @param {string} text 待拆分的文本。
 * @returns {string[]} 完整字形序列。
 */
function graphemes(text) {
  // 较旧浏览器至少按Unicode码点拆分，现代浏览器保留完整组合字形。
  return graphemeSegmenter
    ? Array.from(graphemeSegmenter.segment(text), (item) => item.segment)
    : Array.from(text);
}

/**
 * 将中英文混排段落拆成可换行单元，英文单词优先整体排列，中文按字换行。
 * @param {string} paragraph 单行段落文本。
 * @returns {string[]} 用于宽度累加的单元序列。
 */
function wrappingUnits(paragraph) {
  // 中文句末标点附着前一个单元，避免常见标点单独成为新行开头。
  const units = [];
  let word = "";
  for (const glyph of graphemes(paragraph)) {
    if (/^[A-Za-z0-9_]$/.test(glyph)) {
      word += glyph;
      continue;
    }
    if (word) {
      units.push(word);
      word = "";
    }
    if (/^[，。！？；：、）》】”’]$/.test(glyph) && units.length) {
      units[units.length - 1] += glyph;
    } else {
      units.push(glyph);
    }
  }
  if (word) units.push(word);
  return units;
}

/**
 * 计算整数像素行高，允许施工动画使用临时字号进行测量。
 * @param {import("./theme.js").TextStyle} style 文字样式。
 * @param {number} [size] 当前字号，默认采用样式字号。
 * @returns {number} 设计坐标中的行高。
 */
export function lineHeight(style, size = style.size) {
  // 与原站的逐字输入、字号增长和选框计算保持相同取整规则。
  return Math.round(size * style.lh);
}

/**
 * 按中文、英文单词与长词折行规则测量文字，返回布局尺寸和逐行宽度。
 * @param {string} text 当前已输入或完整的文字内容。
 * @param {import("./theme.js").TextStyle} style 文字样式。
 * @param {number} size 当前字号。
 * @param {number} [width] 文字容器宽度；省略时按最长行宽度确定尺寸。
 * @returns {{w:number,h:number,lines:number[]}} 设计坐标中的边界和每行宽度。
 */
export function measureText(text, style, size, width) {
  // 行高及空白保留规则加入缓存键，防止不同样式误用相同测量结果。
  const cacheKey = `${text}|${style.font}|${style.weight}|${size}|${
    style.ls ?? 0
  }|${style.lh}|${Boolean(style.pre)}|${width ?? -1}`;
  const cached = textMeasureCache.get(cacheKey);
  if (cached) return cached;

  // 延迟创建测量画布，模块本身仅提供函数，不需要挂载额外DOM节点。
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) throw new Error("浏览器无法创建文字测量画布");
  measureContext.font = `${style.weight} ${size}px ${fontFamily(style)}`;
  measureContext.letterSpacing = `${(style.ls ?? 0) * size}px`;
  const lineWidths = [];

  // 显式换行先拆段；代码保持原样，正文按字形和英文单词共同计算可用行宽。
  for (const paragraph of text.split("\n")) {
    if (width == null || style.pre) {
      lineWidths.push(measureContext.measureText(paragraph).width);
      continue;
    }
    let currentLine = "";
    for (const unit of wrappingUnits(paragraph)) {
      // pre-wrap允许行尾空白悬挂，空格本身不应额外撑出一整行。
      if (/^[ \t]+$/.test(unit)) {
        currentLine += unit;
        continue;
      }
      const candidate = currentLine + unit;
      if (currentLine && measureContext.measureText(candidate).width > width) {
        lineWidths.push(measureContext.measureText(currentLine).width);
        currentLine = "";
      }
      if (measureContext.measureText(unit).width <= width) {
        currentLine += unit;
        continue;
      }
      // 超长英文、链接等允许按字形拆行，与展示层overflow-wrap:anywhere对应。
      for (const glyph of graphemes(unit)) {
        if (currentLine && measureContext.measureText(currentLine + glyph).width > width) {
          lineWidths.push(measureContext.measureText(currentLine).width);
          currentLine = "";
        }
        currentLine += glyph;
      }
    }
    lineWidths.push(measureContext.measureText(currentLine).width);
  }

  const measured = {
    w: Math.ceil(width ?? Math.max(0, ...lineWidths)),
    h: lineWidths.length * lineHeight(style, size),
    lines: lineWidths,
  };
  textMeasureCache.set(cacheKey, measured);
  return measured;
}
