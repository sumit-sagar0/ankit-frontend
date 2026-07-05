import React, { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   AdminLogin — Password gate before showing the Admin Panel
   Change ADMIN_PASSWORD below to update the secret password.
   ═══════════════════════════════════════════════════════════════════════════ */

const SESSION_KEY = 'aa_admin_auth';

export default function AdminLogin({ onAuthenticated }) {
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [shake,     setShake]     = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  /* ── Check session on mount ── */
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        window.dispatchEvent(new Event('authChange'));
        onAuthenticated();
      } else {
        setError(data.message || 'Galat password hai! Dobara try karo.');
        setShake(true);
        setPassword('');
        setTimeout(() => setShake(false), 600);
      }
    } catch (err) {
      setError('Server error occurred.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>

      <div
        style={{
          background:    'var(--white)',
          border:        '1px solid var(--slate-100)',
          borderRadius:  'var(--radius-xl)',
          boxShadow:     'var(--shadow-lg)',
          padding:       '36px 32px 40px',
          position:      'relative',
          overflow:      'hidden',
          animation:     'fadeSlideUp 0.7s ease 0.15s both',
        }}
      >
        {/* Top accent stripe */}
        <div style={{
          position:     'absolute',
          top: 0, left: 0, right: 0,
          height:       4,
          background:   'var(--gradient-blue)',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* Close button */}
        <button
          onClick={() => window.dispatchEvent(new Event('closeAdminPanel'))}
          style={{
            position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%',
            background: 'var(--slate-50)', color: 'var(--slate-400)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
            transition: 'background 0.2s, color 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#be123c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.color = 'var(--slate-400)'; }}
          title="Close"
        >
          ✕
        </button>

        {/* Lock icon */}
        <div style={{
          width:          56,
          height:         56,
          borderRadius:   14,
          background:     'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(56,189,248,0.07))',
          border:         '1.5px solid rgba(37,99,235,0.15)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       26,
          marginBottom:   20,
          animation:      'floatY 4s ease-in-out infinite',
        }}>
          🔐
        </div>

        {/* Heading */}
        <h2 className="font-sora" style={{
          fontSize:      '1.3rem',
          fontWeight:    800,
          color:         'var(--slate-900)',
          letterSpacing: '-0.02em',
          marginBottom:  6,
        }}>
          Admin Panel
        </h2>
        <p style={{
          fontSize:   '0.84rem',
          color:      'var(--slate-500)',
          lineHeight: 1.6,
          marginBottom: 28,
        }}>
          Sirf Ankit ke liye — password daalo aur paintings manage karo.
        </p>

        {/* Error message */}
        {error && (
          <div style={{
            padding:      '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            background:   'rgba(244,63,94,0.07)',
            border:       '1.5px solid rgba(244,63,94,0.3)',
            color:        '#be123c',
            fontSize:     '0.8rem',
            display:      'flex',
            alignItems:   'center',
            gap:          8,
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          style={{ animation: shake ? 'shakeX 0.55s ease' : 'none' }}
        >
          <label className="studio-label" htmlFor="admin-pass">
            Secret Password
          </label>

          {/* Password field with show/hide toggle */}
          <div style={{ position: 'relative' }}>
            <input
              id="admin-pass"
              type={showPass ? 'text' : 'password'}
              className="studio-input"
              placeholder="Password daalo..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
              style={{ paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              style={{
                position:       'absolute',
                right:          12,
                top:            '50%',
                transform:      'translateY(-50%)',
                background:     'none',
                border:         'none',
                cursor:         'pointer',
                fontSize:       16,
                color:          'var(--slate-400)',
                padding:        4,
                lineHeight:     1,
              }}
              title={showPass ? 'Hide' : 'Show'}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className="upload-btn"
            disabled={loading || !password}
            style={{ marginTop: 20 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{
                  width: 15, height: 15, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  animation: 'spinRing 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Verifying...
              </span>
            ) : '🔓 Login to Admin Panel'}
          </button>
        </form>

        {/* Hint */}
        <p style={{
          marginTop:  16,
          fontSize:   '0.7rem',
          color:      'var(--slate-300)',
          textAlign:  'center',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.04em',
        }}>
          Session tab band hone pe automatically logout ho jaata hai
        </p>
      </div>
    </>
  );
}
