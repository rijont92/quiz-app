import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      // already logged in -> go to admin
      navigate('/admin/questions');
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill all fields.");
      return;
    }

    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem('user', email)
      onLogin(email);
      setError(null);
      navigate("/admin/questions");
    } else {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>
        Login to{' '}
        <span
          className="login-brand"
          role="link"
          tabIndex={0}
          onClick={() => navigate('/')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
        >
          LevelUp
        </span>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }}/>
        </div>

        {error && <div className="login-error" role="alert">{error}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
);
}

export default Login;