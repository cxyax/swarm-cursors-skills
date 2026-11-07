# Scene and interaction customization

[简体中文](customization.zh-CN.md)

# 1、Source locations

Paths are relative to exported `src/swarm/` or the module target.

| Goal | File |
| --- | --- |
| Page composition and height | `scene/create-scene.js` |
| Content and layout | `scene/sections/` |
| Colors, typography and canvas dimensions | `scene/theme.js` |
| Scene and task construction | `scene/scene-builder.js` |
| Worker counts and appearance | `animation/config.js` |
| Scheduling, following and movement | `animation/SwarmEngine.js` |
| Drawing, typing and duplication | `animation/DrawingEngine.js` |
| Click targets and dependencies | `interactions/actions.js` |
| Host action handling | `hooks/usePageInteractions.js` |
| Local dialogs and downloads | `components/InteractionDialog.jsx` |

Replace the generic template's Swarm branding, example pricing and copy when adapting it. Do not present demonstration metrics as real business data.

# 2、Scene protocol

`SceneBuilder` gathers elements, tasks and groups. The scene factory returns `{els: elements, tasks, groups, height}`; height must cover all elements and entity IDs must be unique.

| Method | Task ID | Use |
| --- | --- | --- |
| `scene.rect(id,x,y,w,h,options)` | `r:id` | Draw and fill a rectangle; options include `fill`, `r`, `stroke`, `deps` |
| `scene.text(id,x,y,text,style,options)` | `t:id` | Type text; options include `w`, `align`, `deps`, `snap`, `grow` |
| `scene.path(id,points,options)` | `p:id` | Draw ordered anchors; options include `stroke`, `sw`, `closed`, `deps` |
| `scene.guide(id,axis,pos,taskY)` | `g:id` | Drag a guide from the ruler, referenced by text `snap` |
| `scene.duplicate(groupId,ids,copies)` | `d:groupId:0` onward | Copy entities with suffixes starting at `~1`; edited copy text uses `e:id~1` |

Use returned task IDs in `deps`; dependencies must exist and must not form cycles. Duplicate `edits` correspond to source text entities in declaration order, excluding rectangles. Copies wait for duplication before text replacement; their interaction must wait for both duplication and final text edits.

# 3、Interaction protocol

An interaction defines `id`, `elements`, completion tasks in `after`, an accessible `label`, a style and an action. The click layer derives bounds from entities and uses the correct scaling. Do not enable it based only on visibility or shown text: snapping and copying may still be in progress. Navigation copy `nav0~1` waits on `d:nav:0` and `e:nav0~1`, not `t:nav0~1`.

Built-in actions are `START`, `SCROLL` and `DIALOG`; `CUSTOM` is for the host. `SCROLL.target` names a scene entity; omitting it scrolls to the top. Return `true` synchronously from `onAction` to take over an action.

# 4、Animation invariants

The engine advances generators using seconds in `engine.step(delta)` and maintains one animation loop per instance. Clean up RAF and listeners on unmount. Mutable entities update their `v` via `markChanged()` so renderers refresh. Keep Canvas and CSS font metrics aligned.

`WORKER_LIMITS.INITIAL`, `BASE`, `FOLLOW` and `MAXIMUM` all affect worker count. A fixed count or continued idle cruising requires coordinated changes to `step()`, `advanceWorkers()`, `flock()`, `makeCursor()` and `idle()`. Preserve stable IDs when replacing one section; for a whole new page supply a new factory and interactions and adjust the scene height.
