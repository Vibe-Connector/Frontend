import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ButtonOrange } from '@/components/common';
import { useMonthlyReport, useYearlyReport } from '@/hooks/useReport';
import type { MonthlyReportResponse, YearlyReportResponse } from '@/api/report';

const mainColor = '#F1863B';
const gradientStart = '#F1863B';
const gradientEnd = '#E85D75';
const gradientPurple = '#8B5CF6';

// ── Mock 폴백 데이터 (API 데이터 없을 때) ──

const mockMonthly: MonthlyReportResponse = {
  summary: { totalVibes: 47, activeDays: 23, avgPerDay: 2.0 },
  signature: { topMood: '나른한', topTime: '오후 4시', topSpace: '카페' },
  moodKeywords: [
    { word: '나른한', count: 18, percent: 38 },
    { word: '몽글몽글', count: 12, percent: 26 },
    { word: '포근한', count: 8, percent: 17 },
    { word: '차분한', count: 5, percent: 11 },
    { word: '고요한', count: 4, percent: 8 },
  ],
  weeklyFlow: [
    { week: '1주차', count: 8 }, { week: '2주차', count: 12 },
    { week: '3주차', count: 15 }, { week: '4주차', count: 12 },
  ],
  dailyHeatmap: [
    [0,1,2,1,0,2,1], [1,2,3,2,1,1,0], [2,3,4,3,2,2,1], [1,2,3,2,1,0,1], [0,1,2,1,0,0,0],
  ],
  timeDistribution: [
    { time: '아침', percent: 8 }, { time: '오전', percent: 15 },
    { time: '오후', percent: 45 }, { time: '저녁', percent: 22 }, { time: '밤', percent: 10 },
  ],
  recommendations: [
    { category: '커피', icon: '☕', items: [
      { name: '볼루토', match: '나른한', score: 95 },
      { name: '도쿄 비발토', match: '포근한', score: 88 },
      { name: '아르페지오', match: '차분한', score: 82 },
    ]},
    { category: '음악', icon: '🎵', items: [
      { name: '어쿠스틱 기타 & 허밍', match: '나른한', score: 97 },
      { name: 'Lo-Fi Beats', match: '몽글몽글', score: 91 },
      { name: 'Chet Baker 재즈', match: '고요한', score: 85 },
    ]},
    { category: '영상', icon: '🎬', items: [
      { name: '인턴', match: '나른한', score: 93 },
      { name: '카모메 식당', match: '포근한', score: 89 },
      { name: '효리네 민박', match: '차분한', score: 84 },
    ]},
    { category: '조명', icon: '💡', items: [
      { name: '3000K 전구색', match: '나른한', score: 96 },
      { name: '자연광 + 린넨커튼', match: '포근한', score: 90 },
      { name: '캔들라이트', match: '고요한', score: 86 },
    ]},
  ],
};

const mockYearly: YearlyReportResponse = {
  summary: { totalVibes: 547, activeDays: 40, avgPerMonth: 45.6 },
  monthlyTrend: [
    { month: '1월', count: 32, topMood: '차분한', color: '#93C5FD' },
    { month: '2월', count: 28, topMood: '포근한', color: '#FCA5A5' },
    { month: '3월', count: 45, topMood: '설레는', color: '#A7F3D0' },
    { month: '4월', count: 52, topMood: '몽글몽글', color: '#FDE68A' },
    { month: '5월', count: 48, topMood: '활기찬', color: '#6EE7B7' },
    { month: '6월', count: 38, topMood: '나른한', color: '#F1863B' },
    { month: '7월', count: 35, topMood: '시원한', color: '#67E8F9' },
    { month: '8월', count: 30, topMood: '느긋한', color: '#FDBA74' },
    { month: '9월', count: 55, topMood: '센치한', color: '#C4B5FD' },
    { month: '10월', count: 58, topMood: '아늑한', color: '#F9A8D4' },
    { month: '11월', count: 62, topMood: '포근한', color: '#E85D75' },
    { month: '12월', count: 64, topMood: '나른한', color: '#F1863B' },
  ],
  quarterlyEvolution: [
    { quarter: 'Q1', moods: ['차분한', '포근한', '설레는'], theme: '새로운 시작', color: '#93C5FD' },
    { quarter: 'Q2', moods: ['몽글몽글', '활기찬', '나른한'], theme: '에너지 충전', color: '#FDE68A' },
    { quarter: 'Q3', moods: ['시원한', '느긋한', '센치한'], theme: '감성 회복', color: '#67E8F9' },
    { quarter: 'Q4', moods: ['아늑한', '포근한', '나른한'], theme: '따뜻한 마무리', color: '#F1863B' },
  ],
  moodDistribution: [
    { mood: '나른한', percent: 23 }, { mood: '포근한', percent: 18 },
    { mood: '몽글몽글', percent: 14 }, { mood: '차분한', percent: 12 },
    { mood: '아늑한', percent: 11 }, { mood: '기타', percent: 22 },
  ],
  highlights: [
    { icon: '🏆', title: '가장 활발했던 달', value: '12월', detail: '64개 Vibe 생성' },
    { icon: '⏰', title: '가장 긴 세션', value: '4시간 23분', detail: '9월 15일' },
    { icon: '🔥', title: '연속 사용', value: '23일', detail: '11월 최장 기록' },
    { icon: '💫', title: '가장 많은 공유', value: '15회', detail: '10월 Vibe 카드' },
  ],
  bestMatching: [
    { category: '올해의 커피', icon: '☕', item: '볼루토', reason: '"나른한" 분위기와 가장 잘 어울렸어요', score: 156 },
    { category: '올해의 음악', icon: '🎵', item: '어쿠스틱 기타 & 허밍', reason: '전체 추천의 34%를 차지했어요', score: 187 },
    { category: '올해의 영상', icon: '🎬', item: '인턴', reason: '꾸준히 사랑받은 영화', score: 42 },
    { category: '올해의 조명', icon: '💡', item: '3000K 전구색', reason: '따뜻한 분위기에 빠지지 않았어요', score: 203 },
  ],
};

// 감각 민감도 (Mock 유지 — 사용자 결정)
const senses = [
  { name: '시각', value: 85, icon: '👁️', color: '#8B5CF6' },
  { name: '청각', value: 72, icon: '🎧', color: '#EC4899' },
  { name: '후각', value: 65, icon: '👃', color: '#F59E0B' },
  { name: '미각', value: 58, icon: '👅', color: '#10B981' },
  { name: '촉각', value: 78, icon: '✨', color: '#3B82F6' },
];

/* ── 로딩 스피너 ── */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-disabled border-t-accent" />
    </div>
  );
}

/* ── 월간 리포트 ── */
function MonthlyReport({ year, month }: { year: number; month: number }) {
  const { data: apiData, isLoading, isError } = useMonthlyReport(year, month);

  // API 데이터가 있으면 사용, 없으면 mock 폴백
  const d = apiData ?? mockMonthly;
  const isUsingMock = !apiData;

  if (isLoading) return <LoadingSpinner />;

  const maxWeeklyCount = Math.max(...d.weeklyFlow.map(w => w.count), 1);
  const topTimeLabel = d.timeDistribution.length > 0
    ? d.timeDistribution.reduce((a, b) => a.percent > b.percent ? a : b).time
    : '';

  return (
    <div className="space-y-8">
      {/* 에러 배너 */}
      {isError && (
        <div className="rounded-control bg-primary-bg p-3 text-center text-sm text-caption">
          데이터를 불러오지 못했습니다. 샘플 데이터를 표시합니다.
        </div>
      )}

      {/* 헤더 */}
      <div className="rounded-card py-10 text-center" style={{ background: `linear-gradient(135deg, ${gradientStart}10, ${gradientEnd}10)` }}>
        <p className="mb-2 text-caption">{year}년 {month}월의 기록</p>
        <h2 className="mb-2 text-4xl font-bold text-high-emphasis">당신의 Vibe 리포트</h2>
        <p className="text-lg text-caption">이번 달, 어떤 분위기를 찾았나요?</p>
      </div>

      {/* 핵심 지표 + 시그니처 + 감각 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 핵심 지표 */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">📊 이번 달 요약</h3>
          <div className="space-y-4">
            {[
              { label: '생성한 Vibe', value: d.summary.totalVibes, unit: '개' },
              { label: '활동한 날', value: d.summary.activeDays, unit: '일' },
              { label: '일평균', value: d.summary.avgPerDay, unit: '회' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between rounded-control bg-vibe-bg p-4">
                <span className="text-caption">{stat.label}</span>
                <span className="text-2xl font-bold text-accent">{stat.value}<span className="ml-1 text-sm text-low-emphasis">{stat.unit}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* 시그니처 */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">✨ 이번 달 시그니처</h3>
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full text-4xl" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}>☁️</div>
              <p className="text-xl font-bold text-high-emphasis">{d.signature.topMood || '-'}</p>
              <p className="text-sm text-low-emphasis">대표 분위기</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-vibe-bg text-2xl">🕓</div>
                <p className="font-semibold text-high-emphasis">{d.signature.topTime || '-'}</p>
                <p className="text-xs text-low-emphasis">주요 시간대</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary-bg text-2xl">☕</div>
                <p className="font-semibold text-high-emphasis">{d.signature.topSpace || '-'}</p>
                <p className="text-xs text-low-emphasis">선호 공간</p>
              </div>
            </div>
          </div>
        </div>

        {/* 감각 레이더 (Mock 유지) */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🎯 감각 민감도</h3>
          <div className="space-y-3">
            {senses.map((sense, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 text-xl">{sense.icon}</span>
                <span className="w-12 text-sm text-caption">{sense.name}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-full bg-disabled">
                  <div className="h-full rounded-full transition-all" style={{ width: `${sense.value}%`, backgroundColor: sense.color }} />
                </div>
                <span className="w-10 text-right text-sm font-semibold" style={{ color: sense.color }}>{sense.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 분위기 키워드 + 주간 흐름 + 히트맵 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 분위기 키워드 */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🎨 분위기 키워드</h3>
          <div className="space-y-3">
            {d.moodKeywords.map((mood, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-high-emphasis">{mood.word}</span>
                <div className="h-8 flex-1 overflow-hidden rounded-full bg-disabled">
                  <div className="flex h-full items-center justify-end rounded-full pr-3" style={{ width: `${mood.percent}%`, background: `linear-gradient(90deg, ${gradientStart}, ${i % 2 === 0 ? gradientEnd : gradientPurple})` }}>
                    <span className="text-xs font-medium text-white">{mood.count}회</span>
                  </div>
                </div>
                <span className="w-10 text-right text-sm text-low-emphasis">{mood.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 주간 흐름 */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">📅 주간 Vibe 흐름</h3>
          <div className="flex h-40 items-end justify-between gap-4 px-4">
            {d.weeklyFlow.map((week, i) => (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="w-full rounded-t-control" style={{ height: `${(week.count / maxWeeklyCount) * 100}%`, background: `linear-gradient(180deg, ${gradientStart}, ${gradientEnd})` }} />
                <p className="mt-2 text-xs text-caption">{week.week}</p>
                <p className="text-sm font-semibold text-accent">{week.count}회</p>
              </div>
            ))}
          </div>
        </div>

        {/* 히트맵 */}
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🔥 일별 활동 히트맵</h3>
          <div className="mb-2 flex justify-center gap-1">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <div key={day} className="w-8 text-center text-xs text-low-emphasis">{day}</div>
            ))}
          </div>
          <div className="space-y-1">
            {d.dailyHeatmap.map((week, wi) => (
              <div key={wi} className="flex justify-center gap-1">
                {week.map((count, di) => (
                  <div key={di} className="h-8 w-8 rounded-md" style={{ backgroundColor: count === 0 ? 'var(--color-surface)' : mainColor, opacity: count === 0 ? 1 : 0.3 + (count * 0.2) }} />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs text-low-emphasis">적음</span>
            {[0.3, 0.5, 0.7, 0.9].map((op, i) => (
              <div key={i} className="h-4 w-4 rounded" style={{ backgroundColor: mainColor, opacity: op }} />
            ))}
            <span className="text-xs text-low-emphasis">많음</span>
          </div>
        </div>
      </div>

      {/* 시간대별 분포 + 분위기 이미지 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">⏰ 시간대별 Vibe 분포</h3>
          <div className="relative h-48">
            <svg viewBox="0 0 400 150" className="h-full w-full">
              <defs>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={mainColor} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={mainColor} stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path d="M 0 130 Q 40 125, 80 115 Q 120 90, 160 50 Q 200 25, 240 45 Q 280 65, 320 85 Q 360 105, 400 115 L 400 150 L 0 150 Z" fill="url(#areaGrad)" />
              <path d="M 0 130 Q 40 125, 80 115 Q 120 90, 160 50 Q 200 25, 240 45 Q 280 65, 320 85 Q 360 105, 400 115" fill="none" stroke={mainColor} strokeWidth="3" />
              <circle cx="160" cy="50" r="8" fill={mainColor} />
              <text x="160" y="35" textAnchor="middle" fill={mainColor} fontSize="12" fontWeight="bold">
                {d.timeDistribution.length > 0 ? d.timeDistribution.reduce((a, b) => a.percent > b.percent ? a : b).percent + '%' : ''}
              </text>
            </svg>
          </div>
          <div className="flex justify-between px-4">
            {d.timeDistribution.map((t, i) => (
              <span key={i} className="text-sm text-low-emphasis">{t.time}</span>
            ))}
          </div>
          {topTimeLabel && (
            <div className="mt-4 rounded-control bg-vibe-bg p-3 text-center">
              <span className="font-bold text-accent">{topTimeLabel} 시간대</span>
              <span className="text-caption">에 가장 많은 Vibe를 생성했어요</span>
            </div>
          )}
        </div>

        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🖼️ 당신의 분위기 컬러</h3>
          <div className="relative h-56 overflow-hidden rounded-card" style={{ background: `linear-gradient(135deg, #FEF3E7 0%, #FDEBD0 25%, #F8D7A4 50%, #F1863B 75%, #E85D75 100%)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="mb-3 text-5xl">☁️</p>
                <p className="text-2xl font-bold drop-shadow-lg">{d.signature.topMood ? `${d.signature.topMood} 오후의 따스함` : '나른한 오후의 따스함'}</p>
                <p className="mt-2 text-sm opacity-80">{year}년 {month}월의 당신</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
              {['#FEF3E7', '#F8D7A4', '#F1863B', '#E85D75', '#8B5CF6'].map((color, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white shadow-card" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-caption">이번 달 선호한 분위기를 컬러로 표현했어요</p>
        </div>
      </div>

      {/* 관심 분위기 맞춤 추천 */}
      <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
        <h3 className="mb-2 text-sm font-semibold text-low-emphasis">🎯 관심 분위기 맞춤 추천</h3>
        <p className="mb-6 text-xs text-low-emphasis">당신이 자주 찾은 분위기와 어울리는 아이템이에요</p>
        <div className="grid grid-cols-4 gap-6">
          {d.recommendations.map((cat, ci) => (
            <div key={ci}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-semibold text-high-emphasis">{cat.category}</span>
              </div>
              <div className="space-y-3">
                {cat.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-3 rounded-control bg-surface p-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: ii === 0 ? mainColor : ii === 1 ? '#F8A87A' : '#FBC9A8' }}>{ii + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-high-emphasis">{item.name}</p>
                      <p className="text-xs text-low-emphasis">{item.match} 분위기</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{item.score}{isUsingMock ? '%' : '회'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 연간 리포트 ── */
function YearlyReport({ year }: { year: number }) {
  const { data: apiData, isLoading, isError } = useYearlyReport(year);

  const d = apiData ?? mockYearly;
  const moodColors = [mainColor, gradientEnd, gradientPurple, '#FCD34D', '#34D399', '#E5E7EB'];
  const maxMonthlyCount = Math.max(...d.monthlyTrend.map(m => m.count), 1);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {isError && (
        <div className="rounded-control bg-primary-bg p-3 text-center text-sm text-caption">
          데이터를 불러오지 못했습니다. 샘플 데이터를 표시합니다.
        </div>
      )}

      {/* 헤더 */}
      <div className="rounded-card py-10 text-center" style={{ background: `linear-gradient(135deg, ${gradientStart}15, ${gradientEnd}15)` }}>
        <p className="mb-2 text-caption">{year}년 연간 리포트</p>
        <h2 className="mb-2 text-4xl font-bold text-high-emphasis">당신의 한 해를 되돌아보며</h2>
        <p className="text-lg text-caption">365일 중 <span className="font-bold text-accent">{d.summary.activeDays}일</span>을 Vibe와 함께했어요</p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-card border border-stroke bg-white p-6 text-center shadow-card">
          <p className="text-5xl font-bold text-accent">{d.summary.totalVibes}</p>
          <p className="mt-2 text-caption">생성한 총 Vibe</p>
        </div>
        <div className="rounded-card border border-stroke bg-white p-6 text-center shadow-card">
          <p className="text-5xl font-bold" style={{ color: gradientEnd }}>{d.summary.activeDays}</p>
          <p className="mt-2 text-caption">활동한 날</p>
        </div>
        <div className="rounded-card border border-stroke bg-white p-6 text-center shadow-card">
          <p className="text-5xl font-bold" style={{ color: gradientPurple }}>{d.summary.avgPerMonth}</p>
          <p className="mt-2 text-caption">월평균 Vibe</p>
        </div>
        <div className="rounded-card border border-stroke bg-white p-6 text-center shadow-card">
          <p className="text-5xl font-bold text-green-500">Top 5%</p>
          <p className="mt-2 text-caption">전체 사용자 중</p>
        </div>
      </div>

      {/* 12개월 흐름 */}
      <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
        <h3 className="mb-6 text-sm font-semibold text-low-emphasis">📈 12개월 Vibe 흐름</h3>
        <div className="flex h-48 items-end justify-between gap-2 px-4">
          {d.monthlyTrend.map((m, i) => (
            <div key={i} className="group flex flex-1 cursor-pointer flex-col items-center">
              <div className="relative w-full">
                <div className="w-full rounded-t-control transition-all group-hover:opacity-80" style={{ height: `${(m.count / maxMonthlyCount) * 160}px`, backgroundColor: m.color }} />
                <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-default px-3 py-1 text-xs text-white opacity-0 transition-all group-hover:opacity-100">
                  {m.topMood} · {m.count}회
                </div>
              </div>
              <p className="mt-2 text-sm text-caption">{m.month.replace('월', '')}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-low-emphasis">👆 막대에 마우스를 올리면 그 달의 대표 분위기를 볼 수 있어요</p>
      </div>

      {/* 분기별 변화 + 연간 분위기 비율 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🌊 분기별 분위기 변화</h3>
          <div className="grid grid-cols-2 gap-4">
            {d.quarterlyEvolution.map((q, i) => (
              <div key={i} className="rounded-control p-4" style={{ background: `linear-gradient(135deg, ${q.color}20, ${q.color}10)` }}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: q.color }}>{q.quarter}</span>
                  <span className="text-sm text-caption">{q.theme}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.moods.map((mood, mi) => (
                    <span key={mi} className="rounded-full bg-white px-3 py-1 text-xs text-caption shadow-card">{mood}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🎨 연간 분위기 비율</h3>
          <div className="flex items-center gap-8">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                {d.moodDistribution.reduce<{ elements: React.ReactNode[]; offset: number }>((acc, mood, i) => {
                  const offset = acc.offset;
                  acc.elements.push(
                    <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={moodColors[i] ?? '#E5E7EB'} strokeWidth="20" strokeDasharray={`${mood.percent * 2.51} ${251 - mood.percent * 2.51}`} strokeDashoffset={-offset * 2.51} />,
                  );
                  acc.offset += mood.percent;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{d.summary.totalVibes}</p>
                  <p className="text-xs text-low-emphasis">Total</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {d.moodDistribution.map((mood, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: moodColors[i] ?? '#E5E7EB' }} />
                  <span className="flex-1 text-sm text-caption">{mood.mood}</span>
                  <span className="text-sm font-semibold" style={{ color: moodColors[i] ?? '#E5E7EB' }}>{mood.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하이라이트 + 분위기 이미지 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🏅 올해의 하이라이트</h3>
          <div className="grid grid-cols-2 gap-4">
            {d.highlights.map((h, i) => (
              <div key={i} className="rounded-control bg-vibe-bg p-4">
                <span className="text-3xl">{h.icon}</span>
                <p className="mt-2 text-xs text-low-emphasis">{h.title}</p>
                <p className="text-xl font-bold text-high-emphasis">{h.value}</p>
                <p className="text-xs text-low-emphasis">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🖼️ {year}년, 당신의 컬러</h3>
          <div className="relative h-48 overflow-hidden rounded-card" style={{ background: `linear-gradient(135deg, #93C5FD 0%, #FCA5A5 10%, #A7F3D0 20%, #FDE68A 30%, #6EE7B7 40%, ${mainColor} 50%, #67E8F9 60%, #FDBA74 70%, #C4B5FD 80%, #F9A8D4 90%, ${gradientEnd} 100%)` }}>
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <div className="text-center text-white drop-shadow-lg">
                <p className="mb-2 text-4xl">✨</p>
                <p className="text-2xl font-bold">{year}년의 여정</p>
                <p className="mt-1 text-sm opacity-90">12가지 분위기가 만든 당신만의 스펙트럼</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="flex overflow-hidden rounded-full shadow-inner">
              {d.monthlyTrend.map((m, i) => (
                <div key={i} className="h-6 w-6" style={{ backgroundColor: m.color }} title={m.month} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 올해의 베스트 매칭 */}
      <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
        <h3 className="mb-6 text-sm font-semibold text-low-emphasis">🏆 올해의 베스트 매칭</h3>
        <div className="grid grid-cols-4 gap-6">
          {d.bestMatching.map((rec, i) => (
            <div key={i} className="rounded-control bg-vibe-bg p-5">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-control text-3xl" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}>{rec.icon}</div>
              <p className="text-xs text-low-emphasis">{rec.category}</p>
              <p className="mt-1 text-lg font-bold text-high-emphasis">{rec.item}</p>
              <p className="mt-2 text-xs text-caption">{rec.reason}</p>
              <p className="mt-3 text-2xl font-bold text-accent">{rec.score}<span className="text-sm font-normal text-low-emphasis">회</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 아이덴티티 카드 (Mock 유지) ── */
function IdentityCard({ isYearly = false }: { isYearly?: boolean }) {
  const identity = {
    type: '오후의 몽상가',
    emoji: '☁️',
    description: '나른한 오후, 따뜻한 공간에서 몽글몽글한 분위기를 즐기는 당신',
    keywords: ['나른한', '포근한', '몽글몽글'],
    stats: isYearly ? { vibes: 547, days: 40, rank: 'Top 5%' } : { vibes: 47, days: 23, rank: 'Top 12%' },
    signature: { coffee: '볼루토', music: '어쿠스틱 기타', movie: '인턴', light: '3000K 전구색' } as Record<string, string>,
  };
  const icons: Record<string, string> = { coffee: '☕', music: '🎵', movie: '🎬', light: '💡' };

  return (
    <div className="rounded-card border border-stroke bg-white p-6 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-low-emphasis">🪪 나의 Vibe 아이덴티티</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* 카드 */}
        <div className="relative overflow-hidden rounded-card" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd}, ${gradientPurple})` }}>
          <div className="absolute top-4 right-4 text-sm font-medium text-white/50">VIBE-LINK</div>
          <div className="p-8 text-white">
            <div className="mb-6 text-center">
              <div className="mb-4 text-7xl">{identity.emoji}</div>
              <h4 className="text-3xl font-bold">{identity.type}</h4>
              <p className="mt-2 text-white/80">{identity.description}</p>
            </div>
            <div className="mb-6 flex justify-center gap-2">
              {identity.keywords.map((kw, i) => (
                <span key={i} className="rounded-full bg-white/20 px-4 py-1 text-sm">#{kw}</span>
              ))}
            </div>
            <div className="mb-6 grid grid-cols-4 gap-3">
              {Object.entries(identity.signature).map(([key, value], i) => (
                <div key={i} className="rounded-control bg-white/10 p-3 text-center">
                  <span className="text-2xl">{icons[key]}</span>
                  <p className="mt-1 truncate text-xs">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-around border-t border-white/20 pt-6 text-center">
              <div><p className="text-3xl font-bold">{identity.stats.vibes}</p><p className="text-xs text-white/60">Vibes</p></div>
              <div><p className="text-3xl font-bold">{identity.stats.days}</p><p className="text-xs text-white/60">Days</p></div>
              <div><p className="text-3xl font-bold">{identity.stats.rank}</p><p className="text-xs text-white/60">Rank</p></div>
            </div>
          </div>
        </div>

        {/* 저장 옵션 */}
        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-control bg-surface p-6">
            <h4 className="mb-2 font-semibold text-high-emphasis">📤 카드 저장하기</h4>
            <p className="mb-4 text-sm text-caption">아이덴티티 카드만 이미지로 저장해요</p>
            <ButtonOrange shape="rect" className="w-full">카드 이미지 저장</ButtonOrange>
          </div>
          <div className="rounded-control bg-surface p-6">
            <h4 className="mb-2 font-semibold text-high-emphasis">📸 전체 리포트 저장</h4>
            <p className="mb-4 text-sm text-caption">리포트 전체를 이미지로 저장해요</p>
            <button type="button" className="w-full cursor-pointer rounded-control py-3 font-medium tracking-[-1px] text-white transition-opacity duration-150 hover:opacity-80 font-pretendard" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` }}>전체 리포트 저장</button>
          </div>
          <div className="rounded-control bg-surface p-6">
            <h4 className="mb-2 font-semibold text-high-emphasis">🔗 공유하기</h4>
            <p className="mb-4 text-sm text-caption">SNS에 공유하거나 링크를 복사해요</p>
            <div className="flex gap-3">
              <button type="button" className="flex-1 cursor-pointer rounded-control border-2 border-accent py-3 font-medium tracking-[-1px] text-accent transition-opacity duration-150 hover:opacity-80 font-pretendard">링크 복사</button>
              <button type="button" className="flex-1 cursor-pointer rounded-control border-2 border-accent py-3 font-medium tracking-[-1px] text-accent transition-opacity duration-150 hover:opacity-80 font-pretendard">SNS 공유</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 ── */
export default function ProfileAnalysisReport() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  return (
    <PageContainer>
      {/* 탭 + 월 선택 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-[-1px] text-high-emphasis">분석 리포트</h1>
          <div className="flex rounded-control bg-surface p-1">
            <button
              type="button"
              onClick={() => setActiveTab('monthly')}
              className={`cursor-pointer rounded-control px-6 py-2 text-sm font-medium transition-all ${activeTab === 'monthly' ? 'bg-white text-high-emphasis shadow-card' : 'text-caption'}`}
            >
              월간 리포트
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('yearly')}
              className={`cursor-pointer rounded-control px-6 py-2 text-sm font-medium transition-all ${activeTab === 'yearly' ? 'bg-white text-high-emphasis shadow-card' : 'text-caption'}`}
            >
              연간 리포트
            </button>
          </div>
        </div>

        {activeTab === 'monthly' && (
          <div className="mt-4 flex gap-2">
            {[...Array(12)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedMonth(i + 1)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all ${selectedMonth === i + 1 ? 'text-white' : 'bg-surface text-caption hover:bg-disabled'}`}
                style={selectedMonth === i + 1 ? { backgroundColor: mainColor } : {}}
              >
                {i + 1}월
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 컨텐츠 */}
      {activeTab === 'monthly' ? (
        <>
          <MonthlyReport year={currentYear} month={selectedMonth} />
          <div className="mt-8"><IdentityCard isYearly={false} /></div>
        </>
      ) : (
        <>
          <YearlyReport year={currentYear} />
          <div className="mt-8"><IdentityCard isYearly={true} /></div>
        </>
      )}
    </PageContainer>
  );
}
