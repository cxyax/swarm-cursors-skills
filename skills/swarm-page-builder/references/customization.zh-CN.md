# 1、源码编辑位置

以下路径以导出后的`src/swarm/`或模块目标目录为根。

| 目标 | 文件 |
| --- | --- |
| 页面组合与高度 | `scene/create-scene.js` |
| 文案、卡片、按钮布局 | `scene/sections/` |
| 字体层级、颜色、画布宽度、标志矢量 | `scene/theme.js` |
| 场景与任务生成 | `scene/scene-builder.js` |
| 工人数量、名字、颜色、工具状态 | `animation/config.js` |
| 调度、巡航、跟随、生成与退出 | `animation/SwarmEngine.js` |
| 描线、拉框、打字与复制动画 | `animation/DrawingEngine.js` |
| 点击入口及所需完成任务 | `interactions/actions.js` |
| 宿主动作拦截和内置事件处理 | `hooks/usePageInteractions.js` |
| 本地文档、方案预览、复制下载 | `components/InteractionDialog.jsx` |

当前模板仍保留Swarm演示页面的品牌与英文示例。迁移到新业务时更换文案、标志、示例价格与配置；不把演示指标写成新项目真实运营数据。

# 2、场景协议

`SceneBuilder`依次收集`elements/tasks/groups`。工厂返回`{els:elements,tasks,groups,height}`，高度必须覆盖所有元素。实体ID在一个场景中唯一。

| 创建方法 | 任务ID | 关键规则 |
| --- | --- | --- |
| `scene.rect(id,x,y,w,h,options)` | `r:id` | 先拉框再填色；options包括`fill/r/stroke/deps` |
| `scene.text(id,x,y,text,style,options)` | `t:id` | options包括`w/align/deps/snap/grow`；宽度影响测量与换行 |
| `scene.path(id,points,options)` | `p:id` | 钢笔锚点顺序决定路径；options包括`stroke/sw/closed/deps` |
| `scene.guide(id,axis,pos,taskY)` | `g:id` | 从标尺拖出辅助线；文本通过`snap`引用 |
| `scene.duplicate(groupId,ids,copies)` | `d:groupId:0`起 | 元素副本从`id~1`起；被替换文字另有`e:id~1`任务 |

文字依赖卡片完成的例子：先用`const cardTask = scene.rect(...)`取得任务ID，再把`{deps:[cardTask]}`传入文字方法。依赖列表不得形成循环或引用不存在的任务，否则该任务不会执行。

`duplicate`的`edits`数组按源组内文字实体的声明顺序对应，不包含矩形。副本要等待复制任务全部完成后才替换内容，点击入口必须等待自己副本的复制及最终文字修改完成。

# 3、点击协议

每个交互定义包含：

```js
{
  id: "demo-button",
  elements: ["demo-button", "demo-label"],
  after: ["r:demo-button", "t:demo-label"],
  label: "Open the configuration guide",
  style: InteractionStyle.BUTTON,
  action: { type: ActionType.DIALOG, kind: DialogKind.DOCS },
}
```

点击层从实体当前边界计算位置，复用正文或吸顶导航容器的缩放，不额外叠加`stick`或滚动偏移。不要靠`vis`或`shown === text`提前启用：文字结束输入后可能继续吸附，副本开始拖动时已经可见。

导航副本`nav0~1`对应`d:nav:0`和`e:nav0~1`，没有`t:nav0~1`任务。定价副本还要等方案名称替换完成，防止卡片仍显示旧方案时被点击。

内置动作支持`START`、`SCROLL`、`DIALOG`；`CUSTOM`保留给宿主。`SCROLL`的`target`是场景元素ID，省略时回到顶部。宿主扩展动作时通过`onAction`同步返回`true`接管；不必往引擎内混入业务请求。

# 4、动画约束

引擎使用生成器逐帧推进，React展示层不直接调度工人。`engine.step(delta)`使用秒；每个实例只维护一个动画循环。卸载时取消RAF和全部监听，避免路由重复进入后出现多组工人。

实体是可变对象。文字、几何或可见性变化后需要更新`v`，渲染组件通过单独的版本快照跳过未变化的实体。调整主题或文字测量时，保持Canvas与CSS字体一致。

`WORKER_LIMITS.INITIAL`为初始数，`BASE`参与保留人数，`FOLLOW`参与跟随阶段扩增，`MAXIMUM`限制施工阶段的动态规模。固定18个或持续缓慢巡航属于调度行为定制，需要一起检查`step()`、`advanceWorkers()`、`flock()`、`makeCursor()`和`idle()`，不能只修改一个常量。

原场景包含导航、页脚和内置弹窗。只替换一个区块时保留其ID可减少接线变更；整页替换时显式传入新的`sceneFactory`和`interactions`，并按新内容调整页面高度。
