import React, { useEffect, useState } from 'react';
import '../../components/layout/layout.css';
import './AdminQuestions.css';
import Layout from '../../components/layout/Layout.jsx';
import { fetchQuestions, QUESTIONS_ENDPOINT } from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';


async function localFetchQuestions() {
  try {
    return await fetchQuestions();
  } catch (err) {
    throw err;
  }
}

function AdminQuestions({ user, onLogout, onDataChange }) {
  const navigate = useNavigate();
  const getContrastColor = (hex) => {
    try {
      const h = hex.replace('#','');
      const r = parseInt(h.substring(0,2),16);
      const g = parseInt(h.substring(2,4),16);
      const b = parseInt(h.substring(4,6),16);
      const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
      return lum > 0.55 ? '#06202a' : '#ffffff';
    } catch (e) {
      return '#ffffff';
    }
  };
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editQuestion, setEditQuestion] = useState(null);
  const [addQuestion, setAddQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answerIndex: 0,
    difficulty: 'easy',
    levelSlug: '',
  });
  const api = QUESTIONS_ENDPOINT;

  const reloadLevels = async () => {
    setLoading(true);
    setError(null);
    try {
      const questions = await localFetchQuestions();
      const levelsMap = {};
      questions.forEach(q => {
        const slug = q.level || q.levelSlug || 'unknown';
        if (!levelsMap[slug]) {
          levelsMap[slug] = { slug, label: slug, description: '', color: '#999', questions: [] };
        }
        levelsMap[slug].questions.push(q);
      });
      const levelsArray = Object.values(levelsMap);
      const colorMap = { beginner: '#22c55e', intermediate: '#f97316', advanced: '#6366f1' };
      levelsArray.forEach(l => {
        const key = String(l.slug || '').toLowerCase();
        l.color = colorMap[key] || l.color || '#999';
      });
      setLevels(levelsArray);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadLevels();
  }, []);

  const handleEdit = (levelSlug, q) => {
    setEditQuestion({ ...q, levelSlug });
  };

  const handleSaveEdit = () => {
    const updatedLevels = levels.map(level => {
      if (level.slug === editQuestion.levelSlug) {
        return {
          ...level,
          questions: level.questions.map(q => String(q.id) === String(editQuestion.id) ? editQuestion : q)
        };
      }
      return level;
    });
    const updatedLevel = updatedLevels.find(l => l.slug === editQuestion.levelSlug);
    if (editQuestion && editQuestion.id) {
      fetch(`${api}/${editQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editQuestion),
      })
        .then(res => res.json())
        .then(() => {
          setEditQuestion(null);
          reloadLevels();
          if (onDataChange) onDataChange();
        })
        .catch(err => {
          console.error('Failed to persist edited question', err);
          setEditQuestion(null);
          reloadLevels();
          if (onDataChange) onDataChange();
        });
    } else {
      console.warn('Skipping network persist for edited question: question has no id');
      setEditQuestion(null);
      setLevels(updatedLevels);
    }
  };

  const handleDelete = (levelSlug, qid) => {
    if (!window.confirm('Delete this question?')) return;
    const updatedLevels = levels.map(level => {
      if (level.slug === levelSlug) {
        return {
          ...level,
          questions: level.questions.filter(q => String(q.id) !== String(qid))
        };
      }
      return level;
    });
    if (qid) {
      fetch(`${api}/${qid}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) return Promise.reject('Failed')
          reloadLevels();
          if (onDataChange) onDataChange();
        })
        .catch(err => {
          console.error('Failed to delete question', err);
          reloadLevels();
          if (onDataChange) onDataChange();
        });
    } else {
      setLevels(updatedLevels);
    }
  };

  const handleAddQuestion = e => {
    e.preventDefault();
    const tempId = `temp-${Date.now()}`;
    const newQuestion = { ...addQuestion, id: tempId };
    const updatedLevels = levels.map(level => {
      if (level.slug === addQuestion.levelSlug) {
        return {
          ...level,
          questions: [...level.questions, newQuestion]
        };
      }
      return level;
    });
    const payload = { ...newQuestion, level: addQuestion.levelSlug };
    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(created => {
        setAddQuestion({ question: '', options: ['', '', '', ''], answerIndex: 0, difficulty: 'easy', levelSlug: '' });
        reloadLevels();
        if (onDataChange) onDataChange();
      })
      .catch(err => {
        console.error('Failed to persist new question', err);
        setAddQuestion({ question: '', options: ['', '', '', ''], answerIndex: 0, difficulty: 'easy', levelSlug: '' });
        reloadLevels();
        if (onDataChange) onDataChange();
      });
  };
  
  if (loading) return <Layout user={user} onLogout={onLogout} mainClassName="app-main2"><div className="admin-loading">Loading...</div></Layout>;
  if (error) return <Layout user={user} onLogout={onLogout} mainClassName="app-main2"><div className="admin-error">{error}</div></Layout>;

  return (
    <Layout user={user} onLogout={onLogout} mainClassName="app-main2">
      <div className="admin-questions-page admin-questions-page-2">
        <div className="admin-top-actions">
          <button className="top-btn top-btn--primary" onClick={() => navigate('/')}>Go to Quiz</button>
          <button className="top-btn top-btn--danger" onClick={() => { onLogout && onLogout(); navigate('/login') }}>Logout</button>
        </div>
        <h2>Admin Questions Management</h2>
        {levels.map(level => (
          <section key={level.slug} className="admin-level-card" style={{ borderColor: level.color }}>
            <div className="admin-level-header">
              <span
                className="admin-level-pill"
                style={{
                  background: level.color,
                  color: getContrastColor(level.color),
                  border: 'none',
                  boxShadow: 'inset 0 -6px 12px rgba(0,0,0,0.12)'
                }}
              >
                {level.label}
              </span>
               <span className="admin-level-desc">{level.description}</span>
             </div>
            <div className="admin-questions-list">
              {level.questions.map(q => (
                <div key={q.id} className="admin-question-card">
                  {editQuestion && editQuestion.id === q.id ? (
                    <div className="admin-edit-modal">
                      <form className="admin-edit-form" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
                        <h4>Edit Question</h4>
                        <label>Question Text</label>
                        <input value={editQuestion.question} onChange={e => setEditQuestion({ ...editQuestion, question: e.target.value })} />
                        <div className="admin-edit-options">
                          <label>Options</label>
                          {editQuestion.options.map((opt, idx) => (
                            <div key={idx} className="admin-edit-option-row">
                              <span>{String.fromCharCode(65 + idx)}.</span>
                              <input value={opt} onChange={e => {
                                const opts = [...editQuestion.options];
                                opts[idx] = e.target.value;
                                setEditQuestion({ ...editQuestion, options: opts });
                              }} />
                            </div>
                          ))}
                        </div>
                        <label>Correct Answer</label>
                        <select value={editQuestion.answerIndex} onChange={e => setEditQuestion({ ...editQuestion, answerIndex: Number(e.target.value) })}>
                          {editQuestion.options.map((_, idx) => (
                            <option key={idx} value={idx}>Option {String.fromCharCode(65 + idx)}</option>
                          ))}
                        </select>
                        <label>Difficulty</label>
                        <select value={editQuestion.difficulty} onChange={e => setEditQuestion({ ...editQuestion, difficulty: e.target.value })}>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <div className="admin-edit-actions">
                          <button type="submit">Save</button>
                          <button type="button" onClick={() => setEditQuestion(null)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <div className="admin-question-text">{q.question}</div>
                      <ul className="admin-options-list">
                        {q.options.map((opt, idx) => (
                          <li key={idx} className={idx === q.answerIndex ? 'admin-option-correct' : ''}>{opt}</li>
                        ))}
                      </ul>
                      <div className="admin-question-meta">
                        <span className="admin-difficulty">{q.difficulty}</span>
                      </div>
                      <div className="admin-question-actions">
                        <button onClick={() => handleEdit(level.slug, q)}>Edit</button>
                        <button onClick={() => handleDelete(level.slug, q.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
        <form className="admin-add-question-form" onSubmit={handleAddQuestion}>
          <h3>Add New Question</h3>
          <input required placeholder="Question text" value={addQuestion.question} onChange={e => setAddQuestion({ ...addQuestion, question: e.target.value })} />
          {addQuestion.options.map((opt, idx) => (
            <input key={idx} required placeholder={`Option ${idx + 1}`} value={opt} onChange={e => {
              const opts = [...addQuestion.options];
              opts[idx] = e.target.value;
              setAddQuestion({ ...addQuestion, options: opts });
            }} />
          ))}
          <select value={addQuestion.answerIndex} onChange={e => setAddQuestion({ ...addQuestion, answerIndex: Number(e.target.value) })}>
            {addQuestion.options.map((_, idx) => (
              <option key={idx} value={idx}>Correct: Option {idx + 1}</option>
            ))}
          </select>
          <select value={addQuestion.difficulty} onChange={e => setAddQuestion({ ...addQuestion, difficulty: e.target.value })}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select required value={addQuestion.levelSlug} onChange={e => setAddQuestion({ ...addQuestion, levelSlug: e.target.value })}>
            <option value="">Select Level</option>
            {levels.map(l => <option key={l.slug} value={l.slug}>{l.label}</option>)}
          </select>
          <button type="submit">Add Question</button>
        </form>
      </div>
    </Layout>
  );
}

export default AdminQuestions;
