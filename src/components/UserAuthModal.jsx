import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/env';

/* ═══════════════════════════════════════════════════════════════════════════
   UserAuthModal
   Handles both Login and Registration for regular users (clients).
   Props:
     isOpen     {boolean}
     onClose    {() => void}
     onSuccess  {() => void}  — triggered on successful login/register
   ═══════════════════════════════════════════════════════════════════════════ */

export default function UserAuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  /* ── Lock body scroll when open ── */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Reset on open/close ── */
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({ name: '', email: '', password: '' });
      setError('');
      setIsLogin(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, form);
      
      // Save to local storage
      const userData = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email
      };
      
      localStorage.setItem('aa_user_auth', JSON.stringify(userData));
      // Dispatch custom event so Navbar updates instantly
      window.dispatchEvent(new Event('userAuthChange'));
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: isLogin ? 'Login successful! Welcome back.' : 'Account created successfully!', type: 'success' } 
      }));
      
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (err) {
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: err.response?.data?.message || (isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.'), type: 'error' } 
      }));
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.25s ease'
        }}
      />
      <div 
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 10000, width: '92%', maxWidth: 420,
          background: 'var(--white)', borderRadius: 'var(--radius-xl)',
          boxShadow: '0 32px 80px rgba(37,99,235,0.22)',
          animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden'
        }}
      >
        <div style={{ height: 4, background: 'var(--gradient-blue)', backgroundSize: '200% 200%', animation: 'gradientFlow 4s ease infinite' }} />
        
        <div style={{ padding: '32px 32px 0', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20, background: 'none', border: 'none',
              fontSize: 20, color: 'var(--slate-400)', cursor: 'pointer'
            }}
          >✕</button>
          
          <h2 className="font-sora" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: 6 }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            {isLogin 
              ? 'Login to request commissions and manage orders.' 
              : 'Join Artistic Ankit to request custom paintings.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isLogin && (
              <div>
                <label className="studio-label" style={{ marginTop: 0 }}>Full Name</label>
                <input 
                  name="name" type="text" className="studio-input" required 
                  placeholder="e.g. Rahul Verma" value={form.name} onChange={handleChange} 
                  disabled={loading}
                />
              </div>
            )}
            
            <div>
              <label className="studio-label" style={{ marginTop: 0 }}>Email Address</label>
              <input 
                name="email" type="email" className="studio-input" required 
                placeholder="name@example.com" value={form.email} onChange={handleChange} 
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="studio-label" style={{ marginTop: 0 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  name="password" type={showPass ? "text" : "password"} className="studio-input" required minLength="6"
                  placeholder="••••••••" value={form.password} onChange={handleChange} 
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--slate-400)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="studio-btn" 
              style={{ 
                marginTop: 8, 
                width: '100%', 
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinRing 0.8s linear infinite' }} />
                  Processing...
                </span>
              ) : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              disabled={loading}
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--blue-600)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
