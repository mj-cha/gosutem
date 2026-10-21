/* 화면 틀: PC 왼쪽 소개(세로 탭) + 오른쪽 앱(상단 바 · 본문 · 하단 탭) */
import { useEffect, useRef } from "react";
import { Tabs, Toast } from "@heroui/react";
import { Icon, Sprite } from "./components/Icon.jsx";
import { Promo, TBadge } from "./components/common.jsx";
import Home, { HomeTop, focusSearch } from "./screens/Home.jsx";
import Bag, { BagTop } from "./screens/Bag.jsx";
import ModalHost from "./modals/Modals.jsx";
import { BAGS, T, TORDER } from "./data/data.js";
import { AppProvider, useApp } from "./lib/store.jsx";

const DEVMAP = "https://claude.ai/artifact/9KQ7bje3a9EXoxYqtPGvA1";

function Intro() {
  return (
    <aside className="intro" aria-label="서비스 소개">
      <div className="wordmark">고수템 <small>GOSUTEM · 가칭</small><a className="devmap-chip" href={DEVMAP} target="_blank" rel="noopener">개발맵 ↗</a></div>
      <Promo />
      <Tabs orientation="vertical" className="vtabs" defaultSelectedKey="about">
        <Tabs.ListContainer>
          <Tabs.List aria-label="소개 메뉴">
            <Tabs.Tab id="about">서비스 소개<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="labels">라벨 5가지<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="install">홈 화면 추가<Tabs.Indicator /></Tabs.Tab>
            <Tabs.Tab id="dev">개발맵<Tabs.Indicator /></Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id="about"><h3>고수의 가방을 열어 봐요</h3><p>평범한 고수의 가방을 열어, 물건마다 담을지 말지 하트로 고르고 그대로 담는 서비스예요. 새상품·중고·유사템·나눔 중 어디서 구할 수 있는지 AI가 바로 찾아 줘요.</p></Tabs.Panel>
        <Tabs.Panel id="labels"><h3>고수가 붙이는 라벨</h3><ul className="legend">{TORDER.map((k) => <li key={k}><TBadge k={k} /><span>{T[k].def}</span></li>)}</ul></Tabs.Panel>
        <Tabs.Panel id="install"><h3>폰 홈 화면에 추가</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><b className="text-[.82rem]">갤럭시</b><ol className="steps"><li>폰에서 이 페이지 열기</li><li>메뉴 <b>⋮</b> 또는 <b>≡</b></li><li><b>홈 화면에 추가</b></li></ol></div>
            <div><b className="text-[.82rem]">아이폰</b><ol className="steps"><li>사파리로 열기</li><li>아래 <b>공유</b></li><li><b>홈 화면에 추가</b></li></ol></div>
          </div>
        </Tabs.Panel>
        <Tabs.Panel id="dev"><h3>개발맵</h3><p>메뉴별 개발 메모, 피드백 로그, 주석을 남기는 곳이에요.</p><a className="button button--sm button--primary mt-2 inline-flex" href={DEVMAP} target="_blank" rel="noopener">개발맵 열기 ↗</a></Tabs.Panel>
      </Tabs>
      <p className="disclaimer">시범 화면입니다. 가방·인물·가격·재고·좋아요 수는 모두 예시이고, 실제 고수의 가방은 촬영을 마친 뒤 공개합니다. 새상품 바로가기는 각 오픈마켓의 검색 결과로, 중고·나눔은 고수템 안의 다른 고수 매물로 연결돼요.</p>
    </aside>
  );
}

function TabBar({ active }) {
  const { go, toast } = useApp();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const f = () => document.documentElement.style.setProperty("--tabh", el.offsetHeight + "px");
    f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, []);
  const tabs = [["home", "home", "홈"], ["search", "search", "찾기"], ["saved", "bookmark", "저장"], ["me", "user", "내 가방"]];
  const press = (k) => {
    if (k === "home") go("home");
    else if (k === "search") { if (location.hash && location.hash !== "#home") { go("home"); setTimeout(focusSearch, 80); } else focusSearch(); }
    else toast(k === "saved" ? "저장한 가방이 여기 모여요. 시범 화면이라 비어 있어요." : "담은 물건이 여기 모여요. 시범 화면이라 비어 있어요.");
  };
  return (
    <nav className="tabbar" aria-label="주 메뉴" ref={ref}>
      {tabs.map(([k, ic, n]) => <button key={k} type="button" className="tab" aria-current={active === k ? "page" : undefined} onClick={() => press(k)}><Icon id={ic} />{n}</button>)}
    </nav>
  );
}

function Shell() {
  const { route } = useApp();
  const b = BAGS.find((x) => x.id === route);
  useEffect(() => {
    const s = document.querySelector(".scroller");
    if (s) s.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [route]);
  return (
    <div className="stage">
      <Intro />
      <div className="app">
        <header className="topbar">{b ? <BagTop b={b} /> : <HomeTop />}</header>
        <div className="scroller"><main>{b ? <Bag key={b.id} b={b} /> : <Home />}</main></div>
        <TabBar active={b ? null : "home"} />
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
