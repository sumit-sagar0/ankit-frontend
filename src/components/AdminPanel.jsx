import React, { useState, useCallback } from 'react';
import AdminLogin      from './AdminLogin';
import AddPaintingForm from './AddPaintingForm';
import AdminDashboard  from './AdminDashboard';
import AdminCommissions from './AdminCommissions';
import { useAppData }  from '../hooks/useAppData';

/* ═══════════════════════════════════════════════════════════════════════════
   AdminPanel — Wraps the login gate + the actual painting upload form.
   Shows AdminLogin first. Once authenticated → shows AddPaintingForm.
   Props:
     onSuccess  {(message: string) => void}  — passed up after a upload
   ═══════════════════════════════════════════════════════════════════════════ */
export default function AdminPanel({ onSuccess }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'commissions', or 'settings'
  const { appData, updateCommissionSettings } = useAppData();

  const handleAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('aa_admin_auth');
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('closeAdminPanel'));
    setIsAuthenticated(false);
  };

  /* ── Not logged in → show password gate ── */
  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  /* ── Logged in → show the upload form with a logout button ── */
  return (
    <div style={{ position: 'relative' }}>

      {/* Logout button — top right corner of the panel */}
      <div style={{
        position:       'absolute',
        top:            16,
        right:          16,
        zIndex:         10,
      }}>
        <button
          onClick={handleLogout}
          title="Logout from Admin"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            5,
            padding:        '5px 12px',
            borderRadius:   999,
            border:         '1.5px solid rgba(244,63,94,0.25)',
            background:     'rgba(244,63,94,0.05)',
            color:          '#be123c',
            fontFamily:     'Inter, sans-serif',
            fontSize:       '0.7rem',
            fontWeight:     600,
            letterSpacing:  '0.04em',
            cursor:         'pointer',
            transition:     'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background   = 'rgba(244,63,94,0.12)';
            e.currentTarget.style.borderColor  = 'rgba(244,63,94,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background   = 'rgba(244,63,94,0.05)';
            e.currentTarget.style.borderColor  = 'rgba(244,63,94,0.25)';
          }}
        >
          🔒 Logout
        </button>
      </div>

      {/* Dashboard Analytics */}
      <div style={{ marginTop: 40 }}>
        <AdminDashboard />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginTop: 32, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none',
            background: activeTab === 'upload' ? 'var(--gradient-blue)' : 'var(--white)',
            color: activeTab === 'upload' ? '#fff' : 'var(--slate-600)',
            fontWeight: 700, cursor: 'pointer', boxShadow: activeTab === 'upload' ? 'var(--shadow-blue)' : 'var(--shadow-sm)'
          }}
        >
          📤 Upload Artwork
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none',
            background: activeTab === 'commissions' ? 'var(--gradient-blue)' : 'var(--white)',
            color: activeTab === 'commissions' ? '#fff' : 'var(--slate-600)',
            fontWeight: 700, cursor: 'pointer', boxShadow: activeTab === 'commissions' ? 'var(--shadow-blue)' : 'var(--shadow-sm)'
          }}
        >
          ✉️ Commissions
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none',
            background: activeTab === 'settings' ? 'var(--gradient-blue)' : 'var(--white)',
            color: activeTab === 'settings' ? '#fff' : 'var(--slate-600)',
            fontWeight: 700, cursor: 'pointer', boxShadow: activeTab === 'settings' ? 'var(--shadow-blue)' : 'var(--shadow-sm)'
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Conditional Rendering based on Tab */}
      {activeTab === 'upload' && <AddPaintingForm onSuccess={onSuccess} />}
      {activeTab === 'commissions' && <AdminCommissions />}
      {activeTab === 'settings' && (
        <div style={{ background: 'var(--white)', padding: 32, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
          <h2 className="font-sora" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 24, color: 'var(--slate-900)' }}>
            Studio Settings
          </h2>
          
          <div style={{ marginBottom: 20 }}>
            <label className="studio-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
              <input 
                type="checkbox" 
                checked={appData.commissionsOpen}
                onChange={(e) => updateCommissionSettings(e.target.checked, appData.commissionSlots)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              Accepting New Commissions
            </label>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: -6, marginLeft: 28, lineHeight: 1.5 }}>
              If unchecked, the website will show a &quot;Waitlist&quot; button instead of the commission form.
            </p>
          </div>

          <div style={{ marginTop: 24 }}>
            <label className="studio-label">Available Slots</label>
            <input 
              type="number" 
              className="studio-input" 
              value={appData.commissionSlots}
              onChange={(e) => updateCommissionSettings(appData.commissionsOpen, e.target.value)}
              min="0"
              style={{ maxWidth: 150 }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: 6, lineHeight: 1.5 }}>
              Number of commissions you can currently handle. When it hits 0, you should close commissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
