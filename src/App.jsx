import { useState } from 'react'
import './App.css'
import Layout from './components/Layout.jsx'
import LevelSelector from './components/LevelSelector.jsx'
import QuizPanel from './components/QuizPanel.jsx'

function App() {
  const [activeLevelId, setActiveLevelId] = useState('beginner')

  return (
    <Layout>
      <LevelSelector currentLevelId={activeLevelId} onSelectLevel={setActiveLevelId} />
      <QuizPanel activeLevelId={activeLevelId} onResetLevel={() => {}} />
    </Layout>
  )
}

export default App

