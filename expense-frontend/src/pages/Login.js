import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedOverlay from '../components/AnimatedOverlay';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    const bodyArgs = isLogin ? { email, password } : { name, email, password };
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyArgs)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <AnimatedOverlay />
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)', position: 'relative', zIndex: 10, borderRadius: '16px' }}>
        <h2 className="text-center mb-4 text-primary" style={{ fontSize: '2rem' }}>TravelSplit</h2>
        <h3 className="card-title text-center mb-4">{isLogin ? 'Welcome back' : 'Create an account'}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && <div className="form-group"><label>Full Name</label><input type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} /></div>}
          <div className="form-group"><label>Email Address</label><input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="form-group mb-4"><label>Password</label><input type="password" className="input-field" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button type="submit" className="btn btn-primary btn-block mb-3" disabled={loading}>{loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}</button>
        </form>
        <p className="text-center text-muted mt-3">{isLogin ? "Don't have an account? " : 'Already have an account? '}<button type="button" className="btn-secondary" style={{ padding: 0, border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Log in'}</button></p>
      </div>
    </div>
  );
}

export default Login;
