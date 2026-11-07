import React from "react";
import { SwarmExperience } from "./swarm/index.js";
import "./swarm/styles/index.css";

/**
 * 演示可迁移组件的最小接入；业务项目可将同样的组件放到独立全屏路由。
 * @returns {React.ReactElement} 默认施工页面。
 */
export default function App() {
  // 使用默认场景和点击交互，业务定制可传sceneFactory、interactions和onAction。
  return <SwarmExperience />;
}
