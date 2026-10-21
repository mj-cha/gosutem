/* 홈: 통합 내비게이션 바 → 배너 → 가방 피드 → 고수 신청 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, SearchField, Separator, Tabs, Tag, TagGroup, Tooltip } from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { DeckStrip, Pager, Photo, Promo, TBadge, Who } from "../components/common.jsx";
import { BAGS, POP_FALLBACK, T, TORDER } from "../data/data.js";
import { catName, costOf, countT, filterBags, minNew, normQ, pcCount, pGroups, relatedTerms, won } from "../lib/logic.js";
import { regionLabel, useApp } from "../lib/store.jsx";
import { topSearches, useHub } from "../lib/claude.js";

const PAGE = 3;

/* 최근·인기 검색어 패널 */
function Suggest({ onPick }) {
  const { recent, setRecent, toast } = useApp();
  const st = useHub();
  const top = topSearches(st), live = !!(st.db && top.length);
  const list = live ? top : POP_FALLBACK.map((q) => ({ q }));
  const at = st.searchesAt, stamp = at ? at.getHours() + ":" + String(at.getMinutes()).padStart(2, "0") : "";
  return (
    <div className="nx-pop" role="region" aria-label="검색어 추천">
      <div className="sg-h"><b>최근 검색어</b>{recent.length > 0 && <button type="button" className="link-btn" onClick={() => { setRecent([]); toast("최근 검색어를 모두 지웠어요."); }}>전체 삭제</button>}</div>
      {recent.length ? (
        <TagGroup aria-label="최근 검색어" className="chips" selectionMode="single" selectedKeys={[]} size="sm"
          onSelectionChange={(k) => { const v = [...k][0]; if (v) onPick(v); }}
          onRemove={(keys) => setRecent(recent.filter((x) => !keys.has(x)))}>
          <TagGroup.List>
            {recent.map((t) => <Tag key={t} id={t} textValue={t}>{t}<Tag.RemoveButton aria-label={t + " 지우기"} /></Tag>)}
          </TagGroup.List>
        </TagGroup>
      ) : <p className="sg-empty">찾아본 검색어가 여기 남아요. 이 기기에만 저장돼요.</p>}
      <div className="sg-h"><b>인기 검색어</b><span className="sg-basis">{live ? stamp + " 기준 · 최근 7일 검색한 사람 수" : "예시 · 검색이 쌓이면 실제 순위로 바뀌어요"}</span></div>
      <TagGroup aria-label="인기 검색어" className="chips sg-pop" selectionMode="single" selectedKeys={[]} size="sm"
        onSelectionChange={(k) => { const v = [...k][0]; if (v) onPick(v); }}>
        <TagGroup.List>
          {list.map((o, k) => <Tag key={o.q} id={o.q} textValue={o.q} className={k < 3 ? "hot" : ""}>{o.q}</Tag>)}
        </TagGroup.List>
      </TagGroup>
    </div>
  );
}

/* 통합 내비게이션 바: 검색 · 지역 · 필터 · 파우치 분류(상황·취미군) · 고른 조건 */
function NavBar() {
  const { nav, patchNav, region, openModal, commitSearch } = useApp();
  const [pop, setPop] = useState(false);
  const box = useRef(null), tm = useRef(null);
  const top = nav.pc ? nav.pc.split("/")[0] : "";
  const g = top ? pGroups().find((c) => c.k === top) : null;
  const nf = (nav.cat ? 1 : 0) + (nav.gosu ? 1 : 0);

  useEffect(() => {
    const f = (e) => { if (box.current && !box.current.contains(e.target)) setPop(false); };
    document.addEventListener("pointerdown", f);
    return () => document.removeEventListener("pointerdown", f);
  }, []);
  useEffect(() => () => clearTimeout(tm.current), []);

  const setQ = (v) => {
    patchNav({ q: v }); setPop(!v.trim());
    clearTimeout(tm.current);
    if (normQ(v).length >= 2) tm.current = setTimeout(() => commitSearch(v), 1500);
  };
  const chips = [];
  if (nav.q.trim()) chips.push(["q", "‘" + nav.q.trim() + "’"]);
  if (nav.pc) chips.push(["pc", catName(nav.pc)]);
  if (nav.cat) chips.push(["cat", catName(nav.cat)]);
  if (nav.gosu) { const gb = BAGS.find((b) => b.id === nav.gosu); if (gb) chips.push(["gosu", gb.name]); }

  return (
    <nav className="navx" aria-label="가방 찾기" ref={box}>
      <div className="nx-row">
        <SearchField aria-label="검색" value={nav.q} onChange={setQ} variant="secondary" fullWidth
          onFocus={() => setPop(!nav.q.trim())}
          onSubmit={(v) => { clearTimeout(tm.current); commitSearch(v); setPop(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") setPop(false); }}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input id="q" placeholder="물건·상황·고수 검색" autoComplete="off" />
            <SearchField.ClearButton aria-label="검색어 지우기" />
          </SearchField.Group>
        </SearchField>
        <Button variant="secondary" size="sm" className="nx-btn" aria-label={"지역 선택: " + (region ? region.full : "전국")} onPress={() => openModal("region")}>
          <Icon id="pin" className="icon-sm" /><span className="lbl">{regionLabel(region)}</span>
        </Button>
        <Button variant="secondary" size="sm" className="nx-btn" aria-label="필터" onPress={() => openModal("filter")}>
          <Icon id="sliders" className="icon-sm" />{nf > 0 && <span className="ft-n num">{nf}</span>}
        </Button>
        {pop && <Suggest onPick={(v) => { patchNav({ q: v }); commitSearch(v); setPop(false); }} />}
      </div>
      <div className="nx-tabs">
        <Tabs variant="secondary" selectedKey={top || "all"} onSelectionChange={(k) => patchNav({ pc: k === "all" ? null : String(k) })}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="파우치 분류">
              {[{ k: "all", n: "전체" }, ...pGroups()].map((c) => (
                <Tabs.Tab key={c.k} id={c.k}>{c.n}<Tabs.Indicator /></Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <Button isIconOnly variant="secondary" size="sm" aria-label="전체 분류 보기" onPress={() => openModal("category")}><Icon id="grid" className="icon-sm" /></Button>
      </div>
      {g && (
        <div className="nx-sub">
          <TagGroup aria-label={g.n} className="chips" selectionMode="single" disallowEmptySelection size="sm"
            selectedKeys={[nav.pc]} onSelectionChange={(k) => { const v = [...k][0]; if (v) patchNav({ pc: String(v) }); }}>
            <TagGroup.List>
              {[{ k: "", n: g.n + " 전체" }, ...g.subs].map((sb) => {
                const path = sb.k ? top + "/" + sb.k : top, cnt = pcCount(path);
                return <Tag key={path} id={path} textValue={sb.n} className={cnt ? "" : "zero"}>{sb.n}{cnt > 0 && <span className="cnt-n num">{cnt}</span>}</Tag>;
              })}
            </TagGroup.List>
          </TagGroup>
        </div>
      )}
      {chips.length > 0 && (
        <div className="nx-chips">
          <TagGroup aria-label="고른 조건" className="chips" size="sm" onRemove={(keys) => { const k = [...keys][0]; patchNav({ [k]: k === "q" ? "" : null }); }}>
            <TagGroup.List>
              {chips.map(([k, l]) => <Tag key={k} id={k} textValue={l}>{l}<Tag.RemoveButton aria-label={l + " 조건 빼기"} /></Tag>)}
            </TagGroup.List>
          </TagGroup>
          {chips.length > 1 && <button type="button" className="link-btn" onClick={() => patchNav({ q: "", pc: null, cat: null, gosu: null })}>초기화</button>}
        </div>
      )}
    </nav>
  );
}

function BagCard({ b }) {
  const { go, nav, commitSearch } = useApp();
  const c = countT(b);
  let all = 0, combo = 0;
  b.items.forEach((it) => { all += minNew(it); if (T[it.t].pick) combo += costOf(it); });
  const open = () => { if (nav.q) commitSearch(nav.q); go(b.id); };
  return (
    <article className={"bag-card" + (b.deck ? " deck" : "")} tabIndex={0} role="link" aria-label={b.title + " 열기"}
      onClick={open} onKeyDown={(e) => { if (e.key === "Enter") open(); }}>
      {b.deck && <DeckStrip b={b} />}
      <Photo b={b} />
      <div className="card-body">
        <Who b={b} />
        {b.deck && <p className="hook">{b.hook}</p>}
        <h3>{b.title}</h3>
        {b.deck ? <p className="deck-sub">{b.sub}</p> : <p className="views num">조회수 {b.views} · 스크랩 {b.scraps.toLocaleString("ko-KR")}회</p>}
        <Separator />
        <div className="tbadges">{TORDER.map((k) => <TBadge key={k} k={k} n={c[k]} />)}</div>
        <p className="save-line"><span>고수 추천대로 담으면</span><em className="num">-{Math.round((1 - combo / all) * 100)}%</em><span className="num">{won(combo)}</span><s className="num" aria-label={"전부 새로 사면 " + won(all)}>{won(all)}</s></p>
      </div>
    </article>
  );
}

function Feed() {
  const { nav, setNav, patchNav, region, openModal, commitSearch } = useApp();
  const feed = useRef(null);
  const { list, shown } = useMemo(() => filterBags(nav), [nav]);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE)), page = Math.min(Math.max(1, nav.page), pages);
  const qq = nav.q.trim(), rel = qq ? relatedTerms(qq) : [];
  const head = qq ? "“" + qq + "” 가방 검색 결과"
    : nav.pc || nav.cat ? [nav.pc ? catName(nav.pc) : "", nav.cat ? catName(nav.cat) + " 물건" : ""].filter(Boolean).join(" · ") + " 가방" : "고수의 가방";
  const turn = (n) => {
    setNav((s) => ({ ...s, page: n }));
    requestAnimationFrame(() => { const f = feed.current; if (!f) return; f.scrollIntoView({ block: "start" }); const c = f.querySelector(".bag-card"); if (c) c.focus({ preventScroll: true }); });
  };
  return (
    <div className="feed pad" ref={feed} aria-live="polite" style={{ scrollMarginTop: "calc(var(--stick) + 140px)" }}>
      <div className="feed-head">
        <h2>{head} <span className="fh-n num">{shown.length}</span><span className="fh-reg">{region ? region.full : "전국"}</span></h2>
        {rel.length > 0 && (
          <div className="fh-rel surface surface--default" style={{ borderRadius: 16, padding: 12, display: "grid" }}>
            <span className="label-sm">연관 검색어</span>
            <TagGroup aria-label="연관 검색어" className="chips" selectionMode="single" selectedKeys={[]} size="sm"
              onSelectionChange={(k) => { const v = [...k][0]; if (v) { patchNav({ q: v }); commitSearch(v); } }}>
              <TagGroup.List>{rel.map((t) => <Tag key={t} id={t} textValue={t}>{t}</Tag>)}</TagGroup.List>
            </TagGroup>
          </div>
        )}
      </div>
      {!list.length ? (
        <div className="empty"><h3>{nav.pc ? catName(nav.pc) : "이 상황"} 고수를 모시는 중이에요</h3><p>가방을 보여 줄 고수를 찾고 있어요.</p><Button onPress={() => openModal("supply")}>내 가방 보여 주기</Button></div>
      ) : !shown.length ? (
        <div className="empty"><h3>{qq ? "‘" + qq + "’" : catName(nav.cat)} 가방이 아직 없어요</h3><p>찾는 물건이 담긴 가방을 고수에게 부탁해 볼게요.</p><Button onPress={() => openModal("supply")}>내 가방 보여 주기</Button></div>
      ) : null}
      {shown.slice((page - 1) * PAGE, page * PAGE).map((b) => <BagCard key={b.id} b={b} />)}
      <Pager page={page} total={pages} onChange={turn} label="가방 목록 페이지" />
    </div>
  );
}

export function HomeTop() {
  const { openModal } = useApp();
  return (
    <>
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="전체 분류" onPress={() => openModal("category")}><Icon id="menu" /></Button>
      <div className="logo">고수템<small>가칭</small></div>
      <InstallBtn />
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="찾기" onPress={focusSearch}><Icon id="search" /></Button>
    </>
  );
}
function InstallBtn() {
  const { openModal } = useApp();
  return (
    <Tooltip delay={300}>
      <Tooltip.Trigger>
        <Button isIconOnly variant="ghost" className="icon-btn" aria-label="홈 화면에 추가" onPress={() => openModal("install")}><Icon id="addhome" /></Button>
      </Tooltip.Trigger>
      <Tooltip.Content showArrow><Tooltip.Arrow />홈 화면에 추가하면 앱처럼 열려요</Tooltip.Content>
    </Tooltip>
  );
}
export function focusSearch() {
  const q = document.getElementById("q");
  if (q) { window.scrollTo({ top: 0 }); const s = document.querySelector(".scroller"); if (s) s.scrollTop = 0; q.focus({ preventScroll: true }); }
}

export default function Home() {
  const { openModal } = useApp();
  return (
    <div className="view">
      <NavBar />
      <section className="pad" style={{ paddingTop: 16 }} aria-label="고수템 소식">
        <h2 className="vh">고수는 이건 사지 마도 알려줘요</h2>
        <Promo />
      </section>
      <Feed />
      <div className="pad">
        <section className="supply">
          <h3>내 가방도 보여 주고 싶다면</h3>
          <p>홍보가 아니에요. 처음 시작하는 사람에게 살 것과 안 사도 되는 것을 알려 주세요.</p>
          <ul>
            <li><Icon id="check" className="icon-sm" /><span>사진 1장 + 음성 메모 5분이면 끝 · AI가 초안을 써 드려요</span></li>
            <li><Icon id="check" className="icon-sm" /><span>내 가방이 내 이름의 프로필 페이지로 남아요</span></li>
            <li><Icon id="check" className="icon-sm" /><span>안 쓰는 물건은 중고·나눔으로 연결해 드려요</span></li>
          </ul>
          <Button size="sm" onPress={() => openModal("supply")}>고수로 신청하기</Button>
        </section>
        <p className="foot-note">모든 가방·인물·가격·재고·좋아요 수는 예시예요.</p>
      </div>
    </div>
  );
}
