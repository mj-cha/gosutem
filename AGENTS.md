# AGENTS.md — 고수템 저장소에서 일하는 AI(Gemini Jules·Gemini CLI·Codex 등) 규칙

자세한 협업 흐름은 `docs/AI-COLLAB.md`. 이 파일은 AI 도구가 자동으로 읽는 요약본이에요.

## 기술
- Vite 8 + React 19 + HeroUI v3.2.6(`@heroui/react`) + Tailwind CSS v4, 자바스크립트(JSX). 타입스크립트 아님.
- 설치 `npm ci` → 확인 `npm run build` (오류 없이 끝나야 PR 가능)

## 브랜치·PR
- 작업 기준 브랜치: `feature/react` (PR의 base도 `feature/react`)
- 브랜치 이름: Gemini `ai/gemini-<화면이름>`, GPT/Codex `ai/gpt-<화면이름>`
- 한 PR = 화면 하나 또는 작업 하나. 작게 자주.
- 합치기·충돌 정리·배포는 Claude가 해요. 직접 `feature/react`·`main`에 push 하지 않아요.

## 고치면 안 되는 공통 파일
`src/App.jsx`, `src/store.jsx`(있으면), `src/index.css`, `src/data/*`, `src/lib/*`, `package.json`
→ 바꿔야 하면 고치지 말고 PR 설명에 "이렇게 바꿔 달라"고 적어요.
(예외: 작업 지시에 그 파일을 고치라고 적혀 있을 때)

## 화면 코드 규칙
1. 새 화면은 `src/screens/<화면이름>.jsx` 하나, `export default` 컴포넌트 하나. 작은 부품은 같은 파일 안에.
2. UI는 HeroUI v3 점 표기 조립식(`<Tabs><Tabs.ListContainer><Tabs.List>…`). HeroUI v2(NextUI) 문법, `HeroUIProvider`, MUI·shadcn·Bootstrap 금지.
3. 색은 CSS 변수만: `--accent --ink --muted --surface --ground --line --t-must --t-share --t-used --t-swap --t-no --off`. Tailwind는 레이아웃(flex·grid·gap)에만.
4. 데이터는 `src/data/data.js`에서 import. 새 예시 데이터는 화면 파일 맨 위 `const` + `/* 예시 */` 주석.
5. 폰 너비 390px 기준, 가로 스크롤 금지, 좌우 여백 `className="pad"`.
6. 글은 쉬운 한국어 해요체. "생존"·"필수" 같은 과장 금지. 가격·인물·재고는 "예시" 표시. 실제 브랜드 효능 문구·이모지 장식 금지.
7. 새 npm 패키지 추가 금지(꼭 필요하면 PR 설명에 이유).
8. 접근성: 아이콘 버튼 `aria-label`, 클릭은 `<button>`(div·span onClick 금지), 이미지 `alt`+`width/height`, `...` 대신 `…`.
9. 폰 탭 주의: 한 번 탭으로 목록이 열리고 바로 확정되는 흐름 금지 — 목록 선택은 임시 선택 + 확정 버튼.

## PR 설명에 쓸 것
만든 것 / 쓴 HeroUI 컴포넌트 / 공통 파일에 필요한 변경 / `npm run build` 결과 / 확인 못 한 것
