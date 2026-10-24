/* 홈: 통합 내비게이션 바 → 배너 → 가방 피드 → 고수 신청 */
import { useMemo, useRef } from "react";
import { Accordion, Badge, Button, Separator, Tabs, Tag, TagGroup } from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { DeckStrip, Pager, Photo, Promo, TBadge, Who } from "../components/common.jsx";
import { BAGS, POP_FALLBACK, T, TORDER } from "../data/data.js";
import { catName, costOf, countT, filterBags, minNew, pcCount, pGroups, relatedTerms, won } from "../lib/logic.js";
import { regionLabel, useApp } from "../lib/store.jsx";
import { topSearches, useHub } from "../lib/claude.js";

const PAGE = 3;

/* 최근·인기 검색어 (찾기 창 안에서 씀) */
export function Suggest({ onPick }) {
  const { recent, setRecent, toast } = useApp();
  const st = useHub();
  const top = topSearches(st), live = !!(st.db && top.length);
  const list = live ? top : POP_FALLBACK.map((q) => ({ q }));
  const at = st.searchesAt, stamp = at ? at.getHours() + ":" + String(at.getMinutes()).padStart(2, "0") : "";
  return (
    <div className="sg-panel" role="region" aria-label="검색어 추천">
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

/* 통합 내비게이션 바: 지역 · 필터 · 파우치 분류(상황·취미군) · 고른 조건
   검색은 하단 '찾기'(돋보기)에서만 열어요 */
function NavBar() {
  const { nav, patchNav, region, openModal } = useApp();
  const top = nav.pc ? nav.pc.split("/")[0] : "";
  const g = top ? pGroups().find((c) => c.k === top) : null;
  const nf = (nav.cat ? 1 : 0) + (nav.gosu ? 1 : 0);
  const chips = [];
  if (nav.q.trim()) chips.push(["q", "‘" + nav.q.trim() + "’"]);
  if (nav.pc) chips.push(["pc", catName(nav.pc)]);
  if (nav.cat) chips.push(["cat", catName(nav.cat)]);
  if (nav.gosu) { const gb = BAGS.find((b) => b.id === nav.gosu); if (gb) chips.push(["gosu", gb.name]); }

  return (
    <nav className="navx" aria-label="가방 찾기">
      <div className="nx-row">
        <Button variant="secondary" size="sm" className="nx-btn" aria-label={"지역 선택: " + (region ? region.full : "전국")} onPress={() => openModal("region")}>
          <Icon id="pin" className="icon-sm" /><span className="lbl">{regionLabel(region)}</span>
        </Button>
        <span className="nx-hint">{region ? "근처 중고·나눔부터 보여 드려요" : "지역을 고르면 근처 중고·나눔부터 보여요"}</span>
        <Badge.Anchor>
          <Button isIconOnly variant="secondary" size="sm" className="nx-btn" aria-label={nf ? "필터 " + nf + "개 적용됨" : "필터"} onPress={() => openModal("filter")}>
            <Icon id="sliders" className="icon-sm" />
          </Button>
          {nf > 0 && <Badge color="accent" size="sm" className="min-w-5 font-semibold tabular-nums">{nf}</Badge>}
        </Badge.Anchor>
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
      <div className="logo"><small>고수의 아이템 · GOSUTEM</small><span>고수템</span></div>
      <Button isIconOnly variant="ghost" size="sm" className="gear-btn" aria-label="설정" onPress={() => openModal("settings")}><Icon id="gear" className="icon-sm" /></Button>
    </>
  );
}
/* 홈 맨 아래 안내: 고수 신청(펼친 상태) + 자주 묻는 질문 (HeroUI Accordion) */
const FAQ = [
  ["고수템은 어떤 곳이에요?", "검색은 짧게, 선택은 똑똑하게. 평범한 고수가 실제로 들고 다니는 가방을 열어, 뭘 사고 뭘 안 사도 되는지, 집에 있는 걸로 대신할 수 있는지 한눈에 보여 줘요. 더 사라고 만들지 않아요. 덜 헤매라고 만들어요."],
  ["가격은 어디 기준이에요?", "새상품은 쿠팡·네이버쇼핑·11번가 검색 가격, 중고·나눔은 고수템 안에서 다른 고수가 올린 매물이에요. 지금은 시범 화면이라 가격과 매물은 모두 예시예요."],
  ["중고·나눔은 어떻게 거래해요?", "다른 사이트로 넘기지 않고 고수템 안에서 이어 드려요. 매물을 고르면 판매 고수와 채팅하거나 나눔을 신청하고, 직거래는 내 동네 근처부터 보여 드려요."],
  ["화장품 중고, 괜찮을까요?", "소모품은 유통기한이 적힌 매물만 예산 플랜에 넣어요. 의약품과 개봉한 입·눈 화장품은 아예 거래를 막아요."],
  ["협찬이나 광고도 있나요?", "있을 수 있어요. 대신 숨기지 않아요. 협찬받은 물건과 제휴 링크(사면 고수템이 수수료를 받는 링크)는 물건마다 표시해요. 협찬이어도 고수가 별로라고 하면 그대로 비추천템이에요."],
  ["회원가입 꼭 해야 하나요?", "만들 땐 안 해도 돼요. 사진 올리고 초안까지 보는 데 가입이 없어요. 공개할 때 닉네임 하나만 정하면 끝이고, 비밀번호도 없어요. 카카오로 한 번 누르면 더 빨라요."],
];
const JOIN = [
  ["찰칵, 1장", "가방 속 물건을 펼쳐 놓고 사진 한 장. 물건 이름은 AI가 알아서 찾아요. 사진만 올려도 초안이 나와요."],
  ["말하거나, 누르거나 \u2014 30초", "\u201C이건 꼭 사, 이건 사지 마\u201D를 물건마다 버튼으로 고르거나, 10초씩 말해요. 녹음은 선택이에요."],
  ["쓱, 확인", "AI가 쓴 초안에서 틀린 것만 고치고 공개 버튼을 눌러요. 가입은 이때 닉네임만."],
];
function Pinned() {
  const { openModal } = useApp();
  return (
    <section className="pinned" aria-labelledby="h-pin">
      <div className="pin-head">
        <span className="pin-chip"><Icon id="spark" className="icon-xs" />안내</span>
        <h2 id="h-pin">고수 데뷔 안내 · 자주 묻는 질문</h2>
      </div>
      <Accordion variant="surface" defaultExpandedKeys={["join"]} allowsMultipleExpanded>
        <Accordion.Item id="join">
          <Accordion.Heading>
            <Accordion.Trigger><span className="join-t">내 가방 열고, 10분 만에 고수 데뷔</span><Accordion.Indicator /></Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body className="join">
              <p className="join-lead">거창한 리뷰는 필요 없어요. 매일 들고 다니는 가방이면 충분해요. 글은 AI가 쓰고, 고수님은 고르기만 해 주세요.</p>
              <ol className="join-steps">
                {JOIN.map(([t, d], k) => <li key={k}><b>{t}</b><span>{d}</span></li>)}
              </ol>
              <p className="join-plus"><Icon id="check" className="icon-xs" />안 쓰는 물건은 그 자리에서 중고·나눔으로 올려 드려요.</p>
              <Button onPress={() => openModal("supply")}><Icon id="spark" className="icon-sm" />가입 없이 먼저 만들어 보기</Button>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
        {FAQ.map(([q, a], k) => (
          <Accordion.Item key={k} id={"faq-" + k}>
            <Accordion.Heading>
              <Accordion.Trigger><span><span className="faq-q">Q</span>{q}</span><Accordion.Indicator /></Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel><Accordion.Body>{a}</Accordion.Body></Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}

/* 출시 알림 사전신청 진입 버튼 */
function PreorderCta() {
  const { go } = useApp();
  return (
    <button type="button" className="pre-cta" onClick={() => go("preorder")}>
      <Icon id="spark" />
      <span><b>출시 알림 사전신청</b><span>이메일만 남기면 열릴 때 알려 드려요</span></span>
      <Icon id="back" className="go" />
    </button>
  );
}

export default function Home() {
  return (
    <div className="view">
      <NavBar />
      <section className="pad" style={{ paddingTop: 16 }} aria-label="고수템 소식">
        <h2 className="vh">고수는 이건 사지 마도 알려줘요</h2>
        <Promo />
        <PreorderCta />
      </section>
      <Feed />
      <div className="pad" style={{ paddingTop: 28 }}>
        <Pinned />
        <p className="foot-note">모든 가방·인물·가격·재고·좋아요 수는 예시예요.</p>
      </div>
    </div>
  );
}
