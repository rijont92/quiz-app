import './layout.css'

function Layout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-pill">Quiz</span>
          <span className="app-title">LevelUp</span>
        </div>
        <p className="app-subtitle">Practice, level up, and track your progress.</p>
      </header>
      <main className="app-main">{children}</main>
      
    </div>
    // 
  )
}

export default Layout

