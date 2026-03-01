import questions2026_1, { SUBJECTS as SUBJECTS_2026_1 } from './questions-2026-1'

// 정보처리기사 과목은 모든 회차 공통
export { SUBJECTS_2026_1 as SUBJECTS }

const EXAM_DATA = {
  '2026-1': {
    questions: questions2026_1,
    subjects: SUBJECTS_2026_1,
  },
}

export function getExamData(examId) {
  return EXAM_DATA[examId] ?? { questions: [], subjects: [] }
}
