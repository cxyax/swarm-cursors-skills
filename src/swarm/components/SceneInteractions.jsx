import React from "react";
import { TaskState } from "../animation/config.js";
import { InteractionStyle, PAGE_INTERACTIONS } from "../interactions/actions.js";

/**
 * 在已施工完成的场景内容上覆盖原生按钮，继承所在画布的缩放与吸顶坐标。
 * @param {{engine:object,sticky?:boolean,interactions?:object[],onAction:(action:object)=>void}} props 引擎、图层、点击配置及统一动作处理器。
 * @returns {React.ReactElement} 可通过点击、Enter或空格操作的交互层。
 */
export function SceneInteractions({
  engine,
  sticky = false,
  interactions = PAGE_INTERACTIONS,
  onAction,
}) {
  // 不创建全屏透明容器，避免拦截场景中普通区域的滚动和文本操作。
  return (
    <>
      {interactions.map((interaction) => {
        const elements = interaction.elements.map((id) => engine.els.get(id));
        if (elements.some((element) => !element?.vis)) return null;
        if (Boolean(elements[0].sticky) !== sticky) return null;
        if (
          !interaction.after.every(
            (id) => engine.byTask.get(id)?.state === TaskState.DONE
          )
        )
          return null;
        const bounds = engine.unionBounds(interaction.elements);
        const isButton = interaction.style === InteractionStyle.BUTTON;
        const mobile = engine.width <= 480;
        // 手机文字链接按视口像素扩展；导航宽度不超过相邻链接的66像素设计间距。
        const touchSize = mobile ? 44 / engine.vp.s : 36;
        const linkWidth = mobile ? (sticky ? Math.min(touchSize, 66) : touchSize) : bounds.w;
        const paddingX = isButton ? 0 : Math.max(7, (linkWidth - bounds.w) / 2);
        const paddingY = isButton ? 0 : Math.max(6, (touchSize - bounds.h) / 2);
        return (
          <button
            key={interaction.id}
            type="button"
            className={`scene-action scene-action--${interaction.style}`}
            data-interaction-id={interaction.id}
            aria-label={interaction.label}
            title={interaction.label}
            aria-haspopup={interaction.action.kind ? "dialog" : undefined}
            style={{
              left: bounds.x - paddingX,
              top: bounds.y - paddingY,
              width: bounds.w + paddingX * 2,
              height: bounds.h + paddingY * 2,
              // 顶部导航链接使用直角，其余按钮和正文链接保留原有形状。
              borderRadius: isButton ? elements[0].r : sticky ? 0 : 4,
            }}
            onClick={() => onAction(interaction.action)}
          />
        );
      })}
    </>
  );
}
