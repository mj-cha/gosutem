/* 행동 지표 저장소 (Netlify Functions + Netlify Blobs, 설정 없이 동작)
   POST /api/track              { base, events:[...] } 를 날짜별로 저장
   GET  /api/track?day=YYYY-MM-DD&token=…   그날 기록을 NDJSON 으로 내려받기 (환경변수 TRACK_TOKEN 필요)
   GET  /api/track?days=7&token=…           최근 7일 요약(이벤트별·일별 개수) */
import { getStore } from "@netlify/blobs";

const dayOf = (ms) => new Date(ms).toISOString().slice(0, 10);

export default async (req) => {
  const store = getStore("events");
  const url = new URL(req.url);

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
    const events = Array.isArray(body?.events) ? body.events.slice(0, 50) : [];
    if (!events.length) return new Response("", { status: 204 });
    const base = body.base && typeof body.base === "object" ? body.base : {};
    const ua = (req.headers.get("user-agent") || "").slice(0, 120);
    const country = req.headers.get("x-country") || "";
    const now = Date.now();
    const rows = events.map((e) => ({ ...base, ...e, t: typeof e.t === "number" ? e.t : now, ua, country }));
    const key = `${dayOf(now)}/${now}-${Math.random().toString(36).slice(2, 8)}.ndjson`;
    await store.set(key, rows.map((r) => JSON.stringify(r)).join("\n"));
    return new Response("", { status: 204 });
  }

  /* 읽기는 토큰이 맞을 때만 */
  const token = process.env.TRACK_TOKEN;
  if (!token || url.searchParams.get("token") !== token) return new Response("forbidden", { status: 403 });

  const day = url.searchParams.get("day");
  if (day) {
    const { blobs } = await store.list({ prefix: day + "/" });
    const parts = await Promise.all(blobs.map((b) => store.get(b.key)));
    return new Response(parts.filter(Boolean).join("\n"), { headers: { "Content-Type": "application/x-ndjson; charset=utf-8" } });
  }

  const days = Math.min(+url.searchParams.get("days") || 7, 31);
  const out = {};
  for (let i = 0; i < days; i++) {
    const d = dayOf(Date.now() - i * 864e5);
    const { blobs } = await store.list({ prefix: d + "/" });
    const parts = await Promise.all(blobs.map((b) => store.get(b.key)));
    const cnt = {}, sids = new Set();
    parts.filter(Boolean).join("\n").split("\n").forEach((line) => {
      if (!line) return;
      try { const r = JSON.parse(line); cnt[r.n] = (cnt[r.n] || 0) + 1; if (r.sid) sids.add(r.sid); } catch { /* 깨진 줄은 건너뜀 */ }
    });
    out[d] = { sessions: sids.size, events: cnt };
  }
  return Response.json(out);
};

export const config = { path: "/api/track" };
