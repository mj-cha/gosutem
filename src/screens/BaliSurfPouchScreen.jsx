import React, { useState, useEffect } from "react";
import {
  Button,
  TagGroup,
  Tag,
  Modal,
  Surface,
  Avatar,
  Alert,
  Accordion,
} from "@heroui/react";
import { T, TORDER } from "../data/data.js";

// ==========================================
// [예시 데이터] 발리 한 달 살기 & 서핑 파우치 프리셋
// ==========================================
const BALI_SURF_PRESET = {
  id: "bali-surf",
  badge: "발리 · 서핑 (예시)",
  title: "캐리어 절반은 비워가세요, 짱구 서퍼의 가벼운 파우치 (예시)",
  desc: "발리에서 직접 파도 타고 지내며 남긴 솔직한 후기예요. 협찬 없이 직접 쓴 물건만 모았어요. (예시)",
  photoLabel: "bali_surf_pouch_real.jpg (예시 사진)",
  detectedCount: 6,
  items: [
    {
      id: "bs-1",
      name: "징크 선블록 SPF 30+ (예시)",
      brand: "현지 서프샵 (예시)",
      label: "must",
      tip: "한국에서 비싸게 직구하지 마세요! 발리 현지 서프샵 가면 반값에 사요. (예시)",
      comment:
        "파도 위에서 오래 버틸 때 고수가 챙기는 물건이에요. 현지 서프샵에서 소형·대형으로 팔아요. (예시)",
      expDate: "2027.08 까지 (예시)",
      marketPrice: "현지 약 7,000원 ~ 15,000원 (예시)",
      stocks: { newCnt: 2, usedCnt: 4, simCnt: 2, shareCnt: 1 },
      senseScore: 99,
      likes: 234,
    },
    {
      id: "bs-2",
      name: "노워시 헤어 트리트먼트 소용량 (예시)",
      brand: "생활용품점 (예시)",
      label: "must",
      tip: "무거운 본품 대신 출국 전 다이소에서 소용량으로 가볍게 챙겨 가세요. (예시)",
      comment:
        "바닷물에 엉킨 머리를 씻지 않고 정리할 때 썼대요. 본품 대신 소용량이면 한 달 충분해요. (예시)",
      expDate: "2027.11 까지 (예시)",
      marketPrice: "다이소가 3,000원 ~ 5,000원 (예시)",
      stocks: { newCnt: 2, usedCnt: 3, simCnt: 2, shareCnt: 2 },
      senseScore: 98,
      likes: 195,
    },
    {
      id: "bs-3",
      name: "판초형 샌드프리 비치타월 (예시)",
      brand: "서핑 브랜드 (예시)",
      label: "used",
      tip: "해변에서 옷 갈아입을 때 내 프라이버시를 지켜주는 이동식 탈의실이에요. (예시)",
      comment:
        "모래도 잘 안 붙고 툭 뒤집어쓰기 좋아요. 한 달 살기 끝내고 돌아온 분들이 내놓는 깨끗한 중고 매물이 많으니 반값에 구해 보세요.",
      expDate: "유통기한 없음 (패브릭 · 예시)",
      marketPrice: "중고 시세 약 18,000원 (예시)",
      stocks: { newCnt: 2, usedCnt: 6, simCnt: 1, shareCnt: 0 },
      senseScore: 92,
      likes: 84,
    },
    {
      id: "bs-4",
      name: "골드 쉬머 바디 오일 (예시)",
      brand: "바디 브랜드 (예시)",
      label: "swap",
      tip: "해 질 녘 비치클럽 조명 아래서 은은하게 빛나는 피부 결을 만들어 줘요. (예시)",
      comment:
        "어깨와 쇄골에 살짝 발라주면 건강해 보여요. 코코넛 향이나 펄 입자 크기가 취향을 타니 한 번 써보고 안 맞으면 다른 향 가진 분과 스왑해 보세요.",
      expDate: "2026.12 까지 (예시)",
      marketPrice: "교환 희망 / 시세 22,000원 (예시)",
      stocks: { newCnt: 2, usedCnt: 3, simCnt: 2, shareCnt: 1 },
      senseScore: 89,
      likes: 67,
    },
    {
      id: "bs-5",
      name: "대용량 알로에 수딩젤 & 모기 기피제 세트 (예시)",
      brand: "현지 마트템 (예시)",
      label: "share",
      tip: "귀국 전날 밤, 막 발리에 도착한 여행자에게 물려주기 가장 좋은 아이템이에요. (예시)",
      comment:
        "한 달 내내 햇볕에 달아오른 피부를 진정시켜 줬지만 한국으로 들고 가기엔 무거워요. 방 빼기 전 새로 입성한 여행자에게 기분 좋게 나눔해 보세요.",
      expDate: "2027.03 까지 (예시)",
      marketPrice: "무료 나눔 (0원 · 예시)",
      stocks: { newCnt: 3, usedCnt: 1, simCnt: 2, shareCnt: 5 },
      senseScore: 96,
      likes: 145,
    },
    {
      id: "bs-6",
      name: "여행용 샤워기 헤드 & 대량 필터 세트 (예시)",
      brand: "일반 여행용품 (예시)",
      label: "no",
      tip: "후기만 보고 무겁게 사 갔는데 한 달 내내 캐리어에서 꺼내지도 않았어요. (예시)",
      comment:
        "요즘 짱구나 스미냑 근처 깔끔한 숙소들은 자체 정수 시설이 잘 되어 있어서 필터가 불필요한 곳도 많아요.",
      instead: "대신 · 숙소 수질을 먼저 확인하고 필요할 때만 현지에서 소량 구하기 (예시)",
      expDate: "미개봉 (예시)",
      marketPrice: "중고 처분가 9,000원 (예시)",
      stocks: { newCnt: 3, usedCnt: 8, simCnt: 0, shareCnt: 3 },
      senseScore: 98,
      likes: 189,
    },
  ],
};

/* 라벨 이름·색·뜻은 공통 데이터(T)에서 가져옴 */
const LABEL_META = Object.fromEntries(TORDER.map((k) => [k, { key: k, name: T[k].name, colorVar: T[k].c, desc: T[k].def }]));

const AUTOSAVE_KEY = "gosutem_bali_surf_autosave_v1";

// ==========================================
// [하위 부품] 재고 및 유사템 상세 모달
// ==========================================
function StockDetailModal({ item, isOpen, onClose }) {
  if (!item) return null;
  const meta = LABEL_META[item.label] || LABEL_META.must;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded-2xl p-4 max-w-[360px] mx-auto">
            <Modal.Header className="flex flex-col gap-1 pb-2 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-[var(--surface)]"
                  style={{ backgroundColor: meta.colorVar }}
                >
                  {meta.name}
                </span>
                <span className="text-xs text-[var(--muted)]">{item.brand}</span>
              </div>
              <Modal.Heading className="text-base font-bold text-[var(--ink)]">
                {item.name}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="py-3 flex flex-col gap-3 text-sm">
              <div className="p-2.5 rounded-xl bg-[var(--ground)] border border-[var(--line)]">
                <p className="text-xs text-[var(--muted)] mb-1">사용기한·시세 (예시)</p>
                <p className="font-medium text-[var(--ink)]">· 유통기한/상태: {item.expDate}</p>
                <p className="font-medium text-[var(--accent)]">· 기준 시세: {item.marketPrice}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-[var(--muted)]">어디서 구할 수 있나요? (채널별 재고 예시)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[var(--ground)] border border-[var(--line)] flex flex-col">
                    <span className="text-xs text-[var(--muted)]">새상품 최저가</span>
                    <span className="text-sm font-bold text-[var(--ink)]">{item.stocks.newCnt}곳 연결 가능 (예시)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--ground)] border border-[var(--line)] flex flex-col">
                    <span className="text-xs text-[var(--muted)]">참여자 중고 재고</span>
                    <span className="text-sm font-bold text-[var(--off)]">{item.stocks.usedCnt}건 매칭 대기 (예시)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--ground)] border border-[var(--line)] flex flex-col">
                    <span className="text-xs text-[var(--muted)]">비슷한 효과 유사템</span>
                    <span className="text-sm font-bold text-[var(--accent)]">{item.stocks.simCnt}종 추천 (예시)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--ground)] border border-[var(--line)] flex flex-col">
                    <span className="text-xs text-[var(--muted)]">무료 나눔 매물</span>
                    <span className="text-sm font-bold text-[var(--ink)]">
                      {item.stocks.shareCnt > 0 ? `${item.stocks.shareCnt}건 나눔 중 (예시)` : "나눔 없음 (예시)"}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="pt-2 border-t border-[var(--line)] flex justify-end gap-2">
              <Button
                size="sm"
                onPress={() => onClose(false)}
                className="bg-[var(--ground)] text-[var(--ink)] border border-[var(--line)] rounded-xl px-4 py-1.5 text-xs"
              >
                닫기
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

// ==========================================
// [메인 컴포넌트] BaliSurfPouchScreen
// ==========================================
export default function BaliSurfPouchScreen() {
  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.items) return parsed;
      }
    } catch {
      // ignore
    }
    return {
      bagTitle: BALI_SURF_PRESET.title,
      bagDesc: BALI_SURF_PRESET.desc,
      items: BALI_SURF_PRESET.items,
      savedIds: ["bs-1", "bs-2"],
      filterTab: "all",
      lastSavedAt: "방금 자동 저장됨",
    };
  };

  const initial = loadInitialState();

  const [bagTitle, setBagTitle] = useState(initial.bagTitle);
  const [bagDesc, setBagDesc] = useState(initial.bagDesc);
  const [items, setItems] = useState(initial.items);
  const [savedIds, setSavedIds] = useState(initial.savedIds || []);
  const [filterTab, setFilterTab] = useState(initial.filterTab || "all");
  const [lastSavedAt, setLastSavedAt] = useState(initial.lastSavedAt);
  const [selectedModalItem, setSelectedModalItem] = useState(null);
  const [publishNotice, setPublishNotice] = useState("");

  // 수시로 자동 저장 (localStorage)
  useEffect(() => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const payload = {
      bagTitle,
      bagDesc,
      items,
      savedIds,
      filterTab,
      lastSavedAt: timeStr,
    };

    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
      setLastSavedAt(timeStr);
    } catch {
      // ignore
    }
  }, [bagTitle, bagDesc, items, savedIds, filterTab]);

  const handleChangeItemLabel = (itemId, nextLabel) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, label: nextLabel } : it))
    );
  };

  const handleToggleHeart = (itemId) => {
    setSavedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const counts = items.reduce(
    (acc, it) => {
      acc.all += 1;
      acc[it.label] = (acc[it.label] || 0) + 1;
      return acc;
    },
    { all: 0, must: 0, share: 0, used: 0, swap: 0, no: 0 }
  );

  const filteredItems = filterTab === "all" ? items : items.filter((it) => it.label === filterTab);

  const handleResetDraft = () => {
    setBagTitle(BALI_SURF_PRESET.title);
    setBagDesc(BALI_SURF_PRESET.desc);
    setItems(BALI_SURF_PRESET.items);
    setSavedIds(["bs-1", "bs-2"]);
    setFilterTab("all");
    setPublishNotice("발리 서핑 파우치 초기 상태로 되돌렸어요.");
  };

  const handlePublishBag = () => {
    setPublishNotice(
      `발리 서핑 파우치 총 ${items.length}개 물건(담은 물건 ${savedIds.length}개)이 공개 및 재고 매칭에 등록되었어요! (예시)`
    );
  };

  return (
    <div className="pad w-full max-w-[390px] mx-auto min-h-screen bg-[var(--ground)] text-[var(--ink)] pb-24 flex flex-col gap-4 overflow-x-hidden">
      {/* 상단 헤더 & 자동저장 배지 */}
      <header className="pt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--surface)] flex items-center justify-center text-xs font-bold">
              bali
            </Avatar>
            <div>
              <h1 className="text-base font-bold leading-tight text-[var(--ink)]">
                발리 서핑 & 한 달 살기 파우치
              </h1>
              <p className="text-xs text-[var(--muted)]">고수 가방 예시</p>
            </div>
          </div>
          <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--accent)] border border-[var(--line)]">
            자동저장 {lastSavedAt}
          </span>
        </div>

        <Alert className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink)]">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[var(--accent)]">
              캐리어는 가볍게, 짱구 서퍼의 찐 애정템만 담았어요! (예시)
            </span>
            <span className="text-[var(--muted)]">
              현지 조달 팁부터 중고·나눔까지 한눈에 비교해 보세요.
            </span>
          </div>
        </Alert>
      </header>

      {/* 파우치 타이틀 & 소개 편집 */}
      <Surface className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--ink)]">파우치 초안 정보</span>
          <button type="button" onClick={handleResetDraft} className="text-[11px] text-[var(--muted)] underline">
            초안 초기화
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[var(--muted)]">파우치 제목</label>
          <input
            type="text"
            value={bagTitle}
            onChange={(e) => setBagTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--ground)] text-[var(--ink)] border border-[var(--line)] text-xs font-semibold focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-[var(--muted)]">한 줄 소개</label>
          <textarea
            rows={2}
            value={bagDesc}
            onChange={(e) => setBagDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--ground)] text-[var(--ink)] border border-[var(--line)] text-xs focus:outline-none resize-none"
          />
        </div>
      </Surface>

      {/* 라벨별 필터 Tabs (HeroUI v3 점 표기 조립식) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--ink)]">물건별 라벨 및 담기</span>
          <span className="text-[11px] text-[var(--accent)] font-semibold">내 가방 담김 {savedIds.length}개</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="라벨로 거르기">
          {[["all", "전체", counts.all]].concat(Object.values(LABEL_META).map((lm) => [lm.key, lm.name, counts[lm.key] || 0])).map(([k, n, c]) => (
            <button key={k} type="button" aria-pressed={filterTab === k} onClick={() => setFilterTab(k)}
              className={`shrink-0 min-h-[40px] px-3 rounded-full text-xs font-semibold border ${filterTab === k ? "bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]" : "bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]"}`}>
              {n} {c}
            </button>
          ))}
        </div>
      </div>

      {/* 아이템 리스트 카드 */}
      <div className="flex flex-col gap-3">
        {filteredItems.map((item, idx) => {
          const meta = LABEL_META[item.label] || LABEL_META.must;
          const isHearted = savedIds.includes(item.id);

          return (
            <Surface key={item.id} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[var(--muted)]">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedModalItem(item)}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-[var(--surface)]"
                    style={{ backgroundColor: meta.colorVar }}
                  >
                    {meta.name}
                  </button>
                  <span className="text-[11px] text-[var(--muted)]">{item.brand}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleHeart(item.id)}
                  aria-label="내 가방에 담기"
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                    isHearted
                      ? "bg-[var(--accent)] text-[var(--surface)] border-[var(--accent)]"
                      : "bg-[var(--ground)] text-[var(--muted)] border-[var(--line)]"
                  }`}
                >
                  {isHearted ? "♥ 담김" : "♡ 담기"}
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold text-[var(--ink)] leading-snug">{item.name}</h2>
                <p className="text-xs font-semibold text-[var(--accent)]">“{item.tip}”</p>
                <p className="text-xs text-[var(--ink)] leading-relaxed">{item.comment}</p>
                {item.instead && (
                  <p className="text-xs font-semibold text-[var(--off)] mt-0.5">{item.instead}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--muted)] bg-[var(--ground)] px-2.5 py-1.5 rounded-xl border border-[var(--line)]">
                <span>{item.expDate}</span>
                <span className="font-semibold text-[var(--ink)]">{item.marketPrice}</span>
              </div>

              {/* 스톡 배지 버튼 */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedModalItem(item)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[var(--ground)] text-[var(--ink)] border border-[var(--line)]"
                >
                  새상품 {item.stocks.newCnt}곳 (예시)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModalItem(item)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[var(--ground)] text-[var(--off)] border border-[var(--line)] font-semibold"
                >
                  중고 {item.stocks.usedCnt} (예시)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModalItem(item)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[var(--ground)] text-[var(--accent)] border border-[var(--line)] font-semibold"
                >
                  유사템 {item.stocks.simCnt} (예시)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModalItem(item)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-[var(--ground)] text-[var(--ink)] border border-[var(--line)]"
                >
                  {item.stocks.shareCnt > 0 ? `나눔 ${item.stocks.shareCnt} (예시)` : "나눔 없음"}
                </button>
              </div>

              {/* 라벨 변경 TagGroup */}
              <div className="pt-1.5 border-t border-[var(--line)] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--muted)]">라벨 바꾸기 (터치 시 즉시 반영·자동저장)</span>
                  <span className="text-[11px] text-[var(--muted)]">공감 {item.likes} (예시)</span>
                </div>

                <TagGroup
                  aria-label="라벨 바꾸기"
                  selectionMode="single"
                  selectedKeys={new Set([item.label])}
                  onSelectionChange={(keys) => {
                    const nextKey = Array.from(keys)[0];
                    if (nextKey) handleChangeItemLabel(item.id, String(nextKey));
                  }}
                >
                  <TagGroup.List className="flex flex-wrap gap-1">
                    {Object.values(LABEL_META).map((lm) => {
                      const isSelected = item.label === lm.key;
                      return (
                        <Tag
                          key={lm.key}
                          id={lm.key}
                          className={`text-[11px] px-2 py-0.5 rounded-lg border cursor-pointer ${
                            isSelected
                              ? "font-bold text-[var(--surface)] border-transparent"
                              : "bg-[var(--ground)] text-[var(--muted)] border-[var(--line)]"
                          }`}
                          style={isSelected ? { backgroundColor: lm.colorVar } : undefined}
                        >
                          {lm.name}
                        </Tag>
                      );
                    })}
                  </TagGroup.List>
                </TagGroup>
              </div>
            </Surface>
          );
        })}
      </div>

      {/* 안내 Accordion */}
      <Surface className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
        <Accordion>
          <Accordion.Item id="bali-guide">
            <Accordion.Heading>
              <Accordion.Trigger className="w-full flex items-center justify-between text-xs font-bold text-[var(--ink)] py-1">
                <span>발리 서핑 파우치 팁 & 현지 조달 가이드</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pt-2 text-xs text-[var(--muted)] flex flex-col gap-1.5 leading-relaxed">
                <p>· <strong>현지 마트 조달:</strong> 짱구·스미냑 대형 마트(Bintang Supermarket 등)에서 선블록과 알로에를 현지 구매하면 캐리어 무게를 크게 아낄 수 있어요. (예시)</p>
                <p>· <strong>출국 전 나눔:</strong> 한 달 살기를 마치고 귀국할 때 남은 소모품은 새로 입국하는 서퍼 친구에게 나눔템으로 넘겨주세요. (예시)</p>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Surface>

      {/* 하단 고정 액션 바 */}
      <div className="sticky bottom-2 z-10 p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex flex-col gap-2 shadow-sm">
        {publishNotice && (
          <p className="text-xs font-semibold text-[var(--accent)] px-1">{publishNotice}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--ink)]">담은 물건 {savedIds.length}개 · 전체 {items.length}개</span>
            <span className="text-[11px] text-[var(--muted)]">변경 사항은 수시로 자동 저장돼요</span>
          </div>
          <Button
            size="sm"
            onPress={handlePublishBag}
            className="bg-[var(--accent)] text-[var(--surface)] font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            발리 파우치 공개 & 등록 (예시)
          </Button>
        </div>
      </div>

      {/* 상세 모달 */}
      <StockDetailModal
        item={selectedModalItem}
        isOpen={Boolean(selectedModalItem)}
        onClose={() => setSelectedModalItem(null)}
      />
    </div>
  );
}
