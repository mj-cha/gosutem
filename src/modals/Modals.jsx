/* 모든 모달(HeroUI Modal) — 열린 모달은 store 의 modal.type 하나 */
import { useMemo, useState } from "react";
import { Button, ListBox, Modal, SearchField, Tabs, Tag, TagGroup } from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { GosuAvatar, TBadge } from "../components/common.jsx";
import { ART, BAGS, GU, PCATS, CATS, PCH, TORDER } from "../data/data.js";
import {
  allRegions, catCount, filterBags, isPouchPath, listingsOf, minNew, nearestGu, optionsOf, pcCount, pGroups, prodGroups, won,
} from "../lib/logic.js";
import { useApp } from "../lib/store.jsx";

/* 공통 틀: 폰은 아래에서, PC는 가운데 · 흐린 배경 · 닫기(X) */
function Shell({ title, icon, desc, children, footer, size = "sm", className = "" }) {
  const { modal, closeModal } = useApp();
  return (
    <Modal isOpen={modal.open} onOpenChange={(v) => { if (!v) closeModal(); }}>
      <Modal.Backdrop variant="blur">
        <Modal.Container placement="auto" scroll="inside" size={size}>
          <Modal.Dialog className={className} aria-label={typeof title === "string" ? title : undefined}>
            <Modal.CloseTrigger aria-label="닫기" />
            {title && (
              <Modal.Header>
                {icon && <Modal.Icon className="bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent)]"><Icon id={icon} /></Modal.Icon>}
                <Modal.Heading>{title}</Modal.Heading>
                {desc && <p className="m-sub">{desc}</p>}
              </Modal.Header>
            )}
            <Modal.Body className="m-body">{children}</Modal.Body>
            <Modal.Footer>{footer || <Button onPress={closeModal}>닫기</Button>}</Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function Install() {
  return (
    <Shell title="홈 화면에 추가하기" icon="addhome">
      <div><b>갤럭시 (삼성 인터넷·크롬)</b><ol className="steps"><li>메뉴 <b>≡</b> 또는 <b>⋮</b> 누르기</li><li><b>현재 페이지 추가</b> 또는 <b>홈 화면에 추가</b></li><li>홈 화면의 <b>고수템</b> 아이콘으로 열기</li></ol></div>
      <div><b>아이폰 (사파리)</b><ol className="steps"><li>아래 <b>공유</b> 버튼</li><li><b>홈 화면에 추가</b></li><li>오른쪽 위 <b>추가</b></li></ol></div>
    </Shell>
  );
}
function Supply() {
  return (
    <Shell title="고수로 신청하기" icon="spark" desc="총 10분 정도면 돼요. 글은 AI가 먼저 쓰고, 고수님은 고치고 확인만 해 주세요.">
      <ol className="steps">
        <li><b>사진 1장 · 1분</b> · 물건을 펼쳐 놓고 폰으로 한 장</li>
        <li><b>음성 메모 · 5분</b> · "이건 꼭 사, 이건 사지 마"를 말로만. 질문 3개(알짜템·비추천템·후회한 것)에 답하면 돼요</li>
        <li><b>AI 초안 확인 · 3~4분</b> · AI가 사진에서 물건을 찾고, 말한 내용으로 라벨·한 줄 팁을 채워요. 틀린 것만 고치고 공개 여부 결정</li>
      </ol>
      <p className="m-note">시범 화면이라 신청서는 아직 연결되지 않았어요.</p>
    </Shell>
  );
}
function Profile({ b }) {
  return (
    <Shell title={b.name} desc={b.meta}>
      <div className="flex items-center gap-3"><GosuAvatar av={b.av} color={b.avc} size="lg" /><span className="who-t"><b>{b.name}</b><span className="desc-sm">@{b.handle || b.id}</span></span></div>
      <div className="words" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="word"><span className="k">공개 가방</span><span className="v num">1</span></div>
        <div className="word"><span className="k">좋아요</span><span className="v num">{b.likes}</span></div>
        <div className="word"><span className="k">물건</span><span className="v num">{b.items.length}</span></div>
      </div>
      <div className="tbadges">{TORDER.map((k) => <TBadge key={k} k={k} n={b.items.filter((it) => it.t === k).length} />)}</div>
      <p className="m-note">프로필의 숫자는 예시예요. 고수가 가방을 더 공개하면 여기에 쌓여요.</p>
    </Shell>
  );
}

/* 아직 하나도 안 골랐을 때: 라벨 기본값을 먼저 보여 주고 확인하면 한 번에 고르기 */
function Recommend({ b, dp, region, onOk }) {
  const { closeModal } = useApp();
  let tot = 0, all = 0;
  const rows = b.items.map((it, i) => {
    const c = dp[i]; if (!c || c === "skip") return null;
    const pr = listingsOf(it, c, region)[0].p; tot += pr; all += minNew(it);
    return <li key={i}><span className="co-n"><span>{it.n}</span></span><span className="pick-chip" data-ch={c}>{PCH[c]}</span><span className="co-p num">{pr ? won(pr) : "무료"}</span></li>;
  });
  return (
    <Shell title="고수 추천대로 고를까요?" icon="spark" desc="라벨대로 골라 둘게요. 알짜템은 새상품, 중고템은 중고, 나눔템은 나눔, 스왑템은 스왑이에요. 나중에 하나씩 바꿀 수 있어요."
      footer={<><Button variant="tertiary" onPress={closeModal}>취소</Button><Button onPress={() => { onOk(); closeModal(); }}>이대로 고르기</Button></>}>
      <section className="co-g"><ul>{rows}</ul></section>
      <div className="co-total"><span>예상 합계 <em className="save-off num">-{all ? Math.round((1 - tot / all) * 100) : 0}%</em></span><b className="num">{won(tot)}</b></div>
    </Shell>
  );
}

/* 일괄 구매: 경로별로 묶어서 한 화면에 */
function Checkout({ b, plan, picks, pickOf }) {
  const { closeModal, toast } = useApp();
  const [copied, setCopied] = useState(false);
  const groups = { nw: [], used: [], sim: [], share: [], swap: [] };
  let total = 0, all = 0;
  b.items.forEach((it, i) => { const c = plan[i]; if (!picks[i] || !c || c === "skip") return; const pk = pickOf(i), p = pk ? pk.p : 0; total += p; all += minNew(it); groups[c].push({ it, i, p, pk }); });
  const lines = [];
  const req = (w) => toast(w + " 요청은 시범 화면이라 아직 연결되지 않아요.");
  const secs = Object.keys(groups).filter((c) => groups[c].length).map((c) => {
    const g = groups[c], sub = g.reduce((s, x) => s + x.p, 0);
    return (
      <section className="co-g" key={c}>
        <div className="co-h"><b>{PCH[c]} {g.length}개</b><span className="num">{sub ? won(sub) : "무료"}</span></div>
        <ul>{g.map(({ it, i, p, pk }) => {
          pk = pk || { src: "", note: "" };
          const word = c === "share" ? "나눔" : c === "swap" ? "스왑" : "채팅";
          const act = pk.internal ? <button type="button" className="link-btn" onClick={() => req(word)}>{c === "share" ? "나눔 신청" : c === "swap" ? "스왑 요청" : "채팅하기"}</button>
            : pk.link ? <a href={pk.link} target="_blank" rel="noopener">{c === "nw" ? "바로가기" : "찾아보기"}<Icon id="out" className="icon-sm" /></a>
            : <button type="button" className="link-btn" onClick={() => req(c === "swap" ? "스왑" : "나눔")}>{c === "swap" ? "스왑 요청" : "나눔 신청"}</button>;
          lines.push("[" + PCH[c] + "] " + it.n + " · " + (pk.src || "") + " · " + (p ? won(p) : "무료") + (pk.link ? " · " + pk.link : ""));
          return <li key={i}><span className="co-n"><span>{it.n}</span><small>{pk.src + (pk.note && c !== "nw" ? " · " + pk.note : "")}</small></span><span className="co-p num">{p ? won(p) : "무료"}</span><span className="co-a">{act}</span></li>;
        })}</ul>
      </section>
    );
  });
  const copy = () => {
    const t = "고수템 · " + b.title + "\n" + lines.join("\n") + "\n합계 " + won(total);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => setCopied(true), () => toast("복사하지 못했어요."));
    else toast("이 브라우저는 복사를 지원하지 않아요.");
  };
  return (
    <Shell title="일괄 구매" icon="bag" desc="경로별로 묶었어요. 쇼핑몰은 각각 결제하고, 중고·나눔·스왑은 연결 요청을 보내요."
      footer={<><Button variant="tertiary" onPress={copy}>{copied ? "복사했어요" : "목록 복사"}</Button><Button onPress={closeModal}>닫기</Button></>}>
      <div className="co">{secs}</div>
      <div className="co-total"><span>합계</span><b className="num">{won(total)}</b></div>
      <p className="m-note"><span className="ok-line">전부 새로 사는 것보다 {won(all - total)} 아껴요</span> · 예상 가격이에요. 시범 화면이라 결제·신청은 연결되지 않아요.</p>
    </Shell>
  );
}

/* 고수 매물 상세 */
const WHY = { "미개봉": "뜯지도 않은 새것이에요. 선물 받았거나 두 개 사서 남았대요.", "거의 새것": "몇 번만 쓰고 넣어 둔 거예요.", "사용감 적음": "한 시즌 쓰고 바꿔서 정리하는 거예요.", "사용감 있음": "충분히 쓴 만큼 가격을 확 낮췄어요." };
function Listing({ b, i, ch, k, region, finalize }) {
  const { closeModal, toast } = useApp();
  const it = b.items[i], L = listingsOf(it, ch, region), x = L[k], base = minNew(it), off = x.p ? Math.round((1 - x.p / base) * 100) : 100, sl = x.seller, others = L.filter((_, j) => j !== k);
  const why = ch === "share" ? "고수가 다 못 쓰고 남은 걸 그냥 넘기는 거예요. 받으러 가기만 하면 돼요."
    : ch === "swap" ? "고수가 써 보니 취향(향·색·사이즈)에 안 맞아 내 물건과 바꾸고 싶대요." : WHY[x.cond] || "";
  const word = ch === "share" ? "나눔 신청" : ch === "swap" ? "스왑 요청" : "채팅하기";
  return (
    <Shell title={PCH[ch] + " 매물"} size="md"
      footer={<><Button variant="tertiary" onPress={() => toast((ch === "share" ? "나눔 신청" : ch === "swap" ? "스왑 요청" : "채팅") + "은 시범 화면이라 아직 연결되지 않아요.")}>{word}</Button><Button onPress={() => { closeModal(); finalize(i, ch, k); }}>이걸로 고르기</Button></>}>
      <div className="ld-photo"><span className="ex-badge ex">예시</span><svg viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[it.art] }} /><span className="ld-ph">고수가 찍은 실물 사진 자리</span></div>
      <div className="who"><GosuAvatar av={sl.av} color={sl.c} size="md" /><span className="who-t"><span className="name">{sl.n} 고수 <span className="l-badge">고수템</span></span><span className="meta">@{sl.h} · 거래 {sl.deals}회 · {x.place}</span></span></div>
      <div className="ld-title"><span className="ld-cond">{x.cond}</span>{it.cons && ch === "used" && it.used.exp ? <span className="ld-cond ok">유통기한 확인</span> : null}<h4>{it.n}</h4></div>
      <div className="ld-price">{x.p ? <><em className="num">-{off}%</em><b className="num">{won(x.p)}</b></> : <b>무료 {ch === "swap" ? "교환" : "나눔"}</b>}<s className="num">{won(base)}</s></div>
      <section className="ld-sec"><h5>어떻게 이 가격이죠?</h5><p>{why}</p></section>
      {it.cons ? <section className="ld-sec"><h5>사용기한</h5><p>{it.used.exp && ch !== "share" ? <>유통기한 <b>{it.used.exp}</b>까지 · 고수가 직접 확인했어요</> : "개봉일과 남은 양은 채팅으로 꼭 물어보세요"}</p></section> : null}
      <section className="ld-sec"><h5>가격 비교</h5><div className="ld-cmp"><span>새상품 최저가</span><b className="num">{won(base)}</b></div>{others.length > 0 && <div className="ld-cmp"><span>다른 고수 매물 {others.length}개</span><b className="num">{won(Math.min(...others.map((y) => y.p)))}부터</b></div>}</section>
      <section className="ld-sec"><h5>거래 방식</h5><p>{x.deal === "택배" ? "택배 거래 · 배송비 ₩3,500 (예시) · 고수템 안전결제" : x.deal === "교환" ? "만나서 교환 또는 서로 택배" : "직거래 · " + x.place + " · 만나서 확인하고 거래"}</p></section>
      <section className="ld-sec"><h5>물건 설명</h5><p>{it.tip}</p>{it.note && <p className="ld-warn">{it.note}</p>}</section>
      <p className="ld-legal">고수 간 거래는 판매 고수에게 책임이 있어요. 고수템은 거래 장소를 이어 주고, 의약품·개봉한 입·눈 화장품은 거래를 막아요.</p>
    </Shell>
  );
}

/* 필터: 파우치 분류 · 물건 종류 · 고수 (당근처럼 칩) */
function Filter() {
  const { nav, patchNav, closeModal } = useApp();
  const [t, setT] = useState({ pc: nav.pc, cat: nav.cat, gosu: nav.gosu });
  const count = useMemo(() => filterBags({ ...t, q: nav.q }).shown.length, [t, nav.q]);
  const pick = (k) => (keys) => { const v = [...keys][0]; setT((s) => ({ ...s, [k]: v === "__all" || v == null ? null : String(v) })); };
  const tg = (t.pc || "").split("/")[0], g = tg ? pGroups().find((x) => x.k === tg) : null;
  const chip = (id, label, cnt) => <Tag key={id} id={id} textValue={label} className={cnt === 0 ? "zero" : ""}>{label}{cnt ? <span className="cnt-n num">{cnt}</span> : null}</Tag>;
  return (
    <Shell title="필터" size="md"
      footer={<><Button variant="tertiary" onPress={() => setT({ pc: null, cat: null, gosu: null })}>초기화</Button><Button onPress={() => { patchNav(t); closeModal(); }}>{count}개 가방 보기</Button></>}>
      <section className="fm-sec">
        <h4>파우치 분류 <span>상황·취미</span></h4>
        <TagGroup aria-label="파우치 분류" className="chips" selectionMode="single" size="sm" selectedKeys={[tg || "__all"]} onSelectionChange={pick("pc")}>
          <TagGroup.List>{[chip("__all", "전체"), ...pGroups().map((x) => chip(x.k, x.n, pcCount(x.k)))]}</TagGroup.List>
        </TagGroup>
        {g && (
          <div className="fm-sub">
            <TagGroup aria-label={g.n + " 세부"} className="chips" selectionMode="single" size="sm" selectedKeys={t.pc && t.pc !== tg ? [t.pc] : []} onSelectionChange={(keys) => { const v = [...keys][0]; setT((s) => ({ ...s, pc: v ? String(v) : tg })); }}>
              <TagGroup.List>{g.subs.map((sb) => chip(tg + "/" + sb.k, sb.n, pcCount(tg + "/" + sb.k)))}</TagGroup.List>
            </TagGroup>
          </div>
        )}
      </section>
      <section className="fm-sec">
        <h4>물건 종류 <span>가방 속 물건으로 찾기</span></h4>
        {prodGroups().map((pg) => (
          <div key={pg.k} className="grid gap-1.5">
            <div className="fm-g">{pg.n}</div>
            <TagGroup aria-label={pg.n} className="chips" selectionMode="single" size="sm" selectedKeys={t.cat && (t.cat === pg.k || t.cat.startsWith(pg.k + "/")) ? [t.cat] : []} onSelectionChange={pick("cat")}>
              <TagGroup.List>{[chip(pg.k, pg.n + " 전체", catCount(pg.k)), ...pg.subs.map((sb) => chip(pg.k + "/" + sb.k, sb.n, catCount(pg.k + "/" + sb.k)))]}</TagGroup.List>
            </TagGroup>
          </div>
        ))}
      </section>
      <section className="fm-sec">
        <h4>고수</h4>
        <ListBox aria-label="고수 고르기" className="gosu-lb" selectionMode="single" selectedKeys={[t.gosu || "__all"]} disallowEmptySelection
          onSelectionChange={(keys) => { const v = [...keys][0]; setT((s) => ({ ...s, gosu: v === "__all" ? null : String(v) })); }}>
          <ListBox.Item id="__all" textValue="전체 고수">
            <GosuAvatar av={<Icon id="user" className="icon-sm" />} color="#8A9AB4" />
            <span className="who-t"><span className="text-sm font-semibold">전체 고수</span><span className="desc-sm">{BAGS.length}명의 가방을 모두 봐요</span></span>
            <ListBox.ItemIndicator />
          </ListBox.Item>
          {BAGS.map((b) => (
            <ListBox.Item key={b.id} id={b.id} textValue={b.name}>
              <GosuAvatar av={b.av} color={b.avc} />
              <span className="who-t min-w-0"><span className="text-sm font-semibold">{b.name}</span><span className="desc-sm truncate">@{b.handle} · {b.meta}</span></span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </section>
    </Shell>
  );
}

/* 전체 분류: 왼쪽 대분류(세로 탭), 오른쪽 중분류·소분류 */
function Category() {
  const { nav, patchNav, closeModal } = useApp();
  const [cur, setCur] = useState((nav.pc || nav.cat || "").split("/")[0] || "work");
  const groups = [...pGroups(), ...prodGroups()];
  const choose = (v) => {
    if (isPouchPath(v)) patchNav({ pc: v }); else patchNav({ cat: v });
    closeModal();
    setTimeout(() => { const f = document.querySelector(".feed"); if (f) f.scrollIntoView({ block: "start", behavior: "smooth" }); }, 200);
  };
  const right = (gk) => {
    const pouch = pGroups().some((x) => x.k === gk), cnt0 = pouch ? pcCount : catCount, g = PCATS.concat(CATS).find((c) => c.k === gk);
    return (
      <>
        <div className="cp-r-h"><b>{g.n} <span className="desc-sm">{pouch ? "파우치 분류" : "물건 종류"}</span></b><button type="button" className="link-btn" onClick={() => choose(g.k)}>{g.n} 전체 보기 ›</button></div>
        {g.subs.map((sb) => {
          const path = g.k + "/" + sb.k, cnt = cnt0(path);
          if (sb.leaf) return (
            <section className="cp-sec" key={path}>
              <div className="cp-sh"><span>{sb.n}{cnt ? <> <span className="cp-n num">{cnt}</span></> : null}</span><button type="button" className="link-btn" onClick={() => choose(path)}>더보기 ›</button></div>
              <div className="cp-leaf">{sb.leaf.map((lf) => { const lp = path + "/" + lf[0], c2 = cnt0(lp); return <button type="button" key={lp} className={"cp-lf" + (c2 ? "" : " zero") + (nav.cat === lp ? " on" : "")} onClick={() => choose(lp)}>{lf[1]}{c2 ? <> <span className="num">{c2}</span></> : null}</button>; })}</div>
            </section>
          );
          return <button type="button" key={path} className={"cp-one" + (cnt ? "" : " zero") + (nav.cat === path || nav.pc === path ? " on" : "")} onClick={() => choose(path)}><span>{sb.n}</span>{cnt ? <span className="num">{cnt}{pouch ? "개 가방" : ""}</span> : <span className="cp-soon">모집 중</span>}</button>;
        })}
      </>
    );
  };
  return (
    <Shell title="전체 분류" size="md"
      footer={<><Button variant="tertiary" onPress={() => { patchNav({ cat: null, pc: null }); closeModal(); }}>선택 해제</Button><Button onPress={closeModal}>닫기</Button></>}>
      <div className="cp">
        <Tabs orientation="vertical" selectedKey={cur} onSelectionChange={(k) => setCur(String(k))}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="대분류">
              {groups.map((c) => <Tabs.Tab key={c.k} id={c.k}><Icon id={c.ic} className="icon-sm" />{c.n}<Tabs.Indicator /></Tabs.Tab>)}
            </Tabs.List>
          </Tabs.ListContainer>
          {groups.map((c) => <Tabs.Panel key={c.k} id={c.k} className="cp-r">{right(c.k)}</Tabs.Panel>)}
        </Tabs>
      </div>
      <p className="m-note">파우치 분류는 상황·취미로 가방을 고르고, 물건 종류는 가방 속 물건으로 찾아요. ‘모집 중’은 아직 가방이 없는 곳이에요.</p>
    </Shell>
  );
}

/* 지역 (중고 직거래·나눔·스왑에만 씀) */
const REC = ["인천광역시 연수구 송도동", "서울특별시 강남구 역삼동", "서울특별시 서초구 서초동", "서울특별시 관악구 신림동", "경기도 성남시 분당구 정자동", "강원특별자치도 춘천시 석사동", "서울특별시 마포구 서교동", "서울특별시 송파구 잠실동"];
function Region() {
  const { region, setRegion, closeModal, toast } = useApp();
  const [q, setQ] = useState("");
  const cur = region ? GU.find((x) => x.gu === region.gu) || GU[0] : GU[0];
  const pick = (full) => { const r = allRegions().find((x) => x.full === full); if (!r) return; setRegion(r); closeModal(); toast(r.dong + "(으)로 바꿨어요. 근처 중고·나눔부터 보여 드려요."); };
  const geo = () => {
    if (!navigator.geolocation) { toast("이 브라우저는 위치를 쓸 수 없어요. 지역 이름으로 골라 주세요."); return; }
    toast("현재 위치를 확인하는 중이에요…");
    navigator.geolocation.getCurrentPosition((pos) => {
      const best = nearestGu(pos.coords.latitude, pos.coords.longitude);
      if (!best) { toast("근처에 등록된 지역이 아직 없어요. 지역 이름으로 골라 주세요."); return; }
      const r = { sido: best.sido, gu: best.gu, dong: best.dong[0], full: best.sido + " " + best.gu + " " + best.dong[0], approx: true };
      setRegion(r); closeModal(); toast(r.gu + " 근처로 설정했어요.");
    }, () => toast("위치 권한이 없어서 쓸 수 없어요. 지역 이름으로 골라 주세요."), { timeout: 8000, maximumAge: 600000 });
  };
  const t = q.trim(), hits = t ? allRegions().filter((x) => t.split(/\s+/).every((w) => x.full.includes(w))).slice(0, 30) : [];
  const chips = (list, full, label) => (
    <TagGroup aria-label={label} className="chips" selectionMode="single" size="sm" selectedKeys={region ? [region.full] : []} onSelectionChange={(k) => { const v = [...k][0]; if (v) pick(String(v)); }}>
      <TagGroup.List>{list.map((x) => { const f = full ? x : cur.sido + " " + cur.gu + " " + x; return <Tag key={f} id={f} textValue={x}>{x}</Tag>; })}</TagGroup.List>
    </TagGroup>
  );
  return (
    <Shell title="지역 변경" size="md"
      footer={<><Button variant="tertiary" onPress={() => { setRegion(null); closeModal(); }}>전국으로 보기</Button><Button onPress={closeModal}>닫기</Button></>}>
      <SearchField aria-label="지역 이름" value={q} onChange={setQ} autoFocus fullWidth>
        <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="예) 서울특별시, 마포구, 아현동" autoComplete="off" /><SearchField.ClearButton /></SearchField.Group>
      </SearchField>
      <Button fullWidth variant="secondary" onPress={geo}><Icon id="target" className="icon-sm" />현재 위치로 검색</Button>
      {t ? (
        <div className="rg-res">{hits.length ? hits.map((x) => <button type="button" key={x.full} className="rg-row" onClick={() => pick(x.full)}>{x.full}</button>)
          : <p className="m-note">‘{t}’ 지역을 찾지 못했어요. 시범 화면이라 일부 지역만 들어 있어요.</p>}</div>
      ) : (
        <>
          <div className="rg-h">주변 지역 <span>{cur.sido + " " + cur.gu}</span></div>
          {chips(cur.dong, false, "주변 지역")}
          <div className="rg-h">추천 지역</div>
          {chips(REC, true, "추천 지역")}
        </>
      )}
      <p className="m-note">지역은 중고 직거래·나눔·스왑에 써요. 고수 가방 글은 어디서나 볼 수 있어요. 이 기기에만 저장돼요.</p>
    </Shell>
  );
}

const MAP = { install: Install, supply: Supply, profile: Profile, recommend: Recommend, checkout: Checkout, listing: Listing, filter: Filter, category: Category, region: Region };
export default function ModalHost() {
  const { modal } = useApp();
  const C = modal.type && MAP[modal.type];
  return C ? <C key={modal.seq} {...modal.props} /> : null;
}
