import { useState, useMemo, useEffect } from 'react'
import { getExamData } from '../data/questions'
import { saveResult } from '../utils/storage'
import QuestionText from '../components/QuestionText'

export default function Exam({ config, onFinish, onCancel }) {
  const practiceMode = config.practiceMode
  const { questions, subjects } = getExamData(config.examId)

  const examQuestions = useMemo(() => {
    if (config.mode === 'full') return questions
    return questions.filter((q) => q.subject === config.subjectId)
  }, [config.mode, config.subjectId, questions])

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: choiceIndex(1~4) }
  const [showExplanation, setShowExplanation] = useState({}) // { questionId: bool }, undefined = 열림
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  useEffect(() => {
    if (!showConfirm) return
    const handler = (e) => { if (e.key === 'Escape') setShowConfirm(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showConfirm])

  const q = examQuestions[current]
  const total = examQuestions.length
  const answered = Object.keys(answers).length
  const currentAnswered = answers[q.id] != null

  function selectAnswer(choiceIndex) {
    // 연습모드에서 이미 답변한 경우 변경 불가
    if (practiceMode && answers[q.id] != null) return
    setAnswers((prev) => ({ ...prev, [q.id]: choiceIndex }))
  }

  function toggleExplanation(qId) {
    setShowExplanation((prev) => ({ ...prev, [qId]: prev[qId] !== false ? false : true }))
  }

  function submit() {
    const subjectScores = {}
    subjects.forEach((s) => {
      subjectScores[s.id] = { name: s.name, correct: 0, total: 0, wrong: [] }
    })

    examQuestions.forEach((q) => {
      const sid = q.subject
      if (!subjectScores[sid]) return
      subjectScores[sid].total++
      if (answers[q.id] === q.answer) {
        subjectScores[sid].correct++
      } else {
        subjectScores[sid].wrong.push({
          question: q,
          selected: answers[q.id] ?? null,
        })
      }
    })

    const subjectResults = Object.entries(subjectScores)
      .filter(([, v]) => v.total > 0)
      .map(([id, v]) => ({
        subjectId: Number(id),
        name: v.name,
        correct: v.correct,
        total: v.total,
        score: Math.round((v.correct / v.total) * 100),
        wrong: v.wrong,
      }))

    const avgScore =
      subjectResults.reduce((sum, s) => sum + s.score, 0) / subjectResults.length
    const hasFail = subjectResults.some((s) => s.score < 40)
    const passed = avgScore >= 60 && !hasFail

    const result = {
      id: Date.now(),
      date: new Date().toLocaleString('ko-KR'),
      mode: config.mode,
      subjectId: config.subjectId,
      practiceMode,
      subjectResults,
      avgScore: Math.round(avgScore),
      passed,
    }

    saveResult(result)
    onFinish(result)
  }

  // 연습모드에서 선택지 스타일
  function getChoiceStyle(choiceNum) {
    const isSelected = answers[q.id] === choiceNum
    const isCorrect = q.answer === choiceNum

    if (!practiceMode) {
      // 시험모드: 선택 여부만 표시
      return isSelected
        ? 'border-blue-500 bg-blue-50 text-blue-800'
        : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50'
    }

    // 연습모드: 답변 후 정답/오답 표시
    if (!currentAnswered) {
      return 'border-slate-200 bg-white text-slate-700 active:bg-slate-50'
    }
    if (isCorrect) return 'border-green-500 bg-green-50 text-green-800'
    if (isSelected) return 'border-red-400 bg-red-50 text-red-700'
    return 'border-slate-200 bg-white text-slate-400'
  }

  function getChoiceNumStyle(choiceNum) {
    const isSelected = answers[q.id] === choiceNum
    const isCorrect = q.answer === choiceNum

    if (!practiceMode) {
      return isSelected ? 'text-blue-600' : 'text-slate-400'
    }
    if (!currentAnswered) return 'text-slate-400'
    if (isCorrect) return 'text-green-600'
    if (isSelected) return 'text-red-500'
    return 'text-slate-300'
  }

  // 문제 번호 네비게이션 색상 (연습모드: 정답/오답 구분)
  function getNavStyle(idx) {
    const navQ = examQuestions[idx]
    const isCurrent = idx === current
    const navAnswer = answers[navQ.id]

    if (isCurrent) return 'bg-blue-600 text-white'
    if (navAnswer == null) return 'bg-slate-100 text-slate-500'
    if (!practiceMode) return 'bg-blue-100 text-blue-700'
    return navAnswer === navQ.answer
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-600'
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => setShowConfirm(true)} className="text-slate-500 text-sm">
          ✕ 나가기
        </button>
        <div className="text-center">
          <span className="text-sm font-medium text-slate-700">{current + 1} / {total}</span>
          {practiceMode && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">연습</span>
          )}
        </div>
        <span className="text-sm text-slate-500">{answered}/{total} 답변</span>
      </div>

      {/* 문제 번호 네비게이션 */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {examQuestions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${getNavStyle(idx)}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 문제 영역 */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {q.subjectName}
          </span>
        </div>
        <p className="text-slate-800 font-medium text-base leading-relaxed mb-6">
          {current + 1}. <QuestionText text={q.question} />
        </p>

        {/* 선택지 */}
        <div className="space-y-3">
          {q.choices.map((choice, idx) => {
            const choiceNum = idx + 1
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(choiceNum)}
                aria-pressed={answers[q.id] === choiceNum}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${getChoiceStyle(choiceNum)}`}
              >
                <span className={`font-semibold mr-2 ${getChoiceNumStyle(choiceNum)}`}>
                  {choiceNum}.
                </span>
                {choice}
              </button>
            )
          })}
        </div>

        {/* 연습모드: 답변 후 해설 버튼 */}
        {practiceMode && currentAnswered && (
          <div className="mt-4">
            <button
              onClick={() => toggleExplanation(q.id)}
              className="text-sm text-blue-600 font-medium"
            >
              {showExplanation[q.id] !== false ? '해설 닫기 ▲' : '해설 보기 ▼'}
            </button>
            {showExplanation[q.id] !== false && (
              <div className="mt-2 bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-800 leading-relaxed">
                {q.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 이전/다음 버튼 */}
      <div className="bg-white border-t border-slate-200 px-4 py-3 flex gap-3 sticky bottom-0">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium disabled:opacity-40 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          이전
        </button>
        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium active:bg-blue-700"
          >
            다음
          </button>
        ) : (
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium active:bg-green-700"
          >
            제출하기
          </button>
        )}
      </div>

      {/* 제출 확인 모달 */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">제출 확인</h3>
            <p className="text-slate-500 text-sm mb-6">
              {total - answered > 0
                ? `${total - answered}문항에 아직 답하지 않았어요.`
                : '제출하시겠어요?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
              >
                계속 풀기
              </button>
              <button
                onClick={submit}
                className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-medium"
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나가기 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">시험 중단</h3>
            <p className="text-slate-500 text-sm mb-6">
              지금 나가면 진행 상황이 저장되지 않아요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium"
              >
                계속 풀기
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
