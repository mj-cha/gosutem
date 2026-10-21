# 고수템 (GOSUTEM, 가칭) 시범 웹앱

평범한 고수의 가방을 열어 물건마다 담을지 고르고, 새상품·중고·유사템·나눔·스왑 중 합리적인 경로로 구하게 돕는 서비스의 시범 화면입니다.
"쇼핑몰은 사라고만 하지만, 고수는 '이건 사지 마'도 알려줘요."

> 모든 가방·인물·가격·재고·매물·좋아요 수는 **예시**입니다.

## 구조 (빌드 없음)

| 경로 | 내용 |
|---|---|
| `index.html` | 앱 전체 (HTML·CSS·JS 한 파일). 여기만 고치면 됩니다 |
| `devmap.html` | 개발맵 (메뉴별 메모·피드백 로그) |
| `img/` | 이미지 |
| `docs/` | AI 초안 프롬프트, 제품 설명, 화면 요약 |

부트스트랩 5.3.3 CSS·JS는 jsdelivr CDN에서 불러와요. 설치할 것 없음.

## 미리 보기

- 가장 쉬운 방법: `index.html` 더블클릭
- 추천: VS Code 확장 **Live Server** 설치 → `index.html` 우클릭 → Open with Live Server (저장하면 자동 새로고침)
- 폰 화면: 브라우저 F12 → 기기 모양 아이콘

## 고치고 올리기

```
git pull
(index.html 수정 → 브라우저에서 확인)
git add -A
git commit -m "무엇을 바꿨는지"
git push
```

## 배포 (Netlify)

Add new site → Import from GitHub → `mj-cha/gosutem`
- Build command: 비워 두기
- Publish directory: `/` (저장소 그대로)
- `main`에 push하면 자동 배포. 큰 변경은 브랜치를 만들어 Pull Request → Deploy Preview 주소에서 확인 후 합치기

## 알아 둘 것

- **댓글(파우치 이야기)·인기 검색어**는 claude.ai 아티팩트의 공유 저장소를 써서, 로컬·Netlify에서는 "준비 중" 안내로 보여요. 나머지 화면은 그대로 동작해요.
- claude.ai 아티팩트 버전은 부트스트랩 CSS를 파일 안에 넣어서 따로 게시해요(Claude가 처리).

## 일정

- 2026-10-24: Vite + React + HeroUI로 이전 (HeroUI 실제 컴포넌트 사용, 댓글·검색 저장소를 자체 서버로 바꿀 준비)

## 버전

- v39 (2026-10-21) claude.ai 아티팩트 v39와 같은 상태
