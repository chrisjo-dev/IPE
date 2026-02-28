import { useState } from 'react'
import QuestionText from '../components/QuestionText'

export default function Result({ result, onHome, onRetry }) {
  const [openWrongSubject, setOpenWrongSubject] = useState(null)
  const [showExplanation, setShowExplanation] = useState({})

  if (!result) return null

  const { subjectResults, avgScore, passed } = result

  function toggleExplanation(qId) {
    setShowExplanation((prev) => ({ ...prev, [qId]: !prev[qId] }))
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col">
      <div className="flex-1 px-4 py-6">
        {/* 결과 헤더 */}
        {result.mode === 'subject' ? (
          <div className="rounded-2xl p-6 text-center mb-6 bg-blue-50">
            <div className="text-4xl font-bold mb-1 text-blue-600">과목 결과</div>
            <div className="text-slate-600 text-sm mb-4">{subjectResults[0]?.name}</div>
            <div className="text-5xl font-bold text-blue-700">{avgScore}점</div>
            <div className="text-slate-400 text-sm mt-1">
              {subjectResults[0]?.correct}/{subjectResults[0]?.total} 정답
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-6 text-center mb-6 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-4xl font-bold mb-1 ${passed ? 'text-green-600' : 'text-red-500'}`}>
              {passed ? '합격' : '불합격'}
            </div>
            <div className="text-slate-600 text-sm mb-4">
              {passed ? '평균 점수가 60점 이상입니다.' : '조건을 충족하지 못했습니다.'}
            </div>
            <div className={`text-5xl font-bold ${passed ? 'text-green-700' : 'text-red-600'}`}>
              {avgScore}점
            </div>
            <div className="text-slate-400 text-sm mt-1">평균 점수</div>
          </div>
        )}

        {/* 과목별 점수 */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">과목별 점수</h2>
          </div>
          {subjectResults.map((s) => (
            <div key={s.subjectId} className="px-4 py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    s.score < 40 ? 'text-red-500' : s.score >= 60 ? 'text-green-600' : 'text-amber-500'
                  }`}>
                    {s.score}점
                  </span>
                  {s.score < 40 && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">과락</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    s.score < 40 ? 'bg-red-400' : s.score >= 60 ? 'bg-green-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {s.correct}/{s.total} 정답
              </div>
            </div>
          ))}
        </div>

        {/* 오답 목록 */}
        <div className="mb-6">
          <h2 className="font-semibold text-slate-700 mb-3">오답 노트</h2>
          {subjectResults.every((s) => s.wrong.length === 0) ? (
            <div className="bg-green-50 rounded-2xl p-6 text-center text-green-600 font-medium">
              오답이 없어요!
            </div>
          ) : (
            <div className="space-y-3">
              {subjectResults.map((s) => {
                if (s.wrong.length === 0) return null
                const isOpen = openWrongSubject === s.subjectId
                return (
                  <div key={s.subjectId} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setOpenWrongSubject(isOpen ? null : s.subjectId)}
                      className="w-full px-4 py-3 flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-700">{s.name}</span>
                      <span className="text-sm text-slate-500">
                        {s.wrong.length}개 오답 {isOpen ? '▲' : '▼'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100">
                        {s.wrong.map(({ question: q, selected }) => (
                          <div key={q.id} className="px-4 py-4 border-b border-slate-50 last:border-0">
                            <p className="text-sm text-slate-700 font-medium mb-3 leading-relaxed">
                              {q.id}. <QuestionText text={q.question} />
                            </p>
                            <div className="space-y-1.5 mb-3">
                              {q.choices.map((choice, idx) => {
                                const num = idx + 1
                                const isCorrect = num === q.answer
                                const isSelected = num === selected
                                return (
                                  <div
                                    key={idx}
                                    className={`text-sm px-3 py-1.5 rounded-lg
                                      ${isCorrect ? 'bg-green-100 text-green-800 font-medium' : ''}
                                      ${isSelected && !isCorrect ? 'bg-red-100 text-red-700' : ''}
                                      ${!isCorrect && !isSelected ? 'text-slate-500' : ''}
                                    `}
                                  >
                                    {isCorrect ? '✓ ' : isSelected ? '✗ ' : ''}{num}. {choice}
                                  </div>
                                )
                              })}
                            </div>
                            <button
                              onClick={() => toggleExplanation(q.id)}
                              className="text-xs text-blue-600 font-medium"
                            >
                              {showExplanation[q.id] ? '해설 닫기 ▲' : '해설 보기 ▼'}
                            </button>
                            {showExplanation[q.id] && (
                              <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800 leading-relaxed">
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
        <button
          onClick={onHome}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium"
        >
          홈으로
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium active:bg-blue-700"
        >
          다시 풀기
        </button>
      </div>
    </div>
  )
}
