import { sansStyle, monoStyle } from "../swarm/scene/theme.js";

/** 个人主页的纸张、墨色和荧光绿设计令牌。 */
export const PALETTE = {
  paper: "#F6F6F2", ink: "#161A17", muted: "#73796F", line: "#DADDD3",
  green: "#D3FA60", light: "#EDEFE7", white: "#FFFFFF", dark: "#252B24",
};

/**
 * 创建个人主页正文样式，使Canvas测量和实际文字显示共享字体规则。
 * @param {number} size 字号。
 * @param {number} [weight] 字重。
 * @param {string} [color] 文字颜色。
 * @param {number} [height] 行高倍率。
 * @returns {object} 场景文字样式。
 */
export function bodyStyle(size, weight = 400, color = PALETTE.ink, height = 1.55) {
  // 中文标题减少字间距修饰，正文保持宽松行距。
  return sansStyle(size, weight, height, color, 0);
}

/**
 * 创建编号、状态和技术标签使用的等宽文字样式。
 * @param {number} [size] 字号。
 * @param {string} [color] 文字颜色。
 * @returns {object} 等宽文字样式。
 */
export function labelStyle(size = 11, color = PALETTE.muted) {
  // 技术标签与正文形成排版对比，但不改变页面主字体。
  return monoStyle(size, color, 500, { lh: 1.5 });
}
