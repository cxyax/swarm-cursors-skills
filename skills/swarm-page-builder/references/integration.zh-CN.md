# 1、独立项目

模板资源在`assets/template/`。使用Python3标准库复制，无需安装脚本依赖：

```bash
python3 /path/to/swarm-page-builder/scripts/scaffold.py --mode standalone --target /path/to/new-swarm-page
cd /path/to/new-swarm-page
npm install
npm run dev
```

独立模板采用React18.3.1与Vite8.1.4。Node要求为`^20.19.0 || >=22.12.0`。默认地址`http://127.0.0.1:8000/`；目标环境端口冲突时使用`npm run dev -- --port 8080`。

`src/App.jsx`演示如何挂载组件，`src/main.jsx`只负责独立页面的React根节点。`src/demo.css`包含独立站的页面reset，模块CSS从`src/swarm/styles/index.css`加载。

# 2、已有React项目

将目标指定为已有项目中尚不存在的功能目录：

```bash
python3 /path/to/swarm-page-builder/scripts/scaffold.py --mode module --target /path/to/existing-project/src/features/swarm
```

复制后按宿主现有路由方式注册一个全屏页面，组件接入示意：

```jsx
import React from "react";
import { SwarmExperience } from "./features/swarm/index.js";
import "./features/swarm/styles/index.css";

/**
 * 显示独立的施工演示路由。
 * @returns {React.ReactElement} 全屏施工页面。
 */
export default function SwarmPage() {
  // 宿主框架继续拥有React根节点和路由，模块只负责当前页面内容。
  return <SwarmExperience />;
}
```

不要复制独立模板的`main.jsx`、`createRoot()`、`package.json`或Vite配置覆盖宿主。已有React项目沿用其React与构建工具；当前模板以React18.3.1整理，其他版本应由目标项目按其规则验收。JSX扩展名为`.jsx`，业务项目无需为了本组件切换语言或包管理器。

SSR框架从客户端边界引用组件。`SwarmExperience.jsx`声明`"use client"`，引擎在effect里才访问DOM；定义并传递`onAction`或`sceneFactory`函数的宿主包装组件也要处于客户端边界，不能直接从服务端组件传递普通函数。宿主若要求全局CSS集中导入，按其布局入口规则导入本模块样式。框架的路由文件约定需要先查目标工程，不套用其他项目版本的写法。

# 3、组件接口

| 属性 | 默认值 | 用途 |
| --- | --- | --- |
| `sceneFactory` | 内置`createScene` | 返回`{els,tasks,groups,height}`的场景工厂，接收施工人数查询函数 |
| `interactions` | 内置`PAGE_INTERACTIONS` | 与当前场景实体ID对应的点击入口数组 |
| `onAction` | 未设置 | 接收`(action,engine)`的宿主同步动作拦截器；返回`true`表示已处理，否则执行内置行为 |
| `autoStart` | `false` | 为真时初始化完成即施工；默认通过滚动或点击中心标志启动 |

`sceneFactory`和`autoStart`只在首次挂载时读取。更换场景、改变启动方式或重播时使用React的`key`重建实例，以清理旧任务与弹窗状态。自定义场景同时传入自己的`interactions`，没有点击入口时传`[]`。

宿主接管现有按钮示例：

```jsx
"use client";

import React from "react";
import {
  SwarmExperience, ActionType, DialogKind, PAGE_INTERACTIONS,
} from "./features/swarm/index.js";
import "./features/swarm/styles/index.css";

/** 宿主业务动作使用独立枚举，避免和动画内置动作混用。 */
const HostAction = Object.freeze({ SIGN_UP: "sign-up" });
// 原弹窗入口改为业务跳转时同步替换动作描述，避免保留弹窗的辅助技术提示。
const interactions = PAGE_INTERACTIONS.map((interaction) =>
  interaction.action.type === ActionType.DIALOG &&
  interaction.action.kind === DialogKind.QUICK_START
    ? {
        ...interaction,
        label: "Start building · create an account",
        action: { type: ActionType.CUSTOM, name: HostAction.SIGN_UP },
      }
    : interaction
);

/**
 * 接管“开始使用”的点击，把路由控制交还宿主应用。
 * @param {object} action 当前点击动作。
 * @returns {boolean} 为真表示宿主已处理，阻止默认弹窗。
 */
function handleAction(action) {
  // 此处示范跳转到宿主的实际注册页面，目标路径由接入项目确认。
  if (action.type === ActionType.CUSTOM && action.name === HostAction.SIGN_UP) {
    window.location.assign("/signup");
    return true;
  }
  return false;
}

/**
 * 挂载具有宿主点击行为的施工页面。
 * @returns {React.ReactElement} 独立路由页面。
 */
export default function SwarmPage() {
  // 事件接管不需要修改动画引擎或场景渲染组件。
  return <SwarmExperience interactions={interactions} onAction={handleAction} />;
}
```

异步业务处理可以在回调内部启动，但同步返回`true`声明已接管；不要直接传递返回Promise的拦截器并期待它阻止默认行为。

# 4、接入边界

- 使用`window`作为唯一滚动容器；一个文档中只挂载一个实例。
- 全屏路由从文档顶部开始、占满宽度，不包含宿主额外页头、侧栏或外层padding。根元素不能有`transform`、局部overflow滚动或改变fixed定位的包含块。
- 画布设计宽度为1280，窄屏整体等比缩放。它不是任意局部容器自适应组件。
- 页面挂载会回到顶部，并临时接管`history.scrollRestoration`；卸载会清理监听、动画帧并恢复该设置。需要保留宿主滚动位置时，先定制`useSwarm`，不能只改样式。
- 标尺和开场标志按视口定位。内置弹窗暂时锁定根节点滚动，避免与宿主另一个模态窗口并发打开。
- 模块CSS以`.swarm-experience`隔离；宿主仍需为专用路由提供无margin、无外部宽度限制的页面容器。宿主强制全局样式仍可能影响模块内部元素，冲突严重时选择独立页或iframe。
- 导航滚动支持`prefers-reduced-motion`；光标和施工动作尚没有完整的减少动态效果模式，不宣称已覆盖全部动画无障碍需求。

# 5、字体与非React项目

独立模板的`index.html`保留Inter与JetBrains Mono的Google Fonts引用。模块模式不会自动注入外部字体，宿主可加载相同字体，也可换成本地字体；换字体时同步修改`scene/text-metrics.js`、`hooks/useSwarm.js`的字体准备列表及相关CSS。

Vue、普通HTML等项目可以将独立模板构建后部署成同域独立页面，再由路由跳转进入；也可使用占满整个视口的iframe，滚动发生在iframe自身文档中。不要把iframe外层滚动误当作内部动画滚动。需要与宿主业务通信时，另行明确消息协议并校验来源。

没有后端要求时不新增API、密钥、订阅服务或账号系统。内置代码下载与方案弹窗都是本地演示，接入真实业务必须由宿主实现。
