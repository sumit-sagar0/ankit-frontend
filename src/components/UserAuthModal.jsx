import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/env';

/* ═══════════════════════════════════════════════════════════════════════════
   UserAuthModal
   Handles Login, Registration (with Gmail OTP), and Forgot Password (with OTP).
   Props:
     isOpen     {boolean}
     onClose    {() => void}
     onSuccess  {() => void}
   ═══════════════════════════════════════════════════════════════════════════ */

export default function UserAuthModal({ isOpen, onClose, onSuccess }) {
  // mode: 'LOGIN' | 'REGISTER' | 'FORGOT'
  const [mode, setMode] = useState('LOGIN');
  const [otpStep, setOtpStep] = useState(1); // 1 = input email/details, 2 = input OTP
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otpSentMsg, setOtpSentMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
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
      setForm({ name: '', email: '', password: '', confirmPassword: '', otp: '', newPassword: '', confirmNewPassword: '' });
      setError('');
      setMode('LOGIN');
      setOtpStep(1);
      setOtpSentMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  /* ── Send OTP to Gmail ── */
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!form.email) {
      setError('Please enter your email address first.');
      return;
    }

    if (mode === 'REGISTER') {
      if (!form.password) {
        setError('Please enter a password.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match. Please enter matching passwords.');
        return;
      }
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/send-otp`, { email: form.email });
      const msg = res.data?.message || `6-digit verification code generated for ${form.email}!`;
      setOtpSentMsg(msg);
      
      // Auto extract 6 digit OTP if returned
      const match = msg.match(/\b\d{6}\b/);
      if (match) {
        setForm(prev => ({ ...prev, otp: match[0] }));
      }

      setOtpStep(2);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: msg, type: 'success' } 
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate OTP. Please try again.';
      setError(msg);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: msg, type: 'error' } }));
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit Forms (Login / Register / Reset) ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'REGISTER' && otpStep === 1) {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match. Please enter matching passwords.');
        return;
      }
    }

    if (mode === 'FORGOT' && otpStep === 2) {
      if (form.newPassword !== form.confirmNewPassword) {
        setError('New passwords do not match. Please enter matching passwords.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'LOGIN') {
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: form.email,
          password: form.password
        });
        
        const userData = { id: res.data.id, name: res.data.name, email: res.data.email };
        localStorage.setItem('aa_user_auth', JSON.stringify(userData));
        window.dispatchEvent(new Event('userAuthChange'));
        window.dispatchEvent(new CustomEvent('showGlobalToast', { 
          detail: { message: 'Login successful! Welcome back.', type: 'success' } 
        }));
        if (onSuccess) onSuccess();
        onClose();
      } 
      else if (mode === 'REGISTER') {
        if (otpStep === 1) {
          // Send OTP first
          await handleSendOtp();
          return;
        }
        
        // Step 2: Verify & Register
        const res = await axios.post(`${API_URL}/api/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password
        });
        
        const userData = { id: res.data.id, name: res.data.name, email: res.data.email };
        localStorage.setItem('aa_user_auth', JSON.stringify(userData));
        window.dispatchEvent(new Event('userAuthChange'));
        window.dispatchEvent(new CustomEvent('showGlobalToast', { 
          detail: { message: 'Account created & verified successfully!', type: 'success' } 
        }));
        if (onSuccess) onSuccess();
        onClose();
      }
      else if (mode === 'FORGOT') {
        if (otpStep === 1) {
          await handleSendOtp();
          return;
        }

        // Step 2: Reset Password
        const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword
        });

        window.dispatchEvent(new CustomEvent('showGlobalToast', { 
          detail: { message: res.data.message || 'Password reset successfully! Please log in.', type: 'success' } 
        }));
        
        // Switch back to Login mode with prefilled email
        setMode('LOGIN');
        setOtpStep(1);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message: msg, type: 'error' } }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.25s ease'
        }}
      />
      <div 
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 10000, width: '92%', maxWidth: 430,
          background: 'var(--white)', borderRadius: 'var(--radius-xl)',
          boxShadow: '0 32px 80px rgba(139,92,246,0.25)',
          animation: 'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          overflow: 'hidden'
        }}
      >
        {/* Top Gradient Bar */}
        <div style={{ height: 5, backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)' }} />
        
        <div style={{ padding: '28px 32px 0', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20, background: 'none', border: 'none',
              fontSize: 20, color: 'var(--slate-400)', cursor: 'pointer'
            }}
          >✕</button>
          
          <h2 className="font-sora" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: 6 }}>
            {mode === 'LOGIN' && 'Welcome Back'}
            {mode === 'REGISTER' && (otpStep === 1 ? 'Create Account' : 'Verify Email OTP')}
            {mode === 'FORGOT' && (otpStep === 1 ? 'Forgot Password' : 'Reset Password')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            {mode === 'LOGIN' && 'Sign in to request commissions and manage orders.'}
            {mode === 'REGISTER' && (otpStep === 1 ? 'Join Artistic Ankit to order custom anime paintings.' : 'Enter the 6-digit OTP sent to your Gmail.')}
            {mode === 'FORGOT' && (otpStep === 1 ? 'Enter your email to receive a password reset OTP.' : 'Enter the OTP and set your new password.')}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 32px 32px' }}>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {otpSentMsg && otpStep === 2 && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>
              📩 {otpSentMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* REGISTER STEP 1: Name */}
            {mode === 'REGISTER' && otpStep === 1 && (
              <div>
                <label className="studio-label" style={{ marginTop: 0 }}>Full Name</label>
                <input 
                  name="name" type="text" className="studio-input" required 
                  placeholder="e.g. Rahul Verma" value={form.name} onChange={handleChange} 
                  disabled={loading}
                />
              </div>
            )}

            {/* EMAIL (Shown in Step 1 of all modes) */}
            {otpStep === 1 && (
              <div>
                <label className="studio-label" style={{ marginTop: 0 }}>Email Address</label>
                <input 
                  name="email" type="email" className="studio-input" required 
                  placeholder="name@example.com" value={form.email} onChange={handleChange} 
                  disabled={loading}
                />
              </div>
            )}

            {/* LOGIN PASSWORD */}
            {mode === 'LOGIN' && (
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
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => { setMode('FORGOT'); setOtpStep(1); setError(''); }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--blue-600)',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ec4899'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--blue-600)'}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {/* REGISTER STEP 1 PASSWORDS */}
            {mode === 'REGISTER' && otpStep === 1 && (
              <>
                <div>
                  <label className="studio-label" style={{ marginTop: 0 }}>Create Password</label>
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

                <div>
                  <label className="studio-label" style={{ marginTop: 0 }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      name="confirmPassword" type={showPass ? "text" : "password"} className="studio-input" required minLength="6"
                      placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} 
                      disabled={loading}
                      style={{ paddingRight: 40 }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* OTP STEP 2 INPUT */}
            {otpStep === 2 && (
              <div>
                <label className="studio-label" style={{ marginTop: 0 }}>Enter 6-Digit OTP Code</label>
                <input 
                  name="otp" type="text" className="studio-input" required maxLength="6"
                  placeholder="e.g. 482910" value={form.otp} onChange={handleChange} 
                  disabled={loading}
                  style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800 }}
                />
              </div>
            )}

            {/* FORGOT STEP 2: NEW PASSWORD & CONFIRM */}
            {mode === 'FORGOT' && otpStep === 2 && (
              <>
                <div>
                  <label className="studio-label" style={{ marginTop: 0 }}>Set New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      name="newPassword" type={showPass ? "text" : "password"} className="studio-input" required minLength="6"
                      placeholder="••••••••" value={form.newPassword} onChange={handleChange} 
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

                <div>
                  <label className="studio-label" style={{ marginTop: 0 }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      name="confirmNewPassword" type={showPass ? "text" : "password"} className="studio-input" required minLength="6"
                      placeholder="••••••••" value={form.confirmNewPassword} onChange={handleChange} 
                      disabled={loading}
                      style={{ paddingRight: 40 }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* SUBMIT BUTTON WITH GRADIENT */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: 8, 
                width: '100%', 
                padding: '13px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
                opacity: loading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinRing 0.8s linear infinite' }} />
                  Processing...
                </span>
              ) : (
                mode === 'LOGIN' ? 'Sign In' :
                mode === 'REGISTER' ? (otpStep === 1 ? 'Send Verification OTP 📩' : 'Verify OTP & Create Account ✨') :
                (otpStep === 1 ? 'Send Password Reset OTP 📩' : 'Verify OTP & Reset Password 🔒')
              )}
            </button>

          </div>

          {/* Bottom Switch Links */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {mode === 'LOGIN' && (
              <>
                Don't have an account?{' '}
                <button 
                  type="button" disabled={loading}
                  onClick={() => { setMode('REGISTER'); setOtpStep(1); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign up
                </button>
              </>
            )}

            {mode === 'REGISTER' && (
              <>
                Already have an account?{' '}
                <button 
                  type="button" disabled={loading}
                  onClick={() => { setMode('LOGIN'); setOtpStep(1); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign in
                </button>
              </>
            )}

            {mode === 'FORGOT' && (
              <button 
                type="button" disabled={loading}
                onClick={() => { setMode('LOGIN'); setOtpStep(1); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer' }}
              >
                ← Back to Login
              </button>
            )}
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
