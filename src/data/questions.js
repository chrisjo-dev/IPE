import questions2026_1, { SUBJECTS as SUBJECTS_2026_1 } from './questions-2026-1'
import questions2026_1b, { SUBJECTS as SUBJECTS_2026_1b } from './questions-2026-1b'
import questions2024_3, { SUBJECTS as SUBJECTS_2024_3 } from './questions-2024-3'

// 정보처리기사 과목은 모든 회차 공통
export { SUBJECTS_2026_1 as SUBJECTS }

const EXAM_DATA = {
  '2026-1': {
    questions: questions2026_1,
    subjects: SUBJECTS_2026_1,
  },
  '2026-1b': {
    questions: questions2026_1b,
    subjects: SUBJECTS_2026_1b,
  },
  '2024-3': {
    questions: questions2024_3,
    subjects: SUBJECTS_2024_3,
  },
}

export function getExamData(examId) {
  return EXAM_DATA[examId] ?? { questions: [], subjects: [] }
}
