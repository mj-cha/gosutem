#!/usr/bin/env python3
"""고수템 빌드: src/app.html 의 /*BOOTSTRAP_CSS*/ 자리에 부트스트랩 CSS를 넣어 dist/index.html 을 만든다.
실행: python tools/build.py   (Python 3.8 이상, 추가 설치 없음)
"""
import re, shutil, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / "src" / "app.html").read_text(encoding="utf-8")
css = (ROOT / "vendor" / "bootstrap-5.3.3.min.css").read_text(encoding="utf-8")
css = re.sub(r"/\*# sourceMappingURL=.*?\*/", "", css)
dist = ROOT / "dist"
dist.mkdir(exist_ok=True)
(dist / "index.html").write_text(src.replace("/*BOOTSTRAP_CSS*/", css), encoding="utf-8")
shutil.copytree(ROOT / "public" / "img", dist / "img", dirs_exist_ok=True)
shutil.copyfile(ROOT / "src" / "devmap.html", dist / "devmap.html")
print("빌드 완료 → dist/index.html, dist/devmap.html, dist/img/")
