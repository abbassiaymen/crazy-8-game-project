import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      alert("Successful sign in!");
      localStorage.setItem("loggedInUser", email);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue your adventure.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
              <input
                  type="email"
                  className="input-field"
                  placeholder="player@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
              <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Don't have an account? <Link to="/register" style={{ fontWeight: 'bold' }}>Register</Link>
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Back to Home</Link>
            </div>
          </div>

        </div>
      </div>
  );
}

export default Login;
