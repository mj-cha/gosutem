# 고수템 (GOSUTEM, 가칭) 시범 웹앱

평범한 고수의 가방을 열어 물건마다 담을지 고르고, 새상품·중고·유사템·나눔·스왑 중 합리적인 경로로 구하게 돕는 서비스의 시범 화면입니다.
"쇼핑몰은 사라고만 하지만, 고수는 '이건 사지 마'도 알려줘요."

> 모든 가방·인물·가격·재고·매물·좋아요 수는 **예시**입니다.

## 기술

Vite 8 + React 19 + **HeroUI v3.2.6** (실제 컴포넌트) + Tailwind CSS v4

| 화면 요소 | HeroUI 컴포넌트 |
|---|---|
| 검색 바 · 지역 검색 | SearchField |
| 파우치 분류 · 라벨 탭 · 전체 분류 · PC 소개 | Tabs (가로·세로) |
| 하위 분류 · 조건 칩 · 테마 · 최근/인기 검색어 · 경로 칩 | TagGroup / Tag |
| 어디서 살까요 · 매물 고르기 | RadioGroup / Radio |
| 필터의 고수 목록 | ListBox |
| 모든 팝업(필터·지역·일괄 구매·매물 상세…) | Modal |
| 고수 프로필 미리 보기 | Popover |
| 라벨 뜻 · AI 멘트 · 홈 화면 추가 | Tooltip |
| 후회 · 예산 · 한마디 · 이야기 | DisclosureGroup / Disclosure |
| 예산 | Slider |
| 가방 목록 · 댓글 페이지 | Pagination (sm) |
| 카드 · 상자 | Surface, Separator, Avatar |
| 하트 · 공감 · 스크랩 · 팔로우 | ToggleButton |
| 알림 | Toast |

## 폴더

| 경로 | 내용 |
|---|---|
| `src/data/data.js` | 가방·물건·가격·분류·지역 데이터 (내용 수정은 대부분 여기) |
| `src/lib/logic.js` | 가격 비교·예산 플랜·검색 계산 (화면과 분리) |
| `src/lib/store.jsx` | 앱 상태 (검색·분류·지역·하트·모달) |
| `src/lib/claude.js` | 댓글·인기 검색어 저장소 연결 |
| `src/screens/Home.jsx` | 홈 (내비게이션 바·배너·피드) |
| `src/screens/Bag.jsx` | 가방 상세 |
| `src/modals/Modals.jsx` | 모든 모달 |
| `src/index.css` | 브랜드 색(HeroUI 변수 덮어쓰기)·레이아웃 |
| `public/` | 이미지, 개발맵(`devmap.html`) — 그대로 복사됨 |
| `legacy/index.html` | 이전 버전(v39, 한 파일). 비교용으로만 보관 |
| `docs/` | AI 초안 프롬프트, 제품 설명, 화면 요약 |

## 처음 한 번

[Node.js](https://nodejs.org) 22 이상 설치 후, 저장소 폴더에서:

```
npm install
```

## 미리 보기 (고치면서 보기)

```
npm run dev
```

터미널에 나온 주소(보통 http://localhost:5173)를 브라우저로 열어요. 파일을 저장하면 화면이 바로 바뀌어요.
폰 화면은 브라우저 F12 → 기기 모양 아이콘.

## 고치고 올리기

```
git pull
(수정 → npm run dev 로 확인)
git add -A
git commit -m "무엇을 바꿨는지"
git push
```

## 배포 (Netlify)

Add new site → Import from GitHub → `mj-cha/gosutem`
- `netlify.toml`에 설정이 들어 있어서 따로 적을 것 없음 (Build `npm run build`, Publish `dist`)
- `main`에 push하면 자동 배포. 큰 변경은 브랜치 → Pull Request → Deploy Preview 주소에서 확인 후 합치기

## 알아 둘 것

- **댓글(파우치 이야기)·인기 검색어**는 claude.ai 아티팩트의 공유 저장소를 써요. 로컬·Netlify에서는 안내 문구로 보이고, 인기 검색어는 예시 목록이 떠요. 나머지 화면은 그대로 동작해요.
- 다음 단계: 댓글·검색 저장소를 자체 서버(예: Supabase)로 바꾸기

## 버전

- v40 (2026-10-21) Vite + React + HeroUI 이전 (`feature/react`)
- v39 (2026-10-21) 한 파일 버전 — `legacy/index.html`
