import { useNavigate } from 'react-router-dom'
import './layout.css'

function Layout({ children, user, onLogout, mainClassName }) {
  const navigate = useNavigate()
  const mainCls = mainClassName || 'app-main'

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-pill">Quiz</span>
          <span className="app-title">LevelUp</span>
        </div>
        <p className="app-subtitle">Practice, level up, and track your progress.</p>
        <div>
          {!user ? (
            <button className="admin-button" type="button" onClick={() => navigate('/login')}>
              Admin?
            </button>
          ) : (
            <>
              <button className="admin-button" type="button" onClick={() => navigate('/admin/questions')}>
                Admin Panel
              </button>
             
            </>
          )}
        </div>
      </header>
      <main className={mainCls}>{children}</main>
    </div>
  )
}

export default Layout

