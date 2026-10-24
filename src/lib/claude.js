/* claude.ai 아티팩트에서 열었을 때만 쓰는 공유 저장소(db) + 로그인 정보(user)
   - 넷리파이 등 일반 웹에서 열면 window.claude 가 없어서 off 상태로 둠
   - 데이터 모양은 예전 화면과 똑같이 유지(댓글 talk/<uid>, 검색어 searches/<uid>) */
import { useEffect, useState, useSyncExternalStore } from "react";
import { normQ } from "./logic.js";

function createHub() {
  const st = { db: null, user: null, me: null, owner: false, off: false, talk: {}, talkReady: false, searches: {}, searchesAt: null, ver: 0 };
  const subs = new Set();
  const emit = () => { st.ver++; subs.forEach((f) => f()); };
  let started = false;
  function start() {
    if (started) return; started = true;
    const c = typeof window !== "undefined" ? window.claude : null;
    if (!c || typeof c.use !== "function") { st.off = true; emit(); return; }
    c.use("db").then((db) => {
      if (!db) { st.off = true; emit(); return; }
      st.db = db;
      c.use("user").then((u) => { st.user = u; if (!u) return null; st.owner = !!(u.isOwner && u.isOwner()); return u.id(); })
        .then((id) => { st.me = id || null; emit(); }).catch(() => emit());
      db.collection("talk").onSnapshot((snap) => {
        const d = {}; snap.docs.forEach((x) => { if (x.exists) d[x.id] = x.data(); });
        st.talk = d; st.talkReady = true; emit();
      }, () => { st.off = true; emit(); });
      db.collection("searches").onSnapshot((snap) => {
        const d = {}; snap.docs.forEach((x) => { if (x.exists) d[x.id] = x.data(); });
        st.searches = d; st.searchesAt = new Date(); emit();
      }, () => {});
    }, () => { st.off = true; emit(); });
  }
  return {
    st,
    subscribe(f) { start(); subs.add(f); return () => subs.delete(f); },
    snapshot() { return st.ver; },
    emit,
  };
}
export const hub = createHub();

export function useHub() {
  useSyncExternalStore(hub.subscribe, hub.snapshot, hub.snapshot);
  return hub.st;
}

/* ---------- 인기 검색어 ---------- */
let busy = false;
export function recordSearch(t) {
  const st = hub.st;
  if (!st.db || !st.me || busy) return;
  const mine = (st.searches[st.me] && st.searches[st.me].terms) || {}, nt = { ...mine, [t]: new Date().toISOString() };
  const ks = Object.keys(nt).sort((a, b) => (nt[b] < nt[a] ? -1 : 1)).slice(0, 20), body = {};
  ks.forEach((k) => (body[k] = nt[k]));
  busy = true;
  st.db.doc("searches/" + st.me).set({ terms: body }).then(() => {}, () => {}).then(() => { busy = false; });
}
export function topSearches(st) {
  const cut = Date.now() - 7 * 864e5, cnt = {};
  Object.keys(st.searches).forEach((uid) => {
    const t = (st.searches[uid] && st.searches[uid].terms) || {};
    Object.keys(t).forEach((k) => { if (Date.parse(t[k]) >= cut) { const n = normQ(k); if (n.length >= 2) cnt[n] = (cnt[n] || 0) + 1; } });
  });
  return Object.keys(cnt).map((k) => ({ q: k, n: cnt[k] })).sort((a, b) => b.n - a.n || a.q.localeCompare(b.q)).slice(0, 12);
}

/* ---------- 파우치 이야기(댓글) ---------- */
export const TAGS = ["후기", "질문", "꿀팁"];
export function talkItems(st, bagId) {
  const out = [];
  Object.keys(st.talk).forEach((uid) => {
    const d = st.talk[uid];
    ((d && d.items) || []).forEach((it) => {
      if (it && it.bag === bagId && typeof it.text === "string")
        out.push({ uid, nick: d.nick, ex: !!d.example, id: String(it.id), tag: TAGS.includes(it.tag) ? it.tag : "후기", text: it.text.slice(0, 300), at: String(it.at || "") });
    });
  });
  return out.sort((a, c) => (a.at < c.at ? 1 : a.at > c.at ? -1 : 0));
}
export async function talkAdd(bagId, tag, text) {
  const st = hub.st;
  if (!st.db || !st.me) return { ok: false };
  const cur = (st.talk[st.me] && st.talk[st.me].items) || [];
  const items = cur.concat([{ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), bag: bagId, tag, text: text.slice(0, 300), at: new Date().toISOString() }]).slice(-200);
  try { await st.db.doc("talk/" + st.me).set({ items }); return { ok: true }; }
  catch (e) { return { ok: false, denied: !!(e && (e.code === "permission_denied" || e.code === "invalid_argument")) }; }
}
export async function talkDelete(uid, id) {
  const st = hub.st, d = st.talk[uid];
  if (!st.db || !d) return false;
  const body = { items: (d.items || []).filter((it) => String(it.id) !== id) };
  if (d.nick) body.nick = d.nick; if (d.example) body.example = true;
  try { await st.db.doc("talk/" + uid).set(body); return true; } catch { return false; }
}
/* 이름은 매번 user.profiles 로 풀어서 표시(저장하지 않음) */
export function useProfiles(ids) {
  const [names, setNames] = useState({});
  const key = ids.join(",");
  useEffect(() => {
    const u = hub.st.user;
    if (!u || !u.profiles || !ids.length) return;
    let live = true;
    u.profiles(ids).then((ps) => { if (live) setNames(ps || {}); }).catch(() => {});
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return names;
}
