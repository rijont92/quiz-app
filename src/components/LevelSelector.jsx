import { levels } from '../data/levels'

function LevelSelector({ currentLevelId, onSelectLevel }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Choose your level</h2>
        <p className="panel-subtitle">
          Start simple or jump straight into a challenge. You can always change levels later.
        </p>
      </div>

      <div className="level-grid">
        {levels.map((level) => {
          const isActive = level.id === currentLevelId

          return (
            <button
              key={level.id}
              type="button"
              className={`level-card ${isActive ? 'level-card--active' : ''}`}
              style={{ '--level-color': level.color }}
              onClick={() => onSelectLevel(level.id)}
            >
              <div className="level-pill" />
              <div className="level-main">
                <h3 className="level-title">{level.label}</h3>
                <p className="level-description">{level.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* TODO: add filters (topic, difficulty) and a way to preview question count per level. */}
    </section>
  )
}

export default LevelSelector

