/* 가방 열림 빈 자리: #/bag/:id 인데 아직 가방 데이터가 없는 카드 (홈 '상황별 고수 가방'의 예시 카드) */
import { Button } from "@heroui/react";
import { Icon } from "../components/Icon.jsx";
import { useApp } from "../lib/store.jsx";

export function BagSoonTop() {
  const { go } = useApp();
  return (
    <>
      <Button isIconOnly variant="ghost" className="icon-btn" aria-label="뒤로" onPress={() => go("home")}><Icon id="back" /></Button>
      <h1 className="bar-title">고수의 가방</h1>
      <span style={{ width: 40 }} aria-hidden="true" />
    </>
  );
}

export default function BagSoon({ id }) {
  const { go, openModal } = useApp();
  return (
    <div className="view pad" style={{ paddingTop: 24 }}>
      <div className="empty">
        <Icon id="bag" />
        <h3>이 가방은 아직 촬영 중이에요</h3>
        <p>고수가 가방을 열어 보여 주면 여기서 물건마다 살지 말지 볼 수 있어요.</p>
        <p className="sb-soon-id">가방 번호 {id} · 예시</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="secondary" onPress={() => go("home")}>다른 가방 보기</Button>
          <Button onPress={() => openModal("supply")}>내 가방 보여 주기</Button>
        </div>
      </div>
    </div>
  );
}
