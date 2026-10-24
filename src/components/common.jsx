/* 여러 화면에서 같이 쓰는 작은 조각들 */
import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, Pagination } from "@heroui/react";
import { Icon } from "./Icon.jsx";
import { PROMOS, T } from "../data/data.js";
import { useApp } from "../lib/store.jsx";

/* 고수 얼굴: HeroUI Avatar
   - 프로필 사진(src)이 있으면 사진, 사진을 안 정했거나 못 불러오면 이니셜(Fallback) + 고수별 색 */
export function GosuAvatar({ av, color, src, alt = "", size = "sm", className = "" }) {
  return (
    <Avatar size={size} className={"av " + className} style={{ "--av": color }}>
      {src ? <Avatar.Image src={src} alt={alt} /> : null}
      <Avatar.Fallback>{av}</Avatar.Fallback>
    </Avatar>
  );
}
/* 아바타 + 숫자 배지 (HeroUI Badge.Anchor) — 0이면 배지 없이 아바타만 */
export function AvatarBadge({ n, label, variant = "soft", ...av }) {
  return (
    <Badge.Anchor>
      <GosuAvatar {...av} />
      {n > 0 && <Badge className="min-w-5 font-semibold tabular-nums" color="accent" size="sm" variant={variant} aria-label={label}>{n}</Badge>}
    </Badge.Anchor>
  );
}
export function Who({ b, sub, size = "sm" }) {
  return (
    <span className="who sm">
      <GosuAvatar av={b.av} color={b.avc} src={b.photo} alt={b.name} size={size} />
      <span className="who-t"><span className="name">{b.name}</span><span className="meta">{sub ?? b.meta}</span></span>
    </span>
  );
}

/* 라벨 배지 (알짜템 3 …) */
export function TBadge({ k, n }) {
  return <span className="tb" style={{ "--tc": T[k].c }}>{T[k].name}{n != null ? " " + n : ""}</span>;
}

export function DeckStrip({ b }) {
  return (
    <div className="deck-strip">
      <span className="deck-badge"><Icon id="spark" />인기 파우치 덱</span>
      <span className="deck-stat">
        <span><Icon id="eye" /><b className="num">{b.views}</b><span className="vh">조회수</span></span>
        <span><Icon id="bookmark" /><b className="num">{b.scraps.toLocaleString("ko-KR")}</b><span className="vh">스크랩</span></span>
      </span>
    </div>
  );
}

/* 가방 사진 + 좋아요/싫어요 */
export function Photo({ b }) {
  const { react, setReact } = useApp();
  const r = react[b.id], up = b.likes + (r === "up" ? 1 : 0), dn = b.dislikes + (r === "down" ? 1 : 0);
  const tog = (v) => (e) => { e.stopPropagation(); e.preventDefault(); setReact((s) => ({ ...s, [b.id]: s[b.id] === v ? null : v })); };
  return (
    <div className={"photo" + (b.img ? " has-img" : "")}>
      {b.img ? <img src={b.img} alt={b.imgAlt || b.title} width="720" height="720" decoding="async" />
        : <><span className="ex-badge ex">예시</span><div className="ph"><Icon id="camera" /><span>고수 가방 사진 자리<br />촬영 후 실물 사진으로 바뀌어요</span></div></>}
      <div className="reacts">
        <button type="button" className="react up" aria-pressed={r === "up"} aria-label={"좋아요 " + up} onClick={tog("up")}><Icon id="up" /><span className="num">{up}</span></button>
        <button type="button" className="react down" aria-pressed={r === "down"} aria-label={"싫어요 " + dn} onClick={tog("down")}><Icon id="down" /><span className="num">{dn}</span></button>
      </div>
    </div>
  );
}

/* HeroUI Pagination (sm) */
export function Pager({ page, total, onChange, label }) {
  if (total <= 1) return null;
  return (
    <Pagination size="sm" className="pager" aria-label={label}>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => onChange(page - 1)}>
            <Pagination.PreviousIcon /><span>이전</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: total }, (_, k) => k + 1).map((n) => (
          <Pagination.Item key={n}>
            <Pagination.Link isActive={n === page} onPress={() => onChange(n)} aria-label={n + "페이지"}>{n}</Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next isDisabled={page === total} onPress={() => onChange(page + 1)}>
            <span>다음</span><Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}

/* 메인 배너: 포스터가 옆으로 넘어감 (4.2초마다, 손대면 멈춤) */
export function Promo() {
  const { go, openModal } = useApp();
  const track = useRef(null), paused = useRef(false);
  const [idx, setIdx] = useState(0);
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const goTo = (i) => { const t = track.current; if (!t) return; t.scrollTo({ left: i * t.clientWidth, behavior: reduce ? "auto" : "smooth" }); setIdx(i); };
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (paused.current || document.visibilityState === "hidden") return;
      setIdx((i) => { const n = (i + 1) % PROMOS.length; const t = track.current; if (t) t.scrollTo({ left: n * t.clientWidth, behavior: "smooth" }); return n; });
    }, 4200);
    return () => clearInterval(id);
  }, [reduce]);
  const onScroll = useRef(null);
  return (
    <div className="promo" aria-roledescription="carousel"
      onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)} onBlur={() => (paused.current = false)} onTouchStart={() => (paused.current = true)}>
      <div className="promo-track" tabIndex={0} ref={track}
        onScroll={(e) => { clearTimeout(onScroll.current); const t = e.currentTarget; onScroll.current = setTimeout(() => setIdx(Math.round(t.scrollLeft / Math.max(1, t.clientWidth))), 80); }}>
        {PROMOS.map((p, i) => {
          const SlideTag = p.open ? "button" : "div";
          return (
            <SlideTag key={i} className={"slide" + (p.img ? " has-img" : "") + (i === idx ? " on" : "")} style={{ "--bg": p.bg, "--fg": p.fg }}
              type={p.open ? "button" : undefined}
              role="group" aria-roledescription="slide" aria-label={i + 1 + " / " + PROMOS.length}
              data-open={p.open || undefined} onClick={p.open ? () => go(p.open) : undefined}>
              {p.img ? <img src={p.img} alt="" width="720" height="720" loading={i === 0 ? "eager" : "lazy"} decoding="async" /> : <span className="sl-bgword" aria-hidden="true">GOSU</span>}
              <div className="sl-txt">
                <span className="sl-tag">{p.tag}</span>
                <b>{p.big.split("<br>").map((l, k) => <span key={k}>{k > 0 && <br />}{l}</span>)}</b>
                <span className="sl-small">{p.small}</span>
                {p.act && <button type="button" className="sl-cta" onClick={(e) => { e.stopPropagation(); openModal("supply"); }}>고수로 신청하기</button>}
              </div>
            </SlideTag>
          );
        })}
      </div>
      <div className="promo-dots">
        {PROMOS.map((_, i) => <button key={i} type="button" className={"dot" + (i === idx ? " on" : "")} aria-label={i + 1 + "번째 배너"} onClick={() => goTo(i)} />)}
      </div>
    </div>
  );
}
