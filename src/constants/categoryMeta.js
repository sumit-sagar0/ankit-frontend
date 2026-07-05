/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY META  —  Centralised colour map for all painting categories
   Add / edit a category here and it updates everywhere automatically.
   ═══════════════════════════════════════════════════════════════════════════ */

export const CATEGORY_META = {
  'ANIME SKETCH': { color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.3)',  label: 'ANIME SKETCH'  },
  'ACRYLIC':      { color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.3)', label: 'ACRYLIC'       },
  'WATERCOLOR':   { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.3)', label: 'WATERCOLOR'    },
  'OIL':          { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', label: 'OIL PAINTING'  },
  'DIGITAL':      { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', label: 'DIGITAL ART'   },
  'CHARCOAL':     { color: '#64748b', bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.3)',label: 'CHARCOAL'      },
  'SHONEN':       { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)',  label: 'SHONEN'        },
  'SEINEN':       { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.3)', label: 'SEINEN'        },
  'SHOJO':        { color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.3)', label: 'SHŌJO'         },
  'ISEKAI':       { color: '#0891b2', bg: 'rgba(8,145,178,0.08)',  border: 'rgba(8,145,178,0.3)',  label: 'ISEKAI'        },
  'MECHA':        { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', label: 'MECHA'         },
  'SLICE':        { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', label: 'SLICE OF LIFE' },
  DEFAULT:        { color: '#2563eb', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.3)',  label: 'ART'           },
};

/**
 * Returns the colour/label metadata for a given category string.
 * Falls back to DEFAULT if the category is unknown.
 */
export const getCategoryMeta = (category) => {
  if (!category) return CATEGORY_META.DEFAULT;
  const key = category.toUpperCase().replace(/[\s-]/g, ' ').trim();
  return CATEGORY_META[key] || CATEGORY_META.DEFAULT;
};

/** Canonical API endpoint */
import { API_URL } from '../config/env';
export const API_BASE = `${API_URL}/api/paintings`;
