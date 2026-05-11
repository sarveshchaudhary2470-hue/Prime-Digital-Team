import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Backend server not running');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('Processing...');
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setError('Failed to send recovery request');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 2rem 2rem'
    }}>
      <div 
        className="glass"
        style={{
          padding: '3rem',
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {isForgotMode ? 'Recover Password' : 'Admin Access'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isForgotMode ? 'Enter email to receive reset link.' : 'Sign in to manage Prime Digital.'}
          </p>
        </div>

        {error && <div style={{ color: '#ff4d4f', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ color: 'var(--accent-blue)', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}

        {!isForgotMode ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Username</label>
              <input 
                type="text" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                <button 
                  type="button" 
                  onClick={() => { setIsForgotMode(true); setError(''); setMessage(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Login to Dashboard
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Recovery Email</label>
              <input 
                type="email" 
                placeholder="admin@primedigital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Send Recovery Link
            </button>
            <button 
              type="button" 
              onClick={() => { setIsForgotMode(false); setError(''); setMessage(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default AdminLogin;
