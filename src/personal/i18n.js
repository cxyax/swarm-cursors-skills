import { PROFILE } from "./profile.js";

/** 英文教程内容，与中文教程共享链接及步骤结构。 */
export const EN_PROFILE = {
  ...PROFILE,
  role: "Editable source · Collaborative cursors · React",
  description: "Bring collaborative construction to your project.\nInstall the skill and start building.",
  about: [
    "The skill provides editable React components, a scene builder and a scaffold. Cursors draw shapes, type text and continue building as you scroll.",
    "Generated pages need no skill, backend or AI API key at runtime. Scenes are configured in code; existing DOM is not automatically converted.",
  ],
  skills: [
    { name: "Cursor swarm", detail: "Draw, type and duplicate together" },
    { name: "Scroll to build", detail: "Reveal tasks as the page scrolls" },
    { name: "Task dependencies", detail: "Enable interactions when ready" },
    { name: "Custom scenes", detail: "Edit copy, graphics and actions" },
    { name: "React integration", detail: "Standalone or full-screen route" },
    { name: "Editable source", detail: "Keep developing in your project" },
  ],
  projects: [
    { ...PROFILE.projects[0], title: "Install the skill", description: "Install the complete skill\nfor your coding agent.", details: ["Run the installation command and select your coding agents. The -g flag installs it across projects.", "Omit -g to install in the current project. Restart your agent if the skill is not discovered.", "The repository must be public and accessible. The complete skill includes templates, scripts and references."] },
    { ...PROFILE.projects[1], title: "Describe your page", description: "Tell your agent what to build\nand how it should work.", details: ["Invoke $swarm-page-builder in Codex and describe the target directory, content and interactions.", "For an existing React app, specify the route and module directory so the agent can follow existing dependencies.", "Ask for a mobile layout, replay button and custom actions as needed."], command: "Use $swarm-page-builder to create a product page in a new directory. Include features, usage steps and contact, with a mobile layout and replay button." },
    { ...PROFILE.projects[2], title: "Customize & integrate", description: "Adapt scenes and actions\nto fit your own project.", details: ["The skill chooses a standalone project or a full-screen route in an existing React app.", "Edit scene sections, copy, colors and interaction mappings in the generated source; the animation engine remains separate.", "The template uses document scrolling and supports one instance per page. Local scroll containers require adaptation."], command: "Use $swarm-page-builder to add a full-screen demo route to this React project, follow existing dependencies and connect the main button to a host action." },
  ],
};

/** 按场景实体标识提供英文教程文案。 */
export const EN_SCENE_TEXT = {
  "nav-work": "Steps", "nav-about": "About", "nav-stack": "Features", "nav-contact": "Install",
  "hero-title": "Build with\na swarm.", "hero-work-text": "Get started ↗", "hero-contact-text": "Install skill",
  "hero-copy": "Copy install command ↗",
  "hero-note": "Editable source. A page built together, as you explore.",
  "work-title": "From install to creation.", "work-lead": "Three steps to bring the experience into your project.",
  "work-open-0": "View step ↗", "work-open-1": "View step ↗", "work-open-2": "View step ↗",
  "about-title": "How does\nit work?", "about-note-text": "Configure the scene. Make it your own.",
  "stack-title": "Everything you\nneed to build.", "contact-title": "Have a\nquestion?",
  "contact-description": "Questions or ideas?\nGet in touch with the author.", "contact-button-text": "Contact author ↗",
  "footer-home": "Back to top ↑", "footer-replay": "Replay ↻", "footer-copy": "Swarm Cursors Skills · Editable source for your project.",
};

/** 根据所选语言返回教程内容。 */
export function getProfile(language) {
  // 两种语言共享仓库地址和步骤标识。
  return language === "zh" ? PROFILE : EN_PROFILE;
}
