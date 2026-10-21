import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/* 기기 설정이 다크 모드면 html 에 .dark (HeroUI 다크 테마 + 고수템 다크 색) */
const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const applyTheme = () => document.documentElement.classList.toggle("dark", !!(mq && mq.matches));
applyTheme();
if (mq && mq.addEventListener) mq.addEventListener("change", applyTheme);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
