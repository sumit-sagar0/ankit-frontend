import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../config/env';
const API_BASE = `${API_URL}/api/paintings`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, sold: 0, available: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(API_BASE);
      const total = data.length;
      let sold = 0;
      let available = 0;
      let likes = 0;

      data.forEach(p => {
        if (p.availabilityStatus === 'SOLD') sold++;
        else available++;
        likes += (p.likesCount || 0);
      });

      setStats({ total, sold, available, likes });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading Analytics...</div>;

  const statBoxStyle = {
    flex: 1,
    background: 'white',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
    border: '1px solid var(--slate-100)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const labelStyle = {
    fontSize: '0.85rem',
    color: 'var(--slate-500)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const valStyle = {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--slate-800)'
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--slate-800)' }}>Analytics Dashboard</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={statBoxStyle}>
          <div style={labelStyle}>Total Artworks</div>
          <div style={{ ...valStyle, color: 'var(--blue-600)' }}>{stats.total}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={labelStyle}>Available</div>
          <div style={{ ...valStyle, color: '#10b981' }}>{stats.available}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={labelStyle}>Sold</div>
          <div style={{ ...valStyle, color: '#f43f5e' }}>{stats.sold}</div>
        </div>
        <div style={statBoxStyle}>
          <div style={labelStyle}>Total Likes ❤️</div>
          <div style={valStyle}>{stats.likes}</div>
        </div>
      </div>
    </div>
  );
}
