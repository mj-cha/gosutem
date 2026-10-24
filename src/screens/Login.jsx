/* 로그인·회원가입 (#login) — 레이아웃은 회원가입.png(가운데 로고 → 카드 → 로그인/회원가입 탭 → 입력칸 → 버튼 → 데모 계정 → 돌아가기)
   색·글꼴·글자 크기는 메인 기준(어두운 바탕·라임 강조·글자 배율) (10/25 MJ)
   시범 화면: 실제 가입은 되지 않고, 입력한 이메일·비밀번호는 저장하지 않음. 이름·가입 경로만 이 기기에 남김 */
import { useState } from "react";
import { Icon } from "../components/Icon.jsx";
import { Lines } from "../components/common.jsx";
import { useApp } from "../lib/store.jsx";

export default function Login() {
  const { member, setMember, finishLogin, loginWhy, toast, go } = useApp();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const why = loginWhy();
  const join = mode === "join";

  const done = (via, nm) => { finishLogin({ name: nm || "나", via }); toast((join ? "가입했어요" : "로그인했어요") + " (시범) · 이어서 진행할게요."); };
  const submit = (e) => {
    e.preventDefault(); setErr("");
    if (join && !name.trim()) { setErr("이름을 적어 주세요."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("이메일 주소를 확인해 주세요."); return; }
    if (pw.length < 8) { setErr("비밀번호는 8자 이상이에요."); return; }
    if (join && !agree) { setErr("이용약관·개인정보처리방침에 동의해 주세요."); return; }
    setPw(""); done("email", name.trim());
  };
  const social = (via) => { if (join && !agree) { setErr("이용약관·개인정보처리방침에 동의해 주세요."); return; } done(via); };

  return (
    <div className="view login pad">
      <div className="lg-logo"><span className="lg-mark"><Icon id="bag" /></span><b>고수템</b><small>GOSUTEM</small></div>

      <div className="lg-card">
        {member ? (
          <>
            <h2 className="lg-title">{member.name}님, 로그인돼 있어요</h2>
            <p className="lg-sub">{member.via === "email" ? "이메일" : member.via}로 로그인했어요. (시범)</p>
            <button type="button" className="o-btn lime lg-wide" onClick={() => go("home")}>가방 구경하러 가기</button>
            <button type="button" className="lg-demo" onClick={() => { setMember(null); toast("로그아웃했어요."); }}>로그아웃</button>
          </>
        ) : (
          <>
            <div className="lg-tabs" role="tablist" aria-label="로그인 또는 회원가입">
              <button type="button" role="tab" aria-selected={!join} onClick={() => { setMode("login"); setErr(""); }}>로그인</button>
              <button type="button" role="tab" aria-selected={join} onClick={() => { setMode("join"); setErr(""); }}>회원가입</button>
            </div>

            <h2 className="lg-title">{join ? "고수템에 들어오세요" : "다시 오셨네요, 고수님"}</h2>
            <p className="lg-sub">{why ? <Lines t={why + " 로그인하면 바로 이어서 할게요."} /> : join ? "가입하면 가방 저장·고수 팔로우·내 가방을 쓸 수 있어요." : "저장한 가방과 팔로우한 고수를 이어서 볼게요."}</p>

            <form className="lg-form" noValidate onSubmit={submit}>
              {join && <label className="lg-field"><span>이름</span><input autoComplete="name" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} /></label>}
              <label className="lg-field"><span>이메일</span><input type="email" autoComplete="email" inputMode="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="lg-field"><span>비밀번호</span><input type="password" autoComplete={join ? "new-password" : "current-password"} placeholder="8자 이상" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
              {join && (
                <label className="lg-agree">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span><a href="#terms">이용약관</a>과 <a href="#privacy">개인정보처리방침</a>에 동의해요 <em>필수</em></span>
                </label>
              )}
              <p className="lg-err" role="alert">{err}</p>
              <button type="submit" className="o-btn lime lg-wide">{join ? "가입하고 시작하기" : "로그인"}</button>
            </form>

            <div className="lg-or"><span>간편 {join ? "가입" : "로그인"}</span></div>
            <div className="lg-social">
              <button type="button" className="lg-sbtn kakao" onClick={() => social("카카오")}>카카오</button>
              <button type="button" className="lg-sbtn naver" onClick={() => social("네이버")}>네이버</button>
              <button type="button" className="lg-sbtn apple" onClick={() => social("Apple")}>Apple</button>
            </div>

            <div className="lg-line" />
            <p className="lg-demo-k">데모 계정으로 둘러보기 (체험 모드라 저장은 이 기기에만 돼요)</p>
            <button type="button" className="lg-demo" onClick={() => done("데모 계정", "서연(가명)")}>데모 계정 «서연(가명)»으로 둘러보기 ↗</button>
          </>
        )}
      </div>

      <button type="button" className="lg-back" onClick={() => go("home")}>← 가방 구경으로 돌아가기</button>
      <p className="lg-note">시범 화면이에요. 실제로 가입되지 않고, 입력한 이메일·비밀번호는 저장하지 않아요.</p>
    </div>
  );
}
