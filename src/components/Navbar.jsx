import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommissionsGalleryModal from './CommissionsGalleryModal';
import AboutModal              from './AboutModal';
import PortfolioModal          from './PortfolioModal';
import UserAuthModal           from './UserAuthModal';
import ClientDashboardModal    from './ClientDashboardModal';
import { useAppData }          from '../hooks/useAppData';

/* ═══════════════════════════════════════════════════════════════════════════
   Navbar — Frosted-glass sticky header with blue pulse status indicator
   "Commissions" nav link opens the CommissionModal directly from header.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [scrolled,          setScrolled]          = useState(false);
  const [isCommissionOpen,  setIsCommissionOpen]  = useState(false);
  const [isAboutOpen,       setIsAboutOpen]       = useState(false);
  const [isPortfolioOpen,   setIsPortfolioOpen]   = useState(false);
  const [isUserAuthOpen,    setIsUserAuthOpen]    = useState(false);
  const [isDashboardOpen,   setIsDashboardOpen]   = useState(false);
  const [user,              setUser]              = useState(null);
  const [logoClicks,        setLogoClicks]        = useState(0);
  
  const { appData } = useAppData();
  const commissionsAvailable = appData?.commissionsOpen;
  
  const [isDarkMode,        setIsDarkMode]        = useState(false);
  const [mounted,           setMounted]           = useState(false);
  const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('aa_theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('aa_user_auth') : null;
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (_e) {
          console.error("Invalid user auth data");
          localStorage.removeItem('aa_user_auth');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    
    const openAuth = () => setIsUserAuthOpen(true);
    
    window.addEventListener('userAuthChange', checkUser);
    window.addEventListener('openUserAuth', openAuth);
    return () => {
      window.removeEventListener('userAuthChange', checkUser);
      window.removeEventListener('openUserAuth', openAuth);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('aa_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('aa_theme', 'light');
    }
  }, [isDarkMode, mounted]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Regular nav links — just anchors */
  const navLinks = ['Gallery'];

  const handleLogoClick = () => {
    if (logoClicks >= 4) {
      window.dispatchEvent(new Event('secretAdminUnlock'));
      setLogoClicks(0);
    } else {
      setLogoClicks(c => c + 1);
      setTimeout(() => setLogoClicks(0), 3000); // reset after 3 seconds
    }
  };

  return (
    <>
      <header
        className="nav-container"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 40px',
          background: isDarkMode 
            ? (scrolled ? 'rgba(15,23,42,0.94)' : 'rgba(15,23,42,0.85)') 
            : (scrolled ? 'rgba(248,250,252,0.94)' : 'rgba(248,250,252,0.85)'),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? (isDarkMode ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(37,99,235,0.15)')
            : (isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(37,99,235,0.07)'),
          boxShadow: scrolled ? (isDarkMode ? '0 4px 24px rgba(0,0,0,0.5)' : '0 4px 24px rgba(37,99,235,0.08)') : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: 1380,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
            gap: 20,
          }}
        >

          {/* ── Brand Logo ── */}
          <div 
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 10px rgba(139,92,246,0.3)', border: '1.5px solid rgba(139,92,246,0.4)' }}>
              <Image
                src="/logo.png"
                alt="Artistic Ankit Logo"
                width={42}
                height={42}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <div
                className="font-sora"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  lineHeight: 1.1,
                  color: 'var(--slate-900)',
                }}
              >
                ARTISTIC ANKIT
              </div>
              <div
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.34em',
                  color: 'var(--slate-400)',
                  textTransform: 'uppercase',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {`// STUDIO GALLERY`}
              </div>
            </div>
          </div>

          {/* ── Navigation Links ── */}
          <nav className="header-nav" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>

            {/* Regular links */}
            {navLinks.map((link) => (
              <a key={link} href="#" className="nav-link">
                {link}
              </a>
            ))}

            {/* ── Dark Mode Toggle ── */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                justifyContent:'center',
                width:         34,
                height:        34,
                marginLeft:    2,
                borderRadius:  '50%',
                border:        '1.5px solid rgba(37,99,235,0.3)',
                background:    'rgba(37,99,235,0.06)',
                color:         'var(--blue-600)',
                cursor:        'pointer',
                transition:    'all 0.22s ease',
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              onMouseEnter={(e) => {
                e.currentTarget.style.background  = 'var(--gradient-blue)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow   = 'var(--shadow-blue)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = 'rgba(37,99,235,0.06)';
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: 16 }}>{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            {/* ── Portfolio — opens modal ── */}
            <button
              onClick={() => setIsPortfolioOpen(true)}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           6,
                padding:       '7px 16px',
                marginLeft:    2,
                borderRadius:  'var(--radius-sm)',
                border:        '1px solid var(--slate-200)',
                background:    'var(--white)',
                color:         'var(--slate-600)',
                fontFamily:    'Inter, sans-serif',
                fontSize:      '0.82rem',
                fontWeight:    500,
                letterSpacing: '0.02em',
                cursor:        'pointer',
                transition:    'all 0.22s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background  = 'var(--gradient-blue)';
                e.currentTarget.style.color       = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow   = 'var(--shadow-blue)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = 'var(--white)';
                e.currentTarget.style.color       = 'var(--slate-600)';
                e.currentTarget.style.borderColor = 'var(--slate-200)';
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              Portfolio
            </button>

            {/* ── About — opens modal ── */}
            <button
              onClick={() => setIsAboutOpen(true)}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           6,
                padding:       '7px 16px',
                marginLeft:    2,
                borderRadius:  'var(--radius-sm)',
                border:        '1px solid var(--slate-200)',
                background:    'var(--white)',
                color:         'var(--slate-600)',
                fontFamily:    'Inter, sans-serif',
                fontSize:      '0.82rem',
                fontWeight:    500,
                letterSpacing: '0.02em',
                cursor:        'pointer',
                transition:    'all 0.22s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background  = 'var(--gradient-blue)';
                e.currentTarget.style.color       = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow   = 'var(--shadow-blue)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = 'var(--white)';
                e.currentTarget.style.color       = 'var(--slate-600)';
                e.currentTarget.style.borderColor = 'var(--slate-200)';
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              About
            </button>

            {/* ── Commissions — Special CTA button ── */}
            <button
              id="navbar-commission-btn"
              onClick={() => setIsCommissionOpen(true)}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          6,
                padding:      '7px 16px',
                marginLeft:   2,
                borderRadius: 'var(--radius-sm)',
                border:       '1px solid var(--slate-200)',
                background:   'var(--white)',
                color:        'var(--slate-600)',
                fontFamily:   'Inter, sans-serif',
                fontSize:     '0.82rem',
                fontWeight:   500,
                letterSpacing:'0.02em',
                cursor:       'pointer',
                transition:   'all 0.22s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background  = 'var(--gradient-blue)';
                e.currentTarget.style.color       = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow   = 'var(--shadow-blue)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = 'var(--white)';
                e.currentTarget.style.color       = 'var(--slate-600)';
                e.currentTarget.style.borderColor = 'var(--slate-200)';
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              {commissionsAvailable ? 'Customize Your Image' : 'Waitlist'}
            </button>

          </nav>

          {/* ── User Auth & Status ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {user ? (
              <button
                onClick={() => setIsDashboardOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 16px 6px 6px', borderRadius: 999,
                  background: 'var(--white)', border: '1px solid var(--slate-200)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-400)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.04)'; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-sora" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Profile
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsUserAuthOpen(true)}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-blue)', color: '#fff',
                  border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: 'var(--shadow-blue)'
                }}
              >
                Sign In
              </button>
            )}

            {/* ── Blue Pulse "Studio Live" Status ── */}
            <div className="gallery-live-badge" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        8,
                  padding:    '8px 16px',
                  borderRadius: 999,
                  border:     '1px solid var(--slate-200)',
                  background: 'var(--white)',
                }}
              >
                <span
                  style={{
                    width:       8,
                    height:      8,
                    borderRadius:'50%',
                    background:  'var(--emerald-500)',
                    animation:   'activeDot 2.5s ease-in-out infinite',
                    display:     'inline-block',
                    flexShrink:  0,
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize:      '0.65rem',
                    fontWeight:    500,
                    letterSpacing: '0.1em',
                    color:         'var(--slate-600)',
                  }}
                >
                  GALLERY LIVE
                </span>
              </div>
            </div>

            {/* ── Mobile Hamburger Toggle Button ── */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid var(--slate-200)',
                background: 'var(--white)',
                color: 'var(--slate-800)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label="Toggle Mobile Navigation Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer Dropdown ── */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72, left: 0, right: 0, bottom: 0,
            background: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--white)',
              borderBottom: '1px solid var(--slate-200)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              animation: 'fadeSlideUp 0.3s ease',
            }}
          >
            <button
              onClick={() => { setIsDarkMode(!isDarkMode); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                background: 'var(--slate-50)', border: '1px solid var(--slate-200)', color: 'var(--slate-800)',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', width: '100%'
              }}
            >
              <span style={{ fontSize: 18 }}>{isDarkMode ? '☀️' : '🌙'}</span> {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            <button
              onClick={() => { setIsPortfolioOpen(true); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                background: 'var(--slate-50)', border: '1px solid var(--slate-200)', color: 'var(--slate-800)',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', width: '100%'
              }}
            >
              <span>🖼️</span> Portfolio Exhibition
            </button>

            <button
              onClick={() => { setIsAboutOpen(true); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                background: 'var(--slate-50)', border: '1px solid var(--slate-200)', color: 'var(--slate-800)',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', width: '100%'
              }}
            >
              <span>📖</span> About Artist
            </button>

            <button
              onClick={() => { setIsCommissionOpen(true); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', borderRadius: 12,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', color: '#ffffff',
                fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.92rem', width: '100%',
                boxShadow: '0 4px 16px rgba(139,92,246,0.35)'
              }}
            >
              <span>🎨</span> {commissionsAvailable ? 'Customize Your Image' : 'Join Waitlist'}
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <ClientDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

      <CommissionsGalleryModal
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <PortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />

      <UserAuthModal
        isOpen={isUserAuthOpen}
        onClose={() => setIsUserAuthOpen(false)}
      />
    </>
  );
}


