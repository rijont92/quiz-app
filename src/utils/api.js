export const API_BASE = "https://69a6da012cd1d055268f1b99.mockapi.io";
export const QUESTIONS_ENDPOINT = `${API_BASE}/questions`;

export async function fetchQuestions() {
  const res = await fetch(QUESTIONS_ENDPOINT);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

export async function fetchQuestionById(id) {
  try {
    const res = await fetch(`${QUESTIONS_ENDPOINT}/${id}`);
    if (res.ok) return await res.json();
  } catch (err) {
  }
  const data = await fetchQuestions();
  return data.find(q => String(q.id) === String(id)) || null;
}
