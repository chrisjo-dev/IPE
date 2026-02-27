import { useState } from 'react'
import Home from './pages/Home'
import Exam from './pages/Exam'
import Result from './pages/Result'
import History from './pages/History'

// 페이지: 'home' | 'exam' | 'result' | 'history'

export default function App() {
  const [page, setPage] = useState('home')
  const [examConfig, setExamConfig] = useState(null) // { mode: 'full' | 'subject', subjectId: number|null, practiceMode: boolean }
  const [examResult, setExamResult] = useState(null)

  function startExam(config) {
    setExamConfig(config)
    setPage('exam')
  }

  function finishExam(result) {
    setExamResult(result)
    setPage('result')
  }

  function goHome() {
    setPage('home')
    setExamConfig(null)
    setExamResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {page === 'home' && (
        <Home onStartExam={startExam} onShowHistory={() => setPage('history')} />
      )}
      {page === 'exam' && (
        <Exam config={examConfig} onFinish={finishExam} onCancel={goHome} />
      )}
      {page === 'result' && (
        <Result result={examResult} onHome={goHome} onRetry={() => startExam(examConfig)} />
      )}
      {page === 'history' && (
        <History onBack={goHome} />
      )}
    </div>
  )
}
