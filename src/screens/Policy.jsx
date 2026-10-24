/* 사이트 하단 정보 + 이용약관·개인정보처리방침 (시범 서비스용 초안 — 정식 공개 전 법률 검토 필요) */
import { useApp } from "../lib/store.jsx";

const OWNER = "차명진";
const MAIL = "awethings.cha@gmail.com";

export function SiteFooter() {
  const { go } = useApp();
  return (
    <footer className="site-foot pad" aria-label="사이트 정보">
      <div className="sf-brand"><b>고수템</b><span>GOSUTEM</span></div>
      <nav className="sf-links" aria-label="약관과 정책">
        <a href="#terms" onClick={(e) => { e.preventDefault(); go("terms"); }}>이용약관</a>
        <a href="#privacy" onClick={(e) => { e.preventDefault(); go("privacy"); }}><b>개인정보처리방침</b></a>
        <a href="#preorder" onClick={(e) => { e.preventDefault(); go("preorder"); }}>출시 알림 신청</a>
      </nav>
      <dl className="sf-info">
        <dt>상호</dt><dd>고수템 (사업자등록 준비 중)</dd>
        <dt>대표</dt><dd>{OWNER}</dd>
        <dt>문의</dt><dd>{MAIL}</dd>
        <dt>개인정보 책임자</dt><dd>{OWNER}</dd>
        <dt>사업자 정보</dt><dd>사업자등록번호·통신판매업 신고번호·주소는 사업자등록 후 표시해요</dd>
      </dl>
      <p className="sf-note">고수템은 물건을 직접 팔지 않는 정보 제공·연결 서비스예요. 구매 링크로 사면 판매처에서 고수템이 수수료를 받을 수 있어요. 지금은 시범 서비스라 가방·인물·가격·재고는 모두 예시예요.</p>
      <p className="sf-copy">© 2026 GOSUTEM</p>
    </footer>
  );
}

function Doc({ title, date, children }) {
  return (
    <div className="view pad policy">
      <h2>{title}</h2>
      <p className="policy-meta">시범 서비스용 초안 · 시행일 {date}</p>
      {children}
    </div>
  );
}

export function Terms() {
  return (
    <Doc title="이용약관" date="정식 공개일에 확정">
      <h3>1. 목적</h3>
      <p>이 약관은 고수템(이하 "서비스")을 이용할 때 서비스와 이용자 사이의 권리, 의무, 책임을 정합니다.</p>
      <h3>2. 서비스 내용</h3>
      <ul>
        <li>평범한 고수의 가방과 물건별 라벨(알짜템·중고템·나눔템·스왑템·비추천템), 한 줄 이유를 보여 줍니다.</li>
        <li>새상품·중고·나눔 가격과 구매처 정보를 연결합니다.</li>
        <li>서비스는 물건을 직접 팔지 않습니다. 외부 판매처에서 산 물건의 거래 당사자는 판매처와 이용자입니다.</li>
      </ul>
      <h3>3. 시범 서비스</h3>
      <p>지금은 시범 운영 중이라 화면에 보이는 가방·인물·가격·재고·숫자는 예시입니다. 기능과 화면은 예고 없이 바뀔 수 있습니다.</p>
      <h3>4. 제휴 링크</h3>
      <p>일부 구매 링크는 제휴 링크이며, 이용자가 그 링크로 사면 서비스가 판매처로부터 수수료를 받을 수 있습니다. 이용자가 내는 가격은 달라지지 않습니다. 협찬·제휴가 있는 물건에는 표시를 붙입니다.</p>
      <h3>5. 고수 콘텐츠</h3>
      <ul>
        <li>고수가 올린 사진과 글의 저작권은 고수에게 있습니다.</li>
        <li>고수는 서비스 안에서 보여 주고 소개하는 범위에서 이용을 허락합니다. 고수가 삭제를 요청하면 지웁니다.</li>
        <li>다른 사람의 영상·게시물을 재구성한 가방은 원작자의 허락을 받은 경우에만 공개하고, 출처를 표시합니다.</li>
      </ul>
      <h3>6. 이용자의 의무</h3>
      <ul>
        <li>다른 사람의 권리를 침해하거나 사실이 아닌 정보를 올리지 않습니다.</li>
        <li>의약품, 개봉한 화장품·식품, 소분품·견본품, 도수 있는 안경·렌즈 등 법으로 개인 거래가 제한된 물건은 중고·나눔·교환으로 올리지 않습니다.</li>
      </ul>
      <h3>7. 책임의 한계</h3>
      <p>고수의 의견은 개인 경험이며, 효과나 결과를 보장하지 않습니다. 가격과 재고는 표시한 기준일의 정보이며 판매처에서 바뀔 수 있습니다.</p>
      <h3>8. 문의</h3>
      <p>{MAIL}</p>
    </Doc>
  );
}

export function Privacy() {
  return (
    <Doc title="개인정보처리방침" date="정식 공개일에 확정">
      <p>고수템은 이용자의 개인정보를 소중히 다루며, 개인정보 보호법에 따라 아래와 같이 처리합니다.</p>
      <h3>1. 수집하는 항목과 목적</h3>
      <table className="policy-table">
        <thead><tr><th>언제</th><th>항목</th><th>목적</th></tr></thead>
        <tbody>
          <tr><td>출시 알림 사전신청</td><td>이메일(필수), 관심 상황·가방 공개 희망 여부(선택), 유입 경로(utm)</td><td>출시 알림과 서비스 안내, 유입 경로 분석</td></tr>
          <tr><td>서비스 이용 시 자동 생성</td><td>접속 기록 등 호스팅 서버 로그</td><td>서비스 운영과 보안</td></tr>
        </tbody>
      </table>
      <h3>2. 보유 기간과 파기</h3>
      <p>출시 알림 발송 후 6개월이 지나거나 동의를 철회하면 바로 지웁니다. 전자 파일은 복구할 수 없는 방법으로 지웁니다.</p>
      <h3>3. 제3자 제공</h3>
      <p>이용자의 개인정보를 제3자에게 제공하지 않습니다. 법령에 따른 요청이 있는 경우는 예외입니다.</p>
      <h3>4. 처리 위탁과 국외 이전</h3>
      <table className="policy-table">
        <thead><tr><th>받는 곳</th><th>국가</th><th>항목</th><th>목적·시기·방법</th><th>보유 기간</th></tr></thead>
        <tbody>
          <tr><td>Netlify, Inc.</td><td>미국</td><td>사전신청 항목, 접속 기록</td><td>웹사이트 호스팅과 신청서 저장 · 신청할 때 네트워크로 전송</td><td>위 2번과 같음</td></tr>
        </tbody>
      </table>
      <p>국외 이전을 원하지 않으면 사전신청을 하지 않을 수 있습니다. 이 경우 출시 알림을 받을 수 없습니다.</p>
      <h3>5. 이용자의 권리</h3>
      <p>언제든 자신의 개인정보를 열람·정정·삭제하거나 처리 정지를 요청할 수 있습니다. 아래 이메일로 요청하면 바로 처리합니다.</p>
      <h3>6. 개인정보 보호책임자</h3>
      <p>{OWNER} · {MAIL}</p>
      <h3>7. 변경</h3>
      <p>이 방침이 바뀌면 시행 7일 전에 서비스 화면으로 알립니다.</p>
    </Doc>
  );
}
