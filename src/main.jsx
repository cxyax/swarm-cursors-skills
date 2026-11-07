import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./demo.css";

// 仅独立演示入口创建React根节点，迁入已有项目时无需复制此文件。
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
