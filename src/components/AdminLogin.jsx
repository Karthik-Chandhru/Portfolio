import React, { useState } from 'react';

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('portfolio_admin_token', data.token);
        onLoginSuccess(data.token);
        setEmail('');
        setPassword('');
        onClose();
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content admin-login-card">
        <div className="modal-header">
          <h3>Admin Control Center</h3>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="karthikchandhru370@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error-tag">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
