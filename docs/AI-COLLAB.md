# 여러 AI가 같이 만들 때 규칙 (Claude · Gemini · GPT)

저장소 하나를 같이 쓰고, **AI마다 브랜치를 따로** 만들어 작업한 뒤 Pull Request로 합쳐요.
합치기(merge)와 충돌 정리는 Claude가 맡아요.

## 흐름

1. 맡길 화면을 정해요 (예: "내 가방 화면", "고수 신청 화면")
2. 그 AI에게 아래 **붙여 넣을 안내문**을 주고 작업시켜요
3. 결과를 브랜치에 올려요
   - GitHub에 직접 올릴 수 있는 도구(ChatGPT Codex, Gemini의 Jules·Gemini CLI 등)라면 브랜치 + PR까지 맡겨요
   - 채팅으로 코드만 주는 경우: 파일을 저장해서 `ai/gemini-화면이름` 같은 브랜치로 직접 올리거나, Claude에게 파일을 첨부해 주면 Claude가 넣어요
4. Claude가 PR을 확인 → 공통 규칙에 맞게 다듬고 → Netlify 미리 보기 확인 후 `main`에 합쳐요

## 브랜치 이름

| 누가 | 이름 |
|---|---|
| Claude | `feature/…` |
| Gemini | `ai/gemini-화면이름` |
| GPT | `ai/gpt-화면이름` |

한 브랜치에는 화면 하나만. 작게 자주 올릴수록 합치기 쉬워요.

## 붙여 넣을 안내문 (Gemini·GPT에게 그대로 복사)

```
너는 GitHub 저장소 mj-cha/gosutem 의 화면 하나를 만든다.
기술: Vite 8 + React 19 + HeroUI v3.2.6(@heroui/react) + Tailwind CSS v4. 자바스크립트(JSX), 타입스크립트 아님.

[만들 화면]
(여기에 화면 설명)

[꼭 지킬 것]
1. 새 파일은 src/screens/<화면이름>.jsx 하나로 만들고, export default 로 컴포넌트 하나를 내보낸다.
   작은 부품이 필요하면 같은 파일 안에 둔다. 공통 파일(App.jsx, store.jsx, index.css, data.js, logic.js)은 고치지 않는다.
   고쳐야 하면 고치지 말고, PR 설명에 "이렇게 바꿔 달라"고 적는다.
2. UI는 HeroUI v3 컴포넌트를 쓴다 (Button, Tabs, TagGroup, Modal, Surface, Avatar, Badge, Alert, Accordion 등).
   v3 문법은 점 표기 조립식이다. 예: <Tabs><Tabs.ListContainer><Tabs.List><Tabs.Tab id="a">…<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer></Tabs>
   HeroUI v2(NextUI) 문법이나 HeroUIProvider 는 쓰지 않는다. 다른 UI 라이브러리(MUI, shadcn, Bootstrap)도 쓰지 않는다.
3. 색은 직접 쓰지 말고 CSS 변수만 쓴다: --accent(파랑 #2F6DB5), --ink(글자), --muted(흐린 글자), --surface(카드),
   --ground(배경), --line(테두리), 라벨색 --t-must --t-share --t-used --t-swap --t-no, 할인 --off.
   Tailwind는 레이아웃(flex, grid, gap)에만 쓰고, 색은 bg-[var(--surface)] 처럼 변수로.
   다크 모드는 변수가 알아서 바뀌니 따로 만들지 않는다.
4. 데이터는 src/data/data.js 에서 import 해서 쓴다 (BAGS, T, CH, CATS 등). 새 예시 데이터가 필요하면
   화면 파일 맨 위에 const 로 두고 "예시" 라고 주석을 단다.
5. 폰 화면(너비 390px) 기준. 가로 스크롤이 생기면 안 된다. 좌우 여백은 className="pad".
6. 글은 쉬운 한국어 존댓말 해요체. "생존", "필수" 같은 과장 표현 금지. 가격·인물·재고는 전부 "예시"로 표시.
7. 새 npm 패키지는 추가하지 않는다. 꼭 필요하면 PR 설명에 이유를 적는다.
8. 끝나면 npm run build 가 오류 없이 되는지 확인한다.

[넘겨줄 때]
- 브랜치: ai/<너의이름>-<화면이름>
- PR 설명에: 만든 화면, 쓴 HeroUI 컴포넌트, 공통 파일에 필요한 변경(있으면), 확인 못 한 것
```

## Claude가 합칠 때 하는 일

- 화면을 `App.jsx` 라우팅(#해시)과 하단 탭에 연결
- 공통 색·간격·문구 규칙에 맞게 다듬기, 중복 부품은 `src/components`로 빼기
- 빌드·폰/PC/다크 모드 확인 후 합치기

## 같이 볼 문서

- `docs/PRODUCT.md` 제품 설명 · `docs/surface-brief.md` 화면 요약 · `docs/ai-draft-prompt-v1.0.md` 글 쓰는 규칙
