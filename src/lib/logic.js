/* 고수템 계산 로직 (화면과 분리된 순수 함수) */
import { BAGS, CATS, PCATS, SELLERS, GU, PRI, T } from "../data/data.js";

export const won = (n) => "₩" + Number(n).toLocaleString("ko-KR");
export const kfmt = (n) =>
  n >= 10000 ? (Math.round(n / 1000) / 10).toFixed(1).replace(/\.0$/, "") + "만"
  : n >= 1000 ? (Math.round(n / 100) / 10).toFixed(1).replace(/\.0$/, "") + "천" : String(n);
export const normQ = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 20);
export function ago(iso) {
  const t = Date.parse(iso); if (!t) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "방금"; if (m < 60) return m + "분 전";
  const h = Math.floor(m / 60); if (h < 24) return h + "시간 전";
  const d = Math.floor(h / 24); if (d < 7) return d + "일 전";
  const dt = new Date(t); return dt.getMonth() + 1 + "월 " + dt.getDate() + "일";
}

/* 새상품·유사템 외부 검색 링크 */
export function mk(m, q) {
  const e = encodeURIComponent(q);
  return {
    "쿠팡": "https://www.coupang.com/np/search?q=" + e,
    "네이버쇼핑": "https://search.shopping.naver.com/search/all?query=" + e,
    "11번가": "https://search.11st.co.kr/Search.tmall?kwd=" + e,
  }[m];
}

export const minNew = (it) => Math.min(...it.nw.map((x) => x[1]));
export const countT = (b) => { const c = {}; Object.keys(T).forEach((k) => (c[k] = 0)); b.items.forEach((it) => c[it.t]++); return c; };
export function costOf(it) {
  if (it.t === "swap") return 0;
  if (it.t === "share") { if (it.share > 0) return 0; if (it.used.n > 0) return it.used.avg; return minNew(it); }
  if (it.t === "used") { if (it.used.n > 0) return it.used.avg; return minNew(it); }
  return minNew(it);
}
export function simList(it) {
  const base = minNew(it);
  return it.sim.map((x) => (Array.isArray(x) ? { n: x[0], p: x[1] } : { n: x, p: Math.round((base * 0.5) / 100) * 100 }));
}
export const usedOK = (it) => it.used.n > 0 && (!it.cons || !!it.used.exp);

/* ---------- 지역 ---------- */
export const allRegions = () => GU.flatMap((g) => g.dong.map((d) => ({ sido: g.sido, gu: g.gu, dong: d, full: g.sido + " " + g.gu + " " + d })));
export function nearDongs(region) {
  if (!region) return null;
  const g = GU.find((x) => x.gu === region.gu); if (!g) return null;
  return g.dong.filter((d) => d !== region.dong);
}
export function nearestGu(lat, lng) {
  let best = null, bd = 1e9;
  GU.forEach((g) => { const d = (g.lat - lat) ** 2 + ((g.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2; if (d < bd) { bd = d; best = g; } });
  return Math.sqrt(bd) * 111 > 40 ? null : best;
}

/* ---------- 고수템 안의 매물 (예시 생성) ---------- */
function sellerOf(it, k) { let h = 0; for (let j = 0; j < it.n.length; j++) h = (h * 31 + it.n.charCodeAt(j)) % 997; return SELLERS[(h + k * 3) % SELLERS.length]; }
const cache = new Map();
export function listingsOf(it, ch, region) {
  const key = it.n + "|" + ch + "|" + (region ? region.full : "");
  if (cache.has(key)) return cache.get(key);
  const q = it.q, ND = nearDongs(region); let L = [];
  if (ch === "nw") L = it.nw.map((x) => ({ src: x[0], note: "새상품", p: x[1], link: mk(x[0], q) }));
  else if (ch === "used") {
    const F = [0.8, 0.95, 1.05, 1.2, 0.88, 1.1, 0.75, 1.3], C = ["미개봉", "거의 새것", "사용감 적음", "사용감 있음"];
    for (let k = 0; k < it.used.n; k++) {
      const sl = sellerOf(it, k), direct = k % 2 === 1;
      const place = direct ? (ND ? ND[(k + it.n.length) % ND.length] + " " : "") + (0.6 + k * 0.7).toFixed(1) + "km" : "택배";
      L.push({ src: sl.n, seller: sl, cond: C[k % 4], deal: direct ? "직거래" : "택배", place, internal: true, p: Math.round((it.used.avg * F[k % 8]) / 100) * 100,
        note: C[k % 4] + " · " + place + (it.cons && it.used.exp ? " · 유통기한 " + it.used.exp : "") });
    }
  } else if (ch === "sim") L = simList(it).map((x) => ({ src: "네이버쇼핑", note: x.n, p: x.p, link: mk("네이버쇼핑", x.n) }));
  else if (ch === "share") {
    const W = ["오늘", "어제", "3일 전", "이번 주", "지난주"];
    for (let k = 0; k < it.share; k++) {
      const sl = sellerOf(it, k + 5), place = (ND ? ND[(k + it.n.length) % ND.length] + " " : "") + (0.4 + k * 0.6).toFixed(1) + "km";
      L.push({ src: sl.n, seller: sl, cond: "나눔", deal: "직거래", place, internal: true, p: 0, note: place + " · " + W[k % 5] + " 올라옴" });
    }
  } else if (ch === "have") { L = [{ src: "집에 있는 것", note: it.sub ? "대신 · " + it.sub : "이미 가진 걸로 대신", p: 0 }];
  } else if (ch === "swap") { const sl = sellerOf(it, 7); L = [{ src: sl.n, seller: sl, cond: "스왑", deal: "교환", place: "내 물건과 교환", note: "내 물건과 교환", p: 0, internal: true }]; }
  L.sort((a, c) => a.p - c.p); cache.set(key, L); return L;
}

/* 채널별 가격 요약 (가격 비교 칸) */
export function chPrice(it, ch, region) {
  const base = minNew(it);
  if (ch === "have") return { p: 0, n: 1, off: 100 };
  if (ch === "nw") { const ps = it.nw.map((x) => x[1]); return it.nw.length ? { min: Math.min(...ps), max: Math.max(...ps), n: it.nw.length } : null; }
  if (ch === "used") { if (!it.used.n) return null; const p = listingsOf(it, "used", region)[0].p; return { p, n: it.used.n, off: Math.round((1 - p / base) * 100) }; }
  if (ch === "sim") { const l = simList(it); if (!l.length) return null; const m = Math.min(...l.map((x) => x.p)); return { p: m, n: l.length, off: Math.round((1 - m / base) * 100) }; }
  if (ch === "swap") return it.t === "swap" ? { p: 0, n: 1, off: 100 } : null;
  return it.share ? { p: 0, n: it.share, off: 100 } : null;
}
export function optionsOf(it, region) {
  const o = [], base = minNew(it);
  if (it.t === "swap") o.push({ ch: "swap", p: 0 });
  if (it.share > 0) o.push({ ch: "share", p: 0 });
  if (usedOK(it)) o.push({ ch: "used", p: listingsOf(it, "used", region)[0].p });
  const sl = simList(it); if (sl.length) o.push({ ch: "sim", p: Math.min(...sl.map((x) => x.p)) });
  if (it.nw.length) o.push({ ch: "nw", p: base });
  return o.sort((a, c) => a.p - c.p);
}
export const optPrice = (it, ch, region) => { const o = optionsOf(it, region).find((x) => x.ch === ch); return o ? o.p : null; };

/* 예산 플랜: 최저 경로로 시작 → 넘치면 우선순위 낮은 것부터 빼기 → 남는 돈으로 알짜템 새상품 */
export function budgetPlan(b, budget, region) {
  const idx = b.items.map((_, i) => i).filter((i) => b.items[i].t !== "no" && optionsOf(b.items[i], region).length);
  idx.sort((x, y) => { const a = b.items[x], c = b.items[y]; return PRI[a.t] !== PRI[c.t] ? PRI[a.t] - PRI[c.t] : c.emp - a.emp; });
  const sel = {}; let sum = 0;
  idx.forEach((i) => { const o = optionsOf(b.items[i], region)[0]; sel[i] = o.ch; sum += o.p; });
  const dropped = [];
  for (let k = idx.length - 1; k >= 0 && sum > budget; k--) { const i = idx[k], p = optPrice(b.items[i], sel[i], region); if (p > 0) { sum -= p; delete sel[i]; dropped.unshift(i); } }
  idx.forEach((i) => { const it = b.items[i]; if (sel[i] === undefined || it.t !== "must" || sel[i] === "nw" || !it.nw.length) return; const d = minNew(it) - optPrice(it, sel[i], region); if (sum + d <= budget) { sel[i] = "nw"; sum += d; } });
  return { sel, sum, dropped, order: idx };
}
export function maxBudget(b, region) {
  return Math.ceil(b.items.reduce((s, it) => { if (it.t === "no") return s; const o = optionsOf(it, region); if (!o.length) return s; return s + (it.t === "must" && it.nw.length ? minNew(it) : o[0].p); }, 0) / 1000) * 1000;
}
export function defaultPlan(b, picks, region) {
  const dp = {};
  b.items.forEach((it, i) => {
    if (!picks[i]) { if (it.t !== "no") dp[i] = "skip"; return; }
    const o = optionsOf(it, region); if (!o.length) return;
    const want = { must: "nw", used: "used", share: "share", swap: "swap", no: "nw" }[it.t];
    dp[i] = (o.find((x) => x.ch === want) || o[0]).ch;
  });
  return dp;
}

/* ---------- 분류 ---------- */
export const pGroups = () => PCATS.concat(CATS.filter((c) => c.k === "sports" || c.k === "hobby"));
export const prodGroups = () => CATS.filter((c) => c.k === "beauty" || c.k === "life");
export const catHit = (cat, path) => !!cat && (cat === path || cat.indexOf(path + "/") === 0);
export const isPouchPath = (path) => pGroups().some((g) => g.k === (path || "").split("/")[0]);
export const catCount = (path) => BAGS.reduce((n, b) => n + b.items.filter((it) => catHit(it.cat, path)).length, 0);
export const pcCount = (path) => BAGS.filter((b) => (b.pc || []).some((x) => catHit(x, path))).length;
export function catName(path) {
  if (!path) return "전체";
  const p = path.split("/"), g = PCATS.concat(CATS).find((c) => c.k === p[0]); if (!g) return path;
  const out = [g.n];
  if (p[1]) { const sb = g.subs.find((x) => x.k === p[1]); if (sb) { out.push(sb.n); if (p[2] && sb.leaf) { const lf = sb.leaf.find((x) => x[0] === p[2]); if (lf) out.push(lf[1]); } } }
  return out.join(" › ");
}

/* ---------- 검색 ---------- */
export function bagMatch(b, q) {
  q = (q || "").trim().toLowerCase(); if (!q) return true;
  const hay = [b.title, b.name, b.meta, b.sub || "", b.hook || "", b.tags.join(" ")].concat(b.items.map((it) => it.n + " " + it.q)).join(" ").toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
}
export function relatedTerms(q) {
  q = normQ(q); if (!q) return [];
  const out = [];
  BAGS.forEach((b) => b.items.forEach((it) => {
    const hay = (it.n + " " + it.q).toLowerCase();
    if (hay.includes(q) || (b.title + b.tags.join(" ")).toLowerCase().includes(q)) { const t = it.q.replace(/\s*\d+.*$/, "").trim(); if (t && !out.includes(t) && normQ(t) !== q) out.push(t); }
  }));
  CATS.forEach((g) => g.subs.forEach((sb) => { if (sb.n.includes(q) && !out.includes(sb.n)) out.push(sb.n); }));
  return out.slice(0, 10);
}
export function filterBags({ pc, cat, gosu, q }) {
  const list = BAGS.filter((b) => (!pc || (b.pc || []).some((x) => catHit(x, pc))) && (!gosu || gosu === b.id));
  const shown = list.filter((b) => bagMatch(b, q) && (!cat || b.items.some((it) => catHit(it.cat, cat))));
  return { list, shown };
}
