/* 팔로우 = 새 가방 알림 구독 (10/25 MJ)
   - 지금(시범): 브라우저 알림 권한을 받고, 팔로우한 순간 예시 알림을 한 번 띄움. 권한이 없거나 막힌 화면이면 앱 안 알림(토스트)으로 대신
   - 나중(실서비스): 같은 함수 자리에서 서비스워커 + 웹푸시 구독을 서버에 등록/해제하면 됨 (화면 코드는 그대로) */
export const canNotify = () => typeof window !== "undefined" && "Notification" in window;

export async function askPermission() {
  if (!canNotify()) return "unsupported";
  try {
    if (Notification.permission === "default") return await Notification.requestPermission();
    return Notification.permission;
  } catch { return "denied"; } /* 미리보기처럼 막힌 화면 */
}

export function showNotice(title, body) {
  try { new Notification(title, { body, tag: "gosutem-" + title }); return true; } catch { return false; }
}

/* 팔로우 켜기/끄기: 결과 문구를 돌려줌 (토스트로 보여 줌) */
export async function followNotify(on, name) {
  if (!on) return name + "님 팔로우와 새 가방 알림을 껐어요.";
  const p = await askPermission();
  if (p === "granted" && showNotice("고수템 · " + name, "팔로우했어요. 새 가방이 올라오면 이렇게 알려 드려요. (시범)")) return name + "님을 팔로우했어요. 새 가방이 올라오면 알림을 보내 드려요.";
  if (p === "denied") return name + "님을 팔로우했어요. 기기 알림이 꺼져 있어서 앱 안 알림으로 알려 드려요.";
  return name + "님을 팔로우했어요. 새 가방이 올라오면 앱 안에서 알려 드려요. (시범)";
}
