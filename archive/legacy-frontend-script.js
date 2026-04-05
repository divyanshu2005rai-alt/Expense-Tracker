/* ═══════════════════════════════════════════

   FINTRACK PRO — SCRIPT

═══════════════════════════════════════════ */



// ── STATE ──────────────────────────────────

let state = JSON.parse(localStorage.getItem('fintrack_v3')) || {

  expenses: [],

  limit: 0,

  income: 0,

  theme: 'dark'

};



const CATEGORY_META = {

  Food:          { emoji: '🍔', color: '#f05a7c' },

  Transport:     { emoji: '🚌', color: '#5ab4f0' },

  Shopping:      { emoji: '🛍', color: '#f0a05a' },

  Utilities:     { emoji: '💡', color: '#7c6dfa' },

  Health:        { emoji: '💊', color: '#3fd68f' },

  Entertainment: { emoji: '🎬', color: '#fa6db5' },

  Other:         { emoji: '📦', color: '#a0a8c0' },

};



// ── PERSIST ────────────────────────────────

function save() {

  localStorage.setItem('fintrack_v3', JSON.stringify(state));

}



// archived legacy file
