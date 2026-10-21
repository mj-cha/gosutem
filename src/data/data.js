/* 고수템 데이터 (모든 가방·인물·가격·재고·매물 수는 예시) — legacy/index.html v39에서 옮김 */

export const T = {
  must: {name:"알짜템",   c:"var(--t-must)",  def:"고수가 매일 쓰는 것, 처음부터 갖춰 두기", pick:true},
  share:{name:"나눔템",   c:"var(--t-share)", def:"새로 사지 말고 나눔으로 받기", pick:true},
  used: {name:"중고템",   c:"var(--t-used)",  def:"중고로 충분한 것", pick:true},
  swap: {name:"스왑템",   c:"var(--t-swap)",  def:"써 보고 안 맞으면 다른 물건과 바꾸기(물물교환)", pick:false},
  no:   {name:"비추천템", c:"var(--t-no)",    def:"고수가 말리는 것, 처음엔 필요 없음", pick:false}
};

export const TORDER = ["must","share","used","swap","no"];

export const CH = {nw:"새상품", used:"중고", sim:"유사템", share:"나눔"};

export const CHORDER = ["nw","used","sim","share"];

export const BAGS = [
 {id:"intern", pc:["work/intern","work/office"], handle:"seoyeon.intern", tags:["인턴","직장인"], deck:true, img:"img/intern-kits.webp", imgAlt:"신입 인턴 생존 & 멘탈 케어 파우치: 인공눈물, 립글로스, 사탕, 실내화, 거울과 인턴 샘플 인물 사진", views:"31.2K", scraps:4890, likes:2140, dislikes:18,
  title:"부장님 급습에도 3초 만에 표정 관리, 4개월 차 인턴의 영업비밀 파우치",
  hook:"“히터 바람에 눈 건조할 때 & ‘넵!’ 연발할 때”",
  sub:"히터 바람에 뻑뻑한 눈, 회의실 호출 3초 전 안색, 오후 2시 반 식곤증까지. 넉 달 동안 시행착오 끝에 서랍에 남은 것만 골랐어요.",
  name:"서연(가명)", meta:"사무직 인턴 4개월 차", av:"서", avc:"#2E7D6B",
  best:"‘눈물 연기’ 인공눈물", rebuy:"인체공학 손목 받침대 세트", regretItem:8, regret:"첫 출근 전에 3만 원 주고 샀는데, 회사 비품 신청하니까 그냥 나오더라고요.",
  themes:[{k:"mental",n:"멘탈방어 & 안구보안",ic:"i-eye"},{k:"vital",n:"급속 인간화 (3초 미팅)",ic:"i-lips"},{k:"energy",n:"식곤증 & 체력방어",ic:"i-coffee"},{k:"secret",n:"오피스 보안 & 은폐",ic:"i-shield"}],
  items:[
   {n:"겨울 히터 직빵용 ‘눈물 연기’ 인공눈물", q:"무보존제 인공눈물", t:"must", th:"mental", art:"eyedrop", cat:"life/health", cons:1, ai:1, sense:99, emp:412,
    tip:"천장 히터 바람에 뻑뻑해진 눈을 살려 주는 원픽. 8시간 모니터 앞에서 하루 세 번, 피드백 받을 때 0.1초 만에 감격한 눈빛 연기까지 돼요.",
    note:"개봉 의약품이라 중고·나눔·교환 불가. 개인 소장만.", nw:[["쿠팡",12000],["네이버쇼핑",11400]], used:{n:0,avg:0}, sim:["약국 무보존제 일회용 점안액"], share:0},
   {n:"3초 안색 심폐소생 ‘혈색 틴트 립밤’", q:"혈색 틴트 립밤", t:"must", th:"vital", art:"lipbalm", cat:"beauty/makeup/lip", cons:1, ai:1, sense:98, emp:388,
    tip:"부장님이 갑자기 ‘OO씨 회의실 들어와’ 할 때, 모니터 빛에 시들어 버린 유령 안색을 3초 만에 원상복구.",
    note:"입에 닿는 화장품이라 개봉품은 나눔·중고 안 받아요.", nw:[["쿠팡",15900],["네이버쇼핑",14800],["11번가",16500]], used:{n:0,avg:0}, sim:["고보습 혈색 립밤 1+1"], share:0},
   {n:"뒤에서 다가오는 부장님 방어 ‘광각 미니 거울’", q:"모니터 후방 거울", t:"must", th:"secret", art:"mirror", cat:"beauty/tools/makeup-tools", ai:1, sense:100, emp:521,
    tip:"모니터 구석에 붙여 두면 후방 180도 감지. 딴짓하다가도 0.1초 만에 업무용 엑셀 화면 전환 가능.",
    nw:[["쿠팡",8000],["네이버쇼핑",7600]], used:{n:2,avg:2000}, sim:["차량용 보조 거울"], share:1},
   {n:"식곤증 기절 방지 ‘무설탕 포도당 캔디’", q:"무설탕 포도당 캔디", t:"must", th:"energy", art:"candy", cat:"life/office", cons:1, ai:1, sense:95, emp:276,
    tip:"오후 2시 30분, 모니터 글자가 세 개로 겹쳐 보일 때 뇌세포에 직통으로 당을 꽂아 주는 오피스 심폐소생제.",
    nw:[["쿠팡",15000],["네이버쇼핑",13900]], used:{n:0,avg:0}, sim:["포도당 츄어블"], share:0},
   {n:"영혼 없는 ‘넵!’ 단축키 패드 스티커", q:"키보드 스티커 넵", t:"share", th:"mental", art:"sticker", cat:"life/office", ai:1, sense:97, emp:604,
    tip:"‘네’와 ‘알겠습니다’를 상황별로 세분화한 12가지 감정의 ‘넵!’ 가이드. 영혼 손실 완벽 방지.",
    nw:[["쿠팡",5000]], used:{n:0,avg:0}, sim:["직접 출력용 PDF"], share:5},
   {n:"어색한 점심 뒤 ‘스틱 한방 소화제’", q:"스틱 소화제", t:"must", th:"vital", art:"digest", cat:"life/health", cons:1, ai:1, sense:96, emp:233,
    tip:"어색한 팀장님 옆자리 점심 후 꽉 얹힌 가슴을 시원하게 뚫어 주는 서랍 상비약.",
    note:"의약품은 개인 간 거래가 안 돼요. 약국에서 사기.", nw:[["쿠팡",9000]], used:{n:0,avg:0}, sim:["개별 포장 환제"], share:0},
   {n:"소리 안 나는 ‘무소음 오피스 실내화’", q:"무소음 사무실 실내화", t:"swap", th:"secret", art:"slipper", cat:"life/office", ai:1, sense:94, emp:198,
    tip:"탕비실 과자 서리하러 갈 때 발소리 제로. 스텔스 고양이 걸음 가능. 사이즈 안 맞으면 교환으로.",
    nw:[["쿠팡",22000],["네이버쇼핑",19800]], used:{n:3,avg:7000}, sim:["EVA 쿠션 실내화"], share:1},
   {n:"고카페인 위장용 ‘블라인드 텀블러’", q:"슬림 스텐 텀블러 캔", t:"used", th:"energy", art:"can", cat:"life/office", ai:1, sense:99, emp:447,
    tip:"‘인턴이 벌써 고카페인 마셔?’ 소리 안 들으려고 캔째로 넣어 위장해 마시는 텀블러.",
    nw:[["쿠팡",25000],["네이버쇼핑",23500]], used:{n:4,avg:6000}, sim:["스텐 보온 텀블러"], share:0},
   {n:"첫 출근 전 ‘인체공학 손목 받침대 세트’", q:"인체공학 손목 받침대", t:"no", th:"energy", art:"wrist", cat:"life/office", ai:1, sense:93, emp:352,
    tip:"출근 전에 사지 마세요. 회사 비품 신청하면 나와요. 3주 써 보고 정말 필요하면 그때.",
    nw:[["쿠팡",29000],["네이버쇼핑",27500]], used:{n:6,avg:9000}, sim:[], share:2}
  ]},
 {id:"bali", pc:["travel/month","sports/water"], handle:"yuna.canggu", tags:["여행"], deck:true, views:"18.6K", scraps:2310, likes:982, dislikes:9,
  title:"캐리어 절반은 비워가세요, 짱구(Canggu) 서퍼의 가벼운 파우치",
  hook:"“발리 한달살기 + 서핑 파우치”",
  sub:"적도 자외선 아래 서핑부터 해 질 녘 비치클럽, 귀국 전날 나눔까지! 발리에서 직접 파도 타고 지내며 남긴 알짜템 & 나눔 스왑 큐레이션",
  trust:"이 파우치에는 협찬·제휴가 없어요. 발리에서 직접 파도 타고 지내며 남긴 찐 후기예요.",
  howto:"하트를 누르면 내 파우치에 담겨요. 라벨을 누르면 새상품·중고·유사템·나눔 중 어디서 구할 수 있는지 볼 수 있어요.",
  name:"유나(가명)", meta:"발리 한달살기 · 짱구 서핑 3년 차", av:"유", avc:"#1B9AAA",
  best:"써니데이즈 징크 선블록", rebuy:"여행용 샤워기 헤드 & 필터 세트", regretItem:5, regret:"블로그 괴담 보고 바리바리 사 갔는데, 한 달 내내 캐리어에서 꺼내지도 않았어요.",
  themes:[{k:"surf",n:"서핑 & 자외선 방어",ic:"i-wave"},{k:"sunset",n:"선셋 & 비치클럽",ic:"i-sun"},{k:"light",n:"캐리어 다이어트",ic:"i-bag"}],
  items:[
   {n:"써니데이즈 징크 선블록 (Sunny Days Zinc SPF 30+)", q:"써니데이즈 징크 선블록", t:"must", th:"surf", art:"zinc", cat:"beauty/suncare/outdoor", cons:1, ai:1, sense:99, emp:234,
    tip:"백탁 없이 파데처럼 민낯을 가려 주고 파도에도 안 지워지는 서퍼들의 원픽. 한국서 사 가지 말고 발리 현지 퀵실버·록시 매장에서 사세요! (소형 7천 원 / 대형 1.5만 원)",
    note:"한국에선 직구만 돼요. 클렌징은 따뜻한 물과 비누로.", nw:[["쿠팡",18900],["네이버쇼핑",17500]], used:{n:4,avg:9000,exp:"2027.08"}, sim:["컬러 징크 선스틱","미네랄 선머드"], share:1},
   {n:"소금기 머리 복구용 ‘노워시 헤어 오일 세럼’", q:"노워시 헤어 오일 세럼", t:"must", th:"sunset", art:"hairoil", cat:"beauty/hair/styling", cons:1, ai:1, sense:95, emp:112,
    tip:"바닷물에 절여진 빗자루 머릿결, 씻고 젖은 머리에 바로 바르면 선셋 바 갈 때까지 찰랑하게 유지돼요.",
    nw:[["쿠팡",16000],["네이버쇼핑",14900],["11번가",16800]], used:{n:4,avg:6000,exp:"2027.03"}, sim:["헤어 에센스 미니","아르간 오일","워터 트리트먼트"], share:0},
   {n:"해변 3초 환복의 영업비밀 ‘판초형 샌드프리 비치타월’", q:"판초 비치타월 샌드프리", t:"used", th:"surf", art:"poncho", cat:"sports/water", ai:1, sense:92, emp:84,
    tip:"바람 부는 해변에서 툭 뒤집어쓰는 이동식 탈의실. 한달살기 끝낸 사람들이 내놓는 S급 중고가 많으니 반값에 구하세요!",
    nw:[["쿠팡",39000],["네이버쇼핑",36000]], used:{n:6,avg:15000}, sim:["후드 비치타월"], share:0},
   {n:"구릿빛 피부 결 살려 주는 ‘골드 쉬머 바디 오일’", q:"골드 쉬머 바디 오일", t:"swap", th:"sunset", art:"bodyoil", cat:"beauty/body/wash", cons:1, ai:1, sense:89, emp:67,
    tip:"비치클럽 갈 때 쇄골·어깨에 살짝 바르면 조명을 다 흡수해요. 코코넛 향·펄 크기가 취향 타니, 안 맞으면 다른 향 가진 여행자랑 스왑!",
    nw:[["쿠팡",28000],["네이버쇼핑",26500]], used:{n:3,avg:11000}, sim:["쉬머 바디 로션","하이라이터 스틱"], share:1},
   {n:"출국 전날 두고 가는 ‘대용량 알로에 젤 & 모기 기피제’", q:"대용량 알로에 젤", t:"share", th:"light", art:"aloe", cat:"beauty/body/wash", cons:1, ai:1, sense:96, emp:145,
    tip:"한 달 내내 탄 피부와 모기를 막아 준 일등 공신. 한국 가져가기엔 무거우니 귀국 전날 막 도착한 여행자에게 바통터치하세요!",
    note:"개봉한 제품은 남은 양과 개봉일을 적어서 나눔해요.", nw:[["쿠팡",9900],["네이버쇼핑",8900],["11번가",10500]], used:{n:1,avg:3000,exp:"2027.01"}, sim:["알로에 수딩 미스트","패치형 모기 기피제"], share:5},
   {n:"여행용 샤워기 헤드 & 대량 필터 세트", q:"여행용 샤워기 필터", t:"no", th:"light", art:"shower", cat:"life/travel", ai:1, sense:98, emp:189,
    tip:"짱구·스미냑 신축 숙소와 빌라는 자체 정수 시설이 있어 필터가 필요 없는 곳이 많아요. 한국에서 무겁게 수십 개 사 가지 마세요.",
    sub:"숙소 컨디션 먼저 보고 정 필요할 때만 현지 조달", nw:[["쿠팡",24000],["네이버쇼핑",22000],["11번가",25900]], used:{n:8,avg:8000}, sim:[], share:3},
   {n:"한국식 매트 파운데이션 & 9구 아이섀도 팔레트", q:"매트 파운데이션", t:"no", th:"light", art:"palette", cat:"beauty/makeup/base", cons:1, ai:1, sense:94, emp:158,
    tip:"더운 날씨엔 금방 무너지고 답답해서 한 달 내내 서랍 신세. 발리 바이브엔 가벼운 립앤치크 하나가 훨씬 예뻐요.",
    sub:"눈썹 펜슬 + 혈색 살리는 립앤치크 멀티밤 1개", nw:[["쿠팡",42000],["네이버쇼핑",39000],["11번가",43500]], used:{n:5,avg:15000}, sim:["립앤치크 멀티밤","눈썹 펜슬"], share:2}
  ]},
 {id:"uni", pc:["work/student"], handle:"jisu.commute", tags:["대학생"], views:"8.4K", scraps:612, title:"왕복 3시간 지하철에서 완성한, 통학 4년 차의 가벼운 어깨 백팩", sub:"가방 무게 1g이 아쉬운 장거리 통학러가 4년 시행착오 끝에 남긴 미니멀 구성이에요.", name:"지수(가명)", meta:"4학년 · 통학 4년 차", av:"지", avc:"#C7921A", likes:128, dislikes:6,
  best:"초경량 우산", rebuy:"태블릿", regretItem:6, regret:"입학 선물로 샀는데, 한 학기 내내 영상만 봤어요.",
  items:[
   {n:"콘센트 자리 전쟁 끝내는 ‘10,000mAh 보조배터리’", q:"보조배터리 10000mAh", t:"must", art:"battery", cat:"life/digital", sense:96, emp:84, tip:"시험 기간 도서관 콘센트는 아침 9시면 끝나요. 폰 두 번 충전되는 이 용량이 무게 대비 원픽이에요.", nw:[["쿠팡",25000],["네이버쇼핑",24300],["11번가",26900]], used:{n:3,avg:12000}, sim:["슬림형 5,000mAh"], share:0},
   {n:"어깨가 먼저 기억하는 ‘초경량 접이식 우산’", q:"초경량 접이식 우산", t:"must", art:"umbrella", cat:"life/study", sense:92, emp:61, tip:"200g 넘으면 결국 안 들고 다녀요. 4년 동안 우산 세 개 잃어버리고 찾은 답은 무게였어요.", nw:[["쿠팡",15000],["네이버쇼핑",14200]], used:{n:0,avg:0}, sim:["캡슐 우산"], share:0},
   {n:"새거 살 이유 없는 ‘노트북 파우치’", q:"노트북 파우치 13인치", t:"used", art:"sleeve", cat:"life/digital", sense:88, emp:40, tip:"쿠션만 있으면 돼요. 졸업 시즌마다 중고가 쏟아져서 반값이면 충분해요.", nw:[["쿠팡",25000],["네이버쇼핑",23900]], used:{n:5,avg:8000}, sim:[], share:1},
   {n:"학교 카페 할인 리추얼 ‘텀블러’", q:"텀블러 350ml", t:"share", art:"tumbler", cat:"life/study", sense:90, emp:57, tip:"학교 카페 텀블러 할인이 은근 쏠쏠해요. 졸업하는 선배한테 나눔 받으면 공짜로 시작해요.", nw:[["쿠팡",30000]], used:{n:2,avg:9000}, sim:["보온 머그"], share:3},
   {n:"통학 1시간 반의 낭만 ‘목베개’", q:"목베개 메모리폼", t:"swap", art:"pillow", cat:"life/travel", sense:85, emp:33, tip:"지하철 꿀잠의 영업비밀이지만 목 모양 따라 호불호가 커요. 안 맞으면 다른 통학러 것과 바꿔 보세요.", nw:[["쿠팡",20000],["11번가",18500]], used:{n:2,avg:7000}, sim:[], share:0},
   {n:"새 학기 기분에 사는 ‘얇은 필통’", q:"슬림 필통", t:"no", art:"pencil", cat:"life/study", sense:87, emp:49, tip:"새 학기 설렘에 사지 마세요. 고등학교 때 쓰던 걸로 4년 버텼어요.", sub:"쓰던 필통", nw:[["쿠팡",8000]], used:{n:0,avg:0}, sim:["파우치형 필통"], share:2},
   {n:"입학 선물 1순위 ‘태블릿 + 펜’", q:"태블릿 펜슬", t:"no", art:"tablet", cat:"life/digital", sense:97, emp:132, tip:"한 학기 내내 필기보다 영상을 더 봤어요. 1학기는 공책으로, 그래도 아쉬우면 그때 사도 안 늦어요.", nw:[["쿠팡",900000],["네이버쇼핑",879000]], used:{n:4,avg:520000}, sim:[], share:0}
  ]},
 {id:"swim", pc:["sports/water","work/student"], handle:"haneul.swim", tags:["수영","대학생"], views:"5.1K", scraps:398, title:"락커룸 옆자리가 자꾸 힐끔거리는, 수영 5년 차 훈련부장의 그물백", sub:"새벽 6시 강습 전 5분 만에 챙기는 그물백 하나. 처음 사는 사람이 헛돈 쓰는 곳까지 솔직하게 알려 드려요.", name:"하늘(가명)", meta:"수영 5년 차 · 동아리 훈련부장", av:"하", avc:"#2E8FB8", likes:94, dislikes:3,
  best:"실리콘 수모", rebuy:"오리발", regretItem:6, regret:"첫날 샀는데 석 달 동안 사물함 안에만 있었어요.",
  items:[
   {n:"젖은 머리와 이별하는 ‘실리콘 수모’", q:"실리콘 수모", t:"must", art:"cap", cat:"sports/water", sense:94, emp:71, tip:"천 수모는 한 바퀴만 돌아도 머리가 다 젖어요. 실리콘 하나로 드라이 시간이 10분 줄어요.", nw:[["쿠팡",12000],["네이버쇼핑",11000]], used:{n:0,avg:0}, sim:["실리콘+천 이중 수모"], share:0},
   {n:"실내풀엔 이거면 끝 ‘클리어 렌즈 수경’", q:"클리어 수경 실내", t:"must", art:"goggles", cat:"sports/water", sense:91, emp:55, tip:"실내 수영장이면 미러 렌즈는 필요 없어요. 김서림 방지 코팅만 꼭 확인하세요.", nw:[["쿠팡",20000],["네이버쇼핑",19500],["11번가",21000]], used:{n:1,avg:9000}, sim:["노패킹 수경"], share:0},
   {n:"새벽 강습 무드 ‘4부 연습용 수영복’", q:"4부 연습용 수영복", t:"must", art:"suit", cat:"sports/water", sense:93, emp:66, tip:"대회용은 비싸고 입는 데만 5분 걸려요. 연습용 4부가 오래 입기도 편해요.", nw:[["쿠팡",45000],["네이버쇼핑",42000]], used:{n:0,avg:0}, sim:["5부 탄탄이"], share:0},
   {n:"동아리 선배 찬스 ‘방수 파우치’", q:"수영 방수 파우치", t:"share", art:"pouch", cat:"sports/water", sense:86, emp:38, tip:"동아리 나눔 박스에 늘 몇 개씩 굴러다녀요. 사지 말고 받아 가세요.", nw:[["쿠팡",10000]], used:{n:1,avg:4000}, sim:["지퍼백"], share:4},
   {n:"새로 사기 아까운 ‘스포츠 타월’", q:"스포츠 타월", t:"no", art:"towel", cat:"sports/water", sense:84, emp:29, tip:"집 수건 한 장이면 돼요. 극세사는 결국 냄새 때문에 안 쓰게 되더라고요.", sub:"집 수건", nw:[["쿠팡",18000]], used:{n:0,avg:0}, sim:["극세사 수건"], share:1},
   {n:"풀세트로 사는 ‘샴푸·바디워시’", q:"여행용 공병", t:"no", art:"bottle", cat:"beauty/body/wash", cons:1, sense:83, emp:24, tip:"따로 사지 말고 집에 있는 걸 30ml 공병에 덜어 오세요. 그물백이 훨씬 가벼워져요.", sub:"소분 공병", nw:[["쿠팡",15000]], used:{n:0,avg:0}, sim:["여행용 공병 세트"], share:0},
   {n:"초급반이 제일 먼저 사는 ‘오리발’", q:"수영 오리발", t:"no", art:"fins", cat:"sports/water", sense:98, emp:118, tip:"첫 두 달은 한 번도 안 썼어요. 강사님이 가져오라고 할 때 사도 늦지 않아요.", nw:[["쿠팡",60000],["네이버쇼핑",57000]], used:{n:6,avg:25000}, sim:[], share:2}
  ]},
 {id:"run", pc:["sports/running","work/office"], handle:"minho.run", tags:["러닝","직장인"], views:"12.7K", scraps:1035, title:"퇴근 후 7시, 한강 10km 리추얼을 지키는 6년 차 러너의 미니멀 가방", sub:"회사 락커에 두고 다니는 가방 하나로 주 3회 퇴근런, 갓생 루틴을 6년째 이어 온 구성이에요.", name:"민호(가명)", meta:"러닝 6년 차 · 하프 완주", av:"민", avc:"#D2683A", likes:211, dislikes:12,
  best:"러닝 양말", rebuy:"GPS 워치", regretItem:6, regret:"기록 욕심에 샀는데, 결국 폰으로 뛰었어요.",
  items:[
   {n:"발이 먼저 아는 ‘쿠션 러닝화’", q:"쿠션 러닝화", t:"must", art:"shoes", cat:"sports/running", sense:97, emp:143, tip:"매장에서 발 재고 사세요. 카본화는 하프 한 번 뛰고 나서 고민해도 돼요.", nw:[["쿠팡",129000],["네이버쇼핑",124000],["11번가",131000]], used:{n:2,avg:60000}, sim:["입문 쿠션화"], share:0},
   {n:"물집 0개의 영업비밀 ‘러닝 전용 양말’", q:"러닝 양말", t:"must", art:"socks", cat:"sports/running", sense:95, emp:98, tip:"물집은 신발보다 양말 탓이 많아요. 이건 중고 말고 새로 사는 게 맞아요.", nw:[["쿠팡",12000],["네이버쇼핑",11500]], used:{n:0,avg:0}, sim:[], share:0},
   {n:"허리 따라 호불호 ‘러닝 벨트’", q:"러닝 벨트", t:"swap", art:"belt", cat:"sports/running", sense:86, emp:42, tip:"폰만 들어가면 돼요. 뛸 때 출렁이면 다른 러너 것과 바꿔 보세요.", nw:[["쿠팡",30000]], used:{n:7,avg:12000}, sim:["암밴드"], share:1},
   {n:"10월 한강바람 막는 ‘경량 바람막이’", q:"러닝 바람막이", t:"used", art:"jacket", cat:"sports/running", sense:90, emp:77, tip:"가을 퇴근런엔 하나는 있어야 해요. 한 시즌 입고 파는 사람이 많아서 중고가 이득이에요.", nw:[["쿠팡",89000],["네이버쇼핑",85000]], used:{n:4,avg:30000}, sim:["경량 윈드브레이커"], share:0},
   {n:"첫 러닝 기분으로 사는 ‘기능성 티셔츠’", q:"기능성 티셔츠", t:"no", art:"tee", cat:"sports/running", sense:85, emp:36, tip:"새로 사지 마세요. 면 티만 피하면 갖고 있는 운동복으로 충분해요.", sub:"갖고 있는 운동복", nw:[["쿠팡",35000]], used:{n:0,avg:0}, sim:["드라이핏 티"], share:3},
   {n:"10km엔 과한 ‘에너지 젤’", q:"에너지 젤", t:"no", art:"gel", cat:"sports/running", cons:1, sense:89, emp:51, tip:"10km 이하는 물이면 충분해요. 하프부터 챙겨도 돼요.", nw:[["쿠팡",15000]], used:{n:0,avg:0}, sim:[], share:2},
   {n:"기록 욕심의 끝판왕 ‘GPS 워치’", q:"GPS 러닝 워치", t:"no", art:"watch", cat:"sports/running", sense:99, emp:187, tip:"처음 석 달은 폰 앱으로 충분해요. 주 3회가 습관이 되고 나서 사도 늦지 않아요.", nw:[["쿠팡",400000],["네이버쇼핑",389000]], used:{n:5,avg:180000}, sim:[], share:0}
  ]}
];

export const ART = {
  zinc:'<circle cx="32" cy="34" r="22" fill="#E9B44C"/><circle cx="32" cy="34" r="17" fill="#F6D58A"/><path d="M22 34c4-5 16-5 20 0" stroke="#D2683A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="26" r="4" fill="#FF8A3D"/>',
  hairoil:'<rect x="22" y="22" width="20" height="36" rx="6" fill="#E8A33D"/><rect x="26" y="12" width="12" height="11" rx="2" fill="#3E4758"/><rect x="29" y="6" width="6" height="7" rx="2" fill="#2B3240"/><rect x="25" y="34" width="14" height="10" rx="2" fill="#FFF4DD"/>',
  poncho:'<path d="M32 8c-8 0-12 6-12 10l-12 30h48L44 18c0-4-4-10-12-10z" fill="#2E8FB8"/><path d="M14 36h36M11 42h42" stroke="#F6F1E4" stroke-width="3"/><circle cx="32" cy="18" r="5" fill="#1F6E8C"/>',
  bodyoil:'<path d="M24 24h16l4 30a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z" fill="#D9A441"/><rect x="27" y="12" width="10" height="12" rx="2" fill="#C9D6E4"/><circle cx="28" cy="40" r="1.6" fill="#FFF"/><circle cx="35" cy="46" r="1.2" fill="#FFF"/><circle cx="33" cy="35" r="1" fill="#FFF"/>',
  aloe:'<rect x="18" y="20" width="22" height="38" rx="5" fill="#7CC47F"/><rect x="22" y="12" width="14" height="9" rx="2" fill="#3B7D4F"/><path d="M29 30c-4 6-4 12 0 16 4-4 4-10 0-16z" fill="#E4F4E0"/><rect x="42" y="30" width="10" height="28" rx="3" fill="#F2C14E"/><rect x="44" y="24" width="6" height="7" rx="1" fill="#3E4758"/>',
  shower:'<path d="M14 10h10v18" stroke="#8A9AB4" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="30" rx="14" ry="8" fill="#C9D6E4"/><path d="M26 42v6M32 42v8M38 42v6M44 40v5" stroke="#5DADE2" stroke-width="2.5" stroke-linecap="round"/><rect x="44" y="48" width="12" height="10" rx="2" fill="#E4E0D6"/>',
  palette:'<rect x="6" y="14" width="52" height="36" rx="6" fill="#2B3240"/><circle cx="18" cy="26" r="5" fill="#E8B4A0"/><circle cx="32" cy="26" r="5" fill="#C98B6B"/><circle cx="46" cy="26" r="5" fill="#8C5A43"/><circle cx="18" cy="39" r="5" fill="#D9A441"/><circle cx="32" cy="39" r="5" fill="#B5838D"/><circle cx="46" cy="39" r="5" fill="#6D4C41"/>',
  battery:'<rect x="14" y="6" width="36" height="52" rx="7" fill="#2B3240"/><rect x="20" y="14" width="24" height="30" rx="3" fill="#3C4558"/><circle cx="32" cy="50" r="2.5" fill="#7FD3F2"/><rect x="27" y="3" width="10" height="4" rx="1.5" fill="#1A1F29"/>',
  umbrella:'<rect x="10" y="22" width="44" height="14" rx="7" fill="#1F3FA6"/><path d="M16 22v14M24 22v14M32 22v14M40 22v14M48 22v14" stroke="#16307F" stroke-width="2"/><rect x="50" y="25" width="10" height="8" rx="3" fill="#232A36"/>',
  pencil:'<rect x="6" y="20" width="52" height="22" rx="10" fill="#E4E0D6"/><path d="M6 31h52" stroke="#CFCABD" stroke-width="2"/><rect x="40" y="27" width="10" height="8" rx="2" fill="#B9B2A3"/>',
  tumbler:'<path d="M20 12h24l-3 46H23z" fill="#DCE3EE"/><rect x="18" y="6" width="28" height="9" rx="3" fill="#7A8699"/><rect x="21" y="28" width="22" height="10" fill="#B8C4D6"/>',
  tablet:'<rect x="8" y="6" width="44" height="54" rx="6" fill="#20262F"/><rect x="12" y="11" width="36" height="44" rx="2" fill="#4A6C8F"/><rect x="54" y="8" width="4" height="46" rx="2" fill="#C9CFD8"/>',
  sleeve:'<rect x="4" y="12" width="56" height="40" rx="6" fill="#8A9AB4"/><rect x="4" y="12" width="56" height="10" rx="5" fill="#76869F"/><path d="M8 52h48" stroke="#6E7C93" stroke-width="2"/>',
  pillow:'<path d="M14 18c8-10 28-10 36 0 6 8 4 24-4 30-4 3-8 0-8-5 0-6-4-9-6-9s-6 3-6 9c0 5-4 8-8 5-8-6-10-22-4-30z" fill="#B9A6E0"/>',
  cap:'<ellipse cx="32" cy="34" rx="24" ry="20" fill="#FF6F61"/><ellipse cx="26" cy="26" rx="8" ry="4" fill="#FF968B"/>',
  goggles:'<ellipse cx="20" cy="32" rx="12" ry="9" fill="#2E4057"/><ellipse cx="44" cy="32" rx="12" ry="9" fill="#2E4057"/><ellipse cx="20" cy="32" rx="8" ry="6" fill="#9ED8F0"/><ellipse cx="44" cy="32" rx="8" ry="6" fill="#9ED8F0"/><path d="M4 32h4M56 32h4M30 32h4" stroke="#2E4057" stroke-width="3"/>',
  suit:'<path d="M20 6h24l2 14-6 8v30H24V28l-6-8z" fill="#233C7B"/><path d="M24 40h16" stroke="#7FD3F2" stroke-width="3"/>',
  fins:'<path d="M10 8h14l4 40-11 10-9-10z" fill="#FFB84D"/><path d="M40 8h14l2 40-9 10-11-10z" fill="#FFB84D"/><rect x="12" y="10" width="10" height="12" rx="3" fill="#E89A2B"/><rect x="42" y="10" width="10" height="12" rx="3" fill="#E89A2B"/>',
  towel:'<rect x="8" y="14" width="48" height="36" rx="4" fill="#9FD7C2"/><path d="M8 22h48M8 42h48" stroke="#7FC3AA" stroke-width="3"/>',
  pouch:'<rect x="8" y="16" width="48" height="34" rx="8" fill="#BFD9F2"/><rect x="8" y="16" width="48" height="7" rx="3" fill="#5D7FA3"/>',
  bottle:'<rect x="14" y="20" width="14" height="34" rx="4" fill="#EAD3A8"/><rect x="17" y="12" width="8" height="9" rx="2" fill="#CDB38A"/><rect x="36" y="24" width="14" height="30" rx="4" fill="#BCDCC8"/><rect x="39" y="16" width="8" height="9" rx="2" fill="#93BFA3"/>',
  shoes:'<path d="M4 40c0-10 8-14 14-16l10 6 14 2c10 1 18 4 18 10v4H4z" fill="#DDE1E8"/><path d="M4 44h56v6H4z" fill="#FF9C5B"/><path d="M20 30l4 6M26 31l3 5M32 32l2 4" stroke="#B5BCC8" stroke-width="2"/>',
  socks:'<path d="M16 6h12v30c0 6 4 10 10 10h4v12H30c-10 0-16-8-16-18z" fill="#DDE1E8"/><rect x="16" y="6" width="12" height="6" fill="#FF9C5B"/>',
  belt:'<rect x="4" y="26" width="56" height="12" rx="6" fill="#2B3240"/><rect x="22" y="22" width="20" height="20" rx="5" fill="#3E4758"/><rect x="26" y="27" width="12" height="2" fill="#FF9C5B"/>',
  watch:'<rect x="24" y="2" width="16" height="16" rx="3" fill="#3E4758"/><rect x="24" y="46" width="16" height="16" rx="3" fill="#3E4758"/><rect x="16" y="16" width="32" height="32" rx="9" fill="#20262F"/><rect x="21" y="21" width="22" height="22" rx="6" fill="#0E3B4F"/><path d="M26 34l4-5 4 3 4-6" stroke="#6FD4A2" stroke-width="2" fill="none"/>',
  tee:'<path d="M18 8l-12 8 6 10 6-3v33h28V23l6 3 6-10-12-8c-2 4-6 6-10 6s-8-2-10-6z" fill="#5A6B8C"/>',
  jacket:'<path d="M20 6h24l12 10-4 12-6-2v32H18V26l-6 2-4-12z" fill="#1B2C5E"/><path d="M32 8v48" stroke="#FFD23F" stroke-width="2"/>',
  gel:'<path d="M14 10h16l-2 40H16z" fill="#FFD23F"/><path d="M34 14h16l-2 40H36z" fill="#FF9C5B"/><rect x="14" y="10" width="16" height="6" fill="#E6B829"/><rect x="34" y="14" width="16" height="6" fill="#E3824A"/>',
  eyedrop:'<path d="M32 6c6 10 12 17 12 26a12 12 0 0 1-24 0c0-9 6-16 12-26z" fill="#8FC8F0"/><rect x="26" y="40" width="12" height="18" rx="3" fill="#F2F5F9"/><rect x="26" y="40" width="12" height="5" fill="#2F6DB5"/>',
  lipbalm:'<rect x="24" y="24" width="16" height="34" rx="4" fill="#F3D6DC"/><rect x="24" y="24" width="16" height="8" fill="#E2465A"/><path d="M26 24V12l12-4v16z" fill="#C93A52"/>',
  mirror:'<circle cx="32" cy="30" r="20" fill="#C9D6E4"/><circle cx="32" cy="30" r="15" fill="#EAF2FA"/><path d="M24 22l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="29" y="50" width="6" height="10" rx="2" fill="#7A8699"/>',
  candy:'<rect x="18" y="20" width="28" height="24" rx="8" fill="#FFD23F"/><path d="M18 26l-10-6v24l10-6zM46 26l10-6v24l-10-6z" fill="#F2B705"/><path d="M26 28h12M26 34h8" stroke="#E6A800" stroke-width="2"/>',
  sticker:'<rect x="8" y="12" width="48" height="40" rx="6" fill="#F2F5F9"/><rect x="14" y="18" width="16" height="12" rx="3" fill="#2F6DB5"/><rect x="34" y="18" width="16" height="12" rx="3" fill="#1E8A5A"/><rect x="14" y="34" width="16" height="12" rx="3" fill="#C77A12"/><rect x="34" y="34" width="16" height="12" rx="3" fill="#C93A3A"/>',
  digest:'<rect x="12" y="10" width="12" height="44" rx="4" fill="#8BB98A"/><rect x="26" y="10" width="12" height="44" rx="4" fill="#A9CFA8"/><rect x="40" y="10" width="12" height="44" rx="4" fill="#8BB98A"/><path d="M12 20h12M26 20h12M40 20h12" stroke="#5E8F5D" stroke-width="2"/>',
  slipper:'<path d="M8 40c0-12 10-18 22-18s26 4 26 14-8 12-22 12H16c-5 0-8-3-8-8z" fill="#9AA6B8"/><path d="M22 24c2 8 10 12 20 12" stroke="#7A8699" stroke-width="3" fill="none"/>',
  can:'<rect x="20" y="6" width="24" height="52" rx="6" fill="#5A6B8C"/><rect x="20" y="20" width="24" height="18" fill="#7A8AA8"/><rect x="24" y="2" width="16" height="6" rx="2" fill="#3E4758"/>',
  wrist:'<rect x="6" y="28" width="52" height="16" rx="8" fill="#4A5568"/><rect x="10" y="20" width="44" height="10" rx="3" fill="#C9CFD8"/>'
};

export const PROMOS = [
 {bg:"#FF3D7F",fg:"#FFFFFF",big:"누구나<br>고수가 될 수 있다",small:"처음이라 두렵다면? 고수의 가방을 보여줄게.",tag:"#고수되기"},
 {bg:"#16243A",fg:"#FFFFFF",big:"고수가 쓴 걸,<br>가장 합리적으로",small:"새상품·중고·나눔 중 제일 똑똑한 길을 같이 찾아요.",tag:"#합리적소비"},
 {img:"img/intern-kits.webp",bg:"#F3C9DB",fg:"#FFFFFF",big:"4개월 차 인턴의<br>영업비밀 파우치",small:"인기 파우치 덱 · 조회수 31.2K",tag:"#인기덱",open:"intern"},
 {bg:"#C6F432",fg:"#16243A",big:"쇼핑몰은 사라고만 해.<br>고수는 ‘사지 마’도 알려줘.",small:"비추천템까지 솔직하게.",tag:"#사지마"},
 {bg:"#FFD23F",fg:"#16243A",big:"내 가방 공개하고<br>첫 고수 되기",small:"11월 시드 고수 모집 · 선정되면 내 이름의 프로필 페이지 (이벤트 예시)",tag:"EVENT",act:"supply"}
];

export const PCATS = [
 {k:"work",n:"직장·학업",ic:"i-brief",subs:[{k:"intern",n:"인턴"},{k:"office",n:"직장인"},{k:"student",n:"대학생·통학"},{k:"exam",n:"취준·자격증"}]},
 {k:"travel",n:"여행",ic:"i-plane",subs:[{k:"month",n:"한달살기"},{k:"abroad",n:"해외여행"},{k:"domestic",n:"국내여행"},{k:"business",n:"출장"}]}];

export const CATS = [
 {k:"beauty",n:"뷰티",ic:"i-lips",subs:[
  {k:"skincare",n:"스킨케어",leaf:[["toner","토너/미스트/패드"],["essence","에센스/앰플"],["cream","로션/크림"],["special","스페셜케어"]]},
  {k:"mask",n:"마스크/팩",leaf:[["sheet","시트/부분팩"],["sleeping","워시/슬리핑"]]},
  {k:"cleansing",n:"클렌징",leaf:[["face","페이스 클렌징"],["point","포인트/필링"]]},
  {k:"suncare",n:"선케어",leaf:[["daily","데일리 선케어"],["outdoor","아웃도어/기능"]]},
  {k:"makeup",n:"메이크업",leaf:[["base","베이스 메이크업"],["eye","아이 메이크업"],["lip","립 메이크업"],["contour","컨투어링/픽싱"]]},
  {k:"tools",n:"뷰티기기/소품",leaf:[["makeup-tools","메이크업 소품"],["device","뷰티 디바이스"]]},
  {k:"hair",n:"헤어케어",leaf:[["wash","세정/케어"],["scalp","두피/탈모"],["styling","스타일링"]]},
  {k:"fragrance",n:"향수/디퓨저",leaf:[["perfume","향수"],["home","홈프래그런스"]]},
  {k:"body",n:"바디케어",leaf:[["wash","세정/보습"],["hand","핸드/풋/위생"]]}]},
 {k:"sports",n:"스포츠/레저",ic:"i-run",subs:[
  {k:"golf",n:"골프"},{k:"camping",n:"캠핑"},{k:"fishing",n:"낚시"},{k:"running",n:"러닝/마라톤"},{k:"soccer",n:"축구"},{k:"baseball",n:"야구"},{k:"basketball",n:"농구"},{k:"bike",n:"자전거"},
  {k:"hiking",n:"등산/클라이밍"},{k:"fitness",n:"헬스/요가/필라테스"},{k:"skate",n:"인라인/스케이트보드"},{k:"mobility",n:"전동킥보드/전동휠"},{k:"tennis",n:"테니스"},{k:"badminton",n:"배드민턴"},
  {k:"bowling",n:"볼링"},{k:"pingpong",n:"탁구"},{k:"billiards",n:"당구"},{k:"winter",n:"겨울 스포츠"},{k:"water",n:"수상 스포츠"},{k:"martial",n:"격투/무술"},{k:"etc",n:"기타 스포츠"}]},
 {k:"hobby",n:"취미",ic:"i-spark",subs:[
  {k:"game",n:"게임",leaf:[["console","콘솔/PC"],["mobile","모바일"],["board","보드게임"]]},
  {k:"goods",n:"굿즈",leaf:[["idol","아이돌"],["anime","애니/캐릭터"],["sports","스포츠 굿즈"]]},
  {k:"music",n:"악기",leaf:[["guitar","기타/베이스"],["keys","건반"],["drum","드럼/타악기"],["wind","관악기"]]},
  {k:"camera",n:"사진/카메라"},{k:"stationery",n:"문구/다이어리"},{k:"book",n:"독서"}]},
 {k:"life",n:"생활/오피스",ic:"i-brief",subs:[
  {k:"office",n:"오피스"},{k:"study",n:"학업/통학"},{k:"travel",n:"여행용품"},{k:"digital",n:"디지털 액세서리"},{k:"health",n:"건강/상비약"}]}
];

export const SELLERS = [{n:"다은",h:"daeun.pouch",av:"다",c:"#B5838D",deals:23},{n:"준호",h:"junho.gear",av:"준",c:"#4A7C9B",deals:41},{n:"소라",h:"sora.daily",av:"소",c:"#C77A12",deals:9},{n:"태윤",h:"taeyun.run",av:"태",c:"#2E8F6B",deals:57},
 {n:"미나",h:"mina.beauty",av:"미",c:"#D2683A",deals:15},{n:"현우",h:"hyunwoo.swim",av:"현",c:"#2E8FB8",deals:32},{n:"예린",h:"yerin.trip",av:"예",c:"#8E6CC8",deals:12},{n:"도윤",h:"doyun.office",av:"도",c:"#5A6B82",deals:28}];

export const GU = [
 {sido:"서울특별시",gu:"마포구",lat:37.5663,lng:126.9019,dong:["아현동","공덕동","도화동","용강동","대흥동","염리동","신수동","서강동","서교동","합정동","망원제1동","망원제2동","연남동","성산제1동","성산제2동","상암동"]},
 {sido:"서울특별시",gu:"서대문구",lat:37.5791,lng:126.9368,dong:["신촌동","연희동","홍제1동","북아현동","충현동","남가좌1동"]},
 {sido:"서울특별시",gu:"용산구",lat:37.5326,lng:126.9905,dong:["이태원1동","한남동","효창동","청파동","원효로1동"]},
 {sido:"서울특별시",gu:"강남구",lat:37.5172,lng:127.0473,dong:["역삼동","청담동","삼성동","대치동","논현동","압구정동","신사동","개포동"]},
 {sido:"서울특별시",gu:"서초구",lat:37.4837,lng:127.0324,dong:["서초동","반포동","방배동","양재동","잠원동"]},
 {sido:"서울특별시",gu:"관악구",lat:37.4784,lng:126.9516,dong:["신림동","봉천동","남현동","청림동"]},
 {sido:"서울특별시",gu:"송파구",lat:37.5145,lng:127.1059,dong:["잠실동","방이동","석촌동","문정동","가락동"]},
 {sido:"서울특별시",gu:"영등포구",lat:37.5264,lng:126.8962,dong:["여의동","당산동","문래동","영등포동"]},
 {sido:"인천광역시",gu:"연수구",lat:37.4100,lng:126.6783,dong:["송도동","연수동","옥련동","청학동","동춘동"]},
 {sido:"경기도",gu:"성남시 분당구",lat:37.3826,lng:127.1190,dong:["정자동","서현동","수내동","야탑동","판교동"]},
 {sido:"강원특별자치도",gu:"춘천시",lat:37.8813,lng:127.7298,dong:["효자동","석사동","퇴계동","후평동","근화동","소양동"]}];

export const POP_FALLBACK = ["인공눈물","징크 선크림","러닝화","수경","보조배터리","판초 타월","립밤","텀블러","헤어 오일","목베개","수모","바람막이"];

export const TALK_TAGS = ["후기","질문","꿀팁"];

export const PRI = {must:0,used:1,share:2,swap:3};

export const PCH = {nw:"새상품",used:"중고",sim:"유사템",share:"나눔",swap:"스왑"};
