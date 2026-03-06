import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import LevelSelector from './components/LevelSelector.jsx'
import QuizPanel from './components/QuizPanel.jsx'
import Login from './components/Login.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [levels, setLevels] = useState([])
  const [activeLevelId, setActiveLevelId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadLevels() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('https://69a6da012cd1d055268f1b99.mockapi.io/levels')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format')
        }

        const mappedLevels = data.map((item) => ({
          ...item,
          id: item.slug,
        }))

        if (!isMounted) return

        setLevels(mappedLevels)

        if (!activeLevelId && mappedLevels.length > 0) {
          setActiveLevelId(mappedLevels[0].id)
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load levels.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadLevels()

    return () => {
      isMounted = false
    }
  }, [])

  const quizElement = (
    <Layout>
      <LevelSelector
        levels={levels}
        currentLevelId={activeLevelId}
        onSelectLevel={setActiveLevelId}
        isLoading={isLoading}
        error={error}
      />
      <QuizPanel
        levels={levels}
        activeLevelId={activeLevelId}
        isLoading={isLoading}
        error={error}
        onResetLevel={() => {}}
      />
    </Layout>
  )

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={setUser} />} />
      <Route path="/create" element={quizElement} />
      <Route path="*" element={<Navigate to="/create" replace />} />
    </Routes>
  )
}

export default App