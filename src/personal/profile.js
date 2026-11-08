/** 教程内容及可复制示例，供场景与步骤弹窗共用。 */
export const PROFILE = {
  name: "Swarm Skill",
  role: "可编辑源码 · 多光标施工 · React",
  description: "把协作施工效果带进你的项目，\n从安装到创建页面，只需几个步骤。",
  github: "https://github.com/cxyax/swarm-cursors-skills",
  email: "gaoxin.pro@gmail.com",
  about: [
    "Skill 提供可编辑的 React 组件、场景构建器与脚手架，让光标绘制图形、输入文字，并在滚动时继续施工。",
    "生成的页面无需运行时安装 Skill、后端或 AI API 密钥。场景需通过代码配置，不会自动转换任意现有页面。",
  ],
  skills: [
    { name: "多光标协作", detail: "光标共同绘制、输入和复制" },
    { name: "滚动施工", detail: "随页面滚动展开新的任务" },
    { name: "任务依赖", detail: "施工完成后启用对应交互" },
    { name: "场景定制", detail: "修改文案、图形与点击动作" },
    { name: "React 接入", detail: "独立项目或全屏路由" },
    { name: "源码可编辑", detail: "在自己的项目中继续开发" },
  ],
  projects: [
    {
      title: "安装 Skill", category: "INSTALL", description: "安装完整的 Skill，\n让编码助手在项目中使用。", tags: ["Node.js 22.20+", "Skills CLI"], year: "01",
      details: ["运行安装命令，并选择需要安装的编码助手；添加 -g 后可跨项目使用。", "也可以去掉 -g，在当前项目范围安装。安装完成后，如未发现 Skill，请重启助手。", "仓库需要公开且可访问；完整 Skill 包含模板、脚本与参考文档。"],
      command: "npx skills add cxyax/swarm-cursors-skills --skill swarm-page-builder -g", url: "",
    },
    {
      title: "告诉助手需求", category: "PROMPT", description: "描述页面内容与交互，\n让 Skill 帮你创建场景。", tags: ["Codex", "Prompt"], year: "02",
      details: ["在 Codex 中通过 $swarm-page-builder 调用，并说明目标目录、页面内容和交互。", "对于已有 React 项目，说明路由和目标模块目录，让助手沿用现有依赖。", "可要求适配手机布局、重播按钮和自定义点击行为。"],
      command: "使用 $swarm-page-builder 在新目录创建一个产品介绍页面，包含功能、使用步骤和联系入口，支持手机布局与重播。", url: "",
    },
    {
      title: "定制与接入", category: "CUSTOMIZE", description: "修改场景与交互，\n把效果融入自己的项目。", tags: ["React", "Editable"], year: "03",
      details: ["Skill 会根据项目选择独立项目或现有 React 项目的全屏路由接入方式。", "在生成的源码中调整场景分区、文字、颜色与交互映射；动画引擎保持独立。", "模板使用文档滚动，每页支持一个实例；局部滚动容器需要额外适配。"],
      command: "使用 $swarm-page-builder 为现有 React 项目添加全屏演示路由，沿用已有依赖，并将主按钮连接到宿主操作。", url: "",
    },
  ],
};
