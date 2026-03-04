import { useState } from 'react'
import './App.css'
import Layout from './components/Layout.jsx'
import LevelSelector from './components/LevelSelector.jsx'
import QuizPanel from './components/QuizPanel.jsx'
import Login from './components/Login.jsx'

function App() {
  const [activeLevelId, setActiveLevelId] = useState('beginner')
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Layout>
      <LevelSelector
        currentLevelId={activeLevelId}
        onSelectLevel={setActiveLevelId}
      />
      <QuizPanel
        activeLevelId={activeLevelId}
        onResetLevel={() => {}}
      />
    </Layout>
  )
}

export default App