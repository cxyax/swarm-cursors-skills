import React, { useCallback, useEffect, useState } from "react";
import { SwarmExperience, ActionType } from "./swarm/index.js";
import { createPersonalScene } from "./personal/scene.js";
import { getProfile } from "./personal/i18n.js";
import {
  PERSONAL_INTERACTIONS,
  PersonalAction,
  PersonalDialogKind,
} from "./personal/actions.js";
import { PersonalDialog } from "./personal/PersonalDialog.jsx";
import "./swarm/styles/index.css";
import "./personal/site.css";
import "./personal/dialog.css";

/**
 * 监听手机断点，切换为单列设计坐标，避免把桌面文字整体缩成不可读的小字。
 * @returns {boolean} 当前是否使用手机布局。
 */
function useMobileLayout() {
  // 初始化时读取当前视口，后续只有跨越断点才重建整张施工场景。
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    /** 在跨越断点时同步布局模式，普通窗口尺寸变化仍交给动画模块缩放。 */
    function updateLayout() {
      // React相同布尔值不会触发额外场景重挂。
      setMobile(media.matches);
    }
    updateLayout();
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);
  return mobile;
}

/**
 * 将个人资料、协作施工场景和真实点击行为组合成个人主页。
 * @returns {React.ReactElement} 完整个人主页。
 */
export default function App() {
  // 业务弹窗由宿主维护，不需要修改技能的通用施工调度逻辑。
  const mobile = useMobileLayout();
  const [language, setLanguage] = useState("en");
  const profile = getProfile(language);
  const [replay, setReplay] = useState(0);
  const [dialog, setDialog] = useState(null);
  const sceneFactory = useCallback(
    (getWorkerCount) => createPersonalScene(getWorkerCount, { mobile, language }),
    [mobile, language]
  );

  useEffect(() => {
    // 同步文档语言与标题，供浏览器和辅助技术使用。
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = language === "zh" ? "程序员阿鑫 — 把想法写成现实" : "Axin — Ideas into reality";
  }, [language]);

  /** 关闭当前个人资料或项目弹窗，焦点恢复由原生模态组件负责。 */
  const closeDialog = useCallback(() => {
    // 同一状态出口供Esc、关闭按钮和遮罩复用。
    setDialog(null);
  }, []);

  /** 从开头重新播放页面施工，重新挂载时会清理旧引擎的帧循环。 */
  const replayScene = useCallback(() => {
    // 使用key替换实例，所有实体、任务和光标从全新状态重新开始。
    setDialog(null);
    setReplay((value) => value + 1);
  }, []);

  /**
   * 处理作品详情、联系和重播，其他动作继续交给技能的导航处理器。
   * @param {object} action 点击区域声明的动作。
   * @returns {boolean} 是否已经由个人主页接管。
   */
  const onAction = useCallback(
    (action) => {
      // 自定义行为同步返回true，避免同时打开模板的产品演示弹窗。
      if (action.type !== ActionType.CUSTOM) return false;
      switch (action.name) {
        case PersonalAction.PROJECT:
          if (profile.projects[action.index])
            setDialog({ kind: PersonalDialogKind.PROJECT, index: action.index });
          return true;
        case PersonalAction.CONTACT:
          setDialog({ kind: PersonalDialogKind.CONTACT });
          return true;
        case PersonalAction.REPLAY:
          replayScene();
          return true;
        default:
          return false;
      }
    },
    [replayScene, profile]
  );

  return (
    <>
      <h1 className="visually-hidden">{language === "zh" ? `${profile.name}的个人主页 · 把想法写成现实` : `${profile.name} · Ideas into reality`}</h1>
      <SwarmExperience
        key={`${mobile ? "mobile" : "desktop"}-${language}-${replay}`}
        sceneFactory={sceneFactory}
        interactions={PERSONAL_INTERACTIONS.map((item) => ({ ...item, label: language === "zh" ? item.label : ({ "brand": "Back to top", "nav-work": "View work", "nav-about": "About", "nav-stack": "Tools", "nav-contact": "Contact", "hero-work": "Explore work", "hero-contact": "Say hello", "contact-button": "Contact", "footer-home": "Back to top", "footer-replay": "Replay animation" }[item.id] || "View project details") }))}
        onAction={onAction}
        autoStart
      />
      <aside className="personal-dock" aria-label={language === "zh" ? "页面动画控制" : "Page controls"}>
        <button type="button" onClick={() => { setDialog(null); setLanguage(language === "en" ? "zh" : "en"); }} aria-label={language === "en" ? "切换到中文" : "Switch to English"}>{language === "en" ? "中文" : "EN"}</button>
        <span className="dock-status">
          <i aria-hidden="true" />
          18 CURSORS · LIVE
        </span>
        <button type="button" onClick={replayScene} aria-label={language === "zh" ? "重新播放页面施工动画" : "Replay construction animation"}>
          <span aria-hidden="true">↻</span> {language === "zh" ? "重播施工" : "Replay"}
        </button>
      </aside>
      <PersonalDialog dialog={dialog} onClose={closeDialog} language={language} profile={profile} />
    </>
  );
}
