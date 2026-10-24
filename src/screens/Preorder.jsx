/* 출시 알림 사전신청 (Netlify Forms) + 없는 주소 안내 — 1주차 HTML 버전(#3·bugfix)을 React로 옮김 */
import { useMemo, useState } from "react";
import { track } from "../lib/track.js";
import { Button } from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { useApp } from "../lib/store.jsx";

const SITS = ["대학생", "직장인", "여행", "수영", "러닝", "골프", "낚시"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"];

function readUtm() {
  const o = {};
  try { const q = new URLSearchParams(location.search); UTM_KEYS.forEach((k) => { o[k] = (q.get(k) || "").slice(0, 100); }); } catch { /* 주소를 못 읽어도 신청은 됨 */ }
  return o;
}

/* 뒤로 + 제목만 있는 상단 바 */
export function SimpleTop({ title }) {
  const { go } = useApp();
  return (
    <>
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="뒤로" onPress={() => go("home")}><Icon id="back" /></Button>
      <h1 className="bar-title">{title}</h1>
    </>
  );
}

export function Missing() {
  const { go } = useApp();
  return (
    <div className="view pad" style={{ paddingTop: 24 }}>
      <div className="empty">
        <h3>가방을 찾을 수 없어요</h3>
        <p>주소가 바뀌었거나 아직 공개되지 않은 가방이에요.</p>
        <Button onPress={() => go("home")}>다른 가방 보러 가기</Button>
      </div>
    </div>
  );
}

export default function Preorder() {
  const { go } = useApp();
  const utm = useMemo(readUtm, []);
  const [email, setEmail] = useState("");
  const [sits, setSits] = useState([]);
  const [openBag, setOpenBag] = useState(false);
  const [agree, setAgree] = useState(false);
  const [bot, setBot] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const toggleSit = (s) => setSits((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  const submit = (e) => {
    e.preventDefault(); setErr("");
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr("이메일 주소를 확인해 주세요."); document.getElementById("pre-email")?.focus(); return; }
    if (!agree) { setErr("개인정보 수집·이용에 동의해야 신청할 수 있어요."); document.getElementById("pre-agree")?.focus(); return; }
    const p = new URLSearchParams();
    p.append("form-name", "preorder"); p.append("bot-field", bot); p.append("email", em);
    p.append("interest", sits.join(", ")); p.append("open_bag", openBag ? "yes" : "no"); p.append("privacy_agree", "yes");
    UTM_KEYS.forEach((k) => p.append(k, utm[k] || ""));
    setSending(true);
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: p.toString() })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); track("preorder_done", { interest: sits.join("|"), open_bag: openBag ? 1 : 0 }); setDone(true); window.scrollTo(0, 0); document.querySelector(".scroller")?.scrollTo(0, 0); })
      .catch(() => { setSending(false); setErr("신청을 보내지 못했어요. 잠시 뒤 다시 해 주세요."); });
  };

  if (done) {
    return (
      <div className="view pad">
        <section className="pre-done" aria-live="polite">
          <Icon id="check" />
          <h2>사전신청을 받았어요</h2>
          <p>고수템이 열리면 남겨 주신 이메일로 알려 드릴게요.</p>
          <p>그동안 고수의 가방을 먼저 구경해 보세요. 지금 가방은 모두 예시예요.</p>
          <Button size="lg" onPress={() => go("home")}>가방 구경하러 가기</Button>
        </section>
      </div>
    );
  }

  return (
    <div className="view pad">
      <section className="pre-hero" aria-labelledby="pre-h">
        <p>누구나 좋아하는 거 하나쯤은 있다</p>
        <p>누구나 고수가 될 수 있다</p>
        <h2 id="pre-h">내 시간도,<br />내 돈도 아까우니까.</h2>
      </section>
      <form className="pre-form" name="preorder" method="POST" data-netlify="true" netlify-honeypot="bot-field" noValidate onSubmit={submit}>
        <input type="hidden" name="form-name" value="preorder" />
        {UTM_KEYS.map((k) => <input key={k} type="hidden" name={k} value={utm[k] || ""} />)}
        <p className="pre-hp" aria-hidden="true"><label>비워 두세요 <input name="bot-field" tabIndex={-1} autoComplete="off" value={bot} onChange={(e) => setBot(e.target.value)} /></label></p>

        <div className="pre-field">
          <label className="pre-label" htmlFor="pre-email">이메일<span className="req">필수</span></label>
          <input className="pre-input" type="email" id="pre-email" name="email" required autoComplete="email" inputMode="email" placeholder="you@example.com" aria-describedby="pre-email-h" value={email} onChange={(e) => setEmail(e.target.value)} />
          <p className="pre-help" id="pre-email-h">출시 알림과 서비스 안내만 보내요.</p>
        </div>

        <fieldset>
          <legend className="pre-label">관심 있는 상황<span className="opt">여러 개 골라도 돼요</span></legend>
          <div className="pre-sits">
            {SITS.map((s, i) => (
              <label key={s} className="pre-sit" data-on={sits.includes(s)}>
                <input type="checkbox" id={"pre-s" + i} name="interest" value={s} checked={sits.includes(s)} onChange={() => toggleSit(s)} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="pre-check" htmlFor="pre-open">
          <input type="checkbox" id="pre-open" name="open_bag" value="yes" checked={openBag} onChange={(e) => setOpenBag(e.target.checked)} />
          <span>내 가방을 고수로 공개해 볼래요<span className="opt">선택</span></span>
        </label>

        <div className="pre-privacy">
          <dl>
            <dt>수집 항목</dt><dd>이메일, 관심 상황, 가방 공개 희망 여부</dd>
            <dt>이용 목적</dt><dd>고수템 출시 알림과 서비스 안내</dd>
            <dt>보유 기간</dt><dd>출시 알림 발송 후 6개월, 또는 동의를 철회하면 바로 지워요</dd>
            <dt>동의 거부</dt><dd>동의하지 않을 수 있어요. 동의하지 않으면 사전신청이 안 돼요</dd>
          </dl>
          <p className="pre-help">운영자: MJ Cha · 문의: awethings.cha@gmail.com</p>
          <label className="pre-check" htmlFor="pre-agree">
            <input type="checkbox" id="pre-agree" name="privacy_agree" value="yes" required checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>개인정보 수집·이용에 동의해요<span className="req">필수</span></span>
          </label>
        </div>

        <p className="pre-err" role="alert">{err}</p>
        <Button type="submit" size="lg" fullWidth isDisabled={sending}>{sending ? "보내는 중이에요…" : "사전신청하기"}</Button>
      </form>
    </div>
  );
}
