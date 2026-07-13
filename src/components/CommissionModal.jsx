import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/env';

/* ═══════════════════════════════════════════════════════════════════════════
   CommissionModal — Full commission request form in a slide-in modal
   Props:
     isOpen   {boolean}   — controls visibility
     onClose  {() => void} — called when modal should close
   ═══════════════════════════════════════════════════════════════════════════ */

const INITIAL_FORM = {
  name:        '',
  email:       '',
  paintingType:'',
  size:        '',
  budget:      '',
  deadline:    '',
  reference:   '',
  message:     '',
};

const PAINTING_TYPES = [
  'Anime Sketch',
  'Acrylic Painting',
  'Watercolor',
  'Oil Painting',
  'Digital Art',
  'Charcoal',
  'Shonen Style',
  'Seinen Style',
  'Shōjo Style',
  'Isekai Style',
  'Mecha Style',
  'Slice of Life',
  'Custom / Other',
];

const SIZES = [
  'A4  (21 × 30 cm)',
  'A3  (30 × 42 cm)',
  'A2  (42 × 60 cm)',
  '12 × 16 inch',
  '16 × 20 inch',
  '18 × 24 inch',
  'Custom Size',
];

export default function CommissionModal({ isOpen, onClose, prefillStyle = '' }) {
  const [form,      setForm]      = useState({ ...INITIAL_FORM, paintingType: prefillStyle });
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors,    setErrors]    = useState({});

  /* ── Lock body scroll when open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-fill logged-in user details if available
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('aa_user_auth') : null;
      if (userStr) {
        const user = JSON.parse(userStr);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(prev => ({
          ...prev,
          name: prev.name || user.name || '',
          email: prev.email || user.email || ''
        }));
      }
    } else {
      document.body.style.overflow = '';
      // reset on close
      setTimeout(() => { setForm({ ...INITIAL_FORM, paintingType: prefillStyle }); setStep(1); setSubmitted(false); setErrors({}); }, 350);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, prefillStyle]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  /* ── Step 1 validation ── */
  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = 'Name is required';
    if (!form.email.trim())    errs.email    = 'Email is required';
    if (!form.paintingType)    errs.paintingType = 'Select a painting type';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  };

  /* ── Final submit — POST to Backend API ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/commissions`, form);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: 'Commission request sent successfully!', type: 'success' } 
      }));
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit commission request:", error);
      window.dispatchEvent(new CustomEvent('showGlobalToast', { 
        detail: { message: 'Failed to send request. Please try again.', type: 'error' } 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          zIndex:     200,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation:  'fadeIn 0.25s ease',
        }}
      />

      {/* ── Modal panel ── */}
      <div
        style={{
          position:   'fixed',
          top:        '50%',
          left:       '50%',
          transform:  'translate(-50%, -50%)',
          zIndex:     201,
          width:      '92%',
          maxWidth:   560,
          maxHeight:  '90vh',
          overflowY:  'auto',
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow:  '0 32px 80px rgba(37,99,235,0.22), 0 8px 32px rgba(15,23,42,0.14)',
          animation:  'modalPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* ── Top accent bar ── */}
        <div style={{
          height:           4,
          background:       'var(--gradient-blue)',
          borderRadius:     '24px 24px 0 0',
          backgroundSize:   '200% 200%',
          animation:        'gradientFlow 4s ease infinite',
        }} />

        {/* ── Modal header ── */}
        <div style={{
          padding:        '28px 32px 0',
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            12,
        }}>
          <div>
            {/* Step indicator */}
            <div style={{
              display:    'inline-flex',
              gap:        6,
              marginBottom: 12,
              alignItems: 'center',
            }}>
              {[1, 2].map((s) => (
                <div key={s} style={{
                  height: 4,
                  width:  s === step ? 28 : 14,
                  borderRadius: 999,
                  background: s <= step ? 'var(--blue-600)' : 'var(--slate-200)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }} />
              ))}
              <span style={{
                fontSize: '0.65rem', color: 'var(--slate-400)',
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
                marginLeft: 4,
              }}>
                Step {step} of 2
              </span>
            </div>

            <h2 className="font-sora" style={{
              fontSize: '1.4rem', fontWeight: 800,
              color: 'var(--slate-900)', letterSpacing: '-0.02em',
              marginBottom: 6,
            }}>
              {step === 1 ? '✉️ Commission a Painting' : '🎨 Artwork Details'}
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--slate-500)', lineHeight: 1.55 }}>
              {step === 1
                ? "Tell Ankit who you are — he'll get back to you on Email!"
                : 'Describe the artwork you want painted on canvas.'}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              flexShrink:   0,
              width:        36, height: 36,
              borderRadius: '50%',
              border:       '1.5px solid var(--slate-200)',
              background:   'var(--white)',
              color:        'var(--slate-500)',
              fontSize:     18,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              transition:   'all 0.2s ease',
              lineHeight:   1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background    = 'rgba(244,63,94,0.06)';
              e.currentTarget.style.borderColor   = 'rgba(244,63,94,0.3)';
              e.currentTarget.style.color         = '#be123c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background    = 'var(--white)';
              e.currentTarget.style.borderColor   = 'var(--slate-200)';
              e.currentTarget.style.color         = 'var(--slate-500)';
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Form body ── */}
        {!submitted ? (
          <form onSubmit={handleSubmit} autoComplete="off" style={{ padding: '20px 32px 32px' }}>

            {/* ═══════ STEP 1 — Personal Info ═══════ */}
            {step === 1 && (
              <div style={{ animation: 'fadeSlideUp 0.3s ease both' }}>

                <label className="studio-label" htmlFor="cm-name">Your Full Name *</label>
                <input
                  id="cm-name" name="name" className="studio-input"
                  placeholder="e.g. Rahul Verma"
                  value={form.name} onChange={handleChange}
                />
                {errors.name && <span style={{ fontSize: '0.72rem', color: '#be123c' }}>{errors.name}</span>}

                <label className="studio-label" htmlFor="cm-email">Email Address *</label>
                <input
                  id="cm-email" name="email" type="email" className="studio-input"
                  placeholder="e.g. rahul@gmail.com"
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <span style={{ fontSize: '0.72rem', color: '#be123c' }}>{errors.email}</span>}

                <label className="studio-label" htmlFor="cm-paintingType">Painting Type *</label>
                <select
                  id="cm-paintingType" name="paintingType" className="studio-input"
                  value={form.paintingType} onChange={handleChange}
                >
                  <option value="">Select a style</option>
                  {PAINTING_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.paintingType && <span style={{ fontSize: '0.72rem', color: '#be123c' }}>{errors.paintingType}</span>}

                {/* Next button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="upload-btn"
                  style={{ marginTop: 24 }}
                >
                  Continue → Artwork Details
                </button>
              </div>
            )}

            {/* ═══════ STEP 2 — Artwork Details ═══════ */}
            {step === 2 && (
              <div style={{ animation: 'fadeSlideUp 0.3s ease both' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="studio-label" htmlFor="cm-size">Canvas Size</label>
                    <select
                      id="cm-size" name="size" className="studio-input"
                      value={form.size} onChange={handleChange}
                    >
                      <option value="">Select size</option>
                      {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="studio-label" htmlFor="cm-budget">Your Budget (₹)</label>
                    <input
                      id="cm-budget" name="budget" type="number" min="0"
                      className="studio-input" placeholder="e.g. 3000"
                      value={form.budget} onChange={handleChange}
                    />
                  </div>
                </div>

                <label className="studio-label" htmlFor="cm-deadline">Expected Deadline</label>
                <input
                  id="cm-deadline" name="deadline" type="date"
                  className="studio-input"
                  value={form.deadline} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />

                <label className="studio-label" htmlFor="cm-reference">Reference Image / Link (optional)</label>
                <input
                  id="cm-reference" name="reference" className="studio-input"
                  placeholder="e.g. https://drive.google.com/... or Naruto vs Sasuke scene"
                  value={form.reference} onChange={handleChange}
                />

                <label className="studio-label" htmlFor="cm-message">Extra Notes (optional)</label>
                <textarea
                  id="cm-message" name="message" className="studio-input"
                  placeholder="Any special instructions, colour preferences, style notes..."
                  rows={3} value={form.message} onChange={handleChange}
                  style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                />

                {/* Action buttons row */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex:         1,
                      padding:      '12px 0',
                      borderRadius: 'var(--radius-sm)',
                      border:       '1.5px solid var(--slate-200)',
                      background:   'var(--white)',
                      color:        'var(--slate-600)',
                      fontFamily:   'Sora, sans-serif',
                      fontSize:     '0.86rem',
                      fontWeight:   600,
                      cursor:       'pointer',
                      transition:   'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue-400)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    className="upload-btn"
                    disabled={isSubmitting}
                    style={{ flex: 2, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    <span style={{ fontSize: 16 }}>{isSubmitting ? '⏳' : '🚀'}</span>
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>

                {/* Email note */}
                <p style={{
                  marginTop:  14,
                  fontSize:   '0.73rem',
                  color:      'var(--slate-400)',
                  textAlign:  'center',
                  lineHeight: 1.5,
                }}>
                Clicking &quot;Send Request&quot; will securely send your details to Ankit&apos;s studio. 
                  He will review and reply within 24 hours. 🙏
                </p>
              </div>
            )}
          </form>
        ) : (
          /* ── Success screen ── */
          <div style={{
            padding:   '32px 32px 40px',
            textAlign: 'center',
            animation: 'fadeSlideUp 0.4s ease both',
          }}>
            <div style={{
              width:        72, height: 72,
              borderRadius: '50%',
              background:   'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(56,189,248,0.08))',
              border:       '2px solid rgba(37,99,235,0.2)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              fontSize:     32,
              margin:       '0 auto 20px',
              animation:    'floatY 3s ease-in-out infinite',
            }}>
              🎉
            </div>
            <h3 className="font-sora" style={{
              fontSize: '1.3rem', fontWeight: 800,
              color: 'var(--slate-900)', marginBottom: 10,
            }}>
              Order Received!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6, maxWidth: 340, margin: '0 auto 24px' }}>
              Your request has been saved to Ankit&apos;s <b>Secret Admin Dashboard</b>. 
              For a faster response, send Ankit a direct message on Instagram to let him know you submitted a request! 🙏
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <a
                href="https://ig.me/m/artisticankit0"
                target="_blank"
                rel="noreferrer"
                className="upload-btn"
                style={{ 
                  width: '100%', maxWidth: 220, 
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  boxShadow: '0 8px 20px rgba(220, 39, 67, 0.3)',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
                }}
              >
                <span>📸</span> DM on Instagram
              </a>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--slate-500)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
                }}
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Keyframe injection for modal-specific animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
