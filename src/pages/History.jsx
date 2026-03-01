import { useState, useEffect } from 'react'
import { getHistory, clearHistory } from '../utils/storage'
import { SUBJECTS } from '../data/questions'
import Result from './Result'

export default function History({ onBack }) {
  const [history, setHistory] = useState([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    if (!showClearConfirm) return
    const handler = (e) => { if (e.key === 'Escape') setShowClearConfirm(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showClearConfirm])

  function handleClear() {
    clearHistory()
    setHistory([])
    setShowClearConfirm(false)
  }

  function getModeName(record) {
    if (record.mode === 'full') return '전체 모의고사'
    const subject = SUBJECTS.find((s) => s.id === record.subjectId)
    return subject ? subject.name : '과목별'
  }

  if (selectedRecord) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-4">
          <button onClick={() => setSelectedRecord(null)} className="text-slate-500 text-sm">
            ← 기록으로
          </button>
        </div>
        <Result result={selectedRecord} onHome={() => setSelectedRecord(null)} onRetry={null} />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-slate-500 text-sm">
          ← 돌아가기
        </button>
        <h1 className="font-bold text-slate-800">점수 기록</h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className={`text-red-400 text-sm ${history.length === 0 ? 'invisible' : ''}`}
        >
          전체 삭제
        </button>
      </div>

      {/* 기록 목록 */}
      {history.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📋</div>
          <p>아직 기록이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white rounded-2xl border border-slate-200 p-4 cursor-pointer active:bg-slate-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{getModeName(record)}</span>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  record.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {record.passed ? '합격' : '불합격'}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className={`text-3xl font-bold ${
                  record.passed ? 'text-green-600' : 'text-red-500'
                }`}>
                  {record.avgScore}점
                </span>
                <div className="flex gap-2 pb-0.5 flex-wrap">
                  {record.subjectResults.map((s) => (
                    <span key={s.subjectId} className={`text-xs ${
                      s.score < 40 ? 'text-red-500 font-medium' : 'text-slate-400'
                    }`}>
                      {s.score}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-1">{record.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* 전체 삭제 확인 모달 */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">기록 삭제</h3>
            <p className="text-slate-500 text-sm mb-6">모든 점수 기록이 삭제됩니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
              >
                취소
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
