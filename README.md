# Swarm Cursors Skills

![Swarm Cursors Skills logo](public/logo.svg)

English | [简体中文](README.zh-CN.md)

**Build a page with a swarm of cursors, directly in your own project.**

`swarm-page-builder` is a reusable AI skill with editable React source, a scene builder, and a scaffolding script. It recreates the collaborative construction experience inspired by [DhvanilPatel/swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors). The tutorial page in this repository is a demo built with the skill.

[Live demo](https://cxyax.github.io/swarm-cursors-skills/) · [Repository](https://github.com/cxyax/swarm-cursors-skills) · [Skill](skills/swarm-page-builder/SKILL.md)

The demo URL becomes available after GitHub Pages is configured and the deployment workflow succeeds.

# 1、How it works

The reference project is a Chrome extension that snapshots a page and reconstructs it. This skill instead creates editable components, scenes, animation tasks, and interactions in your own React project. Visitors see the animation directly in the page, without installing an extension.

Cursors move together to draw boxes and paths, type text, pull guides, and duplicate elements. Scrolling reveals new construction tasks; interactions become available when their associated tasks finish. You can build a standalone React + Vite page or integrate a full-screen route into an existing React app. The generated page does not depend on the installed skill, a backend, or an AI API key at runtime.

Scenes must be configured in code: arbitrary existing DOM is not automatically snapshotted. The template uses document scrolling and supports one instance per page; embedding it in a separately scrolling panel requires additional adaptation. Features of the reference extension such as sound and playback speed are not guaranteed by this template.

# 2、Install the skill

The complete `skills/swarm-page-builder/` folder is required, including its scripts, references, and template.

**One-command installation**

With Node.js 22.20 or later, run the following command and select the coding agents to install into:

```bash
npx skills add cxyax/swarm-cursors-skills --skill swarm-page-builder -g
```

This uses the [skills CLI](https://github.com/vercel-labs/skills), installs the complete skill in your user scope, and makes it available across projects. For a project-only installation, run the command in that project and omit `-g`. To install directly into Codex without prompts, use:

```bash
npx skills add cxyax/swarm-cursors-skills --skill swarm-page-builder -g -a codex -y
```

Replace `codex` with another [supported agent](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) as needed. Skills are installed into agent applications, not directly into a model; availability depends on the application. The GitHub repository must be published and accessible before these commands work. Restart the agent if it does not discover the skill.

**Install with Codex**

```text
Use $skill-installer to install the skill from:
https://github.com/cxyax/swarm-cursors-skills
Skill path: skills/swarm-page-builder
```

**Install manually on macOS or Linux**

```bash
git clone https://github.com/cxyax/swarm-cursors-skills.git
cd swarm-cursors-skills
mkdir -p "$HOME/.agents/skills"
test ! -e "$HOME/.agents/skills/swarm-page-builder" && \
  cp -R skills/swarm-page-builder "$HOME/.agents/skills/swarm-page-builder"
```

For a project-only installation, copy the complete folder to the project's `.agents/skills/swarm-page-builder/`. If a skill with that name already exists, compare and back up your changes before replacing it.

Invoke `$swarm-page-builder` in Codex. If it does not appear, restart Codex. See the [official skill documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and installation locations. Other agents can use the same skill folder according to their own installation rules.

# 3、Create a page with the skill

Provide the target directory, content and interaction requirements in your prompt.

**New project**

```text
Use $swarm-page-builder to create a personal portfolio in a new my-portfolio directory.
Implement swarm-cursors-style collaborative construction directly in my project source.
Include an introduction, projects, skills and contact details. Keep content in a data file,
use a single-column mobile layout, and add a replay button.
```

**Existing React project**

```text
Use $swarm-page-builder to add a full-screen demo route to this React project.
Place the source in src/features/swarm and follow the existing routing and dependencies.
Adapt the page content into construction tasks and connect the main button to a host action.
```

**Modify an existing scene**

```text
Use $swarm-page-builder to turn the construction page into a product introduction.
Include features, usage steps and contact information. Reuse the animation engine and
update the scene layout, copy and interaction mapping in the project source.
```

The skill inspects the target project before choosing standalone or module integration. Cursor count and mobile layout may require changes to both the scene and scheduling logic.

# 4、Copy the source directly

Python 3 is required; the script uses only the standard library. Run these commands from the repository root. The destination must not already exist.

**Standalone project**

```bash
python3 skills/swarm-page-builder/scripts/scaffold.py \
  --mode standalone --target ../my-swarm-page
cd ../my-swarm-page
npm install
npm run dev
```

Open `http://127.0.0.1:8000/` and scroll or click the center mark to start. This generates the generic template. The personal content, 18-cursor configuration and mobile layout in this repository's demo are separate customizations.

**Existing React project**

```bash
python3 skills/swarm-page-builder/scripts/scaffold.py \
  --mode module --target ../your-react-app/src/features/swarm
```

Mount the component in a dedicated full-screen route:

```jsx
import React from "react";
import { SwarmExperience } from "./features/swarm/index.js";
import "./features/swarm/styles/index.css";

/** Render the construction experience on a dedicated page. */
export default function SwarmPage() {
  // The host retains control of the app entry point and routing.
  return <SwarmExperience autoStart />;
}
```

Adjust import paths to your file location. The script does not modify the host's dependencies, entry point or routes. Use document scrolling without an offset, sidebar, transformed ancestor or local scroll container. In SSR frameworks, mount from a client component.

Add `--dry-run` to inspect the copy plan. The [integration guide](skills/swarm-page-builder/references/integration.md) covers component props, host action handling and other constraints..

# 5、Run the demo

Requirements: Node.js `^20.19.0 || >=22.12.0` and npm. The scaffolding script also requires Python 3.

```bash
git clone https://github.com/cxyax/swarm-cursors-skills.git
cd swarm-cursors-skills
npm ci
npm run dev
```

Open `http://127.0.0.1:5174/`. The demo starts in English; use the language button in the bottom-right dock to switch to Chinese. Switching language restarts the construction. Copy the install command from the first screen, scroll to explore the guide, contact the author, or replay the animation.

If the port is occupied, use `npm run dev -- --port 5175`. To build and preview locally:

```bash
npm run build
npm run preview
```

The build output is `dist/`; the preview uses `http://127.0.0.1:5174/`. Vite preview is intended for local preview only.

# 6、Customize

| Purpose | Demo file |
| --- | --- |
| Chinese profile, email, skills and projects | [`src/personal/profile.js`](src/personal/profile.js) |
| English profile and scene copy | [`src/personal/i18n.js`](src/personal/i18n.js) |
| Desktop and mobile scene layouts | [`src/personal/scene.js`](src/personal/scene.js) |
| Scene colors and typography | [`src/personal/theme.js`](src/personal/theme.js) |
| Navigation and action mappings | [`src/personal/actions.js`](src/personal/actions.js) |
| Project and contact dialogs | [`src/personal/PersonalDialog.jsx`](src/personal/PersonalDialog.jsx) |
| Cursor counts, names and states | [`src/swarm/animation/config.js`](src/swarm/animation/config.js) |
| Page title, description and fonts | [`index.html`](index.html) |

Edit the tutorial content and contact email in your fork. For the generic template, edit `src/swarm/scene/sections/`; the [scene and interaction guide](skills/swarm-page-builder/references/customization.md) documents its protocol. Supply matching `interactions` when using a custom `sceneFactory`; change the React `key` to rebuild an instance when changing scenes or replaying.

The demo and skill template are separate snapshots. Changes to the root `src/` do not automatically update `skills/swarm-page-builder/assets/template/`. Fonts are loaded from Google Fonts by default and can be replaced with local fonts.

# 7、Deploy to GitHub Pages

The [workflow](.github/workflows/deploy.yml) installs dependencies, builds the demo and deploys `dist/` when changes are pushed to `main`. It can also be started manually.

1. Push the repository to the `main` branch of `https://github.com/cxyax/swarm-cursors-skills.git`.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. In **Actions → Deploy Demo to GitHub Pages**, wait for success. If Pages was enabled after the first push, select **Run workflow**.
4. Open **https://cxyax.github.io/swarm-cursors-skills/**.

The workflow uses the Pages base path when building, including for forks and custom domains. A fork's usual URL is `https://<username>.github.io/<repository>/`; update the repository and demo links in your README. Deployment uses the Actions `GITHUB_TOKEN`; your repository must allow Actions and meet the Pages requirements. See the [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages).

# 8、Repository layout

```text
skills/swarm-page-builder/   Installable skill, scripts, references and source template
src/personal/                Demo content, localization, scenes and interactions
src/swarm/                   Demo animation module
public/                      Logo and demo assets
.github/workflows/deploy.yml GitHub Pages workflow
SOURCE.md                    Source and provenance notes
README.md                    English guide
README.zh-CN.md              Chinese guide
```

# 9、Star history

[![Star history chart](https://api.star-history.com/svg?repos=cxyax/swarm-cursors-skills&type=Date)](https://star-history.com/#cxyax/swarm-cursors-skills&Date)

The chart is provided by Star History and requires the repository to be public before its data is available.

# 10、Credits and license status

Inspired by [DhvanilPatel/swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors), which credits the original visual and motion design to [Joel Califa's Swarm](https://califa.github.io/swarm-site/). This project is not affiliated with either project.

This project is distributed under the [MIT License](LICENSE). The reference repository states that it has no license; the MIT license does not grant rights to third-party material. See [SOURCE.md](SOURCE.md) for the unresolved provenance details.
