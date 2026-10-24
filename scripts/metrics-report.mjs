/**
 * 고수템 지표 리포트 스크립트 (docs/METRICS.md 10개 지표 계산)
 *
 * 사용법:
 *   node scripts/metrics-report.mjs [데이터_폴더_경로]
 *
 * 예시:
 *   node scripts/metrics-report.mjs ./data
 *
 * /api/track 이 내려주는 NDJSON 파일들을 받아 docs/METRICS.md 의 10개 지표를
 * 마크다운 표 형식으로 계산하여 출력합니다.
 * Node.js 22 내장 모듈만 사용합니다.
 */

import fs from 'node:fs';
import path from 'node:path';

function getFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const stats = fs.statSync(dirPath);
  if (stats.isFile()) {
    return [dirPath];
  }
  const entries = fs.readdirSync(dirPath, { recursive: true, withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith('.ndjson') || entry.name.endsWith('.json') || entry.name.endsWith('.log'))) {
      const parentDir = entry.parentPath || entry.path || dirPath;
      files.push(path.join(parentDir, entry.name));
    }
  }
  return files;
}

function pct(num, den) {
  if (!den || den === 0) return '0.0%';
  return ((num / den) * 100).toFixed(1) + '%';
}

function formatDate(ts) {
  if (!ts) return 'Unknown';
  if (typeof ts === 'string' && /^\d{4}-\d{2}-\d{2}/.test(ts)) {
    return ts.slice(0, 10);
  }
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return 'Unknown';
    return d.toISOString().slice(0, 10);
  } catch {
    return 'Unknown';
  }
}

async function main() {
  const targetPath = process.argv[2] || './data';

  if (targetPath === '--help' || targetPath === '-h') {
    console.log(`사용법: node scripts/metrics-report.mjs [데이터_폴더_경로]`);
    console.log(`예시: node scripts/metrics-report.mjs ./data`);
    process.exit(0);
  }

  const files = getFiles(targetPath);
  if (files.length === 0) {
    console.error(`Error: 경로 '${targetPath}'에서 분석할 NDJSON 파일을 찾을 수 없습니다.`);
    console.error(`사용법: node scripts/metrics-report.mjs [데이터_폴더_경로]`);
    process.exit(1);
  }

  const events = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const row = JSON.parse(trimmed);
        events.push(row);
      } catch {
        // Ignore malformed JSON lines
      }
    }
  }

  // --- Aggregate Data ---

  // All unique SIDs
  const allSids = new Set();

  // Date -> Set of SIDs
  const dailySids = new Map();

  // Session utm_source: sid -> utm_source
  const sessionChannel = new Map();

  // Sessions visiting Bag detail
  const bagDetailSids = new Set();

  // Sessions with channel_pick
  const channelPickSids = new Set();

  // Channel pick counts by ch (new / used / share / etc.)
  const channelPickCounts = new Map();

  // Sessions with outbound
  const outboundSids = new Set();

  // Outbound host counts
  const outboundHostCounts = new Map();

  // Scrap sessions & Follow sessions
  const scrapSids = new Set();
  const followSids = new Set();

  // Preorder done sessions & open_bag count
  const preorderDoneSids = new Set();
  let preorderOpenBagCount = 0;
  let preorderDoneCount = 0;

  // Supply modal open sessions & step sessions
  const supplyModalSids = new Set();
  const supplyStepSids = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };

  // SID -> Set of dates
  const sidDates = new Map();

  for (const e of events) {
    const sid = e.sid || 'unknown';
    allSids.add(sid);

    // Date
    const date = formatDate(e.t);
    if (!dailySids.has(date)) dailySids.set(date, new Set());
    dailySids.get(date).add(sid);

    if (!sidDates.has(sid)) sidDates.set(sid, new Set());
    if (date !== 'Unknown') sidDates.get(sid).add(date);

    // Channel (utm_source)
    const ch = e.utm_source || e.ref || null;
    if (ch && (!sessionChannel.has(sid) || sessionChannel.get(sid) === '(direct)')) {
      sessionChannel.set(sid, ch);
    } else if (!sessionChannel.has(sid)) {
      sessionChannel.set(sid, '(direct)');
    }

    // Event name
    const name = e.n;
    const route = e.route || '';

    // 2. Bag detail entry
    const isBagDetail =
      name === 'bag_view' ||
      (name === 'screen' && (route.startsWith('bag') || /^b\d+/.test(route))) ||
      Boolean(e.bag);

    if (isBagDetail) {
      bagDetailSids.add(sid);
    }

    // 3. channel_pick
    if (name === 'channel_pick') {
      channelPickSids.add(sid);
      const chType = e.ch || 'unknown';
      channelPickCounts.set(chType, (channelPickCounts.get(chType) || 0) + 1);
    }

    // 6. outbound
    if (name === 'outbound') {
      outboundSids.add(sid);
      const host = e.host || 'unknown';
      outboundHostCounts.set(host, (outboundHostCounts.get(host) || 0) + 1);
    }

    // 7. scrap & follow
    if (name === 'scrap' && (e.on == 1 || e.on === '1' || e.on === true)) {
      scrapSids.add(sid);
    }
    if (name === 'follow' && (e.on == 1 || e.on === '1' || e.on === true)) {
      followSids.add(sid);
    }

    // 8. preorder_done
    if (name === 'preorder_done') {
      preorderDoneSids.add(sid);
      preorderDoneCount++;
      if (e.open_bag == 1 || e.open_bag === '1' || e.open_bag === true) {
        preorderOpenBagCount++;
      }
    }

    // 9. supply_step & modal(supply)
    if (name === 'modal' && e.type === 'supply') {
      supplyModalSids.add(sid);
    }
    if (name === 'supply_step') {
      supplyModalSids.add(sid);
      const step = Number(e.step);
      if (supplyStepSids[step]) {
        supplyStepSids[step].add(sid);
      }
    }
  }

  const totalSessions = allSids.size;

  // Channel breakdown
  const channelCounts = new Map();
  for (const sid of allSids) {
    const channel = sessionChannel.get(sid) || '(direct)';
    channelCounts.set(channel, (channelCounts.get(channel) || 0) + 1);
  }

  // Repeat visitors
  let repeatVisitSids = 0;
  for (const [, dates] of sidDates) {
    if (dates.size >= 2) repeatVisitSids++;
  }

  // Generate Markdown
  let md = `# 고수템 지표 리포트 (docs/METRICS.md)\n\n`;
  md += `분석 대상 파일: ${files.length}개 | 총 이벤트: ${events.length}건 | 총 세션(sid): ${totalSessions}개\n\n`;

  // 1. 일별 세션
  md += `### 1. 일별 세션 수\n\n`;
  md += `| 날짜 | 세션 수(sid) |\n`;
  md += `|---|---|\n`;
  const sortedDates = Array.from(dailySids.keys()).sort();
  for (const date of sortedDates) {
    md += `| ${date} | ${dailySids.get(date).size} |\n`;
  }
  md += `| **전체 (중복 제거)** | **${totalSessions}** |\n\n`;

  // 2. 유입 채널별 세션
  md += `### 2. 유입 채널별 세션 수 (utm_source)\n\n`;
  md += `| 유입 채널 | 세션 수 | 비율 |\n`;
  md += `|---|---|---|\n`;
  for (const [ch, cnt] of Array.from(channelCounts.entries()).sort((a, b) => b[1] - a[1])) {
    md += `| ${ch} | ${cnt} | ${pct(cnt, totalSessions)} |\n`;
  }
  md += `\n`;

  // 3. 홈 -> 가방 진입률
  md += `### 3. 홈 → 가방 상세 진입률\n\n`;
  md += `| 구분 | 세션 수 | 비율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 전체 세션 | ${totalSessions} | 100.0% |\n`;
  md += `| 가방 상세 진입 세션 | ${bagDetailSids.size} | ${pct(bagDetailSids.size, totalSessions)} |\n\n`;

  // 4. 북극성 지표
  md += `### 4. channel_pick 세션 비율 (북극성 지표)\n\n`;
  md += `| 구분 | 세션 수 | 비율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 가방 상세 진입 세션 | ${bagDetailSids.size} | 100.0% |\n`;
  md += `| channel_pick 1회 이상 세션 (북극성) | ${channelPickSids.size} | ${pct(channelPickSids.size, bagDetailSids.size)} |\n\n`;

  // 5. 경로 비중 (new/used/share)
  md += `### 5. 경로 비중 (new / used / share)\n\n`;
  md += `| 구매 경로(ch) | 선택 건수 | 비중 |\n`;
  md += `|---|---|---|\n`;
  const totalPicks = Array.from(channelPickCounts.values()).reduce((a, b) => a + b, 0);
  for (const [ch, cnt] of Array.from(channelPickCounts.entries()).sort((a, b) => b[1] - a[1])) {
    md += `| ${ch} | ${cnt} | ${pct(cnt, totalPicks)} |\n`;
  }
  if (totalPicks === 0) {
    md += `| (데이터 없음) | 0 | 0.0% |\n`;
  }
  md += `\n`;

  // 6. outbound 클릭률 및 host 분포
  md += `### 6. outbound 클릭률 및 host 분포\n\n`;
  md += `#### 6-1. outbound 클릭률\n`;
  md += `| 구분 | 세션 수 | 클릭률 |\n`;
  md += `|---|---|---|\n`;
  md += `| outbound 클릭 발생 세션 | ${outboundSids.size} | ${pct(outboundSids.size, totalSessions)} |\n\n`;
  md += `#### 6-2. 호스트(host) 분포\n`;
  md += `| 도메인(host) | 클릭 건수 | 비중 |\n`;
  md += `|---|---|---|\n`;
  const totalOutbounds = Array.from(outboundHostCounts.values()).reduce((a, b) => a + b, 0);
  for (const [host, cnt] of Array.from(outboundHostCounts.entries()).sort((a, b) => b[1] - a[1])) {
    md += `| ${host} | ${cnt} | ${pct(cnt, totalOutbounds)} |\n`;
  }
  if (totalOutbounds === 0) {
    md += `| (데이터 없음) | 0 | 0.0% |\n`;
  }
  md += `\n`;

  // 7. 스크랩 / 팔로우율
  md += `### 7. 스크랩 · 팔로우율\n\n`;
  md += `| 행동 지표 | 세션 수 | 전환율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 스크랩 (scrap on=1) | ${scrapSids.size} | ${pct(scrapSids.size, totalSessions)} |\n`;
  md += `| 팔로우 (follow on=1) | ${followSids.size} | ${pct(followSids.size, totalSessions)} |\n\n`;

  // 8. 사전신청 전환율
  md += `### 8. 사전신청 전환율 및 가방 열 의향 비율\n\n`;
  md += `| 지표 | 수치 | 비율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 사전신청 완료 세션 (preorder_done) | ${preorderDoneSids.size} | ${pct(preorderDoneSids.size, totalSessions)} |\n`;
  md += `| 사전신청자 중 가방 열 의향 (open_bag=1) | ${preorderOpenBagCount} | ${pct(preorderOpenBagCount, preorderDoneCount)} |\n\n`;

  // 9. supply_step 완주율
  md += `### 9. 고수 데뷔 팝업 연 비율 및 supply_step 완주율\n\n`;
  md += `| 단계 | 세션 수 | 비율 / 완주율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 고수 데뷔 팝업 진입 (type=supply) | ${supplyModalSids.size} | ${pct(supplyModalSids.size, totalSessions)} |\n`;
  md += `| 1단계 (사진) | ${supplyStepSids[1].size} | ${pct(supplyStepSids[1].size, supplyModalSids.size)} |\n`;
  md += `| 2단계 (입력) | ${supplyStepSids[2].size} | ${pct(supplyStepSids[2].size, supplyModalSids.size)} |\n`;
  md += `| 3단계 (초안) | ${supplyStepSids[3].size} | ${pct(supplyStepSids[3].size, supplyModalSids.size)} |\n`;
  md += `| 4단계 (공개 완주) | ${supplyStepSids[4].size} | ${pct(supplyStepSids[4].size, supplyModalSids.size)} (완주율) |\n\n`;

  // 10. 재방문율
  md += `### 10. 재방문율 (2일 이상 방문)\n\n`;
  md += `| 구분 | 사용자 수(sid) | 비율 |\n`;
  md += `|---|---|---|\n`;
  md += `| 전체 사용자 | ${totalSessions} | 100.0% |\n`;
  md += `| 2일 이상 방문 사용자 (재방문) | ${repeatVisitSids} | ${pct(repeatVisitSids, totalSessions)} |\n`;

  console.log(md);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
