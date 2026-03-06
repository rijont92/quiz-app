import { useNavigate } from 'react-router-dom'
import './layout.css'

function Layout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-pill">Quiz</span>
          <span className="app-title">LevelUp</span>
        </div>
        <p className="app-subtitle">Practice, level up, and track your progress.</p>
        <button className="admin-button" type="button" onClick={() => navigate('/login')}>
          Admin?
        </button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

export default Layout

