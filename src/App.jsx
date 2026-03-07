import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import LevelSelector from './components/LevelSelector.jsx'
import QuizPanel from './components/QuizPanel.jsx'
import Login from './components/Login.jsx'
import AdminQuestions from './components/AdminQuestions.jsx'
import { fetchQuestions } from './utils/api'

function App() {
  const [user, setUser] = useState(null)
  const [levels, setLevels] = useState([])
  const [activeLevelId, setActiveLevelId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(stored)
  }, [])

  async function refreshQuestions() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchQuestions()
      if (!Array.isArray(data)) throw new Error('Unexpected response format')

      setQuestions(data)

      const map = {}
      data.forEach(q => {
        const slug = q.level || 'unknown'
        if (!map[slug]) map[slug] = { id: slug, slug, label: slug.charAt(0).toUpperCase() + slug.slice(1), description: '', color: '#999', questions: [] }
        map[slug].questions.push(q)
      })
      const mappedLevels = Object.values(map)

      const colorMap = { beginner: '#22c55e', intermediate: '#f97316', advanced: '#6366f1' }
      mappedLevels.forEach(l => { l.color = colorMap[l.slug] || l.color })

      setLevels(mappedLevels)

      if (!activeLevelId && mappedLevels.length > 0) setActiveLevelId(mappedLevels[0].id)
    } catch (err) {
      setError(err.message || 'Failed to load questions.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshQuestions()
  }, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const quizElement = (
    <Layout user={user} onLogout={handleLogout}>
      <LevelSelector
        levels={levels}
        currentLevelId={activeLevelId}
        onSelectLevel={setActiveLevelId}
        isLoading={isLoading}
        error={error}
      />
      <QuizPanel
        levels={levels}
        questions={questions}
        activeLevelId={activeLevelId}
        isLoading={isLoading}
        error={error}
        onResetLevel={() => {}}
      />
    </Layout>
  )

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(u) => { setUser(u); localStorage.setItem('user', u); }} />} />
      <Route path="/" element={quizElement} />
      <Route
        path="/admin/questions"
        element={user ? <AdminQuestions user={user} onLogout={handleLogout} onDataChange={refreshQuestions} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App