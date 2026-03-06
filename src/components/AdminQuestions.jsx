import React, { useEffect, useState } from 'react';
import './layout.css';
import './AdminQuestions.css';
import Layout from './Layout';
import { fetchQuestions, QUESTIONS_ENDPOINT } from '../utils/api';


async function localFetchQuestions() {
  try {
    return await fetchQuestions();
  } catch (err) {
    throw err;
  }
}

function AdminQuestions() {
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
  const [addLevel, setAddLevel] = useState({
    slug: '',
    label: '',
    description: '',
    color: '#22c55e',
  });
  const [showAddLevel, setShowAddLevel] = useState(false);
  const api = QUESTIONS_ENDPOINT;

  useEffect(() => {
    localFetchQuestions()
      .then(questions => {
        const levelsMap = {};
        questions.forEach(q => {
          const slug = q.level || q.levelSlug || 'unknown';
          if (!levelsMap[slug]) {
            levelsMap[slug] = { slug, label: slug, description: '', color: '#999', questions: [] };
          }
          levelsMap[slug].questions.push(q);
        });
        const levelsArray = Object.values(levelsMap);
        setLevels(levelsArray);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load questions');
        setLoading(false);
      });
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
          setLevels(updatedLevels);
        })
        .catch(err => {
          console.error('Failed to persist edited question', err);
          setEditQuestion(null);
          setLevels(updatedLevels);
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
        .then(res => res.ok ? setLevels(updatedLevels) : Promise.reject('Failed'))
        .catch(err => {
          console.error('Failed to delete question', err);
          setLevels(updatedLevels);
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
        const levelsWithCreated = updatedLevels.map(l => ({
          ...l,
          questions: l.questions.map(q => (String(q.id) === String(tempId) ? ({ ...q, id: created.id }) : q)),
        }));
        setAddQuestion({ question: '', options: ['', '', '', ''], answerIndex: 0, difficulty: 'easy', levelSlug: '' });
        setLevels(levelsWithCreated);
      })
      .catch(err => {
        console.error('Failed to persist new question', err);
        setAddQuestion({ question: '', options: ['', '', '', ''], answerIndex: 0, difficulty: 'easy', levelSlug: '' });
        setLevels(updatedLevels);
      });
  };
  const handleAddLevel = e => {
    e.preventDefault();
    setLevels([...levels, { slug: addLevel.slug, label: addLevel.label, description: addLevel.description, color: addLevel.color, questions: [] }]);
    setAddLevel({ slug: '', label: '', description: '', color: '#22c55e' });
    setShowAddLevel(false);
  };
  
  if (loading) return <Layout><div className="admin-loading">Loading...</div></Layout>;
  if (error) return <Layout><div className="admin-error">{error}</div></Layout>;

  return (
    <Layout>
      <div className="admin-questions-page">
        <h2>Admin Questions Management</h2>
        {levels.map(level => (
          <section key={level.slug} className="admin-level-card" style={{ borderColor: level.color }}>
            <div className="admin-level-header">
              <span className="admin-level-pill" style={{ background: level.color }}>{level.label}</span>
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
        <button className="admin-add-level-toggle" onClick={() => setShowAddLevel(v => !v)}>{showAddLevel ? 'Cancel' : 'Add New Level'}</button>
        {showAddLevel && (
          <form className="admin-add-level-form" onSubmit={handleAddLevel}>
            <h3>Add New Level</h3>
            <input required placeholder="Slug" value={addLevel.slug} onChange={e => setAddLevel({ ...addLevel, slug: e.target.value })} />
            <input required placeholder="Label" value={addLevel.label} onChange={e => setAddLevel({ ...addLevel, label: e.target.value })} />
            <input required placeholder="Description" value={addLevel.description} onChange={e => setAddLevel({ ...addLevel, description: e.target.value })} />
            <input required type="color" value={addLevel.color} onChange={e => setAddLevel({ ...addLevel, color: e.target.value })} />
            <button type="submit">Add Level</button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default AdminQuestions;
