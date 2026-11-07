import React, { useEffect, useRef, useState } from "react";
import { PersonalDialogKind } from "./actions.js";

/** 剪贴板操作状态，用于控制按钮与读屏反馈。 */
const CopyState = Object.freeze({
  IDLE: "idle",
  COPYING: "copying",
  COPIED: "copied",
  MANUAL: "manual",
});

/**
 * 展示可以复制的文本，剪贴板不可用时自动选中原文供手动复制。
 * @param {{text:string,label:string,compact?:boolean}} props 完整文本、操作名称及紧凑显示方式。
 * @returns {React.ReactElement} 可复制内容与反馈。
 */
function CopyBlock({ text, label, compact = false, language }) {
  // 复制状态局限在当前文本块，动画刷新不会清空操作结果。
  const [copyState, setCopyState] = useState(CopyState.IDLE);
  const contentRef = useRef(null);
  const requestRef = useRef(0);
  useEffect(() => {
    // 卸载或内容变更后让旧异步结果失效，避免反馈覆盖下一次操作。
    requestRef.current += 1;
    setCopyState(CopyState.IDLE);
    return () => {
      requestRef.current += 1;
    };
  }, [text]);

  /**
   * 复制当前文本，并在权限不足时提供可选择的原文。
   * @returns {Promise<void>} 剪贴板请求完成后的反馈。
   */
  async function copyText() {
    // 每次点击使用独立请求编号，确保只有当前文本的最后一次请求更新界面。
    const request = ++requestRef.current;
    setCopyState(CopyState.COPYING);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (request === requestRef.current) setCopyState(CopyState.COPIED);
    } catch {
      if (request !== requestRef.current) return;
      setCopyState(CopyState.MANUAL);
      if (contentRef.current) {
        contentRef.current.focus({ preventScroll: true });
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }

  return (
    <section className={`personal-copy${compact ? " personal-copy--compact" : ""}`}>
      <p className="personal-copy-value" ref={contentRef} tabIndex={0}>
        {text}
      </p>
      <button
        className="personal-button personal-button--light"
        type="button"
        onClick={copyText}
        disabled={copyState === CopyState.COPYING}
      >
        {copyState === CopyState.COPYING
          ? (language === "zh" ? "正在复制…" : "Copying…")
          : copyState === CopyState.COPIED
          ? (language === "zh" ? "已复制 ✓" : "Copied ✓")
          : label}
        {copyState === CopyState.IDLE && <span aria-hidden="true">↗</span>}
      </button>
      <p className="personal-copy-feedback" role="status">
        {copyState === CopyState.MANUAL
          ? (language === "zh" ? "已选中文本，可按 Ctrl+C 或 ⌘C 手动复制。" : "Text selected. Press Ctrl+C or ⌘C to copy.")
          : copyState === CopyState.COPIED
          ? (language === "zh" ? "已复制到剪贴板。" : "Copied to clipboard.")
          : ""}
      </p>
    </section>
  );
}

/**
 * 展示个人作品的项目说明与设计亮点。
 * @param {{project:object,index:number,onClose:Function}} props 作品资料、展示序号与关闭回调。
 * @returns {React.ReactElement} 项目详情正文。
 */
function ProjectContent({ project, index, onClose, language }) {
  // 项目数据统一来自profile，外链仅在真实配置了地址时显示。
  return (
    <>
      <div className="personal-project-meta">
        <span>{language === "zh" ? "作品" : "PROJECT"} {String(index + 1).padStart(2, "0")}</span>
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <p className="personal-dialog-description">{project.description}</p>
      <div className="personal-tags" aria-label={language === "zh" ? "项目标签" : "Project tags"}>
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <section className="personal-details" aria-label={language === "zh" ? "作品亮点" : "Project highlights"}>
        <h3>{language === "zh" ? "一些值得展开的细节" : "A closer look"}</h3>
        <ol>
          {project.details.map((detail, detailIndex) => (
            <li key={detail}>
              <span className="personal-detail-number" aria-hidden="true">
                {String(detailIndex + 1).padStart(2, "0")}
              </span>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="personal-dialog-actions">
        {project.url ? (
          <a
            className="personal-button"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {language === "zh" ? "访问项目" : "Visit project"} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <button className="personal-button" type="button" onClick={onClose}>
            {language === "zh" ? "继续探索主页" : "Continue exploring"} <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </>
  );
}

/**
 * 展示联系信息与可复制的个人介绍，示例邮箱不会触发邮件发送入口。
 * @returns {React.ReactElement} 联系内容。
 */
function ContactContent({ profile, language }) {
  // 配置替换为真实邮箱后才开放mailto，避免把示例地址误当成真实联系方式。
  const email = profile.email.trim();
  const isExample = email.toLowerCase().endsWith("@example.com");
  const introduction = `${profile.name} · ${profile.role}\n${profile.description}`;
  return (
    <>
      <p className="personal-dialog-description">
        {language === "zh" ? "关于一个新想法、一次合作，或只是打个招呼。" : "Have an idea, a collaboration, or just want to say hello?"}
        <br />
        {language === "zh" ? "好的故事，往往从一句「你好」开始。" : "Good stories often start with hello."}
      </p>
      <div className="personal-contact-label">
        <span className="personal-contact-dot" aria-hidden="true" />
        <span>{language === "zh" ? "保持好奇，也保持联系" : "Stay curious, stay in touch"}</span>
      </div>
      {email ? (
        <>
          <CopyBlock text={email} label={language === "zh" ? "复制邮箱" : "Copy email"} language={language} compact />
          {isExample ? (
            <p className="personal-contact-note">{language === "zh" ? "示例邮箱，可在个人资料中替换。" : "Example email; replace it in the profile."}</p>
          ) : (
            <a className="personal-button" href={`mailto:${encodeURIComponent(email)}`}>
              {language === "zh" ? "写一封邮件" : "Send an email"} <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      ) : (
        <p className="personal-contact-note">{language === "zh" ? "联系方式正在整理，先认识一下我。" : "Contact details are coming soon."}</p>
      )}
      <section className="personal-introduction">
        <h3>{language === "zh" ? "一张文字名片" : "A short introduction"}</h3>
        <CopyBlock text={introduction} label={language === "zh" ? "复制介绍" : "Copy introduction"} language={language} />
      </section>
      {profile.github && (
        <a
          className="personal-text-link"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          {language === "zh" ? "去 GitHub 看看" : "Visit GitHub"} <span aria-hidden="true">↗</span>
        </a>
      )}
    </>
  );
}

/**
 * 提供个人主页作品与联系弹窗，统一处理焦点、背景滚动和关闭入口。
 * @param {{dialog:({kind:string,index?:number}|null),onClose:()=>void}} props 当前弹窗及关闭回调。
 * @returns {React.ReactElement} 浏览器顶层原生模态窗口。
 */
export function PersonalDialog({ dialog, onClose, language, profile }) {
  // 以是否开启作为副作用依赖，避免施工动画的每帧更新重复创建模态窗口。
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const closeRef = useRef(onClose);
  const backdropPressed = useRef(false);
  closeRef.current = onClose;
  const isOpen = Boolean(dialog);
  useEffect(() => {
    // 原生模态负责焦点约束；记录触发元素与页面样式，退出后原样恢复。
    const node = dialogRef.current;
    if (!isOpen || !node) return undefined;
    const trigger = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    if (!node.open) node.showModal();
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      if (node.open) node.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  /**
   * 通知上层清空弹窗状态，使各个关闭入口使用相同生命周期。
   * @returns {void}
   */
  function requestClose() {
    // 读取最新回调，确保窗口开启期间父组件更新不会导致旧闭包。
    closeRef.current();
  }

  /**
   * 通过上层状态处理Esc，防止原生窗口已关闭而React仍显示开启状态。
   * @param {React.SyntheticEvent<HTMLDialogElement>} event 浏览器取消事件。
   * @returns {void}
   */
  function handleCancel(event) {
    // 阻止默认关闭后统一触发清理与焦点恢复。
    event.preventDefault();
    requestClose();
  }

  /**
   * 判断事件坐标是否落在模态边界之外。
   * @param {React.MouseEvent<HTMLDialogElement>|React.PointerEvent<HTMLDialogElement>} event 当前指针事件。
   * @returns {boolean} 是否属于真正的遮罩操作。
   */
  function isBackdrop(event) {
    // 弹窗留白和遮罩的事件目标相同，需要检查矩形边界来区分。
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  }

  /**
   * 记录遮罩上的按下动作，防止从正文拖动选区至遮罩时误关闭。
   * @param {React.PointerEvent<HTMLDialogElement>} event 指针按下事件。
   * @returns {void}
   */
  function handlePointerDown(event) {
    // 一次关闭必须在遮罩上开始，并在遮罩上结束。
    backdropPressed.current = isBackdrop(event);
  }

  /**
   * 响应完整遮罩点击，并清除上次指针按下记录。
   * @param {React.MouseEvent<HTMLDialogElement>} event 点击事件。
   * @returns {void}
   */
  function handleBackdropClick(event) {
    // 内部复制、外链和关闭按钮的冒泡不会额外触发遮罩关闭。
    if (backdropPressed.current && isBackdrop(event)) requestClose();
    backdropPressed.current = false;
  }

  const isProject = dialog?.kind === PersonalDialogKind.PROJECT;
  const requestedIndex = dialog?.index ?? 0;
  const index = profile.projects[requestedIndex] ? requestedIndex : 0;
  const project = profile.projects[index];
  return (
    <dialog
      className="personal-dialog"
      ref={dialogRef}
      aria-labelledby="personal-dialog-title"
      onCancel={handleCancel}
      onPointerDown={handlePointerDown}
      onClick={handleBackdropClick}
    >
      {dialog && (
        <div className="personal-dialog-surface">
          <header className="personal-dialog-header">
            <span className="personal-dialog-wordmark">
              <span aria-hidden="true">ax.</span> {profile.name}
            </span>
            <button
              className="personal-dialog-close"
              type="button"
              aria-label={language === "zh" ? "关闭弹窗" : "Close dialog"}
              onClick={requestClose}
            >
              ×
            </button>
          </header>
          <div className="personal-dialog-kicker">
            {isProject ? "SELECTED WORK" : "SAY HELLO"}
          </div>
          <h2 id="personal-dialog-title" ref={titleRef} tabIndex={-1}>
            {isProject ? project?.title ?? (language === "zh" ? "关于这件作品" : "About this project") : (language === "zh" ? "让有趣的想法，发生。" : "Let’s make something interesting.")}
          </h2>
          {isProject && project ? (
            <ProjectContent project={project} index={index} onClose={requestClose} language={language} />
          ) : (
            <ContactContent profile={profile} language={language} />
          )}
        </div>
      )}
    </dialog>
  );
}
