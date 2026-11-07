import { PROFILE } from "./profile.js";

/** 英文演示资料，与中文资料保持相同的数据结构。 */
export const EN_PROFILE = {
  ...PROFILE,
  name: "Axin",
  role: "Developer · Creator · Lifelong learner",
  description: "Turning technology into useful tools,\nand ideas into things you can touch.",
  about: [
    "Hi, I'm Axin. I explore the space between code and design, turning small questions into clear, useful and playful things.",
    "I care about the whole experience, from a click on the screen to the logic behind it. This workspace collects projects and ongoing curiosities.",
  ],
  skills: PROFILE.skills.map((skill, index) => ({ ...skill, detail: [
    "Reliable services and clear business logic", "Interactive, maintainable web experiences", "Automating repetitive work", "Exploring human and AI collaboration", "Connecting systems through data", "Crafting thoughtful interfaces",
  ][index] })),
  projects: PROFILE.projects.map((project, index) => ({
    ...project,
    title: ["Swarm Studio", "My Digital Workspace", "Skill Kit"][index],
    description: ["A swarm of cursors, one canvas.\nA page built as you explore.", "Room for projects,\nand room for new ideas.", "Turn a spark of inspiration\ninto a starting point for the next project."][index],
    details: [
      ["Text, paths and cards become tasks shared by multiple cursors.", "Dependencies build cards before text and activate interactions afterwards.", "Rulers, anchors and duplication make the creative process visible."],
      ["A personal homepage with editable profile, skills and projects.", "An open desktop grid and a dedicated mobile layout.", "Project details and contact actions join the construction animation."],
      ["Reusable skills, templates and migration scripts for future projects.", "Inject scenes and actions while retaining the host application's behavior.", "Scoped styles reduce conflicts with the surrounding application."],
    ][index],
  })),
};

/** 按场景实体标识提供英文文案，资料字段由英文资料对象提供。 */
export const EN_SCENE_TEXT = {
  "nav-work": "Work", "nav-about": "About", "nav-stack": "Stack", "nav-contact": "Contact",
  "hero-title": "Ideas into\nreality.", "hero-work-text": "Explore my work ↗", "hero-contact-text": "Say hello",
  "hero-note": "Building a small digital world, one line of code at a time.",
  "work-title": "Ideas made real.", "work-lead": "From curiosity to something you can explore.",
  "work-open-0": "View project ↗", "work-open-1": "View project ↗", "work-open-2": "View project ↗",
  "about-title": "Stay curious.\nBuild with care.", "about-note-text": "Make it useful, then make it distinct.",
  "stack-title": "The right tools\nfor the job.", "contact-title": "Let's make\nsomething good.",
  "contact-description": "An idea, a question,\nor just a hello.", "contact-button-text": "Say hello ↗",
  "footer-home": "Back to top ↑", "footer-replay": "Replay ↻", "footer-copy": "© 2026 Axin · Made with curiosity.",
};

/** 根据所选语言返回个人资料。 */
export function getProfile(language) {
  // 中英文资料共享链接和项目标识，确保切换不改变实际业务动作。
  return language === "zh" ? PROFILE : EN_PROFILE;
}
