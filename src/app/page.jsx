"use client";
import React, { useState, useEffect, useCallback } from 'react';

/* ── Components ── */
import Navbar          from '../components/Navbar';
import Hero            from '../components/Hero';
import AdminPanel      from '../components/AdminPanel';
import PaintingGrid    from '../components/PaintingGrid';
import Footer          from '../components/Footer';
import BehindTheBrush  from '../components/BehindTheBrush';
import FloatingSocials from '../components/FloatingSocials';

/* ── Toast utility (kept here as it's a root-level UI concern) ── */
function Toast({ message, type, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 3400);
    const t2 = setTimeout(() => onDone(),         3750);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`toast toast-${type} ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      {type === 'success' ? '⚡ ' : '✕ '}{message}
    </div>
  );
}

/* ── Subtle animated background orbs ── */
function BackgroundDecor() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Blue orb — top left */}
      <div style={{
        position: 'absolute', width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.055) 0%, transparent 65%)',
        top: '-20%', left: '-15%',
        animation: 'blueOrb 22s ease-in-out infinite',
      }} />
      {/* Cyan orb — bottom right */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 65%)',
        bottom: '-14%', right: '-10%',
        animation: 'blueOrb 28s ease-in-out infinite reverse',
      }} />
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(37,99,235,0.07) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 20%, transparent 80%)',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   App — Root orchestrator
   Owns the toast queue and the live painting count that Hero displays.
   All heavy logic lives inside individual components.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [toast,          setToast]         = useState(null);
  const [paintingCount,  setPaintingCount] = useState(0);
  /* key bumped on each successful upload to force PaintingGrid to refetch */
  const [gridRefreshKey, setGridRefreshKey] = useState(0);
  const [showAdmin,      setShowAdmin]     = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowAdmin(sessionStorage.getItem('aa_admin_auth') === 'true');
    }
  }, []);

  const handleUploadSuccess = useCallback((message) => {
    setToast({ message, type: 'success', id: Date.now() });
    setGridRefreshKey((k) => k + 1);          // triggers PaintingGrid re-mount → refetch
  }, []);

  // Global Event Listeners
  useEffect(() => {
    const handleGlobalToast = (e) => {
      setToast({ message: e.detail.message, type: e.detail.type || 'success', id: Date.now() });
    };

    const handleSecretUnlock = () => {
      setShowAdmin(true);
      // Removed sessionStorage set and authChange to ensure AdminLogin prompts for password
      setToast({ message: 'Creator Portal Revealed 🔓', type: 'success', id: Date.now() });
    };

    const handleAuthChange = () => {
      setShowAdmin(sessionStorage.getItem('aa_admin_auth') === 'true');
    };

    const handleCloseAdmin = () => {
      setShowAdmin(false);
    };

    window.addEventListener('showGlobalToast', handleGlobalToast);
    window.addEventListener('secretAdminUnlock', handleSecretUnlock);
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('closeAdminPanel', handleCloseAdmin);

    return () => {
      window.removeEventListener('showGlobalToast', handleGlobalToast);
      window.removeEventListener('secretAdminUnlock', handleSecretUnlock);
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('closeAdminPanel', handleCloseAdmin);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--snow)' }}>

      {/* ── Animated background layer ── */}
      <BackgroundDecor />

      {/* ── Toast notification ── */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      {/* ── Main content stack (above background) ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Frosted-glass sticky header */}
        <Navbar />

        {/* Welcome hero with live artwork count */}
        <Hero count={paintingCount} />

        {/* ── Dynamic Workspace ── */}
        <main style={{ maxWidth: 1380, margin: '0 auto', padding: '0 40px 80px' }}>
          <div
            className="workspace-grid"
            style={{
              display:             'grid',
              gridTemplateColumns: showAdmin ? '380px 1fr' : '1fr',
              gap:                 32,
              alignItems:          'start',
            }}
          >

            {/* Left — sticky Creator Portal (Admin Only) */}
            {showAdmin && (
              <div className="form-sticky" style={{ position: 'sticky', top: 96 }}>
                <AdminPanel onSuccess={handleUploadSuccess} />
              </div>
            )}

            {/* Right — Live gallery grid */}
            <PaintingGrid
              key={gridRefreshKey}
              onCountChange={setPaintingCount}
            />

          </div>
        </main>

        {/* ── YouTube Integration ── */}
        <BehindTheBrush />

        {/* Footer */}
        <Footer />
        <FloatingSocials />
      </div>
    </div>
  );
}

