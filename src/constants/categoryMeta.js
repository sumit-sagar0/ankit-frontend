/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY META  —  Centralised colour map for all painting categories
   Add / edit a category here and it updates everywhere automatically.
   ═══════════════════════════════════════════════════════════════════════════ */

export const CATEGORY_META = {
  'ANIME SKETCH': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', label: 'ANIME SKETCH'  },
  'ACRYLIC':      { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.4)',  label: 'ACRYLIC'       },
  'WATERCOLOR':   { color: '#ec4899', bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)', label: 'WATERCOLOR'    },
  'OIL':          { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', label: 'OIL PAINTING'  },
  'DIGITAL':      { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', label: 'DIGITAL ART'   },
  'CHARCOAL':     { color: '#64748b', bg: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.4)',label: 'CHARCOAL'      },
  'SHONEN':       { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  label: 'SHŌNEN'        },
  'SEINEN':       { color: '#a855f7', bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', label: 'SEINEN'        },
  'SHOJO':        { color: '#f472b6', bg: 'rgba(244,114,182,0.15)', border: 'rgba(244,114,182,0.4)', label: 'SHŌJO'         },
  'ISEKAI':       { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.4)',  label: 'ISEKAI'        },
  'MECHA':        { color: '#eab308', bg: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.4)',  label: 'MECHA'         },
  'SLICE':        { color: '#84cc16', bg: 'rgba(132,204,22,0.15)', border: 'rgba(132,204,22,0.4)', label: 'SLICE OF LIFE' },
  DEFAULT:        { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', label: 'ARTWORK'        },
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
