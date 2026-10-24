import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/400.css"; /* 배너 영문: 굵고 각진 글꼴 (앱에 같이 묶음) */
import "./index.css";
import App from "./App.jsx";

/* 다크 모드면 html 에 .dark (HeroUI 다크 테마 + 고수템 다크 색)
   - data-theme="dark|light" 가 붙어 있으면(claude.ai 보기 화면 설정) 그걸 따르고, 없으면 기기 설정 */
const root = document.documentElement;
/* 설정에서 고른 화면 모드(밝게·어둡게)가 있으면 먼저 적용 */
try { const saved = localStorage.getItem("gosutem-theme"); if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved); } catch { /* 저장소를 못 써도 기기 설정으로 */ }
const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const applyTheme = () => {
  const t = root.getAttribute("data-theme");
  root.classList.toggle("dark", t === "dark" || (t !== "light" && !!(mq && mq.matches)));
};
applyTheme();
if (mq && mq.addEventListener) mq.addEventListener("change", applyTheme);
new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
