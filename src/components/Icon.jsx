import { SPRITE } from "./sprite.js";

/* 화면 전체에서 한 번만 그리는 아이콘 묶음 */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: SPRITE }} />
  );
}

/* <Icon id="search" /> → 스프라이트의 #i-search 를 씀 */
export function Icon({ id, className = "" }) {
  const ref = id.startsWith("i-") ? id : "i-" + id;
  return (
    <svg className={"icon " + className} aria-hidden="true">
      <use href={"#" + ref} />
    </svg>
  );
}
