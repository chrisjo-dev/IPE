import { useState } from 'react'
import { SUBJECTS } from '../data/questions'

export default function Home({ onStartExam, onShowHistory }) {
  const [practiceMode, setPracticeMode] = useState(false)

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">정보처리기사</h1>
        <p className="text-slate-500 mt-1">2026년 1회차 모의고사 연습</p>
      </div>

      {/* 모드 선택 탭 */}
      <div role="tablist" className="flex bg-slate-100 rounded-xl p-1 mb-6">
        <button
          role="tab"
          aria-selected={!practiceMode}
          onClick={() => setPracticeMode(false)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            !practiceMode
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          시험모드
        </button>
        <button
          role="tab"
          aria-selected={practiceMode}
          onClick={() => setPracticeMode(true)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            practiceMode
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          연습모드
        </button>
      </div>

      {/* 모드 설명 */}
      <p className="text-xs text-slate-400 text-center mb-6 -mt-3">
        {practiceMode
          ? '선택 즉시 정답과 해설을 확인할 수 있어요'
          : '모든 문제를 풀고 나서 결과를 확인해요'}
      </p>

      {/* 전체 모의고사 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          전체 모의고사
        </h2>
        <button
          onClick={() => onStartExam({ mode: 'full', subjectId: null, practiceMode })}
          className="w-full bg-blue-600 text-white rounded-xl p-4 text-left shadow-sm active:bg-blue-700 transition-colors"
        >
          <div className="font-semibold text-lg">전체 문제 풀기</div>
          <div className="text-blue-200 text-sm mt-1">5과목 · 100문항</div>
        </button>
      </div>

      {/* 과목별 풀기 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          과목별 풀기
        </h2>
        <div className="space-y-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onStartExam({ mode: 'subject', subjectId: subject.id, practiceMode })}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-left shadow-sm active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400">{subject.id}과목</span>
                  <div className="font-medium text-slate-800 mt-0.5">{subject.name}</div>
                </div>
                <span className="text-slate-400 text-sm">20문항 →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 점수 기록 */}
      <button
        onClick={onShowHistory}
        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-center text-slate-600 shadow-sm active:bg-slate-50 transition-colors"
      >
        점수 기록 보기
      </button>
    </div>
  )
}
