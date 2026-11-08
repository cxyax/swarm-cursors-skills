# Swarm Cursors Skills

![Swarm Cursors Skills 标志](public/logo.svg)

[English](README.md) | 简体中文

**通过 Skill，让 AI 在你自己的工程中编写代码，实现多光标协作“搭建”网页的效果。**

效果参考 [DhvanilPatel/swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors)：多个光标一起拉框、描线、输入文字、拖出辅助线、复制卡片，随着滚动逐步完成页面。本项目将这一类体验落实为工程内可编辑、可维护的 React 源码，由你自己的页面直接运行。

本仓库主要提供 **`swarm-page-builder` Skill**，包含接入指引、源码模板和迁移脚本。根目录的教程页面是使用该 Skill 制作的 **Demo**，展示场景定制、业务交互与手机布局。

**[在线演示](https://cxyax.github.io/swarm-cursors-skills/)** · **[GitHub 仓库](https://github.com/cxyax/swarm-cursors-skills)** · **[Skill 入口](skills/swarm-page-builder/SKILL.zh-CN.md)**

> 演示地址使用 GitHub Pages，首次发布需完成下文的 Pages 设置，并等待部署工作流成功。

# 1、实现方式

| 项目 | 接入方式 | 页面如何施工 |
| --- | --- | --- |
| [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors) | Chrome 扩展 | 读取当前网页 DOM，生成快照后播放重建过程 |
| 本仓库的 `swarm-page-builder` | 在自己的工程中使用 Skill 生成、修改代码 | 通过场景、任务依赖、动画引擎和 React 组件直接实现页面 |

你可以用这个 Skill 创建独立的 React + Vite 页面，也可以接入已有 React 项目的全屏路由。生成的文案、布局、光标行为和点击动作都留在工程文件中，可以继续修改、构建和部署；访问者打开网站即可看到效果，无需安装浏览器扩展。

现有模板包含光标巡航与跟随、拉框、文字输入、路径描线、辅助线和复制施工。点击区域在对应任务完成后启用，业务按钮可以交给宿主项目处理。页面运行不依赖 Skill 安装目录，也不需要后端或 AI API Key。

模板按场景配置绘制，接入现有页面时需要把内容与布局适配为场景任务；目前不提供任意 DOM 自动快照功能。使用文档滚动，一个页面挂载一个实例，局部滚动面板需要额外适配。参考扩展的音效、倍速等功能不属于当前模板的完整承诺。

# 2、安装 Skill

以下以 Codex 为例。请安装完整的 `skills/swarm-page-builder/` 文件夹，脚本、参考说明和模板都在其中。

**一条命令安装**

准备 Node.js 22.20 或更高版本，运行以下命令，并按提示选择要安装到哪些编码 Agent：

```bash
npx skills add cxyax/swarm-cursors-skills --skill swarm-page-builder -g
```

命令使用 [skills CLI](https://github.com/vercel-labs/skills)，将完整 Skill 安装到用户目录，供多个项目使用。仅安装到当前项目时，在目标项目目录运行并去掉 `-g`。如果只安装到 Codex 且不需要交互确认，可以使用：

```bash
npx skills add cxyax/swarm-cursors-skills --skill swarm-page-builder -g -a codex -y
```

也可以把 `codex` 替换成其他[受支持的 Agent](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)。Skill 安装在支持它的 Agent 客户端中，实际支持情况取决于客户端。上述命令需要 GitHub 仓库已经发布且可以访问；安装后如果客户端没有发现技能，请重启客户端。

**方式一：让 Codex 安装**

在 Codex 对话中输入：

```text
使用 $skill-installer 安装这个 GitHub 仓库中的 Skill：
https://github.com/cxyax/swarm-cursors-skills
Skill 路径：skills/swarm-page-builder
```

**方式二：手动安装**

以下命令适用于 macOS / Linux，目标 Skill 目录必须尚不存在：

```bash
git clone https://github.com/cxyax/swarm-cursors-skills.git
cd swarm-cursors-skills
mkdir -p "$HOME/.agents/skills"
test ! -e "$HOME/.agents/skills/swarm-page-builder" && \
  cp -R skills/swarm-page-builder "$HOME/.agents/skills/swarm-page-builder"
```

如果只想在某个项目中使用，将完整文件夹放入目标项目的 `.agents/skills/swarm-page-builder/`。已有同名 Skill 时，先比较并备份自己的修改，避免重复安装或直接覆盖。

安装后在 Codex 中输入 `$swarm-page-builder` 选择技能；未出现时重启 Codex。安装位置与发现机制见 [OpenAI 官方 Skill 文档](https://learn.chatgpt.com/docs/build-skills)。其他支持本地 Skill 的 Agent 可按各自的安装规则使用同一文件夹。

# 3、使用 Skill 创建页面

在目标工作区中调用 Skill，说明页面内容、输出目录和交互需求。

**创建独立页面：**

```text
使用 $swarm-page-builder，在当前工作区的新目录 my-portfolio 中创建个人主页。
实现 swarm-cursors 风格的多光标协作施工效果，代码直接放在我的工程中。
包含个人介绍、作品、技术栈和联系方式，文案放在独立数据文件中。
手机使用单列布局，并提供施工重播按钮。
```

**接入已有 React 项目：**

```text
使用 $swarm-page-builder，为当前 React 项目增加独立的全屏演示路由。
源码模块放到 src/features/swarm，沿用现有路由与依赖版本。
把页面内容适配为施工场景，将主按钮接入宿主业务动作。
```

**继续修改页面：**

```text
使用 $swarm-page-builder，把施工页面改成产品介绍页。
包含介绍、功能、使用步骤和联系入口，复用现有动画引擎。
请在工程源码中修改场景文案、布局和点击映射。
```

Skill 会先检查工程，再选择独立项目或模块方式。固定光标数量、手机布局等需求需要连同场景与调度逻辑一起适配。模板输出后可以继续通过 AI 修改，也可以直接编辑源码。

# 4、直接使用脚本复制源码

不安装 Skill 也能使用模板。需要 Python 3，脚本仅使用标准库；以下命令从本仓库根目录执行，输出目录必须尚不存在。

**生成独立项目：**

```bash
python3 skills/swarm-page-builder/scripts/scaffold.py \
  --mode standalone --target ../my-swarm-page
cd ../my-swarm-page
npm install
npm run dev
```

默认访问 `http://127.0.0.1:8000/`，滚动页面或点击中心标志开始施工。生成的是通用模板；根目录教程 Demo 的文案、18 个光标配置和手机单列布局属于另行定制的示例。

**复制到已有 React 项目：**

```bash
python3 skills/swarm-page-builder/scripts/scaffold.py \
  --mode module --target ../your-react-app/src/features/swarm
```

然后在宿主的独立全屏页面中挂载：

```jsx
import React from "react";
import { SwarmExperience } from "./features/swarm/index.js";
import "./features/swarm/styles/index.css";

/** 显示自动开始施工的独立演示页面。 */
export default function SwarmPage() {
  // 宿主继续管理入口与路由，组件负责施工场景。
  return <SwarmExperience autoStart />;
}
```

导入路径按文件位置调整；模块脚本不会自动修改入口、路由或依赖。路由使用文档滚动，避免外层独立滚动、偏移、侧栏或 `transform`。SSR 框架需从客户端组件边界接入。

任一复制命令添加 `--dry-run` 可查看计划。组件参数、业务动作接管和接入边界见[接入说明](skills/swarm-page-builder/references/integration.zh-CN.md)。

# 5、本地运行 Demo

环境要求：Node.js `^20.19.0 || >=22.12.0`、npm；使用脚手架时另需 Python 3。

```bash
git clone https://github.com/cxyax/swarm-cursors-skills.git
cd swarm-cursors-skills
npm ci
npm run dev
```

打开 `http://127.0.0.1:5174/`。页面默认显示英文，可用右下角的“中文 / EN”按钮切换语言；切换时会重新播放施工动画。首页支持复制安装命令，向下滚动可查看教程和联系作者，右下角可重新播放。

端口冲突时运行 `npm run dev -- --port 5175`。需要自行检查生产构建时执行：

```bash
npm run build
npm run preview
```

构建产物位于 `dist/`，本地预览地址仍为 `http://127.0.0.1:5174/`。`npm run preview` 仅用于本地预览。

# 6、修改内容与动画

| 内容 | 根目录 Demo 中的位置 |
| --- | --- |
| 姓名、介绍、邮箱、技能和作品 | [`src/personal/profile.js`](src/personal/profile.js) |
| 桌面与手机场景布局 | [`src/personal/scene.js`](src/personal/scene.js) |
| 配色与文字样式 | [`src/personal/theme.js`](src/personal/theme.js) |
| 导航、按钮及卡片动作 | [`src/personal/actions.js`](src/personal/actions.js) |
| 项目详情和联系弹窗 | [`src/personal/PersonalDialog.jsx`](src/personal/PersonalDialog.jsx) |
| 光标数量、名称及状态 | [`src/swarm/animation/config.js`](src/swarm/animation/config.js) |
| 页面标题、描述与字体加载 | [`index.html`](index.html) |

Fork 后可修改 Demo 中的教程内容和联系邮箱。

Skill 导出的通用模板从 `src/swarm/scene/sections/` 修改页面内容，详细协议见[场景与交互定制](skills/swarm-page-builder/references/customization.zh-CN.md)。自定义 `sceneFactory` 时同时传入匹配的 `interactions`；更换场景或重播可通过 React 的 `key` 重建实例。

模板与 Demo 是独立源码快照：修改根目录 `src/` 不会自动更新 Skill。需要向 Skill 用户交付的改动，应同步到 `skills/swarm-page-builder/assets/template/`。默认字体通过 Google Fonts 加载，也可替换为本地字体。

# 7、部署到 GitHub Pages

本仓库提供[部署工作流](.github/workflows/deploy.yml)，推送到 `main` 后自动安装依赖、构建 Demo 并发布 `dist/`，也支持在 Actions 页面手动运行。

首次托管步骤：

1. 将代码推送至 `https://github.com/cxyax/swarm-cursors-skills.git` 的 `main` 分支。
2. 打开仓库 **Settings → Pages → Build and deployment**，将 **Source** 选择为 **GitHub Actions**。
3. 打开 **Actions → Deploy Demo to GitHub Pages**，等待工作流成功；首次推送时若尚未开启 Pages，设置后点击 **Run workflow** 重新部署。
4. 访问 **https://cxyax.github.io/swarm-cursors-skills/**。

工作流使用 Pages 返回的站点路径设置 Vite `base`，适配仓库子路径。Fork 后开启自己仓库的 Pages 即可，地址通常为 `https://<用户名>.github.io/<仓库名>/`；请同步替换 README 中的仓库和演示链接。

部署使用 GitHub Actions 提供的 `GITHUB_TOKEN`，无需另配个人 Token。仓库需允许 Actions 运行并满足 Pages 开通条件。配置参考 [Vite 官方 GitHub Pages 指南](https://vite.dev/guide/static-deploy.html#github-pages)。

# 8、仓库结构

```text
swarm-cursors-skills/
├── skills/swarm-page-builder/   # 主要交付：可独立安装的 Skill
│   ├── SKILL.md                 # 使用入口与适用范围
│   ├── agents/openai.yaml      # Codex 展示信息
│   ├── scripts/scaffold.py     # 独立项目 / React 模块复制脚本
│   ├── references/             # 接入、定制与来源说明
│   └── assets/template/        # 随 Skill 分发的源码模板
├── src/personal/               # 教程 Demo 场景与交互
├── src/swarm/                  # Demo 动画模块
├── public/                     # Demo 静态资源
├── .github/workflows/deploy.yml # GitHub Pages 自动部署
├── SOURCE.md                   # 来源与维护说明
└── README.md
```

# 9、Star 趋势

[![Star 趋势图](https://api.star-history.com/svg?repos=cxyax/swarm-cursors-skills&type=Date)](https://star-history.com/#cxyax/swarm-cursors-skills&Date)

趋势图由 Star History 提供；仓库公开后才会显示其数据。

# 10、致谢与许可状态

效果参考 [DhvanilPatel/swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors)，其项目说明将原始视觉与动画设计归功于 [Joel Califa 的 Swarm](https://califa.github.io/swarm-site/)。感谢这些项目提供的创意与参考。

本项目采用 [MIT 许可证](LICENSE)，通过 Skill 提供工程内的源码接入方式，与参考项目没有官方关联。参考仓库目前未声明开源许可证；本项目的 MIT 许可证不授予第三方素材的权利，源码关系仍待确认。详细来源与许可边界见 [SOURCE.zh-CN.md](SOURCE.zh-CN.md)。
