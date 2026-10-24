/* 앱 전체 상태: 검색·분류·지역, 하트/공감/스크랩, 열린 모달, 화면 이동(해시) */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "@heroui/react";
import { BAGS, T } from "../data/data.js";
import { normQ } from "./logic.js";
import { recordSearch } from "./claude.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
/* 스크랩 수: 내가 스크랩하면 +1 해서 모든 화면에 같은 숫자로 보여 줌 */
export const useScraps = (b) => { const { scrap } = useContext(Ctx); return (b.scraps + (scrap[b.id] ? 1 : 0)).toLocaleString("ko-KR"); };

/* localStorage 는 막혀 있을 수 있어서 항상 try/catch */
const REG_KEY = "gosutem-region", RECENT_KEY = "gosutem-recent";
function load(key, fb) { try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v ?? fb; } catch { return fb; } }
function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* 저장 못 해도 화면은 그대로 */ } }

const routeOf = () => (location.hash || "").replace("#", "");

export function AppProvider({ children }) {
  const [route, setRoute] = useState(routeOf);
  const [region, setRegionS] = useState(() => { const v = load(REG_KEY, null); return v && v.gu ? v : null; });
  const [nav, setNav] = useState({ q: "", pc: null, cat: null, gosu: null, page: 1 });
  const [recent, setRecentS] = useState(() => { const v = load(RECENT_KEY, []); return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 8) : []; });
  const [picks, setPicks] = useState(() => Object.fromEntries(BAGS.map((b) => [b.id, b.items.map((it) => T[it.t].pick)])));
  const [emp, setEmp] = useState(() => Object.fromEntries(BAGS.map((b) => [b.id, b.items.map(() => false)])));
  const [react, setReact] = useState({});
  const [scrap, setScrap] = useState({});
  const [follow, setFollow] = useState({});
  const [chosen, setChosen] = useState({}); /* 가방별로 경로까지 고른 물건 수 (하단 '내 가방' 배지) */
  const [modal, setModal] = useState({ type: null, props: {}, open: false, seq: 0 });

  useEffect(() => {
    const f = () => setRoute(routeOf());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);

  const go = useCallback((id) => {
    if (location.hash !== "#" + id) location.hash = id; else setRoute(id);
  }, []);
  const setRegion = useCallback((r) => { setRegionS(r); save(REG_KEY, r); }, []);
  const setRecent = useCallback((a) => { setRecentS(a); save(RECENT_KEY, a); }, []);
  const commitSearch = useCallback((t) => {
    t = normQ(t); if (t.length < 2) return;
    setRecentS((cur) => { const a = [t, ...cur.filter((x) => x !== t)].slice(0, 8); save(RECENT_KEY, a); return a; });
    recordSearch(t);
  }, []);
  const patchNav = useCallback((p) => setNav((n) => ({ ...n, page: 1, ...p })), []);

  const openModal = useCallback((type, props = {}) => setModal((m) => ({ type, props, open: true, seq: m.seq + 1 })), []);
  const closeModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  const value = useMemo(() => ({
    route, go, region, setRegion, nav, setNav, patchNav, recent, setRecent, commitSearch,
    picks, setPicks, emp, setEmp, react, setReact, scrap, setScrap, follow, setFollow, chosen, setChosen,
    modal, openModal, closeModal, toast: (m) => toast(m),
  }), [route, go, region, setRegion, nav, patchNav, recent, setRecent, commitSearch, picks, emp, react, scrap, follow, chosen, modal, openModal, closeModal]);

  return <Ctx value={value}>{children}</Ctx>;
}

export const regionLabel = (r) => (r ? r.dong || r.gu : "전국");
