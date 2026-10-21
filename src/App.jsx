/* 화면 틀: PC 왼쪽 소개(세로 탭) + 오른쪽 앱(상단 바 · 본문 · 하단 탭) */
import { useEffect, useRef } from "react";
import { Badge, Tabs, Toast } from "@heroui/react";
import { Icon, Sprite } from "./components/Icon.jsx";
import { AvatarBadge, Promo, TBadge } from "./components/common.jsx";
import Home, { HomeTop } from "./screens/Home.jsx";
import Bag, { BagTop } from "./screens/Bag.jsx";
import BagSoon, { BagSoonTop } from "./screens/BagSoon.jsx";
import ModalHost from "./modals/Modals.jsx";
import { BAGS, SRC, SRC_DEF, T, TORDER } from "./data/data.js";
import { AppProvider, useApp } from "./lib/store.jsx";

const DEVMAP = "https://claude.ai/artifact/9KQ7bje3a9EXoxYqtPGvA1";

function Intro() {
  return (
    <aside className="intro" aria-label="서비스 소개">
      <div className="wordmark"><span className="wm-t"><small>고수의 아이템 · GOSUTEM</small>고수템</span><a className="devmap-chip" href={DEVMAP} target="_blank" rel="noopener">사업화 맵 ↗</a></div>
      <Promo />
      <Tabs orientation="vertical" className="vtabs" defaultSelectedKey="about">
        <Tabs.ListContainer>
          <Tabs.List aria-label="소개 메뉴">
            <Tabs.Tab id="about">서비스 소개<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="labels">라벨·출처<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="install">홈 화면 추가<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="dev">사업화 맵<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="about"><h3>고수의 가방을 열어 봐요</h3><p>평범한 고수의 가방을 열어, 물건마다 담을지 말지 하트로 고르고 그대로 담는 서비스예요. 새상품·중고·유사템·나눔 중 어디서 구할 수 있는지 AI가 바로 찾아 줘요.</p></Tabs.Panel>
        <Tabs.Panel id="labels"><h3>고수가 붙이는 라벨</h3><ul className="legend">{TORDER.map((k) => <li key={k}><TBadge k={k} /><span>{T[k].def}</span></li>)}</ul>
          <h3 style={{ marginTop: "1.1rem" }}>물건 출처 배지</h3>
          <ul className="legend">{Object.keys(SRC_DEF).map((k) => <li key={k}><span className={"src-tag src-" + k}>{SRC[k]}</span><span>{SRC_DEF[k]}</span></li>)}</ul>
        </Tabs.Panel>
        <Tabs.Panel id="install"><h3>폰 홈 화면에 추가</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><b className="text-[.82rem]">갤럭시</b><ol className="steps"><li>폰에서 이 페이지 열기</li><li>메뉴 <b>⋮</b> 또는 <b>≡</b></li><li><b>홈 화면에 추가</b></li></ol></div>
            <div><b className="text-[.82rem]">아이폰</b><ol className="steps"><li>사파리로 열기</li><li>아래 <b>공유</b></li><li><b>홈 화면에 추가</b></li></ol></div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel id="dev"><h3>사업화 맵</h3><p>기획부터 개발·마케팅·지식재산권까지 할 일과 단계를 관리하는 곳이에요.</p><a className="button button--sm button--primary mt-2 inline-flex" href={DEVMAP} target="_blank" rel="noopener">사업화 맵 열기 ↗</a></Tabs.Panel>
      </Tabs>
      <p className="disclaimer">시범 화면입니다. 가방·인물·가격·재고·좋아요 수는 모두 예시이고, 실제 고수의 가방은 촬영을 마친 뒤 공개합니다. 새상품 바로가기는 각 오픈마켓의 검색 결과로, 중고·나눔은 고수템 안의 다른 고수 매물로 연결돼요.</p>
    </aside>
  );
}

function TabBar({ active }) {
  const { go, toast, scrap, chosen, openModal, modal } = useApp();
  const cur = modal.open && modal.type === "search" ? "search" : active;
  const nScrap = Object.values(scrap).filter(Boolean).length;
  const nChosen = Object.values(chosen).reduce((s, n) => s + n, 0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const f = () => document.documentElement.style.setProperty("--tabh", el.offsetHeight + "px");
    f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  const tabs = [["home", "home", "홈"], ["search", "search", "찾기"], ["saved", "bookmark", "저장"], ["me", "user", "내 가방"]];
  const press = (k) => {
    if (k === "home") go("home");
    else if (k === "search") openModal("search");
    else toast(k === "saved" ? "저장한 가방이 여기 모여요. 시범 화면이라 비어 있어요." : "담은 물건이 여기 모여요. 시범 화면이라 비어 있어요.");
  };
  return (
    <nav className="tabbar" aria-label="주 메뉴" ref={ref}>
      {tabs.map(([k, ic, n]) => (
        <button key={k} type="button" className="tab" aria-current={cur === k ? "page" : undefined} onClick={() => press(k)}
          aria-label={k === "saved" && nScrap ? n + " " + nScrap + "개" : k === "me" && nChosen ? n + " " + nChosen + "개 고름" : undefined}>
          {k === "me" ? (
            /* 내 프로필 사진을 아직 안 정했으면 이니셜 자리(Fallback)가 뜸 + 고른 물건 수 배지 */
            <span className="tab-av"><AvatarBadge av="나" color="#5A6B82" size="sm" variant="primary" n={nChosen} label={"고른 물건 " + nChosen + "개"} /></span>
          ) : k === "saved" && nScrap ? (
            <Badge.Anchor><Icon id={ic} /><Badge color="accent" size="sm" variant="primary" className="min-w-5 font-semibold tabular-nums">{nScrap}</Badge></Badge.Anchor>
          ) : <Icon id={ic} />}
          {n}
        </button>
      ))}
    </nav>
  );
}

function Shell() {
  const { route } = useApp();
  /* 가방 주소: #/bag/:id (예전 #id 도 그대로 열림). 데이터가 없는 #/bag/:id 는 빈 자리 화면 */
  const bagId = route.startsWith("/bag/") ? decodeURIComponent(route.slice(5)) : route;
  const b = BAGS.find((x) => x.id === bagId);
  const soon = !b && route.startsWith("/bag/") && bagId ? bagId : null;
  useEffect(() => {
    const s = document.querySelector(".scroller");
    if (s) s.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [route]);
  return (
    <div className="stage">
      <Intro />
      <div className="app">
        <header className="topbar">{b ? <BagTop b={b} /> : soon ? <BagSoonTop /> : <HomeTop />}</header>
        <div className="scroller"><main>{b ? <Bag key={b.id} b={b} /> : soon ? <BagSoon id={soon} /> : <Home />}</main></div>
        <TabBar active={b || soon ? null : "home"} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Sprite />
      <Shell />
      <ModalHost />
      <Toast.Provider placement="bottom" />
    </AppProvider>
  );
}
