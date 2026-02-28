export default function QuestionText({ text }) {
  const parts = text.split(/```/)

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          // 일반 텍스트: \n을 줄바꿈으로
          return part.split('\n').map((line, j) => (
            <span key={`${i}-${j}`}>
              {j > 0 && <br />}
              {line}
            </span>
          ))
        } else {
          // 코드 블럭: 첫 줄 언어 태그 제거
          const lines = part.split('\n')
          const firstLine = lines[0].trim()
          const codeLines = /^[a-zA-Z]*$/.test(firstLine) ? lines.slice(1) : lines
          if (codeLines[codeLines.length - 1] === '') codeLines.pop()
          return (
            <pre key={i} className="bg-slate-800 text-slate-100 rounded-lg p-3 mt-2 mb-1 text-sm font-mono overflow-x-auto whitespace-pre">
              {codeLines.join('\n')}
            </pre>
          )
        }
      })}
    </>
  )
}
