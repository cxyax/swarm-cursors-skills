/**
 * 个人主页资料的唯一编辑入口；当前为示例内容，可替换为真实介绍、作品和联系方式。
 * 项目详情与首页卡片共用这些数据，修改后无需分别维护多个页面。
 */
export const PROFILE = {
  name: "程序员阿鑫",
  englishName: "AXIN",
  role: "开发者 · 创造者 · 持续学习的人",
  description: "把技术变成可用的工具，\n把想法做成可以触摸的作品。",
  email: "gaoxin.pro@gmail.com",
  github: "",
  about: [
    "你好，我是阿鑫。喜欢在代码与设计之间来回探索，从一个小问题出发，慢慢做出清晰、好用，也有一点趣味的东西。",
    "我关注完整的体验：从界面上的一次点击，到数据背后的一段逻辑。这里是我的数字工作台，收集作品，也记录持续发生的好奇心。",
  ],
  skills: [
    { name: "Java / Spring", detail: "稳定的服务与清晰的业务逻辑" },
    { name: "React / Vue", detail: "可交互、可维护的网页体验" },
    { name: "Python", detail: "把重复工作交给小工具" },
    { name: "AI Workflow", detail: "探索人与智能工具的协作" },
    { name: "Data / API", detail: "让系统之间顺畅对话" },
    { name: "Interface Craft", detail: "关注细节，也关注使用的人" },
  ],
  projects: [
    {
      title: "Swarm Studio",
      category: "INTERACTIVE EXPERIENCE",
      description: "一群光标，一张画布。\n让页面在浏览中被逐步搭建。",
      tags: ["React", "Animation", "Creative Coding"],
      year: "2026",
      details: [
        "将文字、路径和卡片拆成独立施工任务，由多个光标协作完成。",
        "任务依赖决定绘制顺序：先出现卡片，再输入文字，最后启用点击区域。",
        "加入标尺、锚点和复制过程，让浏览页面也成为一次可观察的创作。",
      ],
      url: "",
    },
    {
      title: "我的数字工作台",
      category: "PERSONAL SPACE",
      description: "留一点空间给作品，\n也留一点空间给新的想法。",
      tags: ["Portfolio", "Responsive", "Design"],
      year: "2026",
      details: [
        "你正在浏览的个人主页，用可编辑资料管理介绍、技能和项目。",
        "桌面采用开放的网格布局，手机使用独立的单列排版。",
        "将项目详情、页面导航和联系入口与施工动画衔接在一起。",
      ],
      url: "",
    },
    {
      title: "Skill Kit",
      category: "DEVELOPER TOOLING",
      description: "把一次灵感封装起来，\n成为下一个项目的起点。",
      tags: ["Codex Skill", "Reusable", "Workflow"],
      year: "2026",
      details: [
        "把可编辑工程整理成技能、模板和迁移脚本，跨项目复用。",
        "通过组件参数注入场景与点击动作，让宿主项目保留自己的业务。",
        "为样式加上独立作用域，减少接入时对已有页面的影响。",
      ],
      url: "",
    },
  ],
};
