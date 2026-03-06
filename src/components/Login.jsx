import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill all fields!");
      return;
    }

    if (email === "admin@gmail.com" && password === "1234") {
      onLogin(email);
      navigate("/create");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Login to LevelUp</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
);
}

export default Login;