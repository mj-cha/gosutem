# 고수템 (GOSUTEM, 가칭) 시범 웹앱

평범한 고수의 가방을 열어 물건마다 담을지 고르고, 새상품·중고·유사템·나눔·스왑 중 합리적인 경로로 구하게 돕는 서비스의 시범 화면입니다.
"쇼핑몰은 사라고만 하지만, 고수는 '이건 사지 마'도 알려줘요."

> 모든 가방·인물·가격·재고·매물·좋아요 수는 **예시**입니다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `src/app.html` | 앱 원본 (HTML·CSS·JS 한 파일). 여기만 고치면 됩니다 |
| `src/devmap.html` | 개발맵 원본 (메뉴별 메모·피드백 로그) |
| `public/img/` | 이미지 (인턴 파우치 움직이는 사진 등) |
| `vendor/bootstrap-5.3.3.min.css` | 부트스트랩 CSS (빌드 때 앱 안에 넣음) |
| `tools/build.py` | 빌드 스크립트 |
| `docs/` | AI 초안 프롬프트, 제품 설명(PRODUCT.md), 화면 요약 |
| `dist/` | 빌드 결과 (git에 안 올림) |

## 실행하기 (처음 한 번)

1. Python 3.8 이상이 있어야 해요. 터미널에서 `python --version` 으로 확인.
2. 이 폴더에서 빌드:
   ```
   python tools/build.py
   ```
3. 미리 보기 서버 켜기:
   ```
   python -m http.server 8000 --directory dist
   ```
4. 브라우저에서 `http://localhost:8000` 열기. 폰 화면은 개발자 도구(F12) → 기기 모양 아이콘으로 확인.

## 고치고 확인하는 순서

1. `src/app.html` 수정
2. `python tools/build.py`
3. 브라우저 새로고침
4. 괜찮으면 커밋: `git add -A && git commit -m "무엇을 바꿨는지"` → `git push`

## 알아 둘 것

- **댓글(파우치 이야기)·인기 검색어**는 claude.ai 아티팩트의 공유 저장소(`window.claude.use("db")`)를 써요. 로컬 미리 보기에서는 "claude.ai에서 열면 보여요"로 나오고 나머지 화면은 그대로 동작해요. 정식 서비스로 옮길 때는 이 부분을 자체 서버(예: Firebase·Supabase)로 바꿔야 해요.
- 부트스트랩 JS는 jsdelivr CDN(5.3.3)에서 불러와요. 인터넷이 없으면 드롭다운이 안 열려요.
- 시범 앱 공개 주소(claude.ai 아티팩트): 고수템 · 개발맵 — 링크는 claude.ai 사이드바/아티팩트 목록에서 확인.

## 버전

- v39 (2026-10-21) claude.ai 아티팩트 버전과 같은 상태에서 시작
