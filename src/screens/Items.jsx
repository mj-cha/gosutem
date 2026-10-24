/* 물건별 보기 (#items): 가방 대신 물건 하나하나를 모아 보는 화면 — 벤치마킹 'THE EDIT' 양식
   폰은 한 줄, 넓은 화면(768px~)은 2열 지그재그(오른쪽 열을 아래로 내리고 왼쪽 열은 크기를 번갈아) */
import { useMemo, useState } from "react";
import { BAGS, ART, T, TORDER } from "../data/data.js";
import { minNew, usedOK, won } from "../lib/logic.js";
import { useApp } from "../lib/store.jsx";

const ALL = BAGS.flatMap((b) => b.items.map((it, i) => ({ b, it, i, key: b.id + ":" + i })))
  .sort((x, y) => (y.it.emp || 0) - (x.it.emp || 0));
const TONES = ["#E9E8E2", "#E9E8E2", "#333FDF"]; /* 사진 자리 바탕: 오프화이트 2 : 코발트 1 */

function status(it) {
  if (it.t === "no") return { txt: "비추천 · 사지 마세요", dark: true };
  if (it.used && it.used.n && usedOK(it)) return { txt: "중고 · " + it.used.n + "개" };
  if (it.share) return { txt: "나눔 · " + it.share + "개" };
  if (it.t === "swap") return { txt: "스왑 · 교환 가능" };
  return { txt: "새상품 · " + (it.nw ? it.nw.length : 0) + "곳", dark: true };
}

function Card({ row, n, saved, onSave }) {
  const { go } = useApp();
  const { b, it } = row;
  const st = status(it), base = minNew(it), tone = TONES[n % TONES.length];
  const name = it.q || it.n;
  return (
    <li className="ed-card">
      <button type="button" className="ed-img" style={{ background: tone }} onClick={() => go(b.id)} aria-label={name + ", " + b.name + "의 가방에서 보기"}>
        <span className="ed-tag lime">ITEM {String(n + 1).padStart(2, "0")}</span>
        <span className={"ed-tag right" + (st.dark ? " dark" : " lime")}>{st.txt}</span>
        <svg viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART[it.art] }} />
      </button>
      <div className="ed-cap">
        <div>
          <h3 className="ed-name">{name}</h3>
          <p className="ed-meta">{T[it.t].name} / {base ? won(base) + "부터" : "나눔"} / {b.name}</p>
        </div>
        <button type="button" className="ed-heart" aria-pressed={saved} aria-label={name + " 저장"} onClick={onSave}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.6 4.5 7 4.5c2 0 3.6 1.1 5 2.9 1.4-1.8 3-2.9 5-2.9 3.4 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" /></svg>
        </button>
      </div>
    </li>
  );
}

export default function Items() {
  const [f, setF] = useState("all");
  const [saved, setSaved] = useState({});
  const list = useMemo(() => ALL.filter((r) => (f === "all" ? true : f === "saved" ? saved[r.key] : r.it.t === f)), [f, saved]);
  const chips = [["all", "ALL ITEMS"], ...TORDER.map((k) => [k, T[k].name]), ["saved", "SAVED"]];

  return (
    <div className="view edit pad">
      <p className="ed-kick">THE GOSU SELECTION / VOL. 01</p>
      <h2 className="ed-h"><span>THE</span> <em>ITEMS.</em><sup>01</sup></h2>
      <div className="ed-sub"><span>Every bag. Every item.</span><span>고수의 가방에서 물건만 꺼내 모았어요. 라벨로 골라 보세요.</span></div>
      <div className="ed-bar">
        <div className="ed-chips" role="group" aria-label="라벨로 고르기">
          {chips.map(([k, t]) => <button key={k} type="button" className="ed-chip" aria-pressed={f === k} onClick={() => setF(k)}>{t}</button>)}
        </div>
        <span className="ed-count num">{String(list.length).padStart(2, "0")} ITEMS</span>
      </div>
      {list.length ? (
        <ul className="ed-grid">
          {list.map((r, n) => <Card key={r.key} row={r} n={n} saved={!!saved[r.key]} onSave={() => setSaved((s) => ({ ...s, [r.key]: !s[r.key] }))} />)}
        </ul>
      ) : <p className="ed-empty">{f === "saved" ? "하트를 누른 물건이 여기 모여요." : "이 라벨의 물건이 아직 없어요."}</p>}
    </div>
  );
}
