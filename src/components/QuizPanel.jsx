import { useEffect, useMemo, useRef, useState } from 'react'

function QuizPanel({ levels, activeLevelId, isLoading, error, onResetLevel }) {
  const level = useMemo(
    () => levels.find((item) => item.id === activeLevelId) ?? levels[0],
    [activeLevelId, levels],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!level) return
    setCurrentIndex(0)
    setSelectedIndex(null)
    setIsCorrect(null)
    setScore(0)
    setCompleted(false)
  }, [level?.id])

  const perLevelStateRef = useRef({})

  useEffect(() => {
    const saved = perLevelStateRef.current[activeLevelId]

    if (saved) {
      setCurrentIndex(saved.currentIndex)
      setSelectedIndex(saved.selectedIndex)
      setIsCorrect(saved.isCorrect)
      setScore(saved.score)
      setCompleted(saved.completed)
    } else {
      setCurrentIndex(0)
      setSelectedIndex(null)
      setIsCorrect(null)
      setScore(0)
      setCompleted(false)
    }
  }, [activeLevelId])

  useEffect(() => {
    perLevelStateRef.current[activeLevelId] = {
      currentIndex,
      selectedIndex,
      isCorrect,
      score,
      completed,
    }
  }, [activeLevelId, currentIndex, selectedIndex, isCorrect, score, completed])

  if (isLoading) {
    return (
      <section className="panel panel--quiz">
        <div className="panel-header">
          <h2 className="panel-title">Loading questions...</h2>
          <p className="panel-subtitle">Fetching the latest questions for you.</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="panel panel--quiz">
        <div className="panel-header">
          <h2 className="panel-title">Something went wrong</h2>
          <p className="panel-subtitle" style={{ color: '#fca5a5' }}>
            {error}
          </p>
        </div>
      </section>
    )
  }

  if (!level || !level.questions || level.questions.length === 0) {
    return (
      <section className="panel panel--quiz">
        <div className="panel-header">
          <h2 className="panel-title">No questions yet</h2>
          <p className="panel-subtitle">
            This level does not have any questions configured.
            <br />
            {/* TODO: add UI to let admins or editors add questions directly from the app. */}
          </p>
        </div>
      </section>
    )
  }

  const totalQuestions = level.questions.length
  const currentQuestion = level.questions[currentIndex]
  const progressPercent = Math.round(((currentIndex + (completed ? 1 : 0)) / totalQuestions) * 100)

  function handleOptionClick(optionIndex) {
    if (selectedIndex !== null || completed) return

    const correct = optionIndex === currentQuestion.answerIndex
    setSelectedIndex(optionIndex)
    setIsCorrect(correct)
    if (correct) {
      setScore((prev) => prev + 1)
    }
  }

  function handleNext() {
    if (currentIndex === totalQuestions - 1) {
      setCompleted(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedIndex(null)
    setIsCorrect(null)
  }

  function handleRestartLevel() {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setIsCorrect(null)
    setScore(0)
    setCompleted(false)
    if (onResetLevel) onResetLevel()
  }

  return (
    <section className="panel panel--quiz" style={{ '--level-color': level.color }}>
      <div className="panel-header panel-header--row">
        <div>
          <h2 className="panel-title">Level: {level.label}</h2>
          <p className="panel-subtitle">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="pill-group">
          <span className="pill pill--ghost">
            Score: <strong>{score}</strong>
          </span>
          <span className="pill pill--ghost">
            Progress: <strong>{progressPercent}%</strong>
          </span>
        </div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%`, backgroundColor: level.color }}
        />
      </div>

      {!completed && (
        <>
          <div className="question-card">
            <p className="question-label">Question</p>
            <p className="question-text">{currentQuestion.question}</p>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((option, index) => {
              const isSelected = index === selectedIndex
              const isRight = index === currentQuestion.answerIndex

              let stateClass = ''
              if (selectedIndex !== null) {
                if (isRight) stateClass = 'option--correct'
                else if (isSelected && !isRight) stateClass = 'option--wrong'
              }

              return (
                <button
                  key={option}
                  type="button"
                  className={`option ${stateClass}`}
                  onClick={() => handleOptionClick(index)}
                  disabled={selectedIndex !== null}
                >
                  <span className="option-index">{index + 1}</span>
                  <span className="option-label">{option}</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {completed && (
        <div className="result-card">
          <h3 className="result-title">Level complete 🎉</h3>
          <p className="result-score">
            You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong>
          </p>
          <p className="result-helper">
            {/* TODO: show more detailed analytics here (accuracy %, time per question, streaks, etc.). */}
            This is a simple summary for now. Expand this area with charts, streaks, and insights.
          </p>
        </div>
      )}

      <div className="panel-actions">
        {!completed && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={selectedIndex === null}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish level' : 'Next question'}
          </button>
        )}

        {completed && (
          <button type="button" className="btn btn-primary" onClick={handleRestartLevel}>
            Restart level
          </button>
        )}

        <button type="button" className="btn btn-ghost" onClick={handleRestartLevel}>
          Change level
        </button>
      </div>
    </section>
  )
}

export default QuizPanel

