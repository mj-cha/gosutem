/* 행동 지표 기록: 화면 이동·경로 선택·외부 링크 클릭 등을 모아 /api/track 으로 보내요.
   - 개인 식별 정보는 보내지 않아요 (익명 세션 번호만, 기기에만 저장)
   - localStorage 가 막혀 있으면 세션 번호를 매번 새로 만들어요
   - 2초마다 또는 화면을 떠날 때(sendBeacon) 묶어서 보내요 */

const KEY = "gosutem-sid";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "ref"];

function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function sid() {
  try { let v = localStorage.getItem(KEY); if (!v) { v = rid(); localStorage.setItem(KEY, v); } return v; }
  catch { return rid(); }
}
function utm() {
  const q = new URLSearchParams(location.search), o = {};
  UTM.forEach((k) => { const v = q.get(k); if (v) o[k] = v.slice(0, 60); });
  return o;
}

const base = { sid: sid(), w: Math.min(window.innerWidth || 0, 9999), ref: (document.referrer || "").slice(0, 120), ...utm() };
let q = [], timer = null;

function flush(beacon) {
  if (!q.length) return;
  const body = JSON.stringify({ base, events: q.splice(0, 50) });
  if (beacon && navigator.sendBeacon) { navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" })); return; }
  fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

/* track("bag_view", { bag: "b1" }) 처럼 써요. 값은 짧은 문자열·숫자만 */
export function track(name, data = {}) {
  if (!name) return;
  const d = {};
  Object.entries(data).forEach(([k, v]) => { if (v == null) return; d[k] = typeof v === "number" ? v : String(v).slice(0, 80); });
  q.push({ n: name, t: Date.now(), r: (location.hash || "").slice(1, 40), ...d });
  if (q.length >= 20) flush(false);
  else if (!timer) timer = setTimeout(() => { timer = null; flush(false); }, 2000);
}

/* 외부 링크(판매처 바로가기 등) 클릭은 컴포넌트를 안 고치고 문서 전체에서 잡아요 */
document.addEventListener("click", (e) => {
  const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  let host = "";
  try { host = new URL(a.href, location.href).host; } catch { return; }
  if (!host || host === location.host) return;
  track("outbound", { host, text: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 40) });
  flush(true);
}, true);

window.addEventListener("pagehide", () => flush(true));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(true); });

track("visit");
