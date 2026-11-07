# Integration

[简体中文](integration.zh-CN.md)

# 1、Standalone project

Copy the template using Python 3 (standard library only). The target must not exist.

```bash
python3 /path/to/swarm-page-builder/scripts/scaffold.py --mode standalone --target /path/to/new-swarm-page
cd /path/to/new-swarm-page
npm install
npm run dev
```

The template uses React 18.3.1 and Vite 8.1.4; Node.js must satisfy `^20.19.0 || >=22.12.0`. The default URL is `http://127.0.0.1:8000/`; use `npm run dev -- --port 8080` if the port is occupied. `src/App.jsx` mounts the component, `src/main.jsx` creates the React root, and `src/demo.css` contains the standalone reset.

# 2、Existing React project

```bash
python3 /path/to/swarm-page-builder/scripts/scaffold.py --mode module --target /path/to/existing-project/src/features/swarm
```

Mount it in a dedicated full-screen route, adjusting paths for the host:

```jsx
import React from "react";
import { SwarmExperience } from "./features/swarm/index.js";
import "./features/swarm/styles/index.css";

/** Render the construction scene in the host route. */
export default function SwarmPage() {
  // The host owns its React root and routing.
  return <SwarmExperience />;
}
```

Do not overwrite the host's entry point, package configuration or Vite configuration. Keep its dependency versions and routing conventions. SSR frameworks must import from a client boundary; wrappers passing `onAction` or `sceneFactory` functions must also be client components. Follow the host framework's global CSS rules.

# 3、Component API

| Prop | Default | Purpose |
| --- | --- | --- |
| `sceneFactory` | `createScene` | Receives a worker-count function and returns `{els,tasks,groups,height}` |
| `interactions` | `PAGE_INTERACTIONS` | Click targets matching scene entity IDs |
| `onAction` | none | Receives `(action, engine)`; synchronously return `true` to handle the action |
| `autoStart` | `false` | Start on initialization instead of scroll or logo click |

`sceneFactory` and `autoStart` are read on first mount. Change the React `key` to rebuild after changing scene, startup mode or replay. Supply matching interactions for custom scenes, or `[]` if there are no click targets. Start asynchronous work inside the handler but return `true` synchronously. See the [Chinese guide](integration.zh-CN.md) for a complete host-action example.

# 4、Constraints

- One instance per document, using `window` scrolling; the route begins at the top and occupies the full width. Avoid outer padding, sidebars, local overflow and transforms that alter fixed positioning.
- The generic scene uses a 1280-wide design canvas and scales down on narrow screens; it is not a responsive local-panel component.
- Mounting scrolls to the top and temporarily changes `history.scrollRestoration`; cleanup restores it and removes listeners and animation frames.
- Rulers and the opening logo are viewport positioned. The built-in dialog locks root scrolling; avoid competing host modals.
- CSS is scoped to `.swarm-experience`, but host global rules can still conflict. Provide a margin-free, unrestricted route container.
- Navigation honors `prefers-reduced-motion`, but the cursor and construction animations do not yet provide complete reduced-motion support.
- The standalone `index.html` loads Inter and JetBrains Mono from Google Fonts. For local fonts, update CSS, `scene/text-metrics.js` and the font preparation list in `hooks/useSwarm.js` together.
- A Vue or HTML host can link to the built standalone page or embed a full-viewport iframe. Explicitly design and validate any cross-frame messaging.
- Built-in downloads and plan dialogs are local demonstrations; real business operations must be implemented by the host.
