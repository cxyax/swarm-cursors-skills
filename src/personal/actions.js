import { ActionType, InteractionStyle } from "../swarm/index.js";

/** 个人主页弹窗类型，首页入口和弹窗组件使用同一协议。 */
export const PersonalDialogKind = Object.freeze({
  PROJECT: "project",
  CONTACT: "contact",
});

/** 交给个人主页处理的业务动作，和施工引擎内置动作隔离。 */
export const PersonalAction = Object.freeze({
  PROJECT: "open-project",
  CONTACT: "open-contact",
  REPLAY: "replay",
});

/**
 * 根据场景文字声明可点击链接，文字施工结束后才进入键盘焦点顺序。
 * @param {string} id 文字实体标识。
 * @param {string} label 操作名称。
 * @param {object} action 点击后的动作。
 * @returns {object} 场景交互描述。
 */
function link(id, label, action) {
  // 点击位置由当前实体边界计算，桌面和手机复用同一套ID。
  return {
    id,
    elements: [id],
    after: [`t:${id}`],
    label,
    style: InteractionStyle.LINK,
    action,
  };
}

/**
 * 将背景和文字合并成完整按钮热区。
 * @param {string} id 按钮背景实体标识，文字为id-text。
 * @param {string} label 操作名称。
 * @param {object} action 点击后的动作。
 * @returns {object} 完整按钮交互描述。
 */
function button(id, label, action) {
  // 同时等待几何和文字绘制结束，避免未完成按钮提前响应。
  return {
    id,
    elements: [id, `${id}-text`],
    after: [`r:${id}`, `t:${id}-text`],
    label,
    style: InteractionStyle.BUTTON,
    action,
  };
}

const contactAction = { type: ActionType.CUSTOM, name: PersonalAction.CONTACT };

/** 全部导航、作品和联系入口，独立于页面尺寸和动画状态。 */
export const PERSONAL_INTERACTIONS = [
  link("brand", "回到首页", { type: ActionType.SCROLL }),
  link("nav-work", "查看作品", { type: ActionType.SCROLL, target: "work-title" }),
  link("nav-about", "关于我", { type: ActionType.SCROLL, target: "about-title" }),
  link("nav-stack", "技术与工具", { type: ActionType.SCROLL, target: "stack-title" }),
  link("nav-contact", "联系我", contactAction),
  button("hero-work", "看看我的作品", { type: ActionType.SCROLL, target: "work-title" }),
  button("hero-contact", "打个招呼", contactAction),
  ...[0, 1, 2].map((index) => ({
    ...link(`work-open-${index}`, `查看第${index + 1}个项目详情`, {
      type: ActionType.CUSTOM,
      name: PersonalAction.PROJECT,
      index,
    }),
    elements: [`work-card-${index}`, `work-open-${index}`],
    after: [`r:work-card-${index}`, `t:work-open-${index}`, `t:work-name-${index}`],
    style: InteractionStyle.BUTTON,
  })),
  button("contact-button", "打开联系方式", contactAction),
  link("footer-home", "返回顶部", { type: ActionType.SCROLL }),
  link("footer-replay", "重新播放施工动画", {
    type: ActionType.CUSTOM,
    name: PersonalAction.REPLAY,
  }),
];
