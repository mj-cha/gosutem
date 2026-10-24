/* 고수의 가방 상세: 머리 카드 → 물건마다 고르기 → (후회 · 예산 · 한마디 · 이야기) → 담기 바 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, Button, Disclosure, DisclosureGroup, Label, Popover, Radio, RadioGroup, Separator, Slider,
  Surface, Tabs, Tag, TagGroup, TextArea, ToggleButton, Tooltip,
} from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { DeckStrip, GosuAvatar, Pager, Photo, Who } from "../components/common.jsx";
import { ART, CH, CHORDER, PCH, SRC, SRC_DEF, T, TORDER } from "../data/data.js";
import {
  ago, budgetPlan, chPrice, costOf, defaultPlan, kfmt, listingsOf, maxBudget, minNew, mk, optionsOf, optPrice, simList, usedOK, won,
} from "../lib/logic.js";
import { regionLabel, useApp, useScraps } from "../lib/store.jsx";
import { TitleSplit } from "./Home.jsx";
import { TAGS, talkAdd, talkDelete, talkItems, useHub, useProfiles } from "../lib/claude.js";

const reduceMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const stockOf = (it, ch) => (ch === "nw" ? it.nw.length : ch === "used" ? (usedOK(it) ? it.used.n : 0) : ch === "sim" ? it.sim.length : it.share);

/* ---------- 상단 바 ---------- */
export function BagTop({ b }) {
  const { go, scrap, setScrap, toast } = useApp();
  const on = !!scrap[b.id];
  const share = () => {
    const u = location.href.split("#")[0] + "#" + b.id;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(() => toast("가방 링크를 복사했어요."), () => toast("주소창 링크를 길게 눌러 복사해 주세요."));
    else toast("주소창 링크를 길게 눌러 복사해 주세요.");
  };
  return (
    <>
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="뒤로" onPress={() => go("home")}><Icon id="back" /></Button>
      <h1 className="bar-title">고수의 가방</h1>
      <ToggleButton isIconOnly variant="ghost" className="icon-btn" aria-label="스크랩" isSelected={on}
        onChange={(v) => { setScrap((s) => ({ ...s, [b.id]: v })); toast(v ? "스크랩했어요. 저장 탭에 모여요." : "스크랩을 취소했어요."); }}>
        <Icon id="bookmark" />
      </ToggleButton>
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="공유하기" onPress={share}><Icon id="share" /></Button>
    </>
  );
}

/* ---------- 고수 이름 → 작은 프로필 카드 (HeroUI Popover) ---------- */
function GosuPopover({ b }) {
  const { follow, setFollow, openModal, toast } = useApp();
  const [open, setOpen] = useState(false);
  const f = !!follow[b.id], base = b.followers || Math.round((b.likes || 100) * 1.7), emp = b.items.reduce((s, it) => s + it.emp, 0);
  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Popover.Trigger className="who-btn" aria-label={b.name + " 프로필 미리 보기"}>
        <Who b={b} sub={"@" + (b.handle || b.id)} />
      </Popover.Trigger>
      <Popover.Content placement="bottom start" offset={10}>
        <Popover.Dialog className="pop-card" aria-label={b.name + " 프로필"}>
          <Popover.Arrow />
          <div className="pop-head">
            <Who b={b} sub={"@" + (b.handle || b.id)} size="md" />
            <ToggleButton size="sm" isSelected={f} variant={f ? "default" : "default"} className={f ? "" : "bg-[var(--ink)] text-[var(--surface)]"}
              onChange={(v) => { setFollow((s) => ({ ...s, [b.id]: v })); toast(v ? b.name + "님을 팔로우했어요. 새 가방이 올라오면 알려 드려요. (시범)" : "팔로우를 취소했어요."); }}>
              {f ? "팔로잉" : "팔로우"}
            </ToggleButton>
          </div>
          <p className="pop-bio">{b.meta}. {b.bio || "제일 잘 산 건 " + b.best + ", 다시는 안 살 건 " + b.rebuy + "."}</p>
          <div className="pop-stats">
            <span><b className="num">{kfmt(b.following || 128)}</b>팔로잉</span>
            <span><b className="num">{kfmt(base + (f ? 1 : 0))}</b>팔로워</span>
            <span><b className="num">{kfmt(emp)}</b>공감</span>
          </div>
          <button type="button" className="link-btn" style={{ justifySelf: "start" }} onClick={() => { setOpen(false); openModal("profile", { b }); }}>프로필 전체 보기</button>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

/* 라벨 이름에 마우스·포커스를 두면 뜻을 보여 줌 (HeroUI Tooltip) */
function Tip({ text, children, className = "" }) {
  return (
    <Tooltip delay={200} closeDelay={100}>
      <Tooltip.Trigger><span tabIndex={0} className={className}>{children}</span></Tooltip.Trigger>
      <Tooltip.Content showArrow><Tooltip.Arrow />{text}</Tooltip.Content>
    </Tooltip>
  );
}
function LabelLine({ it }) {
  return (
    <div className="lbl">
      <Tip text={T[it.t].def}>{T[it.t].name}</Tip>
      <SrcBadge it={it} />
      {it.ai ? <Tip text="AI가 고수 인터뷰로 먼저 쓰고, 고수가 확인한 멘트예요" className="ai-tag"><svg aria-hidden="true"><use href="#i-spark" /></svg>AI 멘트</Tip> : null}
    </div>
  );
}
/* 출처 배지: 내돈내산은 흐리게, 협찬·제휴는 눈에 띄게 (숨기지 않고 표시) */
function SrcBadge({ it }) {
  const k = it.src || "own";
  const tip = it.srcNote || SRC_DEF[k];
  return <Tip text={tip} className={"src-tag src-" + k}>{SRC[k]}</Tip>;
}
const Thumb = ({ it, i }) => (
  <div className="thumb"><span className="no num">{i + 1}</span><svg viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[it.art] }} /></div>
);
const Strike = ({ base, p, off }) => (<><s className="num">{won(base)}</s>{p ? <><em className="num">-{off}%</em>{won(p)}</> : "무료"}</>);

/* 판매처 목록(새상품·유사템은 쇼핑몰, 중고·나눔은 고수템 안 매물로 이어짐) */
function Offers({ it, ch, region, onStage }) {
  const base = minNew(it);
  if (ch === "nw") return it.nw.map((x) => (
    <div className="offer" key={x[0]}><span><span className="m">{x[0]}</span> <span className="num">{won(x[1])}</span></span><a href={mk(x[0], it.q)} target="_blank" rel="noopener">바로가기<Icon id="out" className="icon-sm" /></a></div>
  ));
  if (ch === "used") {
    if (!it.used.n) return <div className="offer none">지금은 고수 중고 매물이 없어요.</div>;
    const p = listingsOf(it, "used", region)[0].p;
    return (
      <div className="offer"><span><span className="m">고수 중고 {it.used.n}개</span> · 최저 <Strike base={base} p={p} off={Math.round((1 - p / base) * 100)} />
        {it.cons ? (it.used.exp ? <><br /><span className="exp ok">유통기한 {it.used.exp}까지 확인</span></> : <><br /><span className="exp">유통기한이 안 적혀 있어요 · 예산 플랜에서 빼요</span></>) : null}</span>
        <button type="button" className="link-btn" onClick={() => onStage("used")}>매물 보기</button></div>
    );
  }
  if (ch === "sim") return it.sim.length ? simList(it).map((s) => (
    <div className="offer" key={s.n}><span><span className="m">{s.n}</span> <Strike base={base} p={s.p} off={Math.round((1 - s.p / base) * 100)} /></span><a href={mk("네이버쇼핑", s.n)} target="_blank" rel="noopener">찾아보기<Icon id="out" className="icon-sm" /></a></div>
  )) : <div className="offer none">비슷한 유사템이 아직 없어요.</div>;
  return it.share ? <div className="offer"><span><span className="m">고수 나눔 {it.share}개</span> · 가까운 순으로 연결</span><button type="button" className="link-btn" onClick={() => onStage("share")}>나눔 보기</button></div>
    : <div className="offer none">지금은 고수 나눔이 없어요.</div>;
}

/* 같은 값을 다시 눌러도 동작하게: 라디오를 감싼 칸을 눌렀을 때 현재 값이면 직접 처리 */
const again = (cur, v, fn) => (e) => { if (e.target.tagName !== "INPUT" && cur === v) fn(v); };

/* ---------- 물건 한 줄 ---------- */
function ItemRow({ b, i, ctx }) {
  const it = b.items[i], key = b.id + ":" + i;
  const { plan, picks, empOn, exp, stage, lpick, open, next, region } = ctx;
  const on = picks[i], sel = plan[i], base = minNew(it);
  const compact = exp[key] !== true && (sel != null || (it.t === "no" && !on));
  const cls = (x) => "item" + x + (ctx.next === key ? " next" : "");

  if (compact) {
    let sum;
    if (sel === "skip") sum = <span className="pick-chip skip">안 담음</span>;
    else if (sel == null) sum = <><span className="pick-chip skip">사지 마세요</span><span className="pick-why">고수가 안 사도 된대요</span></>;
    else {
      const pk = ctx.pickOf(i), pp = pk ? pk.p : 0;
      sum = <><span className="pick-chip" data-ch={sel}>{PCH[sel]}</span><span className="pick-src">{pk ? pk.src : ""}</span><b className="num">{pp ? won(pp) : "무료"}</b>{sel !== "nw" && base > (pp || 0) ? <s className="num">{won(base)}</s> : null}</>;
    }
    return (
      <li className={cls(" compact" + (sel == null || sel === "skip" ? " off" : ""))} style={{ "--tc": T[it.t].c }} id={"it-" + i}>
        <Thumb it={it} i={i} />
        <div className="head"><LabelLine it={it} /><h3>{it.n}</h3><div className="pick-sum">{sum}</div></div>
        <Button size="sm" variant="outline" className="edit-btn" onPress={() => ctx.expand(i)}>{sel == null || sel === "skip" ? "보기" : "변경"}</Button>
      </li>
    );
  }

  const chs = CHORDER.slice(); if (it.t === "swap") chs.push("swap"); chs.push("have");
  const st = stage[key], cur = st || sel || null;
  const oc = open[key];
  const L = st ? listingsOf(it, st, region) : [];
  const lcur = st && sel === st ? lpick[key] || 0 : null;

  return (
    <li className={cls(on ? "" : " off")} style={{ "--tc": T[it.t].c }} id={"it-" + i}>
      <Thumb it={it} i={i} />
      <div className="head"><LabelLine it={it} /><h3>{it.n}</h3></div>
      <ToggleButton isIconOnly variant="ghost" className="heart" isSelected={on} aria-label={it.n + " 담기"} onChange={(v) => ctx.setHeart(i, v)}>
        <svg aria-hidden="true"><use href="#i-heart" /></svg>
      </ToggleButton>
      <div className="body">
        <p className="tip">{it.tip}</p>
        {it.sub && <p className="sub-for">대신 · {it.sub}</p>}
        {it.note && <p className="sub-for">{it.note}</p>}
        <div className="pick-q"><span className="label-sm">어디서 살까요?</span><span className="desc-sm">고르면 접히고 다음 물건으로 넘어가요</span></div>
        <RadioGroup aria-label={it.n + " 어디서 살까요"} className="pc" value={cur} onChange={(v) => ctx.choose(i, v)}>
          {chs.map((ch) => {
            const c = ch === "swap" ? { p: 0, n: 1 } : chPrice(it, ch, region), ok = !!c && (ch !== "used" || usedOK(it));
            const k = ch === "swap" ? "스왑 · 내 물건과 교환" : ch === "have" ? "집에 있는 걸로 · 0원" : CH[ch] + (c ? " · " + c.n + (ch === "nw" ? "곳" : "개") : "");
            let v;
            if (ch === "have") v = <span className="pc-v have">{it.sub ? "고수 추천 대신템 · " + it.sub : "비슷한 게 이미 있으면 안 사요"}</span>;
            else if (!c) v = <span className="pc-v none">없음</span>;
            else if (ch === "used" && !usedOK(it)) v = <span className="pc-v none warn">유통기한 미표시</span>;
            else if (ch === "used" || ch === "sim") v = <span className="pc-v">{won(c.p)}<small>부터</small></span>;
            else if (ch === "nw") v = <span className="pc-v">{won(c.min)}{c.max > c.min ? "~" + c.max.toLocaleString("ko-KR") : ""}</span>;
            else v = <span className="pc-v">{c.p ? won(c.p) : "무료"}<s className="num">{won(base)}</s></span>;
            const tag = !ok || ch === "nw" || !c.p ? null : <em className="num">-{c.off}%</em>;
            return (
              <div key={ch} className={ch === "swap" || ch === "have" ? "wide" : ""} style={ch === "swap" || ch === "have" ? { gridColumn: "1/-1" } : undefined} onClickCapture={ok ? again(cur, ch, (x) => ctx.choose(i, x)) : undefined}>
                <Radio value={ch} isDisabled={!ok}>
                  <Radio.Content>
                    <Radio.Control><Radio.Indicator /></Radio.Control>
                    <span className="pc-t"><span className="pc-k"><span>{k}</span>{tag}</span>{v}</span>
                  </Radio.Content>
                </Radio>
              </div>
            );
          })}
        </RadioGroup>
        {st && (
          <div className="lst">
            <div className="lst-h"><b>{PCH[st]} {L.length}개</b>
              <span>{(st === "used" || st === "share") && <><button type="button" className="link-btn lst-reg" onClick={() => ctx.openModal("region")}><Icon id="pin" className="icon-sm" />{regionLabel(region)}{region ? " 근처" : ""}</button> · </>}하나를 골라 주세요</span>
            </div>
            <RadioGroup aria-label={PCH[st] + " " + L.length + "개 중 고르기"} className="lrows" value={lcur == null ? null : String(lcur)} onChange={(v) => ctx.finalize(i, st, +v)}>
              {L.map((x, k) => (
                <div className="lrow" key={k}>
                  <div onClickCapture={again(lcur == null ? null : String(lcur), String(k), () => ctx.finalize(i, st, k))}>
                    <Radio value={String(k)}>
                      <Radio.Content>
                        <Radio.Control><Radio.Indicator /></Radio.Control>
                        <span className="l-t">
                          <span className="l-src">{x.seller ? <><GosuAvatar av={x.seller.av} color={x.seller.c} className="av-xs" />{x.seller.n} 고수<span className="l-badge">고수템</span></> : x.src}</span>
                          <span className="l-note">{x.note}</span>
                        </span>
                        <span className="l-p num">{x.p ? won(x.p) : "무료"}{x.p && x.p < base && st !== "nw" ? <em>-{Math.round((1 - x.p / base) * 100)}%</em> : null}</span>
                      </Radio.Content>
                    </Radio>
                  </div>
                  {x.internal ? (
                    <Button isIconOnly variant="ghost" size="sm" className="l-go" aria-label={x.src + " 고수 매물 상세 보기"} onPress={() => ctx.openModal("listing", { b, i, ch: st, k, region, finalize: ctx.finalize })}><Icon id="back" className="icon-sm flip" /></Button>
                  ) : x.link ? <a className="l-go" href={x.link} target="_blank" rel="noopener" aria-label={x.src + "에서 보기"}><Icon id="out" className="icon-sm" /></a> : <span className="l-go" />}
                </div>
              ))}
            </RadioGroup>
            <button type="button" className="link-btn" style={{ justifySelf: "start", padding: 6 }} onClick={() => ctx.unstage(i)}>다른 경로 보기</button>
          </div>
        )}
        {oc && !st && <div className="offers"><Offers it={it} ch={oc} region={region} onStage={(c) => ctx.stageTo(i, c)} /></div>}
        <div className="sense">
          <button type="button" className="link-btn" onClick={() => ctx.toggleWhere(i)}>{oc ? "판매처 접기" : "판매처 보기"}</button>
          <ToggleButton size="sm" className="emp num" isSelected={empOn[i]} onChange={() => ctx.toggleEmp(i)}>👍 공감 {(it.emp + (empOn[i] ? 1 : 0)).toLocaleString("ko-KR")}</ToggleButton>
        </div>
      </div>
    </li>
  );
}

/* ---------- 라벨 탭 + 경로 칩 ---------- */
function Filters({ b, tab, ch, onTab, onCh, region }) {
  const ref = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const chk = () => {
      const top = parseFloat(getComputedStyle(el).top) || 0, r = el.getBoundingClientRect(), sc = document.querySelector(".scroller");
      const base = sc && getComputedStyle(sc).overflowY === "auto" ? sc.getBoundingClientRect().top : 0;
      setStuck(r.top <= base + top + 1);
    };
    window.addEventListener("scroll", chk, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", chk, { capture: true });
  }, []);
  const its = tab === "all" ? [] : b.items.filter((it) => it.t === tab);
  const chInfo = (c) => {
    const n = its.reduce((s, it) => s + stockOf(it, c), 0), cs = its.map((it) => chPrice(it, c, region)).filter(Boolean);
    let info = "";
    if (cs.length) {
      if (c === "nw") info = won(Math.min(...cs.map((x) => x.min))) + "~" + Math.max(...cs.map((x) => x.max)).toLocaleString("ko-KR");
      else if (c === "share") info = "무료"; else info = "최대 -" + Math.max(...cs.map((x) => x.off)) + "%";
    }
    return { n, info };
  };
  return (
    <div className={"filters" + (stuck ? " stuck" : "")} ref={ref}>
      <Tabs selectedKey={tab} onSelectionChange={(k) => { onTab(String(k)); if (stuck) requestAnimationFrame(() => { const x = document.getElementById("items"); if (x) x.scrollIntoView({ block: "start" }); }); }}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="라벨">
            <Tabs.Tab id="all">전체 <span className="cnt num">{b.items.length}</span><Tabs.Indicator /></Tabs.Tab>
            {TORDER.map((k) => {
              const n = b.items.filter((it) => it.t === k).length;
              return <Tabs.Tab key={k} id={k} className={n ? "" : "empty"}>{T[k].name} <span className="cnt num">{n}</span><Tabs.Indicator /></Tabs.Tab>;
            })}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
      {tab !== "all" && its.length > 0 && (
        <div className="ch-row">
          <span className="desc-sm">{T[tab].name} {its.length}개 · 어디서 얼마에 구할까</span>
          <TagGroup aria-label="구하는 경로" className="chips" selectionMode="single" size="sm" selectedKeys={ch ? [ch] : []}
            disabledKeys={CHORDER.filter((c) => !chInfo(c).n)} onSelectionChange={(k) => onCh([...k][0] || null)}>
            <TagGroup.List>
              {CHORDER.map((c) => { const x = chInfo(c); return (
                <Tag key={c} id={c} textValue={CH[c]}>{CH[c]} <span className="cnt-n num">{x.n ? x.n + (c === "nw" ? "곳" : "개") : "없음"}</span>{x.info && <span className={"ch-v num" + (c === "nw" ? "" : " off")}>{x.info}</span>}</Tag>
              ); })}
            </TagGroup.List>
          </TagGroup>
        </div>
      )}
    </div>
  );
}

/* ---------- 파우치 이야기(댓글) ---------- */
function Talk({ b }) {
  const { toast } = useApp();
  const st = useHub();
  const [tag, setTag] = useState("후기");
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const items = st.off || !st.talkReady ? [] : talkItems(st, b.id);
  const tp = Math.max(1, Math.ceil(items.length / 5)), pg = Math.min(page, tp), view = items.slice((pg - 1) * 5, pg * 5);
  const names = useProfiles([...new Set(view.filter((c) => !c.ex).map((c) => c.uid))]);
  const send = async () => {
    const t = text.trim();
    if (!t) { toast("내용을 적어 주세요."); return; }
    setBusy(true);
    const r = await talkAdd(b.id, tag, t);
    setBusy(false);
    if (r.ok) { setText(""); toast("댓글을 남겼어요."); }
    else toast(r.denied ? "보기 전용이라 댓글을 남길 수 없어요." : "댓글을 남기지 못했어요. 잠시 뒤 다시 해 주세요.");
  };
  const del = async (c) => { setBusy(true); const ok = await talkDelete(c.uid, c.id); setBusy(false); toast(ok ? "댓글을 지웠어요." : "지우지 못했어요."); };
  let body;
  if (st.off) body = (
    <li className="talk-empty">
      <Alert status="default">
        <Alert.Indicator />
        <Alert.Content><Alert.Title>댓글은 준비 중이에요</Alert.Title><Alert.Description>지금은 claude.ai에서 로그인해 열었을 때만 보이고 남길 수 있어요.</Alert.Description></Alert.Content>
      </Alert>
    </li>
  );
  else if (!st.talkReady) body = <li className="talk-empty">댓글을 불러오는 중이에요…</li>;
  else if (!items.length) body = <li className="talk-empty">아직 이야기가 없어요. 첫 댓글을 남겨 주세요.</li>;
  else body = view.map((c) => {
    const mine = c.uid === st.me, p = !c.ex && names[c.uid];
    const nm = c.ex ? c.nick || "예시" : p && p.name ? (mine ? "나 · " : "") + p.name : mine ? "나" : "고수템 이용자";
    return (
      <li className="talk-item" key={c.uid + c.id}>
        <GosuAvatar av={c.ex ? "예" : p && p.name ? p.name.trim().charAt(0) : "·"} color="#8A9AB4" />
        <div className="talk-body">
          <div className="talk-meta">
            <b className="talk-who">{nm}</b>{c.ex && <span className="ex-badge">예시</span>}
            <span className={"talk-tag t-" + TAGS.indexOf(c.tag)}>{c.tag}</span><span>{ago(c.at)}</span>
            {(mine || st.owner) && <button type="button" className="talk-del" aria-label="댓글 지우기" disabled={busy} onClick={() => del(c)}>지우기</button>}
          </div>
          <p>{c.text}</p>
        </div>
      </li>
    );
  });
  return (
    <>
      <p className="sub">써 본 후기, 고수에게 묻고 싶은 것, 나만의 꿀팁을 남겨 주세요.</p>
      <Surface variant="secondary" className="talk-box">
        <TagGroup aria-label="글 종류" className="chips" selectionMode="single" disallowEmptySelection size="sm" selectedKeys={[tag]} onSelectionChange={(k) => setTag([...k][0] || "후기")}>
          <TagGroup.List>{TAGS.map((t) => <Tag key={t} id={t}>{t}</Tag>)}</TagGroup.List>
        </TagGroup>
        <TextArea aria-label="파우치에 댓글 쓰기" rows={2} maxLength={300} fullWidth value={text} onChange={(e) => setText(e.target.value)}
          placeholder={tag === "질문" ? "고수에게 묻고 싶은 걸 적어 주세요" : tag === "꿀팁" ? "나만 아는 꿀팁을 알려 주세요" : "이 파우치, 어땠나요?"} />
        <div className="flex items-center justify-between gap-2">
          <span className="desc-sm">{!st.off && st.talkReady && !st.me ? "로그인한 사람만 남길 수 있어요." : ""}</span>
          <Button size="sm" isDisabled={st.off || !st.talkReady || !st.me || busy} onPress={send}>남기기</Button>
        </div>
      </Surface>
      <ul className="talk-list" aria-live="polite">{body}</ul>
      <Pager page={pg} total={tp} onChange={setPage} label="댓글 페이지" />
    </>
  );
}

/* ---------- 사진 아래 보기 탭: 01 가방 사진 / 02 물건 펼쳐 보기 (밑줄이 눌린 탭을 따라감) ---------- */
function FlatLay({ b }) {
  return (
    <div className="flatlay" role="img" aria-label={b.title + " 물건 " + b.items.length + "개를 펼쳐 놓은 모습"}>
      <span className="fl-cap">THE FULL BAG · {b.items.length}</span>
      <ol className="fl-grid">
        {b.items.map((it, i) => (
          <li key={i} style={{ "--tc": T[it.t].c }}>
            <span className="fl-no num">{i + 1}</span>
            <svg viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[it.art] }} />
            <span className="fl-n">{it.n}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
function ViewTabs({ b }) {
  const [v, setV] = useState(0);
  const refs = [useRef(null), useRef(null)];
  const [bar, setBar] = useState({ x: 0, w: 0 });
  useEffect(() => {
    const f = () => { const el = refs[v].current; if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth }); };
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  const tabs = ["01 / 고수의 가방", "02 / 물건 펼쳐 보기"];
  return (
    <div className="vt">
      <div className="vt-stage">
        {v === 0 ? (b.deck ? <div className="deck-wrap"><DeckStrip b={b} /><Photo b={b} /></div> : <Photo b={b} />) : <FlatLay b={b} />}
      </div>
      <div className="vt-tabs" role="tablist" aria-label="가방 보기 방식">
        {tabs.map((t, i) => (
          <button key={t} ref={refs[i]} type="button" role="tab" aria-selected={v === i} className="vt-tab" onClick={() => setV(i)}>{t}</button>
        ))}
        <span className="vt-bar" aria-hidden="true" style={{ transform: "translateX(" + bar.x + "px)", width: bar.w }} />
      </div>
    </div>
  );
}

/* ---------- 오른쪽 합계 카드 (넓은 화면): 내 구성 확인하기 ---------- */
function SumCard({ n, done, need, mine, all, onCart, onReset }) {
  return (
    <div className="sumcard">
      <div className="sc-top">
        <div><b className="sc-k">내 구성 합계</b><span className="sc-s num">담은 물건 {n}개 · 구할 곳 {done}/{need} 골랐어요</span></div>
        <span className="sc-big num">{won(mine)}</span>
      </div>
      <div className="sc-row">
        <p className="sc-note num">담은 물건을 전부 새로 사면 {won(all)} · 아끼는 돈 <b>{won(Math.max(0, all - mine))}</b></p>
        <button type="button" className="sc-reset" onClick={onReset}>기본 구성으로 초기화</button>
      </div>
      <button type="button" className="sc-cta" onClick={onCart}>{done ? "내 구성 확인하기 ↗" : "고수 추천대로 고르기 ↗"}</button>
    </div>
  );
}

/* ---------- 상세 화면 ---------- */
export default function Bag({ b }) {
  const app = useApp();
  const { region, picks: allPicks, setPicks, emp: allEmp, setEmp, openModal, toast, setChosen, scrap, setScrap, follow, setFollow } = app;
  const picks = allPicks[b.id], empOn = allEmp[b.id];
  const scN = useScraps(b);
  const fol = (b.followers || Math.round((b.likes || 100) * 1.7)) + (follow[b.id] ? 1 : 0);
  const [tab, setTab] = useState("all");
  const [ch, setCh] = useState(null);
  const [theme, setTheme] = useState("all");
  const [plan, setPlan] = useState({});
  const [exp, setExp] = useState({});
  const [stage, setStage] = useState({});
  const [lpick, setLpick] = useState({});
  const [open, setOpen] = useState({});
  const [next, setNext] = useState(null);
  const [budget, setBudget] = useState(null);
  const [lastPlan, setLastPlan] = useState(null);
  const [dc, setDc] = useState("regret");
  const scrollTo = useRef(null);

  const setPicksB = (fn) => setPicks((s) => ({ ...s, [b.id]: fn(s[b.id]) }));
  const idx = useMemo(() => b.items.map((_, i) => i).filter((i) => { const it = b.items[i]; return (tab === "all" || it.t === tab) && (theme === "all" || it.th === theme); }), [b, tab, theme]);
  const pickOf = (i) => { const c = plan[i]; if (!c || c === "skip") return null; const L = listingsOf(b.items[i], c, region); return L[lpick[b.id + ":" + i] || 0] || L[0]; };
  const itemCost = (i) => { const pk = pickOf(i); return pk ? pk.p : costOf(b.items[i]); };

  /* 고르고 나면 다음 물건으로 스크롤 + 포커스 */
  useEffect(() => {
    const t = scrollTo.current; if (t == null) return; scrollTo.current = null;
    const li = document.getElementById("it-" + t.i); if (!li) return;
    li.scrollIntoView({ block: t.block || "center", behavior: reduceMotion() ? "auto" : "smooth" });
    const r = li.querySelector(t.sel || 'input[type="radio"]:not(:disabled)'); if (r) r.focus({ preventScroll: true });
  });

  const finalize = (i, c, k) => {
    const key = b.id + ":" + i, np = { ...plan, [i]: c };
    setPlan(np); setLpick((s) => ({ ...s, [key]: k })); setStage((s) => ({ ...s, [key]: null }));
    setPicksB((p) => p.map((v, j) => (j === i ? true : v))); setExp((s) => ({ ...s, [key]: false })); setOpen((s) => ({ ...s, [key]: null }));
    const pos = idx.indexOf(i); let nx = null;
    for (let q = 1; q < idx.length; q++) { const j = idx[(pos + q) % idx.length]; if (np[j] == null && b.items[j].t !== "no" && picks[j] !== false) { nx = j; break; } }
    if (nx != null) { setNext(b.id + ":" + nx); scrollTo.current = { i: nx }; setTimeout(() => setNext(null), 1300); }
    else { setNext(null); toast("다 골랐어요! 아래 '일괄 구매'로 한 번에 사요."); }
  };
  const ctx = {
    plan, picks, empOn, exp, stage, lpick, open, next, region, pickOf, openModal, finalize,
    choose: (i, c) => {
      const L = listingsOf(b.items[i], c, region);
      if (L.length <= 1) { finalize(i, c, 0); return; }
      setStage((s) => ({ ...s, [b.id + ":" + i]: c })); scrollTo.current = { i, block: "nearest", sel: ".lst input[type=radio]" };
    },
    stageTo: (i, c) => { const key = b.id + ":" + i; setOpen((s) => ({ ...s, [key]: null })); setStage((s) => ({ ...s, [key]: c })); },
    unstage: (i) => { setStage((s) => ({ ...s, [b.id + ":" + i]: null })); scrollTo.current = { i, block: "nearest" }; },
    expand: (i) => { setExp((s) => ({ ...s, [b.id + ":" + i]: true })); scrollTo.current = { i, block: "nearest" }; },
    toggleWhere: (i) => { const key = b.id + ":" + i, p = plan[i]; setOpen((s) => ({ ...s, [key]: s[key] ? null : p && p !== "skip" && p !== "swap" ? p : "nw" })); },
    toggleEmp: (i) => setEmp((s) => ({ ...s, [b.id]: s[b.id].map((v, j) => (j === i ? !v : v)) })),
    setHeart: (i, v) => {
      const key = b.id + ":" + i;
      setPicksB((p) => p.map((x, j) => (j === i ? v : x)));
      if (!v) { setPlan((s) => ({ ...s, [i]: "skip" })); setExp((s) => ({ ...s, [key]: false })); toast("뺐어요."); }
      else { setPlan((s) => { const n = { ...s }; if (n[i] === "skip") delete n[i]; return n; }); toast("담았어요. 어디서 살지 골라 주세요."); }
    },
  };

  /* 예산 슬라이더 */
  const max = useMemo(() => maxBudget(b, region), [b, region]);
  const bud = budget == null || budget > max ? max : budget;
  const onBudget = (v) => {
    setBudget(v);
    const p = budgetPlan(b, v, region), sel = { ...p.sel };
    b.items.forEach((it, i) => { if (sel[i] === undefined && it.t !== "no") sel[i] = "skip"; });
    setPlan(sel); setPicksB(() => b.items.map((_, i) => p.sel[i] !== undefined)); setOpen({}); setExp({}); setStage({}); setLpick({}); setLastPlan(p);
  };

  /* 합계 */
  let all = 0, allP = 0, mine = 0, n = 0;
  b.items.forEach((it, i) => { all += minNew(it); if (picks[i]) { allP += minNew(it); mine += itemCost(i); n++; } });
  const need = b.items.filter((_, i) => picks[i]).length, done = b.items.filter((_, i) => picks[i] && plan[i] && plan[i] !== "skip").length;
  const rg = b.items[b.regretItem];
  useEffect(() => { setChosen((s) => (s[b.id] === done ? s : { ...s, [b.id]: done })); }, [done, b.id, setChosen]);

  const onCart = () => {
    if (done) { openModal("checkout", { b, plan, picks, pickOf }); return; }
    const dp = defaultPlan(b, picks, region);
    openModal("recommend", {
      b, dp, region,
      onOk: () => { setPlan(dp); setExp({}); setStage({}); setLpick({}); toast("골라 뒀어요. 바꿀 건 '변경'을 눌러 주세요."); requestAnimationFrame(() => { const x = document.getElementById("items"); if (x) x.scrollIntoView({ block: "start" }); }); },
    });
  };

  const onReset = () => { setPicksB(() => b.items.map((it) => T[it.t].pick)); setPlan({}); setExp({}); setStage({}); setLpick({}); setOpen({}); setBudget(null); setLastPlan(null); toast("기본 구성으로 되돌렸어요."); };
  const spent = Object.keys(plan).reduce((s, i) => (plan[i] !== "skip" ? s + (optPrice(b.items[i], plan[i], region) || 0) : s), 0);

  return (
    <>
      <div className="view detail">
        {/* 왼쪽: 사진 바로 아래 가방 설명·컬렉션 저장·팔로우 (Orbit 글꼴·버튼) / 오른쪽: 물건 목록 + 합계 (10/25 MJ) */}
        <div className="d-grid">
        <div className="d-hero">
          <div className="d-photo pad"><ViewTabs b={b} /></div>
          <div className="d-info pad">
            <p className="o-kick">{b.deck ? "GOSU SELECTED · 인기 파우치 덱" : "GOSU SELECTED BAG"}</p>
            <TitleSplit t={b.title} as="h1" className="o-title" />
            {b.sub && <p className="o-desc">{b.sub}</p>}
            <dl className="o-meta">
              <div><dt>GOSU</dt><dd><button type="button" className="o-gosu" onClick={() => openModal("profile", { b })}>{b.name}</button>
                <span className="o-insta"><Icon id="insta" className="icon-xs" />@{b.handle || b.id}</span></dd></div>
              <div><dt>SITUATION</dt><dd>{b.meta}</dd></div>
              <div><dt>ITEMS</dt><dd className="num">{b.items.length}개</dd></div>
              <div><dt>VIEWS</dt><dd className="num">{b.views}</dd></div>
            </dl>
            <div className="o-acts">
              <button type="button" className="o-btn lime" aria-pressed={!!scrap[b.id]} onClick={() => { const v = !scrap[b.id]; setScrap((x) => ({ ...x, [b.id]: v })); toast(v ? "컬렉션에 저장했어요. 저장 탭에 모여요." : "컬렉션에서 뺐어요."); }}>
                {scrap[b.id] ? "저장됨 ✓" : "컬렉션에 저장 +"}
              </button>
              <button type="button" className="o-btn line" aria-pressed={!!follow[b.id]} onClick={() => { const v = !follow[b.id]; setFollow((x) => ({ ...x, [b.id]: v })); toast(v ? b.name + "님을 팔로우했어요. 새 가방이 올라오면 알려 드려요. (시범)" : "팔로우를 취소했어요."); }}>
                {follow[b.id] ? "팔로잉 ✓" : "고수 팔로우 +"}
              </button>
            </div>
            <p className="o-stat num">♡ {scN}명이 저장 · {b.name} 팔로워 {fol.toLocaleString("ko-KR")}명</p>
            <p className="o-trust"><Icon id="shield" className="icon-xs" />{trustLine(b)} <span className="ex-badge">예시</span></p>
          </div>
        </div>

        <div className="d-right">
        <section className="section pad d-items" aria-labelledby="h-items">
          <h2 id="h-items">물건마다 담을지 골라 보세요</h2>
          <p className="sub">{b.howto || "하트를 누르면 담겨요. 라벨을 누르면 새상품·중고·유사템·나눔 중 어디서 구할 수 있는지 볼 수 있어요."}</p>
          {b.themes && (
            <Surface variant="secondary" className="themes">
              <span className="label-sm">테마</span>
              <TagGroup aria-label="테마" className="chips" selectionMode="single" disallowEmptySelection size="sm" selectedKeys={[theme]} onSelectionChange={(k) => setTheme([...k][0] || "all")}>
                <TagGroup.List>
                  <Tag id="all" textValue="전체 보기"><Icon id="bag" className="icon-xs" />전체 보기 {b.items.length}</Tag>
                  {b.themes.map((t) => <Tag key={t.k} id={t.k} textValue={t.n}><Icon id={t.ic} className="icon-xs" />{t.n} {b.items.filter((it) => it.th === t.k).length}</Tag>)}
                </TagGroup.List>
              </TagGroup>
            </Surface>
          )}
          {b.items.some((it) => it.ai) && <p className="ai-note"><span className="ai-tag" style={{ opacity: 1 }}>AI 멘트</span> 물건 설명은 AI가 고수 인터뷰를 바탕으로 먼저 써 드리고, 고수가 확인한 뒤 공개해요.</p>}
          <Filters b={b} tab={tab} ch={ch} region={region} onTab={(k) => { setTab(k); setCh(null); setOpen({}); }} onCh={setCh} />
          <p className="filter-note" aria-live="polite">{tab !== "all" && <>{T[tab].name}{ch ? " · " + CH[ch] : ""} <button type="button" className="link-btn" onClick={() => { setTab("all"); setCh(null); }}>전체 보기</button></>}</p>
          <div id="items">
            {idx.length ? <ul className="items">{idx.map((i) => <ItemRow key={i} b={b} i={i} ctx={ctx} />)}</ul>
              : <div className="empty"><p>{tab === "all" ? "이 테마에는 물건이 없어요." : "이 가방에는 " + T[tab].name + "이 없어요."}</p></div>}
          </div>
        </section>
        <aside className="d-aside pad" aria-label="내 구성 합계"><SumCard n={n} done={done} need={need} mine={mine} all={allP} onCart={onCart} onReset={onReset} /></aside>
        </div>
        </div>

        <Surface variant="default" className="dg">
          <DisclosureGroup expandedKeys={dc ? [dc] : []} onExpandedChange={(keys) => setDc([...keys].find((k) => k !== dc) || null)}>
            <Sec id="regret" title="고수가 처음에 샀다가 후회한 것" sum={"안 사면 " + won(minNew(rg)) + " 아껴요"}>
              <Surface variant="transparent" className="regret">
                <div className="flex items-center gap-2"><span className="tb" style={{ "--tc": "var(--t-no)" }}>비추천템</span><b>{rg.n}</b></div>
                <blockquote>“{rg.regret || b.regret}”</blockquote>
                <span className="s num">안 사면 {won(minNew(rg))} 아껴요 · 예시 가격</span>
              </Surface>
            </Sec>
            <Sec id="save" title="얼마나 아낄 수 있나" sum="예산을 정하면 다시 짜 드려요">
              <p className="sub">예산을 정하면 고수 추천 순서대로 하트를 다시 담아 드려요. 중고·나눔이 있으면 그 가격으로 계산해요.</p>
              <Surface variant="secondary" className="budget">
                <Slider value={bud} minValue={0} maxValue={max} step={1000} onChange={(v) => onBudget(Array.isArray(v) ? v[0] : v)}
                  formatOptions={{ style: "currency", currency: "KRW" }} className="w-full">
                  <div className="flex items-center justify-between"><Label className="label-sm">예산으로 파우치 짜기</Label><Slider.Output className="num text-xs font-bold" /></div>
                  <Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track>
                </Slider>
                <span className="desc-sm">예산을 줄이면 새상품 대신 나눔·중고·유사템으로 바꿔서 다시 짜 드려요. 소모품 중고는 유통기한이 적힌 것만 써요.</span>
                {lastPlan && (
                  <div className="plan">
                    <div className="plan-head"><b>짠! 이렇게 담았어요</b><span className="num">{won(spent)} · {bud - spent >= 0 ? won(bud - spent) + " 남음" : <span className="over">{won(spent - bud)} 초과</span>}</span></div>
                    <ol className="plan-list">
                      {lastPlan.order.filter((i) => plan[i] !== undefined && plan[i] !== "skip").map((i) => {
                        const it = b.items[i], p = optPrice(it, plan[i], region), base = minNew(it);
                        return (
                          <li key={i}><span className="pl-n">{it.n}</span>
                            <span className="pl-r">
                              <select className="pl-sel" aria-label={it.n + " 구하는 경로"} value={plan[i]} onChange={(e) => setPlan((s) => ({ ...s, [i]: e.target.value }))}>
                                {optionsOf(it, region).map((o) => <option key={o.ch} value={o.ch}>{PCH[o.ch]} {o.p ? won(o.p) : "무료"}{o.ch === "used" && it.cons ? " · 유통기한 " + it.used.exp : ""}</option>)}
                              </select>
                              {plan[i] !== "nw" && base > p ? <s className="num">{won(base)}</s> : null}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                    {lastPlan.dropped.length > 0 && <p className="plan-drop">예산이 모자라 뺀 것 · {lastPlan.dropped.map((i) => b.items[i].n).join(", ")}</p>}
                  </div>
                )}
              </Surface>
              <div className="compare">
                <div className="col all"><span className="k">전부 새로 사면</span><span className="v num">{won(all)}</span></div>
                <div className="col mine"><span className="k">내가 담은 조합</span><span className="v num">{won(mine)}</span></div>
              </div>
              <div className="saved"><span>아끼는 돈</span><span className="big num">{won(all - mine)}</span></div>
            </Sec>
            <Sec id="words" title="고수의 한마디" sum={"제일 잘 산 것 · " + b.best}>
              <div className="words">
                <div className="word"><span className="k">제일 잘 산 것</span><span className="v">{b.best}</span></div>
                <div className="word"><span className="k">다시는 안 살 것</span><span className="v">{b.rebuy}</span></div>
              </div>
            </Sec>
            <Sec id="talk" title={<>파우치 이야기 <TalkCount b={b} /></>} sum="후기 · 질문 · 꿀팁">
              <Talk b={b} />
            </Sec>
          </DisclosureGroup>
        </Surface>
        <div style={{ height: 24 }} />
      </div>
      <div className="cartbar pad">
        <div className="sum"><b>{done ? done + "/" + need + " 골랐어요" : n + "개 담음"}</b><span>예상 가격 {won(mine)}</span></div>
        <Button className="px-3" onPress={onCart}><Icon id="bag" className="icon-sm" />{done ? " 일괄 구매 " + done + "개" : " 고수 추천대로 고르기"}</Button>
      </div>
    </>
  );
}

/* 출처 요약: 협찬·제휴가 있으면 개수까지 먼저 밝힘 */
function trustLine(b) {
  const c = {}; b.items.forEach((it) => { const k = it.src || "own"; c[k] = (c[k] || 0) + 1; });
  const others = Object.keys(c).filter((k) => k !== "own");
  if (!others.length) return "출처 표시 · 전부 내돈내산이에요. 협찬·제휴가 있으면 물건마다 표시해요.";
  return "출처 표시 · " + others.map((k) => SRC[k] + " " + c[k] + "개").join(" · ") + " (물건에 표시) · 나머지 " + (c.own || 0) + "개는 내돈내산이에요.";
}
function TalkCount({ b }) {
  const st = useHub();
  const n = st.off || !st.talkReady ? 0 : talkItems(st, b.id).length;
  return n ? <span className="num talk-n">{n}</span> : null;
}
function Sec({ id, title, sum, children }) {
  return (
    <Disclosure id={id}>
      <Disclosure.Heading>
        <Disclosure.Trigger className="disclosure__trigger">
          <span className="dc-ti"><span className="dc-title">{title}</span><span className="dc-sum">{sum}</span></span>
          <Disclosure.Indicator />
        </Disclosure.Trigger>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="dc-body">{children}</Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}
