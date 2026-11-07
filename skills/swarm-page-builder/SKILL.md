---
name: swarm-page-builder
description: Build editable swarm-cursors-style collaborative construction pages directly in a new or existing React project, including cursor movement, scroll-triggered drawing, typing, duplication, rulers and interactions. Uses configured scenes; does not snapshot arbitrary DOM or provide a browser extension.
---

# Swarm page builder

[简体中文](SKILL.zh-CN.md)

Use the included editable source to implement a multi-cursor construction page in the user's project. The effect is inspired by [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors); the page runs its own React components, scheduling engine, scene builder and interactions. It does not need the skill, the original site's compressed scripts, or an AI service at runtime.

# 1、Choose an integration

Inspect the target stack, routing, package manager and files first; follow its conventions.

- **New project:** Use `standalone` as described in [integration](references/integration.md).
- **Existing React project:** Use `module` in a new feature directory and mount a full-screen route. The script does not change the host's entry point, dependencies or routes.
- **Vue or plain HTML:** Use a standalone page or full-viewport iframe, or implement a native rendering and lifecycle adapter around the scene/task protocol. JSX is not directly portable.
- **Decoration or a local panel:** This is not an off-the-shelf component for that use. Adapt the coordinate, scrolling and rendering logic to the requested scope.

The template uses the browser document as its scroll container, with one instance per page. It does not support a nested scroll container, offset or transformed parent. Mount SSR applications from a client component; the engine is created only in a browser effect.

# 2、Copy the source

Replace `<skill-dir>` with the directory containing this file. The target must be a new directory.

```bash
python3 <skill-dir>/scripts/scaffold.py --mode standalone --target /path/to/new-project
python3 <skill-dir>/scripts/scaffold.py --mode module --target /path/to/existing-project/src/features/swarm
```

Add `--dry-run` to inspect the plan. The script copies local files only: it does not download, install, build, commit or deploy. If the target exists, stop and choose a new directory or manually merge reviewed changes. Do not copy `node_modules`, original-site build artifacts, machine settings or local absolute paths. Existing projects retain their own dependency versions and package manager.

# 3、Adapt the page

Read [scene and interaction customization](references/customization.md) as needed. Edit scene sections, theme and click actions before changing animation scheduling. With a custom scene, pass matching `interactions`; remove hotspots for deleted elements.

`SwarmExperience` accepts a scene factory, interactions, an action callback and automatic start. Content, colors, tasks and graphics remain editable. Use the host `onAction` to implement real business behavior; local demos must not claim a purchase, application or AI task has been performed.

- Keep CSS and Canvas font, size and line-height measurements consistent.
- Enable hotspots only after their background, text, copy and replacement tasks complete. Duplicate element suffixes start at `~1`, while duplicate task indices start at `0`.
- Mutable entities use version `v`; call `markChanged()` after mutation.
- `INITIAL`, `BASE`, `FOLLOW` and `MAXIMUM` jointly control cursor numbers; a fixed count needs corresponding scheduling changes.
- Module CSS is scoped under `.swarm-experience`. The host owns its reset; do not copy the standalone `demo.css` globally into an existing project.

# 4、Deliver

Follow the target repository's allowed verification scope. When browser verification is authorized, inspect scroll construction, navigation, dialogs and focus restoration, copy/download behavior and cleanup after routing. If only static review is allowed, say so; do not claim runtime validation.

Describe the output files, startup or route entry, customization points and any unverified behavior. Preserve the [provenance](references/provenance.md); do not represent the template as the original author's unpublished source or grant rights on their behalf.
