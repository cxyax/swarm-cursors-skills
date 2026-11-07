import { SceneBuilder } from "../swarm/scene/scene-builder.js";
import { EN_SCENE_TEXT, getProfile } from "./i18n.js";
import { PALETTE as C, bodyStyle as textStyle, labelStyle } from "./theme.js";

/**
 * 绘制有限长度的细分隔线，避免把局部页面边界绑定到模板的固定画布宽度。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {string} id 唯一线条标识。
 * @param {number} x 起点横坐标。
 * @param {number} y 起点纵坐标。
 * @param {number} endX 终点横坐标。
 * @param {number} [endY] 终点纵坐标。
 * @param {object} [options] 路径样式及依赖。
 * @returns {string} 施工任务标识。
 */
function rule(scene, id, x, y, endX, endY = y, options = {}) {
  // 所有网格线使用当前布局的真实边界，手机布局不依赖桌面常量。
  return scene.path(id, [{ x, y }, { x: endX, y: endY }], { stroke: C.line, ...options });
}

/**
 * 创建统一的区块编号与英文栏目标签。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {string} id 标签标识。
 * @param {string} number 区块编号。
 * @param {string} label 英文栏目名。
 * @param {number} x 标签横坐标。
 * @param {number} y 标签纵坐标。
 * @returns {void}
 */
function sectionLabel(scene, id, number, label, x, y) {
  // 编号与小横线构成编辑式页码，统一各个区块的阅读节奏。
  scene.text(`${id}-number`, x, y, number, labelStyle(11, C.ink));
  rule(scene, `${id}-dash`, x + 34, y + 8, x + 58);
  scene.text(`${id}-label`, x + 74, y, label, labelStyle());
}

/**
 * 创建带背景和独立文字任务的按钮，交互层使用这两个稳定ID判断完成时机。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {string} id 按钮矩形标识。
 * @param {string} label 按钮文案。
 * @param {number} x 横坐标。
 * @param {number} y 纵坐标。
 * @param {number} width 按钮宽度。
 * @param {boolean} [secondary] 是否使用次要按钮样式。
 * @returns {void}
 */
function button(scene, id, label, x, y, width, secondary = false) {
  // 文字等待背景完成，避免可点击标签出现在尚未绘制的底板上。
  const task = scene.rect(id, x, y, width, 50, {
    r: 6, fill: secondary ? C.paper : C.ink, stroke: secondary ? C.line : undefined,
  });
  scene.text(`${id}-text`, x, y + 13, label,
    textStyle(15, 550, secondary ? C.ink : C.paper, 1.5),
    { w: width, align: "center", deps: [task] });
}

/**
 * 构建简洁的吸顶导航，移动端保留全部栏目入口。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @returns {void}
 */
function navigation(scene, layout) {
  // 记录本区块起点，再把导航实体统一标为吸顶层。
  const start = scene.elements.length;
  const { mobile, left, right } = layout;
  scene.rect("brand-dot", left, 45, mobile ? 8 : 10, mobile ? 8 : 10, { fill: C.ink, r: 1 });
  scene.text("brand", left + 20, 40, layout.profile.name, textStyle(mobile ? 15 : 18, 650, C.ink, 1.5));
  const positions = mobile ? [184, 250, 316, 382] : [714, 826, 938, 1050];
  ["作品", "关于", "技术", "联系"].forEach((label, index) => {
    const ids = ["nav-work", "nav-about", "nav-stack", "nav-contact"];
    scene.text(ids[index], positions[index], 43, label, textStyle(mobile ? 14 : 14, 500));
  });
  rule(scene, "nav-rule", left, 87, right);
  scene.elements.slice(start).forEach((element) => { element.sticky = true; });
}

/**
 * 用浏览器窗口、节点和大箭头组成首页主视觉，全部几何都参与施工。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {number} x 图案横坐标。
 * @param {number} y 图案纵坐标。
 * @param {number} width 图案宽度。
 * @param {boolean} mobile 是否使用手机尺寸。
 * @returns {void}
 */
function heroArtwork(scene, x, y, width, mobile) {
  // 图形由分层卡片构成，不依赖外部图片和不可编辑的位图素材。
  const height = mobile ? 274 : 344;
  const base = scene.rect("hero-art-base", x, y, width, height, { r: 14, fill: C.green });
  scene.text("hero-art-label", x + 22, y + 18, "IDEA → CODE → SOMETHING REAL", labelStyle(10, C.ink), { deps: [base] });
  const win = scene.rect("hero-art-window", x + 28, y + 58, width - 56, height - 112, {
    r: 8, fill: C.ink, deps: [base],
  });
  [0, 1, 2].forEach((index) => {
    scene.rect(`hero-window-dot-${index}`, x + 44 + index * 14, y + 73, 6, 6, {
      r: 3, fill: index === 0 ? C.green : "#676F60", deps: [win],
    });
  });
  scene.text("hero-file", x + width - 130, y + 67, "hello.world", labelStyle(10, "#A9B49D"), { deps: [win] });
  rule(scene, "hero-window-rule", x + 29, y + 91, x + width - 29, y + 91, { stroke: "#3A4236", deps: [win] });
  scene.text("hero-code-comment", x + 48, y + 113, "// make something matter", labelStyle(mobile ? 11 : 12, "#8A9780"), { deps: [win] });
  scene.text("hero-code-line", x + 48, y + 146, "const idea = create();", labelStyle(mobile ? 14 : 16, C.paper), { deps: [win] });
  scene.text("hero-code-return", x + 48, y + 181, "return something.real;", labelStyle(mobile ? 14 : 16, C.green), { deps: [win] });
  scene.text("hero-art-bottom", x + 24, y + height - 33, "BUILT WITH CURIOSITY", labelStyle(10, C.ink), { deps: [base] });
  // 跨出窗口的实心箭头为画面制造一个明确焦点，也呼应正在工作的光标。
  const arrowX = x + width - 69;
  const arrowY = y + height - 101;
  scene.path("hero-art-cursor", [
    { x: arrowX, y: arrowY }, { x: arrowX + 44, y: arrowY + 20 },
    { x: arrowX + 27, y: arrowY + 24 }, { x: arrowX + 39, y: arrowY + 47 },
    { x: arrowX + 29, y: arrowY + 53 }, { x: arrowX + 16, y: arrowY + 30 },
    { x: arrowX + 5, y: arrowY + 43 },
  ], { closed: true, fill: C.paper, stroke: C.ink, sw: 2, deps: [win] });
}

/**
 * 创建首屏个人介绍与可交互的两枚主要按钮。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @returns {void}
 */
function hero(scene, layout) {
  // 手机采用纵向堆叠，主标题和正文保持可读字号而不是缩小桌面画布。
  const { mobile, left, right, heroBottom } = layout;
  scene.text("hero-kicker", left, mobile ? 132 : 169, "PERSONAL WORKSPACE / 2026", labelStyle(11));
  scene.guide("hero-guide", "x", left, 140);
  scene.text("hero-title", left, mobile ? 185 : 232, "把想法，\n写成现实。", textStyle(mobile ? 48 : 70, 650, C.ink, 1.18), {
    w: mobile ? 416 : 580, grow: true, snap: "hero-guide",
  });
  scene.text("hero-role", left, mobile ? 326 : 428, layout.profile.role, textStyle(mobile ? 15 : 16, 500));
  scene.text("hero-description", left, mobile ? 370 : 472, layout.profile.description, textStyle(mobile ? 17 : 18, 400, C.muted, 1.7), { w: mobile ? 416 : 520 });
  button(scene, "hero-work", "看看我的作品  ↗", left, mobile ? 458 : 568, mobile ? 206 : 188);
  button(scene, "hero-contact", "打个招呼", left + (mobile ? 222 : 204), mobile ? 458 : 568, mobile ? 194 : 144, true);
  heroArtwork(scene, mobile ? left : 750, mobile ? 555 : 224, mobile ? 416 : 414, mobile);
  scene.text("hero-note", left, heroBottom - 57, "正在用代码，建造一个小小的数字世界。", textStyle(12, 400, C.muted));
  if (!mobile) scene.text("hero-scroll", right - 160, heroBottom - 57, "SCROLL TO EXPLORE ↓", labelStyle(10));
  rule(scene, "hero-bottom", left, heroBottom, right);
}

/**
 * 为作品卡片绘制小型可编辑预览，三个图案各自突出其项目特征。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {number} index 项目序号。
 * @param {number} x 预览横坐标。
 * @param {number} y 预览纵坐标。
 * @param {number} width 预览宽度。
 * @param {string} dependency 卡片背景的前置任务。
 * @returns {void}
 */
function projectPreview(scene, index, x, y, width, dependency) {
  // 预览以有限的几何表达项目，避免用重复的大段文字占据作品区域。
  const prefix = `project-preview-${index}`;
  const colors = [C.light, C.green, C.ink];
  const task = scene.rect(prefix, x, y, width, 170, { r: 5, fill: colors[index], deps: [dependency] });
  if (index === 0) {
    const center = x + width / 2;
    scene.rect(`${prefix}-tile`, center - 53, y + 43, 106, 84, { r: 6, fill: C.paper, stroke: C.line, deps: [task] });
    scene.text(`${prefix}-name`, center - 53, y + 71, "BUILD", labelStyle(21, C.ink), { w: 106, align: "center", deps: [task] });
    [[-89, -17], [73, 5], [-70, 73]].forEach(([dx, dy], cursorIndex) => {
      scene.path(`${prefix}-pointer-${cursorIndex}`, [
        { x: center + dx, y: y + 42 + dy }, { x: center + dx + 21, y: y + 52 + dy },
        { x: center + dx + 11, y: y + 56 + dy }, { x: center + dx + 6, y: y + 68 + dy },
      ], { closed: true, fill: cursorIndex === 1 ? "#566DFF" : C.ink, stroke: cursorIndex === 1 ? "#566DFF" : C.ink, deps: [task] });
    });
  } else if (index === 1) {
    const window = scene.rect(`${prefix}-browser`, x + 36, y + 28, width - 72, 118, { r: 5, fill: C.paper, deps: [task] });
    rule(scene, `${prefix}-bar`, x + 36, y + 49, x + width - 36, y + 49, { deps: [window] });
    scene.text(`${prefix}-heading`, x + 51, y + 64, "HELLO,\nI'M AXIN.", labelStyle(19, C.ink), { deps: [window] });
    scene.rect(`${prefix}-picture`, x + width - 101, y + 65, 48, 58, { r: 3, fill: C.green, deps: [window] });
    scene.rect(`${prefix}-cta`, x + 51, y + 119, 60, 7, { r: 2, fill: C.ink, deps: [window] });
  } else {
    scene.text(`${prefix}-symbol`, x + 30, y + 29, "[ skill ]", labelStyle(34, C.green), { deps: [task] });
    scene.text(`${prefix}-command`, x + 30, y + 90, "$ idea → reusable", labelStyle(12, C.paper), { deps: [task] });
    scene.text(`${prefix}-caption`, x + 30, y + 121, "ONE IDEA. MANY POSSIBILITIES.", labelStyle(9, "#9AA590"), { deps: [task] });
  }
}

/**
 * 创建精选项目区，桌面三列并排，手机单列堆叠。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @returns {void}
 */
function projects(scene, layout) {
  // 标题和点击入口保持稳定ID，布局变化不影响宿主的事件接线。
  const { mobile, left, right, heroBottom, workBottom } = layout;
  sectionLabel(scene, "work-section", "01", "SELECTED WORK", left, heroBottom + 44);
  scene.text("work-title", left, heroBottom + 94, "一些想法，已经发生。", textStyle(mobile ? 30 : 40, 600, C.ink, 1.3), { w: mobile ? 416 : 620 });
  scene.text("work-lead", left, heroBottom + (mobile ? 151 : 158), "从一次好奇，到一个可以点击的作品。", textStyle(15, 400, C.muted));
  layout.profile.projects.slice(0, 3).forEach((project, index) => {
    const width = mobile ? 416 : 324;
    const x = mobile ? left : left + index * 362;
    const y = heroBottom + 232 + (mobile ? index * 484 : 0);
    const background = scene.rect(`work-card-${index}`, x, y, width, 450, { r: 10, fill: C.white, stroke: C.line });
    projectPreview(scene, index, x + 16, y + 16, width - 32, background);
    scene.text(`work-category-${index}`, x + 22, y + 207, `0${index + 1} / ${project.category}`, labelStyle(9), { deps: [background] });
    scene.text(`work-name-${index}`, x + 22, y + 240, project.title, textStyle(23, 600, C.ink, 1.3), { w: width - 44, deps: [background] });
    scene.text(`work-description-${index}`, x + 22, y + 286, project.description, textStyle(15, 400, C.muted, 1.7), { w: width - 44, deps: [background] });
    scene.text(`work-tags-${index}`, x + 22, y + 358, project.tags.slice(0, 2).join("  /  "), labelStyle(10), { deps: [background] });
    rule(scene, `work-divider-${index}`, x + 22, y + 393, x + width - 22, y + 393, { deps: [background] });
    scene.text(`work-open-${index}`, x + 22, y + 409, "查看项目  ↗", textStyle(13, 550), { deps: [background] });
    scene.text(`work-year-${index}`, x + width - 61, y + 410, project.year, labelStyle(10), { deps: [background] });
  });
  rule(scene, "work-bottom", left, workBottom, right);
}

/**
 * 创建个人介绍，以两段正文和一张工作方式便笺呈现个人气质。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @returns {void}
 */
function about(scene, layout) {
  // 介绍内容来自个人资料，便笺使用短语而不编造工作年限或项目指标。
  const { mobile, left, right, workBottom, aboutBottom } = layout;
  sectionLabel(scene, "about-section", "02", "A LITTLE ABOUT ME", left, workBottom + 44);
  scene.text("about-title", left, workBottom + 96, "保持好奇，\n认真做事。", textStyle(mobile ? 34 : 44, 600, C.ink, 1.25), { w: mobile ? 416 : 440 });
  const paragraphX = mobile ? left : 652;
  const paragraphY = workBottom + (mobile ? 215 : 103);
  layout.profile.about.slice(0, 2).forEach((paragraph, index) => {
    scene.text(`about-paragraph-${index}`, paragraphX, paragraphY + index * (mobile ? 126 : 142), paragraph,
      textStyle(mobile ? 17 : 18, 400, C.muted, 1.8), { w: mobile ? 416 : 512 });
  });
  const noteY = mobile ? aboutBottom - 117 : workBottom + 327;
  const noteX = mobile ? left : 116;
  const noteWidth = mobile ? 416 : 412;
  const note = scene.rect("about-note", noteX, noteY, noteWidth, 78, { r: 6, fill: C.light });
  scene.text("about-note-title", noteX + 20, noteY + 15, "THINK CLEARLY. BUILD CAREFULLY.", labelStyle(11, C.ink), { deps: [note] });
  scene.text("about-note-text", noteX + 20, noteY + 41, "先让它有用，再让它有一点不同。", textStyle(13, 400, C.muted), { deps: [note] });
  rule(scene, "about-bottom", left, aboutBottom, right);
}

/**
 * 创建六项技术与工作关注点，采用文字为主的轻量网格。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @returns {void}
 */
function skills(scene, layout) {
  // 技术条目不使用主观百分比，用具体工作方向表达能力与关注点。
  const { mobile, left, right, aboutBottom, stackBottom } = layout;
  sectionLabel(scene, "stack-section", "03", "TOOLS & INTERESTS", left, aboutBottom + 44);
  scene.text("stack-title", left, aboutBottom + 96, mobile ? "手边的工具箱。" : "合适的工具，\n把事情做好。", textStyle(mobile ? 32 : 38, 600, C.ink, 1.3), { w: mobile ? 416 : 420 });
  layout.profile.skills.slice(0, 6).forEach((skill, index) => {
    const columns = mobile ? 2 : 3;
    const x = (mobile ? left : 610) + (index % columns) * (mobile ? 218 : 189);
    const y = aboutBottom + (mobile ? 182 : 101) + Math.floor(index / columns) * (mobile ? 130 : 150);
    const width = mobile ? 198 : 169;
    scene.rect(`skill-dot-${index}`, x, y + 5, 6, 6, { r: 1, fill: C.ink });
    scene.text(`skill-name-${index}`, x + 17, y, skill.name, textStyle(mobile ? 15 : 14, 600), { w: width - 17 });
    scene.text(`skill-description-${index}`, x, y + 38, skill.detail, textStyle(13, 400, C.muted, 1.6), { w: width });
    rule(scene, `skill-rule-${index}`, x, y + 97, x + width);
  });
  rule(scene, "stack-bottom", left, stackBottom, right);
}

/**
 * 创建荧光绿联系区域和简洁页脚，保留返回顶部与重播入口。
 * @param {SceneBuilder} scene 场景构建器。
 * @param {object} layout 当前布局参数。
 * @param {Function} getWorkerCount 当前参与施工人数读取函数。
 * @returns {void}
 */
function closing(scene, layout, getWorkerCount) {
  // 联系按钮的实际行为由宿主接管，场景只负责稳定布局和施工任务。
  const { mobile, left, right, stackBottom, footerTop, height } = layout;
  sectionLabel(scene, "contact-section", "04", "SAY HELLO", left, stackBottom + 44);
  const boxY = stackBottom + 93;
  const boxHeight = mobile ? 328 : 270;
  const box = scene.rect("contact-panel", left, boxY, right - left, boxHeight, { r: 12, fill: C.green });
  const inset = mobile ? 25 : 38;
  scene.text("contact-title", left + inset, boxY + 31, "一起做点\n有意思的。", textStyle(mobile ? 37 : 46, 600, C.ink, 1.2), { w: mobile ? 366 : 560, deps: [box] });
  scene.text("contact-description", left + inset, boxY + (mobile ? 143 : 166), "一个想法、一个问题，\n或者，只是想说一声你好。", textStyle(mobile ? 15 : 16, 400, C.ink, 1.7), { w: mobile ? 360 : 500, deps: [box] });
  button(scene, "contact-button", "打个招呼  ↗", mobile ? left + inset : right - 238, boxY + (mobile ? 237 : 145), mobile ? 366 : 200);
  if (!mobile) scene.text("contact-small", right - 238, boxY + 215, "GOOD THINGS START WITH HELLO.", labelStyle(9, C.ink), { deps: [box] });
  rule(scene, "footer-rule", left, footerTop, right);
  scene.text("footer-brand", left, footerTop + 33, "AXIN / PERSONAL WORKSPACE", labelStyle(mobile ? 10 : 11, C.ink));
  scene.text("footer-home", mobile ? left : right - 220, footerTop + (mobile ? 112 : 32), "回到顶部 ↑", textStyle(12, 500));
  scene.text("footer-replay", mobile ? right - 88 : right - 88, footerTop + (mobile ? 112 : 32), "重新施工 ↻", textStyle(12, 500));
  scene.text("footer-copy", left, footerTop + 66, "© 2026 程序员阿鑫 · 慢慢创造，持续更新。", textStyle(mobile ? 11 : 12, 400, C.muted));
  // 手机页脚下方预留控制条空间，避免协作人数说明被浮动按钮遮挡。
  scene.text("footer-workers", left, mobile ? footerTop + 168 : height - 42, "", labelStyle(9), {
    dyn: () => `BUILT TOGETHER BY ${getWorkerCount()} LITTLE CURSORS.`,
  });
}

/**
 * 组装个人主页场景，按屏幕类型提供独立桌面和手机布局。
 * @param {Function} getWorkerCount 引擎提供的施工人数查询函数。
 * @param {{mobile?:boolean}} [options] 布局选项。
 * @returns {{els:object[],tasks:object[],groups:object[],height:number,width:number}} 可直接交给施工引擎的页面。
 */
export function createPersonalScene(getWorkerCount, { mobile = false, language = "en" } = {}) {
  // 手机画布使用480设计宽度，每个区块重排，不把1280宽的桌面内容整体缩小。
  const layout = mobile
    ? { mobile, width: 480, left: 32, right: 448, heroBottom: 936, workBottom: 2660, aboutBottom: 3260, stackBottom: 3880, footerTop: 4374, height: 4710 }
    : { mobile, width: 1280, left: 116, right: 1164, heroBottom: 790, workBottom: 1560, aboutBottom: 2100, stackBottom: 2540, footerTop: 2990, height: 3180 };
  // 选定资料并在创建文字任务时替换文案，确保文字测量使用当前语言。
  layout.profile = getProfile(language);
  const scene = new SceneBuilder();
  if (language === "en") {
    const addText = scene.text.bind(scene);
    scene.text = (id, x, y, content, style, options) =>
      addText(id, x, y, EN_SCENE_TEXT[id] ?? content, style, options);
  }
  navigation(scene, layout);
  hero(scene, layout);
  projects(scene, layout);
  about(scene, layout);
  skills(scene, layout);
  closing(scene, layout, getWorkerCount);
  return { els: scene.elements, tasks: scene.tasks, groups: scene.groups, height: layout.height, width: layout.width };
}
