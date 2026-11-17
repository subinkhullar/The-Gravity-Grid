/**
 * ============================================================================
 * The Gravity Grid by Subin Khullar 😎
 * Core Application Architecture (Vanilla ES6+ JavaScript)
 *
 * Modules included:
 *  1. Constants, Themes, Insignias, Ranks & Achievement Catalog
 *  2. LocalStorage Persistence & Profile/Gamification Manager
 *  3. Gravity Grid Engine (10x10 - 25x25, 2-8 Players, Team & Game Modes)
 *  4. AI Engine (Levels 1-7: Random through Adaptive Session Memory)
 *  5. Timer System (Countdown, Count-Up, Disabled, Audio & Visual Warnings)
 *  6. Web Audio Synthesizer & Canvas Particle Effects
 *  7. Canvas Analytics Charts (Bar, Pie, Line, Grid Frequency)
 *  8. Tournament Tracker, Saved Games, Match History & Replay Theater
 *  9. Accessibility, Keyboard Navigation & PWA Service Worker Registration
 * ============================================================================
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. CONSTANTS & DEFINITIONS
   * ------------------------------------------------------------------------ */
  const STORAGE_KEY = 'gravity_grid_subin_v1';

  const THEMES = {
    'cosmic-nebula': 'Cosmic Nebula',
    'cyberpunk': 'Cyberpunk',
    'ocean-depths': 'Ocean Depths',
    'forest-kingdom': 'Forest Kingdom',
    'royal-gold': 'Royal Gold',
    'minimalist': 'Minimalist',
    'neon-matrix': 'Neon Matrix'
  };

  const INSIGNIA_TYPES = [
    { id: 'x', label: 'Classic X', symbol: '✕' },
    { id: 'o', label: 'Classic O', symbol: '◯' },
    { id: 'triangle', label: 'Triangle', symbol: '▲' },
    { id: 'square', label: 'Square', symbol: '■' },
    { id: 'diamond', label: 'Diamond', symbol: '◆' },
    { id: 'star', label: 'Star', symbol: '★' },
    { id: 'hexagon', label: 'Hexagon', symbol: '⬡' },
    { id: 'crown', label: 'Crown', symbol: '♛' },
    { id: 'emoji', label: 'Custom Emoji', symbol: '😎' },
    { id: 'text', label: 'Custom Text', symbol: 'G' }
  ];

  const PLAYER_COLORS = [
    '#06b6d4', '#f43f5e', '#fbbf24', '#10b981',
    '#a855f7', '#fb923c', '#3b82f6', '#ec4899'
  ];

  const AI_LEVELS = [
    { level: 1, name: 'Lv 1: Random' },
    { level: 2, name: 'Lv 2: Basic Strategy' },
    { level: 3, name: 'Lv 3: Offensive' },
    { level: 4, name: 'Lv 4: Defensive' },
    { level: 5, name: 'Lv 5: Minimax' },
    { level: 6, name: 'Lv 6: Advanced Heuristic' },
    { level: 7, name: 'Lv 7: Adaptive Learning' }
  ];

  const RANKS = [
    { minLv: 1, title: 'Gravity Initiate', icon: '🛸' },
    { minLv: 3, title: 'Orbit Tactician', icon: '🛰️' },
    { minLv: 5, title: 'Nebula Strategist', icon: '🌌' },
    { minLv: 8, title: 'Quantum Commander', icon: '⚛️' },
    { minLv: 12, title: 'Singularity Master', icon: '🕳️' },
    { minLv: 16, title: 'Cosmic Grandmaster', icon: '👑' }
  ];

  const ACHIEVEMENTS_CATALOG = [
    { id: 'first_victory', title: 'First Victory', desc: 'Win your very first Gravity Grid match.', icon: '🏆', xp: 100 },
    { id: 'ten_wins', title: '10 Wins', desc: 'Accumulate 10 total victories.', icon: '🔟', xp: 250 },
    { id: 'hundred_wins', title: '100 Wins', desc: 'Reach 100 total victories.', icon: '💯', xp: 1000 },
    { id: 'win_streak', title: 'Winning Streak', desc: 'Achieve a 3-game win streak.', icon: '🔥', xp: 200 },
    { id: 'fast_thinker', title: 'Fast Thinker', desc: 'Win a match with average move time under 4s.', icon: '⚡', xp: 180 },
    { id: 'marathon_player', title: 'Marathon Player', desc: 'Complete 20 total matches.', icon: '🏃', xp: 300 },
    { id: 'theme_explorer', title: 'Theme Explorer', desc: 'Try at least 4 different visual themes.', icon: '🎨', xp: 150 },
    { id: 'tournament_champ', title: 'Tournament Champion', desc: 'Win a multi-player Tournament.', icon: '🥇', xp: 400 },
    { id: 'grid_master', title: 'Grid Master', desc: 'Win on a 20×20 or larger grid.', icon: '📐', xp: 220 },
    { id: 'gravity_scholar', title: 'Gravity Scholar', desc: 'Win using Connect 5 or higher.', icon: '🎓', xp: 220 },
    { id: 'ai_slayer', title: 'AI Slayer', desc: 'Defeat Level 5+ AI in a match.', icon: '🤖', xp: 300 },
    { id: 'chaos_survivor', title: 'Chaos Survivor', desc: 'Win a match in Chaos Mode.', icon: '🌀', xp: 250 }
  ];

  const UNLOCKABLES = [
    { id: 'title_tactician', name: 'Title: Gravity Tactician', reqLv: 2, desc: 'Unlocks at Level 2' },
    { id: 'spark_burst', name: 'Enhanced Victory Particles', reqLv: 3, desc: 'Unlocks at Level 3' },
    { id: 'title_nebula', name: 'Title: Nebula Sovereign', reqLv: 5, desc: 'Unlocks at Level 5' },
    { id: 'ai_oracle', name: 'Adaptive AI Insights Badge', reqLv: 7, desc: 'Unlocks at Level 7' },
    { id: 'grandmaster_aura', name: 'Cosmic Grandmaster Aura', reqLv: 10, desc: 'Unlocks at Level 10' }
  ];

  /* ------------------------------------------------------------------------
   * 2. PERSISTENT DATA & DEFAULT FACTORIES
   * ------------------------------------------------------------------------ */
  function createDefaultPlayer(index) {
    const ins = INSIGNIA_TYPES[index % 8];
    return {
      id: `p${index + 1}`,
      name: index === 0 ? 'Player 1' : (index === 1 ? 'GravityBot' : `Player ${index + 1}`),
      type: index === 1 ? 'ai' : 'human',
      aiLevel: index === 1 ? 3 : 2,
      team: (index % 2) + 1,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      insigniaType: ins.id,
      customValue: ins.id === 'emoji' ? '😎' : 'G',
      score: 0,
      piecesDropped: 0,
      eliminated: false
    };
  }

  function createDefaultConfig() {
    return {
      rows: 15,
      cols: 15,
      connectN: 4,
      directions: { h: true, v: true, d: true, ad: true },
      mode: 'classic',
      teamMode: 'none',
      timerMode: 'countdown',
      turnSeconds: 30,
      matchMinutes: 10,
      aiDepth: 3,
      playerCount: 2,
      players: [createDefaultPlayer(0), createDefaultPlayer(1)]
    };
  }

  function generateDailyChallenges(dateStr) {
    return [
      { id: 'dc_play_2', title: 'Daily Warmup', desc: 'Play 2 matches today', target: 2, progress: 0, xp: 120, completed: false, date: dateStr },
      { id: 'dc_win_1', title: 'Daily Victor', desc: 'Win 1 match in any mode', target: 1, progress: 0, xp: 150, completed: false, date: dateStr },
      { id: 'dc_drop_25', title: 'Gravity Architect', desc: 'Drop 25 pieces across matches', target: 25, progress: 0, xp: 140, completed: false, date: dateStr }
    ];
  }

  function createDefaultState() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      settings: {
        theme: 'cosmic-nebula',
        colorMode: 'dark',
        soundEnabled: true,
        showCoords: true,
        showGhost: true
      },
      config: createDefaultConfig(),
      activeProfileId: 'prof_default',
      profiles: [
        {
          id: 'prof_default',
          name: 'Commander',
          avatar: '😎',
          xp: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          bestStreak: 0
        }
      ],
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        currentStreak: 0,
        longestStreak: 0,
        fastestWinSec: null,
        totalMoveTimeMs: 0,
        totalMovesTracked: 0,
        themeUsage: { 'cosmic-nebula': 1 },
        symbolUsage: {},
        aiUsage: {},
        gridFreq: {},
        historyTrend: []
      },
      achievements: [],
      daily: {
        date: today,
        challenges: generateDailyChallenges(today)
      },
      savedGames: [],
      matchHistory: [],
      tournament: null
    };
  }

  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      const base = createDefaultState();
      const merged = {
        ...base,
        ...parsed,
        settings: { ...base.settings, ...(parsed.settings || {}) },
        config: { ...base.config, ...(parsed.config || {}) },
        stats: { ...base.stats, ...(parsed.stats || {}) }
      };
      const today = new Date().toISOString().slice(0, 10);
      if (!merged.daily || merged.daily.date !== today) {
        merged.daily = { date: today, challenges: generateDailyChallenges(today) };
      }
      if (!Array.isArray(merged.profiles) || merged.profiles.length === 0) {
        merged.profiles = base.profiles;
        merged.activeProfileId = base.activeProfileId;
      }
      if (!Array.isArray(merged.config.players) || merged.config.players.length < 2) {
        merged.config.players = base.config.players;
      }
      return merged;
    } catch {
      return createDefaultState();
    }
  }

  let appData = loadPersistedState();

  function saveAppData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch {
      // Ignore storage quota exceptions gracefully
    }
  }

  /* ------------------------------------------------------------------------
   * 3. RUNTIME STATE & LEVEL-7 AI SESSION MEMORY
   * ------------------------------------------------------------------------ */
  const game = {
    board: [],
    rows: 15,
    cols: 15,
    connectN: 4,
    directions: { h: true, v: true, d: true, ad: true },
    mode: 'classic',
    teamMode: 'none',
    timerMode: 'countdown',
    turnSeconds: 30,
    matchMinutes: 10,
    aiDepth: 3,
    players: [],
    currentPlayerIdx: 0,
    moveCount: 0,
    moveLog: [],
    undoStack: [],
    redoStack: [],
    winningCells: [],
    paused: false,
    finished: false,
    isAiTurn: false,
    turnTimeLeft: 30,
    matchTimeSec: 0,
    lastTurnStartMs: Date.now(),
    matchStartMs: Date.now(),
    hintCol: null,
    lastDropped: null,
    selectedCol: 7
  };

  // Level 7 Adaptive Learning Session Memory
  const aiSessionMemory = {
    humanColCounts: {},
    recentHumanCols: [],
    openingMoves: {},
    gamesObserved: 0
  };

  let timerIntervalId = null;
  let aiTimeoutId = null;
  let deferredInstallPrompt = null;

  const replayState = {
    match: null,
    step: 0,
    playing: false,
    intervalId: null
  };

  /* ------------------------------------------------------------------------
   * 4. DOM UTILITIES & WEB AUDIO SYNTHESIZER
   * ------------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let audioCtx = null;
  function playSound(type) {
    if (!appData.settings.soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(145, now + 0.11);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'tick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(820, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'chaos') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.linearRampToValueAtTime(540, now + 0.18);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === 'win' || type === 'achievement') {
        osc.disconnect();
        const notes = type === 'win' ? [523.25, 659.25, 783.99, 1046.5] : [587.33, 880, 1174.66];
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'triangle';
          o.connect(g);
          g.connect(audioCtx.destination);
          o.frequency.setValueAtTime(freq, now + idx * 0.09);
          g.gain.setValueAtTime(0.12, now + idx * 0.09);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.24);
          o.start(now + idx * 0.09);
          o.stop(now + idx * 0.09 + 0.25);
        });
      }
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  }

  /* ------------------------------------------------------------------------
   * 5. PARTICLE ENGINE (CANVAS)
   * ------------------------------------------------------------------------ */
  const particleEngine = (() => {
    const canvas = $('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function spawnBurst(x, y, color, count = 20) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 4.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          r: 2 + Math.random() * 3.2,
          life: 1,
          decay: 0.018 + Math.random() * 0.02,
          color
        });
      }
    }

    function celebrate() {
      const colors = ['#8b5cf6', '#06b6d4', '#fbbf24', '#f43f5e', '#10b981'];
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnBurst(
            w * (0.18 + Math.random() * 0.64),
            h * (0.22 + Math.random() * 0.4),
            colors[i % colors.length],
            34
          );
        }, i * 130);
      }
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    if (canvas) {
      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(tick);
    }

    return { spawnBurst, celebrate };
  })();

  /* ------------------------------------------------------------------------
   * 6. TOAST NOTIFICATIONS & MODAL DIALOG
   * ------------------------------------------------------------------------ */
  function showToast(icon, title, message, duration = 3800) {
    const container = $('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <div class="toast-content">
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 220ms ease';
      setTimeout(() => toast.remove(), 240);
    }, duration);
  }

  function openModal(title, bodyHtml, buttons = []) {
    const modal = $('app-modal');
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHtml;
    const footer = $('modal-footer');
    footer.innerHTML = '';
    buttons.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn ${b.cls || 'btn-ghost'} btn-sm`;
      btn.textContent = b.label;
      btn.addEventListener('click', () => {
        if (b.onClick) b.onClick();
        if (b.close !== false) closeModal();
      });
      footer.appendChild(btn);
    });
    modal.classList.remove('hidden');
  }

  function closeModal() {
    $('app-modal').classList.add('hidden');
  }

  /* ------------------------------------------------------------------------
   * 7. THEME ENGINE & NAVIGATION
   * ------------------------------------------------------------------------ */
  function applySettings() {
    const html = document.documentElement;
    html.setAttribute('data-theme', appData.settings.theme);
    html.setAttribute('data-color-mode', appData.settings.colorMode);
    $('theme-select').value = appData.settings.theme;
    $('color-mode-icon').textContent = appData.settings.colorMode === 'dark' ? '🌙' : '☀️';
    $('sound-icon').textContent = appData.settings.soundEnabled ? '🔊' : '🔇';
    $('btn-sound-toggle').setAttribute('aria-pressed', String(appData.settings.soundEnabled));
  }

  function switchTheme(themeId) {
    if (!THEMES[themeId]) return;
    appData.settings.theme = themeId;
    appData.stats.themeUsage[themeId] = (appData.stats.themeUsage[themeId] || 0) + 1;
    applySettings();
    saveAppData();
    if (Object.keys(appData.stats.themeUsage || {}).length >= 4) {
      unlockAchievement('theme_explorer');
    }
    if (!$('view-analytics').hidden) renderAllCharts();
  }

  function switchView(viewName) {
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      const isTarget = tab.dataset.view === viewName;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', String(isTarget));
    });
    document.querySelectorAll('.view-section').forEach((sec) => {
      const isTarget = sec.id === `view-${viewName}`;
      sec.classList.toggle('active', isTarget);
      sec.hidden = !isTarget;
    });

    if (viewName === 'analytics') {
      renderStatsKPIs();
      renderAllCharts();
    } else if (viewName === 'leaderboard') {
      renderProfilesAndLeaderboard();
      renderTournamentPanel();
    } else if (viewName === 'achievements') {
      renderGamificationView();
    } else if (viewName === 'history') {
      renderSavedAndHistory();
    } else if (viewName === 'setup') {
      syncSetupFormFromConfig();
    }
  }

  /* ------------------------------------------------------------------------
   * 8. INSIGNIA, PROFILES & GAMIFICATION HELPERS
   * ------------------------------------------------------------------------ */
  function getPlayerSymbol(player) {
    if (player.insigniaType === 'emoji' || player.insigniaType === 'text') {
      return (player.customValue || '★').slice(0, 2);
    }
    const found = INSIGNIA_TYPES.find((i) => i.id === player.insigniaType);
    return found ? found.symbol : '✕';
  }

  function getActiveProfile() {
    return appData.profiles.find((p) => p.id === appData.activeProfileId) || appData.profiles[0];
  }

  function calcLevelInfo(xp) {
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const prevReq = Math.pow(level - 1, 2) * 100;
    const nextReq = Math.pow(level, 2) * 100;
    const span = Math.max(1, nextReq - prevReq);
    const pct = Math.min(100, Math.round(((xp - prevReq) / span) * 100));
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (level >= r.minLv) rank = r;
    }
    return { level, prevReq, nextReq, pct, rank };
  }

  function updateHeaderProfileUI() {
    const prof = getActiveProfile();
    if (!prof) return;
    const info = calcLevelInfo(prof.xp);
    $('header-profile-avatar').textContent = prof.avatar;
    $('header-profile-name').textContent = prof.name;
    $('header-profile-level').textContent = `Lv ${info.level}`;
    $('header-xp-fill').style.width = `${info.pct}%`;
  }

  function awardXP(amount, reason = '') {
    const prof = getActiveProfile();
    if (!prof || amount <= 0) return;
    const before = calcLevelInfo(prof.xp).level;
    prof.xp += amount;
    const afterInfo = calcLevelInfo(prof.xp);
    updateHeaderProfileUI();
    saveAppData();

    if (afterInfo.level > before) {
      playSound('achievement');
      particleEngine.celebrate();
      showToast(
        afterInfo.rank.icon,
        `Level Up! Lv ${afterInfo.level}`,
        `Promoted to ${afterInfo.rank.title}${reason ? ` (${reason})` : ''}`
      );
    }
  }

  function unlockAchievement(id) {
    if (appData.achievements.includes(id)) return;
    const item = ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
    if (!item) return;
    appData.achievements.push(id);
    playSound('achievement');
    showToast(item.icon, `Achievement Unlocked: ${item.title}`, `${item.desc} (+${item.xp} XP)`);
    awardXP(item.xp, item.title);
    saveAppData();
  }

  function updateDailyChallenge(id, increment = 1) {
    const c = appData.daily.challenges.find((ch) => ch.id === id);
    if (!c || c.completed) return;
    c.progress = Math.min(c.target, c.progress + increment);
    if (c.progress >= c.target) {
      c.completed = true;
      showToast('📅', `Daily Complete: ${c.title}`, `Earned +${c.xp} XP!`);
      awardXP(c.xp, 'Daily Challenge');
    }
    saveAppData();
  }

  /* ------------------------------------------------------------------------
   * 9. CORE GRAVITY GRID GAME ENGINE
   * ------------------------------------------------------------------------ */
  function startNewGame(customConfig = null) {
    clearTimers();
    const cfg = customConfig ? JSON.parse(JSON.stringify(customConfig)) : JSON.parse(JSON.stringify(appData.config));

    game.rows = Math.max(10, Math.min(25, Number(cfg.rows) || 15));
    game.cols = Math.max(10, Math.min(25, Number(cfg.cols) || 15));
    game.connectN = Math.max(3, Math.min(Math.max(game.rows, game.cols), Number(cfg.connectN) || 4));
    game.directions = { ...cfg.directions };
    if (!game.directions.h && !game.directions.v && !game.directions.d && !game.directions.ad) {
      game.directions.h = true;
    }
    game.mode = cfg.mode || 'classic';
    game.teamMode = cfg.teamMode || 'none';
    game.timerMode = cfg.timerMode || 'countdown';
    game.turnSeconds = Math.max(5, Number(cfg.turnSeconds) || 30);
    game.matchMinutes = Math.max(1, Number(cfg.matchMinutes) || 10);
    game.aiDepth = Math.max(1, Math.min(5, Number(cfg.aiDepth) || 3));

    const count = Math.max(2, Math.min(8, Number(cfg.playerCount) || 2));
    game.players = cfg.players.slice(0, count).map((p, idx) => ({
      ...p,
      index: idx,
      score: 0,
      piecesDropped: 0,
      eliminated: false
    }));

    game.board = Array.from({ length: game.rows }, () => Array(game.cols).fill(null));
    game.currentPlayerIdx = 0;
    game.moveCount = 0;
    game.moveLog = [];
    game.undoStack = [];
    game.redoStack = [];
    game.winningCells = [];
    game.paused = false;
    game.finished = false;
    game.isAiTurn = false;
    game.hintCol = null;
    game.lastDropped = null;
    game.selectedCol = Math.floor(game.cols / 2);
    game.turnTimeLeft = game.turnSeconds;
    game.matchTimeSec = game.timerMode === 'countdown' ? game.matchMinutes * 60 : 0;
    game.lastTurnStartMs = Date.now();
    game.matchStartMs = Date.now();

    const root = document.documentElement;
    root.style.setProperty('--grid-cols', String(game.cols));
    root.style.setProperty('--grid-rows', String(game.rows));
    const maxDim = Math.max(game.cols, game.rows);
    const cellPx = maxDim >= 22
      ? 'clamp(16px, 2vw, 28px)'
      : (maxDim >= 18 ? 'clamp(18px, 2.3vw, 33px)' : 'clamp(22px, 2.8vw, 42px)');
    root.style.setProperty('--cell-size', cellPx);

    $('board-pause-overlay').classList.add('hidden');
    $('game-result-overlay').classList.add('hidden');
    $('btn-pause-resume').textContent = '⏸️ Pause';

    const banner = $('mode-status-banner');
    if (game.mode === 'chaos') {
      banner.textContent = '🌀 Chaos Mode Active: Gravity anomaly triggers every 5 moves!';
      banner.classList.remove('hidden');
    } else if (game.mode === 'sudden-death') {
      banner.textContent = '💀 Sudden Death: Timeout causes instant elimination!';
      banner.classList.remove('hidden');
    } else if (game.mode === 'endless') {
      banner.textContent = '♾️ Endless Mode: Completed lines score points & cascade!';
      banner.classList.remove('hidden');
    } else if (game.mode === 'tournament' && appData.tournament) {
      banner.textContent = `🏆 Tournament Match #${appData.tournament.currentMatchIdx + 1} of ${appData.tournament.matches.length}`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }

    renderArenaAll();
    startTimers();
    scheduleAiIfNeeded();
  }

  function clearTimers() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
    if (aiTimeoutId) {
      clearTimeout(aiTimeoutId);
      aiTimeoutId = null;
    }
  }

  function findDropRow(board, col) {
    if (col < 0 || col >= game.cols) return -1;
    for (let r = game.rows - 1; r >= 0; r--) {
      if (board[r][col] === null) return r;
    }
    return -1;
  }

  function snapshotState() {
    return {
      board: game.board.map((row) => [...row]),
      currentPlayerIdx: game.currentPlayerIdx,
      moveCount: game.moveCount,
      moveLog: [...game.moveLog],
      players: game.players.map((p) => ({ ...p })),
      winningCells: [...game.winningCells],
      finished: game.finished
    };
  }

  function restoreSnapshot(snap) {
    game.board = snap.board.map((row) => [...row]);
    game.currentPlayerIdx = snap.currentPlayerIdx;
    game.moveCount = snap.moveCount;
    game.moveLog = [...snap.moveLog];
    game.players = snap.players.map((p) => ({ ...p }));
    game.winningCells = [...snap.winningCells];
    game.finished = snap.finished;
    game.hintCol = null;
    game.lastDropped = null;
    renderArenaAll();
  }

  function makeMove(col, isAi = false) {
    if (game.paused || game.finished) return false;
    const player = game.players[game.currentPlayerIdx];
    if (!player || player.eliminated) return false;
    if (player.type === 'ai' && !isAi) return false;

    const row = findDropRow(game.board, col);
    if (row === -1) return false;

    game.undoStack.push(snapshotState());
    if (game.undoStack.length > 100) game.undoStack.shift();
    game.redoStack = [];

    const now = Date.now();
    const elapsedMs = Math.max(150, now - game.lastTurnStartMs);
    if (player.type === 'human') {
      appData.stats.totalMoveTimeMs += elapsedMs;
      appData.stats.totalMovesTracked += 1;
      aiSessionMemory.humanColCounts[col] = (aiSessionMemory.humanColCounts[col] || 0) + 1;
      aiSessionMemory.recentHumanCols.push(col);
      if (aiSessionMemory.recentHumanCols.length > 24) aiSessionMemory.recentHumanCols.shift();
      if (game.moveCount < 2) {
        aiSessionMemory.openingMoves[col] = (aiSessionMemory.openingMoves[col] || 0) + 1;
      }
      updateDailyChallenge('dc_drop_25', 1);
    }

    game.board[row][col] = player.index;
    player.piecesDropped += 1;
    game.moveCount += 1;
    game.hintCol = null;
    game.lastDropped = { row, col, dropRows: row + 1 };

    const sym = getPlayerSymbol(player);
    appData.stats.symbolUsage[sym] = (appData.stats.symbolUsage[sym] || 0) + 1;

    game.moveLog.push({
      moveNum: game.moveCount,
      playerIdx: player.index,
      playerName: player.name,
      symbol: sym,
      row,
      col,
      ms: elapsedMs
    });

    playSound('drop');

    // Emit subtle impact particle burst at target cell position
    const targetCell = $('gravity-board')?.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (targetCell) {
      const rect = targetCell.getBoundingClientRect();
      particleEngine.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, player.color, 10);
    }

    const winCells = checkWinAt(game.board, row, col, player.index);
    if (winCells.length > 0) {
      if (game.mode === 'endless') {
        player.score += winCells.length * 100;
        clearCellsWithGravity(winCells);
        showToast('♾️', 'Endless Combo!', `${player.name} scored +${winCells.length * 100} pts!`);
        playSound('win');
        if (isBoardFull(game.board)) {
          finishEndlessMatch();
          return true;
        }
      } else {
        game.winningCells = winCells;
        finishMatch(player);
        return true;
      }
    } else if (isBoardFull(game.board)) {
      if (game.mode === 'endless') {
        finishEndlessMatch();
      } else {
        finishMatch(null);
      }
      return true;
    }

    if (game.mode === 'chaos' && game.moveCount % 5 === 0) {
      triggerChaosEvent();
    }

    advanceTurn();
    return true;
  }

  function advanceTurn() {
    const total = game.players.length;
    let next = (game.currentPlayerIdx + 1) % total;
    let guard = 0;
    while (game.players[next].eliminated && guard < total) {
      next = (next + 1) % total;
      guard++;
    }
    game.currentPlayerIdx = next;
    game.turnTimeLeft = game.turnSeconds;
    game.lastTurnStartMs = Date.now();
    renderArenaAll();
    scheduleAiIfNeeded();
  }

  function sameAllegiance(boardVal, playerIdx) {
    if (boardVal === null) return false;
    if (boardVal === playerIdx) return true;
    if (game.teamMode !== 'none') {
      const pA = game.players[boardVal];
      const pB = game.players[playerIdx];
      return Boolean(pA && pB && pA.team === pB.team);
    }
    return false;
  }

  function getEnabledDirectionVectors() {
    const dirs = [];
    if (game.directions.h) dirs.push([0, 1]);
    if (game.directions.v) dirs.push([1, 0]);
    if (game.directions.d) dirs.push([1, 1]);
    if (game.directions.ad) dirs.push([1, -1]);
    return dirs;
  }

  function checkWinAt(board, r, c, playerIdx) {
    const dirs = getEnabledDirectionVectors();
    for (const [dr, dc] of dirs) {
      const line = [[r, c]];
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols && sameAllegiance(board[nr][nc], playerIdx)) {
        line.push([nr, nc]);
        nr += dr;
        nc += dc;
      }
      nr = r - dr;
      nc = c - dc;
      while (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols && sameAllegiance(board[nr][nc], playerIdx)) {
        line.unshift([nr, nc]);
        nr -= dr;
        nc -= dc;
      }
      if (line.length >= game.connectN) {
        return line;
      }
    }
    return [];
  }

  function isBoardFull(board) {
    for (let c = 0; c < game.cols; c++) {
      if (board[0][c] === null) return false;
    }
    return true;
  }

  function clearCellsWithGravity(cells) {
    for (const [r, c] of cells) {
      game.board[r][c] = null;
    }
    compactBoardGravity();
  }

  function compactBoardGravity() {
    for (let c = 0; c < game.cols; c++) {
      const colItems = [];
      for (let r = game.rows - 1; r >= 0; r--) {
        if (game.board[r][c] !== null) colItems.push(game.board[r][c]);
      }
      for (let r = game.rows - 1, idx = 0; r >= 0; r--, idx++) {
        game.board[r][c] = idx < colItems.length ? colItems[idx] : null;
      }
    }
  }

  function triggerChaosEvent() {
    const events = ['bottom_purge', 'gravity_shift_left', 'gravity_shift_right', 'column_swap'];
    const choice = events[Math.floor(Math.random() * events.length)];
    const banner = $('mode-status-banner');
    playSound('chaos');

    if (choice === 'bottom_purge') {
      for (let c = 0; c < game.cols; c++) game.board[game.rows - 1][c] = null;
      compactBoardGravity();
      banner.textContent = '🌀 Chaos Anomaly: Bottom row imploded! Pieces dropped!';
    } else if (choice === 'gravity_shift_left') {
      for (let r = 0; r < game.rows; r++) {
        const first = game.board[r].shift();
        game.board[r].push(first);
      }
      compactBoardGravity();
      banner.textContent = '🌀 Chaos Anomaly: Lateral wind shifted columns LEFT!';
    } else if (choice === 'gravity_shift_right') {
      for (let r = 0; r < game.rows; r++) {
        const last = game.board[r].pop();
        game.board[r].unshift(last);
      }
      compactBoardGravity();
      banner.textContent = '🌀 Chaos Anomaly: Lateral wind shifted columns RIGHT!';
    } else {
      const c1 = Math.floor(Math.random() * game.cols);
      const c2 = (c1 + 1 + Math.floor(Math.random() * (game.cols - 1))) % game.cols;
      for (let r = 0; r < game.rows; r++) {
        const tmp = game.board[r][c1];
        game.board[r][c1] = game.board[r][c2];
        game.board[r][c2] = tmp;
      }
      banner.textContent = `🌀 Chaos Anomaly: Columns ${c1 + 1} & ${c2 + 1} swapped places!`;
    }
    showToast('🌀', 'Chaos Event!', banner.textContent.replace('🌀 Chaos Anomaly: ', ''));
  }

  function finishEndlessMatch() {
    const sorted = [...game.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0].score > 0 ? sorted[0] : null;
    finishMatch(winner, `${sorted[0].name} leads with ${sorted[0].score} pts!`);
  }

  function finishMatch(winner, customSubtitle = '') {
    clearTimers();
    game.finished = true;
    game.isAiTurn = false;
    aiSessionMemory.gamesObserved += 1;
    renderArenaAll();

    const durationSec = Math.max(1, Math.round((Date.now() - game.matchStartMs) / 1000));
    const humanPlayers = game.players.filter((p) => p.type === 'human');
    const primaryHuman = humanPlayers[0] || game.players[0];
    const humanWon = Boolean(
      winner && (winner.index === primaryHuman.index || (game.teamMode !== 'none' && winner.team === primaryHuman.team))
    );

    appData.stats.gamesPlayed += 1;
    const gridKey = `${game.rows}×${game.cols}`;
    appData.stats.gridFreq[gridKey] = (appData.stats.gridFreq[gridKey] || 0) + 1;
    game.players.filter((p) => p.type === 'ai').forEach((ai) => {
      const key = `Lv ${ai.aiLevel}`;
      appData.stats.aiUsage[key] = (appData.stats.aiUsage[key] || 0) + 1;
    });

    const prof = getActiveProfile();
    let outcome = 'draw';
    if (!winner) {
      appData.stats.draws += 1;
      appData.stats.currentStreak = 0;
      if (prof) prof.draws += 1;
      awardXP(45, 'Match Draw');
    } else if (humanWon || (humanPlayers.length > 1 && winner.type === 'human')) {
      outcome = 'win';
      appData.stats.wins += 1;
      appData.stats.currentStreak += 1;
      appData.stats.longestStreak = Math.max(appData.stats.longestStreak, appData.stats.currentStreak);
      if (appData.stats.fastestWinSec === null || durationSec < appData.stats.fastestWinSec) {
        appData.stats.fastestWinSec = durationSec;
      }
      if (prof) {
        prof.wins += 1;
        prof.bestStreak = Math.max(prof.bestStreak, appData.stats.currentStreak);
      }
      awardXP(120 + game.connectN * 15, 'Victory');
      updateDailyChallenge('dc_win_1', 1);
      playSound('win');
      particleEngine.celebrate();
    } else {
      outcome = 'loss';
      appData.stats.losses += 1;
      appData.stats.currentStreak = 0;
      if (prof) prof.losses += 1;
      awardXP(35, 'Match Completed');
    }

    updateDailyChallenge('dc_play_2', 1);
    const totalDecided = appData.stats.wins + appData.stats.losses + appData.stats.draws;
    const winPct = totalDecided > 0 ? Math.round((appData.stats.wins / totalDecided) * 100) : 0;
    appData.stats.historyTrend.push({
      gameNum: appData.stats.gamesPlayed,
      winRate: winPct,
      outcome
    });
    if (appData.stats.historyTrend.length > 40) appData.stats.historyTrend.shift();

    // Achievement Evaluations
    if (appData.stats.wins >= 1) unlockAchievement('first_victory');
    if (appData.stats.wins >= 10) unlockAchievement('ten_wins');
    if (appData.stats.wins >= 100) unlockAchievement('hundred_wins');
    if (appData.stats.longestStreak >= 3) unlockAchievement('win_streak');
    if (appData.stats.gamesPlayed >= 20) unlockAchievement('marathon_player');
    if (humanWon && game.rows >= 20 && game.cols >= 20) unlockAchievement('grid_master');
    if (humanWon && game.connectN >= 5) unlockAchievement('gravity_scholar');
    if (humanWon && game.mode === 'chaos') unlockAchievement('chaos_survivor');
    if (humanWon && game.players.some((p) => p.type === 'ai' && p.aiLevel >= 5)) unlockAchievement('ai_slayer');
    if (humanWon && appData.stats.totalMovesTracked > 0) {
      const avgSec = (appData.stats.totalMoveTimeMs / appData.stats.totalMovesTracked) / 1000;
      if (avgSec < 4) unlockAchievement('fast_thinker');
    }

    const matchRecord = {
      id: `match_${Date.now()}`,
      timestamp: new Date().toISOString(),
      rows: game.rows,
      cols: game.cols,
      connectN: game.connectN,
      mode: game.mode,
      winnerName: winner ? winner.name : 'Draw',
      durationSec,
      players: game.players.map((p) => ({
        name: p.name,
        color: p.color,
        symbol: getPlayerSymbol(p)
      })),
      moves: [...game.moveLog]
    };
    appData.matchHistory.unshift(matchRecord);
    if (appData.matchHistory.length > 30) appData.matchHistory.pop();

    const nextTourneyBtn = $('btn-result-next-tourney');
    if (game.mode === 'tournament' && appData.tournament && !appData.tournament.completed) {
      recordTournamentResult(winner);
      nextTourneyBtn.classList.toggle('hidden', appData.tournament.completed);
    } else {
      nextTourneyBtn.classList.add('hidden');
    }

    saveAppData();

    $('result-emoji').textContent = winner ? '🏆' : '🤝';
    $('result-title').textContent = winner
      ? (game.teamMode !== 'none' ? `Team ${winner.team} (${winner.name}) Wins!` : `${winner.name} Wins!`)
      : 'Match Draw!';
    $('result-subtitle').textContent = customSubtitle || (winner
      ? `Connected ${game.connectN} pieces in ${durationSec}s (${game.moveCount} total moves).`
      : `The ${game.rows}×${game.cols} grid is completely full!`);

    $('result-stats-summary').innerHTML = `
      <div class="result-stat-box"><span>Moves</span><strong>${game.moveCount}</strong></div>
      <div class="result-stat-box"><span>Duration</span><strong>${durationSec}s</strong></div>
      <div class="result-stat-box"><span>Grid</span><strong>${game.rows}×${game.cols}</strong></div>
    `;
    $('game-result-overlay').classList.remove('hidden');
  }

  /* ------------------------------------------------------------------------
   * 10. TIMERS SYSTEM
   * ------------------------------------------------------------------------ */
  function startTimers() {
    clearInterval(timerIntervalId);
    if (game.timerMode === 'disabled') {
      updateTimerDisplay();
      return;
    }
    timerIntervalId = setInterval(() => {
      if (game.paused || game.finished) return;

      if (game.timerMode === 'countdown') {
        game.turnTimeLeft = Math.max(0, game.turnTimeLeft - 1);
        game.matchTimeSec = Math.max(0, game.matchTimeSec - 1);

        if (game.turnTimeLeft <= 5 && game.turnTimeLeft > 0) {
          playSound('tick');
        }
        if (game.turnTimeLeft === 0) {
          handleTurnTimeout();
          return;
        }
        if (game.matchTimeSec === 0) {
          const sorted = [...game.players].sort((a, b) => b.piecesDropped - a.piecesDropped);
          finishMatch(sorted[0], 'Match time expired!');
          return;
        }
      } else {
        game.matchTimeSec += 1;
      }

      updateTimerDisplay();
    }, 1000);
    updateTimerDisplay();
  }

  function handleTurnTimeout() {
    const active = game.players[game.currentPlayerIdx];
    if (game.mode === 'sudden-death') {
      active.eliminated = true;
      showToast('💀', 'Sudden Death Elimination!', `${active.name} ran out of time!`);
      const alive = game.players.filter((p) => !p.eliminated);
      if (alive.length === 1) {
        finishMatch(alive[0], `${active.name} timed out in Sudden Death!`);
        return;
      }
      advanceTurn();
    } else {
      const validCols = getValidColumns(game.board);
      if (validCols.length > 0) {
        const col = validCols[Math.floor(Math.random() * validCols.length)];
        showToast('⏱️', 'Time Expired', `Auto-dropped for ${active.name} in Col ${col + 1}`);
        makeMove(col, true);
      }
    }
  }

  function formatMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    const turnBox = $('turn-timer-box');
    const turnBar = $('turn-timer-bar');
    if (game.timerMode === 'disabled') {
      $('turn-timer-display').textContent = 'OFF';
      $('match-timer-display').textContent = 'OFF';
      $('timer-mode-tag').textContent = 'Disabled';
      turnBar.style.width = '100%';
      turnBox.classList.remove('timer-warning');
      return;
    }
    if (game.timerMode === 'countup') {
      const elapsedTurn = Math.floor((Date.now() - game.lastTurnStartMs) / 1000);
      $('turn-timer-display').textContent = formatMMSS(elapsedTurn);
      $('match-timer-display').textContent = formatMMSS(game.matchTimeSec);
      $('timer-mode-tag').textContent = 'Count-Up';
      turnBar.style.width = '100%';
      turnBox.classList.remove('timer-warning');
      return;
    }

    $('turn-timer-display').textContent = formatMMSS(game.turnTimeLeft);
    $('match-timer-display').textContent = formatMMSS(game.matchTimeSec);
    $('timer-mode-tag').textContent = 'Countdown';
    const pct = Math.max(0, Math.min(100, (game.turnTimeLeft / game.turnSeconds) * 100));
    turnBar.style.width = `${pct}%`;
    turnBox.classList.toggle('timer-warning', game.turnTimeLeft <= 5);
  }

  /* ------------------------------------------------------------------------
   * 11. AI SYSTEM (LEVELS 1 TO 7)
   * ------------------------------------------------------------------------ */
  function getValidColumns(board) {
    const cols = [];
    for (let c = 0; c < game.cols; c++) {
      if (board[0][c] === null) cols.push(c);
    }
    return cols;
  }

  function getCandidateColumns(board) {
    const valid = getValidColumns(board);
    if (valid.length <= 9) return valid;

    const center = Math.floor(game.cols / 2);
    const activeSet = new Set([center]);
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        if (board[r][c] !== null) {
          for (let d = -2; d <= 2; d++) {
            const nc = c + d;
            if (nc >= 0 && nc < game.cols && board[0][nc] === null) activeSet.add(nc);
          }
        }
      }
    }
    const list = Array.from(activeSet).filter((c) => board[0][c] === null);
    list.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
    return list.slice(0, 11);
  }

  function findImmediateWinCol(board, playerIdx) {
    const valid = getValidColumns(board);
    for (const c of valid) {
      const r = findDropRow(board, c);
      if (r === -1) continue;
      board[r][c] = playerIdx;
      const win = checkWinAt(board, r, c, playerIdx).length > 0;
      board[r][c] = null;
      if (win) return c;
    }
    return -1;
  }

  function scoreWindow(counts, aiIdx, oppIndices) {
    const aiCount = counts[aiIdx] || 0;
    let oppCount = 0;
    for (const oi of oppIndices) oppCount += (counts[oi] || 0);
    const emptyCount = counts.empty || 0;

    if (aiCount > 0 && oppCount > 0) return 0;
    if (aiCount === game.connectN) return 100000;
    if (oppCount === game.connectN) return -100000;

    let score = 0;
    if (aiCount > 0 && emptyCount > 0) {
      if (aiCount === game.connectN - 1) score += 280;
      else if (aiCount === game.connectN - 2) score += 48;
      else score += aiCount * 6;
    }
    if (oppCount > 0 && emptyCount > 0) {
      if (oppCount === game.connectN - 1) score -= 340;
      else if (oppCount === game.connectN - 2) score -= 58;
      else score -= oppCount * 5;
    }
    return score;
  }

  function evaluateBoardHeuristic(board, aiIdx, level) {
    const oppIndices = game.players
      .filter((p) => p.index !== aiIdx && !sameAllegiance(p.index, aiIdx))
      .map((p) => p.index);
    const dirs = getEnabledDirectionVectors();
    const n = game.connectN;
    let total = 0;

    const center = Math.floor(game.cols / 2);
    for (let r = 0; r < game.rows; r++) {
      if (sameAllegiance(board[r][center], aiIdx)) total += 7;
    }

    for (const [dr, dc] of dirs) {
      for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.cols; c++) {
          const er = r + dr * (n - 1);
          const ec = c + dc * (n - 1);
          if (er < 0 || er >= game.rows || ec < 0 || ec >= game.cols) continue;

          const counts = { empty: 0 };
          for (let k = 0; k < n; k++) {
            const val = board[r + dr * k][c + dc * k];
            if (val === null) {
              counts.empty++;
            } else if (sameAllegiance(val, aiIdx)) {
              counts[aiIdx] = (counts[aiIdx] || 0) + 1;
            } else {
              counts[val] = (counts[val] || 0) + 1;
            }
          }
          total += scoreWindow(counts, aiIdx, oppIndices);
        }
      }
    }

    // Level 6+: Detect double-threat trap setups
    if (level >= 6) {
      let aiThreats = 0;
      for (let c = 0; c < game.cols; c++) {
        const r = findDropRow(board, c);
        if (r === -1) continue;
        board[r][c] = aiIdx;
        if (checkWinAt(board, r, c, aiIdx).length > 0) aiThreats++;
        board[r][c] = null;
      }
      if (aiThreats >= 2) total += 1800;
    }

    // Level 7: Adaptive Session Memory counters human preferred columns
    if (level >= 7) {
      for (const [colStr, freq] of Object.entries(aiSessionMemory.humanColCounts)) {
        const col = Number(colStr);
        if (col >= 0 && col < game.cols && board[0][col] === null) {
          total += Math.min(20, freq * 2);
        }
      }
    }
    return total;
  }

  function chooseAiColumn(player) {
    const valid = getValidColumns(game.board);
    if (valid.length === 0) return -1;

    const lv = Number(player.aiLevel) || 3;
    const center = Math.floor(game.cols / 2);

    // Level 1: Random
    if (lv === 1) {
      return valid[Math.floor(Math.random() * valid.length)];
    }

    // Level 2+: Immediate Win & Immediate Block
    const immediateWin = findImmediateWinCol(game.board, player.index);
    if (immediateWin !== -1) return immediateWin;

    const opponents = game.players.filter(
      (p) => p.index !== player.index && !p.eliminated && !sameAllegiance(p.index, player.index)
    );
    for (const opp of opponents) {
      const blockCol = findImmediateWinCol(game.board, opp.index);
      if (blockCol !== -1) return blockCol;
    }

    // Level 2: Basic Strategy
    if (lv === 2) {
      const sorted = [...valid].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
      return sorted[Math.floor(Math.random() * Math.min(3, sorted.length))];
    }

    const candidates = getCandidateColumns(game.board);

    // Level 3 (Offensive) & Level 4 (Defensive)
    if (lv === 3 || lv === 4) {
      let bestCol = candidates[0];
      let bestScore = -Infinity;

      for (const c of candidates) {
        const r = findDropRow(game.board, c);
        if (r === -1) continue;
        game.board[r][c] = player.index;
        let score = evaluateBoardHeuristic(game.board, player.index, lv);

        if (lv === 4 && r - 1 >= 0) {
          for (const opp of opponents) {
            game.board[r - 1][c] = opp.index;
            if (checkWinAt(game.board, r - 1, c, opp.index).length > 0) score -= 9500;
            game.board[r - 1][c] = null;
          }
        }
        if (lv === 3) {
          score -= Math.abs(c - center) * 3;
        }
        game.board[r][c] = null;
        if (score > bestScore) {
          bestScore = score;
          bestCol = c;
        }
      }
      return bestCol;
    }

    // Levels 5, 6, 7: Alpha-Beta Minimax with configurable depth
    const maxDepth = Math.min(game.aiDepth, lv === 5 ? 3 : 4);
    const primaryOpp = opponents[0] ? opponents[0].index : player.index;
    const startTime = Date.now();
    let nodesVisited = 0;

    function minimax(board, depth, alpha, beta, maximizing) {
      nodesVisited++;
      if (depth === 0 || nodesVisited > 2400 || (Date.now() - startTime) > 140) {
        return evaluateBoardHeuristic(board, player.index, lv);
      }
      const cols = getCandidateColumns(board);
      if (cols.length === 0) return 0;

      if (maximizing) {
        let maxEval = -Infinity;
        for (const c of cols) {
          const r = findDropRow(board, c);
          if (r === -1) continue;
          board[r][c] = player.index;
          if (checkWinAt(board, r, c, player.index).length > 0) {
            board[r][c] = null;
            return 100000 + depth * 120;
          }
          const ev = minimax(board, depth - 1, alpha, beta, false);
          board[r][c] = null;
          maxEval = Math.max(maxEval, ev);
          alpha = Math.max(alpha, ev);
          if (beta <= alpha) break;
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (const c of cols) {
          const r = findDropRow(board, c);
          if (r === -1) continue;
          board[r][c] = primaryOpp;
          if (checkWinAt(board, r, c, primaryOpp).length > 0) {
            board[r][c] = null;
            return -100000 - depth * 120;
          }
          const ev = minimax(board, depth - 1, alpha, beta, true);
          board[r][c] = null;
          minEval = Math.min(minEval, ev);
          beta = Math.min(beta, ev);
          if (beta <= alpha) break;
        }
        return minEval;
      }
    }

    let bestCol = candidates[0];
    let bestScore = -Infinity;
    for (const c of candidates) {
      const r = findDropRow(game.board, c);
      if (r === -1) continue;
      game.board[r][c] = player.index;
      let val = minimax(game.board, maxDepth - 1, -Infinity, Infinity, false);
      game.board[r][c] = null;

      if (lv === 7) {
        val += (aiSessionMemory.humanColCounts[c] || 0) * 5;
        const lastHumanCol = aiSessionMemory.recentHumanCols[aiSessionMemory.recentHumanCols.length - 1];
        if (lastHumanCol !== undefined && Math.abs(c - lastHumanCol) <= 1) {
          val += 12;
        }
      }
      val -= Math.abs(c - center) * 1.5;

      if (val > bestScore) {
        bestScore = val;
        bestCol = c;
      }
    }
    return bestCol;
  }

  function scheduleAiIfNeeded() {
    if (aiTimeoutId) clearTimeout(aiTimeoutId);
    if (game.paused || game.finished) return;
    const active = game.players[game.currentPlayerIdx];
    if (!active || active.type !== 'ai' || active.eliminated) {
      game.isAiTurn = false;
      $('ai-thinking-indicator').classList.add('hidden');
      return;
    }

    game.isAiTurn = true;
    $('ai-thinking-indicator').classList.remove('hidden');

    aiTimeoutId = setTimeout(() => {
      if (game.paused || game.finished) return;
      const col = chooseAiColumn(active);
      game.isAiTurn = false;
      $('ai-thinking-indicator').classList.add('hidden');
      if (col !== -1) makeMove(col, true);
    }, 320);
  }

  /* ------------------------------------------------------------------------
   * 12. ARENA RENDERING
   * ------------------------------------------------------------------------ */
  function renderArenaAll() {
    renderBoard();
    renderArenaHUD();
    renderRoster();
    renderMoveFeed();
    updateTimerDisplay();
  }

  function renderArenaHUD() {
    const active = game.players[game.currentPlayerIdx];
    const modeLabelMap = {
      classic: 'Classic Mode',
      'sudden-death': 'Sudden Death',
      timed: 'Timed Blitz',
      endless: 'Endless Mode',
      tournament: 'Tournament',
      chaos: 'Chaos Mode'
    };
    $('arena-mode-badge').textContent = modeLabelMap[game.mode] || 'Classic Mode';
    $('arena-rules-badge').textContent = `${game.rows}×${game.cols} • Connect ${game.connectN}`;
    $('header-status-line').textContent = `${game.rows}×${game.cols} Grid • Connect ${game.connectN} • ${modeLabelMap[game.mode] || 'Classic'}`;

    if (active) {
      const sym = getPlayerSymbol(active);
      const avatarEl = $('turn-player-insignia');
      avatarEl.textContent = sym;
      avatarEl.style.color = active.color;
      avatarEl.style.borderColor = active.color;
      $('turn-player-name').textContent = active.name;
      $('turn-player-sub').textContent = `${active.type === 'ai' ? `AI Lv ${active.aiLevel}` : 'Human'}${game.teamMode !== 'none' ? ` • Team ${active.team}` : ''} • Move #${game.moveCount + 1}`;
      $('turn-status-label').textContent = game.finished ? 'MATCH COMPLETE' : 'CURRENT TURN';
    }

    const totalCells = game.rows * game.cols;
    let occupied = 0;
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        if (game.board[r][c] !== null) occupied++;
      }
    }
    $('telemetry-moves').textContent = String(game.moveCount);
    $('telemetry-empty').textContent = String(totalCells - occupied);
    $('telemetry-connect').textContent = String(game.connectN);

    $('btn-undo').disabled = game.undoStack.length === 0 || game.finished;
    $('btn-redo').disabled = game.redoStack.length === 0 || game.finished;
    $('roster-team-indicator').textContent = game.teamMode === 'none' ? 'Free-for-All' : `${game.teamMode} Teams`;
  }

  function renderRoster() {
    const ul = $('players-roster');
    ul.innerHTML = '';
    game.players.forEach((p) => {
      const isAct = p.index === game.currentPlayerIdx && !game.finished;
      const li = document.createElement('li');
      li.className = `roster-item${isAct ? ' roster-active' : ''}`;
      const sym = getPlayerSymbol(p);
      li.innerHTML = `
        <div class="roster-left">
          <span class="roster-symbol" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}">${escapeHtml(sym)}</span>
          <span class="roster-name">${escapeHtml(p.name)}</span>
        </div>
        <span class="roster-meta">
          ${p.eliminated ? 'OUT' : (game.mode === 'endless' ? `${p.score} pts` : `${p.piecesDropped} pcs`)}
          ${game.teamMode !== 'none' ? ` • T${p.team}` : ''}
        </span>
      `;
      ul.appendChild(li);
    });
  }

  function renderMoveFeed() {
    const ol = $('move-feed');
    $('move-feed-count').textContent = `${game.moveLog.length} moves`;
    ol.innerHTML = '';
    const recent = [...game.moveLog].reverse().slice(0, 40);
    recent.forEach((m) => {
      const li = document.createElement('li');
      li.className = 'move-feed-item';
      li.innerHTML = `
        <span><strong>#${m.moveNum}</strong> ${escapeHtml(m.playerName)} (${escapeHtml(m.symbol)})</span>
        <span class="text-muted">C${m.col + 1} · R${m.row + 1}</span>
      `;
      ol.appendChild(li);
    });
  }

  function renderBoard() {
    const dropBar = $('column-drop-bar');
    const boardEl = $('gravity-board');
    dropBar.innerHTML = '';
    boardEl.innerHTML = '';

    const active = game.players[game.currentPlayerIdx];
    const activeSym = active ? getPlayerSymbol(active) : '✕';
    const activeColor = active ? active.color : '#06b6d4';
    const winSet = new Set(game.winningCells.map(([r, c]) => `${r},${c}`));

    dropBar.classList.toggle('hidden', !appData.settings.showCoords);
    for (let c = 0; c < game.cols; c++) {
      const colFull = game.board[0][c] !== null;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'col-drop-btn';
      btn.textContent = String(c + 1);
      btn.disabled = colFull || game.finished || game.paused || game.isAiTurn;
      btn.setAttribute('aria-label', `Drop piece in column ${c + 1}`);
      btn.addEventListener('mouseenter', () => highlightColumn(c, true));
      btn.addEventListener('mouseleave', () => highlightColumn(c, false));
      btn.addEventListener('click', () => handleHumanColumnClick(c));
      dropBar.appendChild(btn);
    }

    const ghostRowByCol = {};
    if (appData.settings.showGhost && !game.finished && !game.isAiTurn) {
      for (let c = 0; c < game.cols; c++) {
        ghostRowByCol[c] = findDropRow(game.board, c);
      }
    }

    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);

        if (winSet.has(`${r},${c}`)) {
          cell.classList.add('cell-winning');
        }
        if (game.hintCol === c && ghostRowByCol[c] === r) {
          cell.classList.add('cell-hint');
        }

        const val = game.board[r][c];
        if (val !== null) {
          const owner = game.players[val];
          const piece = document.createElement('div');
          piece.className = 'cell-piece';
          if (game.lastDropped && game.lastDropped.row === r && game.lastDropped.col === c) {
            piece.classList.add('piece-dropping');
            piece.style.setProperty('--drop-rows', String(game.lastDropped.dropRows));
            piece.style.setProperty('--drop-duration', `${Math.min(480, 140 + game.lastDropped.dropRows * 18)}ms`);
          }
          const color = owner ? owner.color : '#8b5cf6';
          piece.style.background = `radial-gradient(circle at 30% 30%, ${color}ee, ${color}88)`;
          piece.style.border = `2px solid ${color}`;
          piece.style.color = '#ffffff';
          piece.textContent = owner ? getPlayerSymbol(owner) : '?';
          cell.appendChild(piece);
        } else if (ghostRowByCol[c] === r) {
          cell.dataset.ghost = activeSym;
          cell.style.setProperty('--ghost-color', activeColor);
        }

        cell.addEventListener('mouseenter', () => highlightColumn(c, true));
        cell.addEventListener('mouseleave', () => highlightColumn(c, false));
        cell.addEventListener('click', () => handleHumanColumnClick(c));
        boardEl.appendChild(cell);
      }
    }
  }

  function highlightColumn(col, active) {
    const boardEl = $('gravity-board');
    if (!boardEl) return;
    const dropBtns = $('column-drop-bar').children;
    if (dropBtns[col]) dropBtns[col].classList.toggle('col-hover', active);

    const ghostRow = appData.settings.showGhost && !game.finished && !game.isAiTurn ? findDropRow(game.board, col) : -1;
    boardEl.querySelectorAll(`.grid-cell[data-col="${col}"]`).forEach((el) => {
      el.classList.toggle('col-highlighted', active);
      const r = Number(el.dataset.row);
      el.classList.toggle('cell-ghost', active && r === ghostRow && game.board[r][col] === null);
    });
  }

  function handleHumanColumnClick(col) {
    if (game.paused || game.finished || game.isAiTurn) return;
    game.selectedCol = col;
    makeMove(col, false);
  }

  /* ------------------------------------------------------------------------
   * 13. GAME SETUP STUDIO
   * ------------------------------------------------------------------------ */
  function syncSetupFormFromConfig() {
    const cfg = appData.config;
    $('cfg-rows').value = cfg.rows;
    $('cfg-rows-val').textContent = cfg.rows;
    $('cfg-cols').value = cfg.cols;
    $('cfg-cols-val').textContent = cfg.cols;
    $('cfg-connect-n').value = cfg.connectN;
    $('cfg-connect-preset').value = ['4', '5', '6'].includes(String(cfg.connectN)) ? String(cfg.connectN) : 'custom';
    $('cfg-dir-h').checked = cfg.directions.h;
    $('cfg-dir-v').checked = cfg.directions.v;
    $('cfg-dir-d').checked = cfg.directions.d;
    $('cfg-dir-ad').checked = cfg.directions.ad;
    $('cfg-mode').value = cfg.mode;
    $('cfg-team-mode').value = cfg.teamMode;
    $('cfg-timer-mode').value = cfg.timerMode;
    $('cfg-turn-seconds').value = cfg.turnSeconds;
    $('cfg-match-minutes').value = cfg.matchMinutes;
    $('cfg-ai-depth').value = cfg.aiDepth;
    $('cfg-ai-depth-val').textContent = cfg.aiDepth;
    $('cfg-player-count').value = String(cfg.playerCount);
    renderPlayerSetupCards();
  }

  function renderPlayerSetupCards() {
    const count = Number($('cfg-player-count').value) || 2;
    while (appData.config.players.length < count) {
      appData.config.players.push(createDefaultPlayer(appData.config.players.length));
    }
    appData.config.playerCount = count;

    const list = $('player-setup-list');
    list.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const p = appData.config.players[i];
      const sym = getPlayerSymbol(p);
      const card = document.createElement('div');
      card.className = 'player-setup-card';
      card.innerHTML = `
        <div class="player-setup-header">
          <div class="player-setup-badge">
            <span class="player-setup-preview" style="background:${p.color}22;color:${p.color};border:1px solid ${p.color}">${escapeHtml(sym)}</span>
            <span>Player ${i + 1}</span>
          </div>
          <input type="color" class="p-color" data-idx="${i}" value="${p.color}" title="Player Color" />
        </div>
        <div class="two-col">
          <input type="text" class="p-name" data-idx="${i}" value="${escapeHtml(p.name)}" maxlength="18" placeholder="Name" aria-label="Player ${i + 1} Name" />
          <select class="p-type" data-idx="${i}" aria-label="Player ${i + 1} Control Type">
            <option value="human" ${p.type === 'human' ? 'selected' : ''}>👤 Human</option>
            <option value="ai" ${p.type === 'ai' ? 'selected' : ''}>🤖 AI Bot</option>
          </select>
        </div>
        <div class="two-col">
          <select class="p-ai-level" data-idx="${i}" ${p.type === 'human' ? 'disabled' : ''} aria-label="Player ${i + 1} AI Level">
            ${AI_LEVELS.map((l) => `<option value="${l.level}" ${Number(p.aiLevel) === l.level ? 'selected' : ''}>${l.name}</option>`).join('')}
          </select>
          <select class="p-team" data-idx="${i}" aria-label="Player ${i + 1} Team">
            <option value="1" ${Number(p.team) === 1 ? 'selected' : ''}>Team 1</option>
            <option value="2" ${Number(p.team) === 2 ? 'selected' : ''}>Team 2</option>
            <option value="3" ${Number(p.team) === 3 ? 'selected' : ''}>Team 3</option>
            <option value="4" ${Number(p.team) === 4 ? 'selected' : ''}>Team 4</option>
          </select>
        </div>
        <div class="two-col">
          <select class="p-insignia" data-idx="${i}" aria-label="Player ${i + 1} Insignia">
            ${INSIGNIA_TYPES.map((ins) => `<option value="${ins.id}" ${p.insigniaType === ins.id ? 'selected' : ''}>${ins.symbol} ${ins.label}</option>`).join('')}
          </select>
          <input type="text" class="p-custom ${p.insigniaType === 'emoji' || p.insigniaType === 'text' ? '' : 'hidden'}" data-idx="${i}" value="${escapeHtml(p.customValue || '😎')}" maxlength="2" placeholder="Emoji/Txt" aria-label="Custom Symbol" />
        </div>
      `;
      list.appendChild(card);
    }

    list.querySelectorAll('.p-name').forEach((el) => el.addEventListener('input', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].name = e.target.value || `Player ${Number(e.target.dataset.idx) + 1}`;
    }));
    list.querySelectorAll('.p-color').forEach((el) => el.addEventListener('input', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].color = e.target.value;
      renderPlayerSetupCards();
    }));
    list.querySelectorAll('.p-type').forEach((el) => el.addEventListener('change', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].type = e.target.value;
      renderPlayerSetupCards();
    }));
    list.querySelectorAll('.p-ai-level').forEach((el) => el.addEventListener('change', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].aiLevel = Number(e.target.value);
    }));
    list.querySelectorAll('.p-team').forEach((el) => el.addEventListener('change', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].team = Number(e.target.value);
    }));
    list.querySelectorAll('.p-insignia').forEach((el) => el.addEventListener('change', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].insigniaType = e.target.value;
      renderPlayerSetupCards();
    }));
    list.querySelectorAll('.p-custom').forEach((el) => el.addEventListener('input', (e) => {
      appData.config.players[Number(e.target.dataset.idx)].customValue = e.target.value || '★';
      const badge = e.target.closest('.player-setup-card').querySelector('.player-setup-preview');
      if (badge) badge.textContent = e.target.value || '★';
    }));
  }

  function applyConfigFromForm() {
    appData.config.rows = Number($('cfg-rows').value);
    appData.config.cols = Number($('cfg-cols').value);
    appData.config.connectN = Number($('cfg-connect-n').value);
    appData.config.directions = {
      h: $('cfg-dir-h').checked,
      v: $('cfg-dir-v').checked,
      d: $('cfg-dir-d').checked,
      ad: $('cfg-dir-ad').checked
    };
    appData.config.mode = $('cfg-mode').value;
    appData.config.teamMode = $('cfg-team-mode').value;
    appData.config.timerMode = $('cfg-timer-mode').value;
    appData.config.turnSeconds = Number($('cfg-turn-seconds').value);
    appData.config.matchMinutes = Number($('cfg-match-minutes').value);
    appData.config.aiDepth = Number($('cfg-ai-depth').value);
    appData.config.playerCount = Number($('cfg-player-count').value);
    saveAppData();
  }

  function applyPreset(name) {
    const c = appData.config;
    if (name === 'classic') {
      c.rows = 15; c.cols = 15; c.connectN = 4; c.mode = 'classic'; c.playerCount = 2;
      c.timerMode = 'countdown'; c.turnSeconds = 30;
    } else if (name === 'blitz') {
      c.rows = 10; c.cols = 10; c.connectN = 4; c.mode = 'sudden-death'; c.playerCount = 2;
      c.timerMode = 'countdown'; c.turnSeconds = 10;
    } else if (name === 'mega') {
      c.rows = 25; c.cols = 25; c.connectN = 6; c.mode = 'classic'; c.playerCount = 3;
      c.timerMode = 'countup';
    } else if (name === 'ai-war') {
      c.rows = 16; c.cols = 16; c.connectN = 4; c.mode = 'classic'; c.playerCount = 4;
      for (let i = 0; i < 4; i++) {
        if (!c.players[i]) c.players[i] = createDefaultPlayer(i);
        c.players[i].type = 'ai';
        c.players[i].aiLevel = Math.min(7, i + 3);
        c.players[i].name = `Bot Lv${c.players[i].aiLevel}`;
      }
    } else if (name === 'chaos') {
      c.rows = 14; c.cols = 14; c.connectN = 4; c.mode = 'chaos'; c.playerCount = 2;
      c.timerMode = 'countdown'; c.turnSeconds = 25;
    }
    syncSetupFormFromConfig();
    showToast('⚙️', 'Preset Applied', `Loaded "${name.toUpperCase()}" configuration.`);
  }

  /* ------------------------------------------------------------------------
   * 14. ANALYTICS DASHBOARD & CANVAS CHARTS
   * ------------------------------------------------------------------------ */
  function topEntry(obj, fallback = '—') {
    const entries = Object.entries(obj || {});
    if (entries.length === 0) return fallback;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  function renderStatsKPIs() {
    const s = appData.stats;
    $('stat-games-played').textContent = String(s.gamesPlayed);
    $('stat-wld').textContent = `${s.wins} / ${s.losses} / ${s.draws}`;
    $('stat-win-streak').textContent = String(s.longestStreak);
    $('stat-fastest-win').textContent = s.fastestWinSec !== null ? `${s.fastestWinSec}s` : '—';
    const avgSec = s.totalMovesTracked > 0 ? `${((s.totalMoveTimeMs / s.totalMovesTracked) / 1000).toFixed(1)}s` : '—';
    $('stat-avg-move-time').textContent = avgSec;
    const topThemeId = topEntry(s.themeUsage, 'cosmic-nebula');
    $('stat-top-theme').textContent = THEMES[topThemeId] || topThemeId;
    $('stat-top-symbol').textContent = topEntry(s.symbolUsage, '✕');
    $('stat-top-grid').textContent = topEntry(s.gridFreq, '15×15');
  }

  function setupCanvasDPI(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || 520));
    const h = 260;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function getCssVar(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function renderAllCharts() {
    renderBarChart();
    renderPieChart();
    renderLineChart();
    renderGridFreqChart();
  }

  function renderBarChart() {
    const canvas = $('chart-bar');
    if (!canvas) return;
    const { ctx, w, h } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, w, h);

    const textCol = getCssVar('--text-secondary', '#cbd5e1');
    const items = [
      { label: 'Wins', val: appData.stats.wins, color: '#10b981' },
      { label: 'Losses', val: appData.stats.losses, color: '#f43f5e' },
      { label: 'Draws', val: appData.stats.draws, color: '#fbbf24' }
    ];
    Object.entries(appData.stats.aiUsage || {}).slice(0, 4).forEach(([k, v]) => {
      items.push({ label: k, val: v, color: '#8b5cf6' });
    });

    const maxVal = Math.max(1, ...items.map((i) => i.val));
    const pad = 34;
    const barW = Math.min(48, (w - pad * 2) / items.length - 14);
    const step = (w - pad * 2) / items.length;

    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    items.forEach((item, idx) => {
      const x = pad + idx * step + (step - barW) / 2;
      const barH = ((h - 70) * item.val) / maxVal;
      const y = h - 34 - barH;
      ctx.fillStyle = item.color;
      drawRoundedRect(ctx, x, y, barW, Math.max(4, barH), 6);
      ctx.fill();
      ctx.fillStyle = textCol;
      ctx.fillText(String(item.val), x + barW / 2, y - 6);
      ctx.fillText(item.label, x + barW / 2, h - 14);
    });
  }

  function renderPieChart() {
    const canvas = $('chart-pie');
    if (!canvas) return;
    const { ctx, w, h } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, w, h);

    const textCol = getCssVar('--text-secondary', '#cbd5e1');
    const entries = Object.entries(appData.stats.themeUsage || {});
    const total = entries.reduce((acc, [, v]) => acc + v, 0) || 1;
    const palette = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#22c55e'];

    const cx = w * 0.28;
    const cy = h * 0.5;
    const radius = Math.min(cx - 18, cy - 18);
    let start = -Math.PI / 2;

    entries.forEach(([key, val], idx) => {
      const slice = (val / total) * Math.PI * 2;
      const color = palette[idx % palette.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      start += slice;

      const ly = 34 + idx * 24;
      ctx.fillStyle = color;
      ctx.fillRect(w * 0.55, ly - 10, 12, 12);
      ctx.fillStyle = textCol;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      const pct = Math.round((val / total) * 100);
      ctx.fillText(`${THEMES[key] || key} (${pct}%)`, w * 0.55 + 18, ly);
    });
  }

  function renderLineChart() {
    const canvas = $('chart-line');
    if (!canvas) return;
    const { ctx, w, h } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, w, h);

    const textCol = getCssVar('--text-secondary', '#cbd5e1');
    const accent = getCssVar('--accent-secondary', '#06b6d4');
    const trend = appData.stats.historyTrend;

    if (!trend || trend.length === 0) {
      ctx.fillStyle = textCol;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Complete matches to view your win percentage trend.', w / 2, h / 2);
      return;
    }

    const padL = 42, padR = 20, padT = 24, padB = 34;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    ctx.strokeStyle = 'rgba(148,163,184,0.2)';
    ctx.lineWidth = 1;
    [0, 50, 100].forEach((pct) => {
      const y = padT + plotH - (pct / 100) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      ctx.fillStyle = textCol;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${pct}%`, padL - 6, y + 4);
    });

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    trend.forEach((pt, idx) => {
      const x = padL + (trend.length === 1 ? plotW / 2 : (idx / (trend.length - 1)) * plotW);
      const y = padT + plotH - (pt.winRate / 100) * plotH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    trend.forEach((pt, idx) => {
      const x = padL + (trend.length === 1 ? plotW / 2 : (idx / (trend.length - 1)) * plotW);
      const y = padT + plotH - (pt.winRate / 100) * plotH;
      ctx.fillStyle = pt.outcome === 'win' ? '#10b981' : (pt.outcome === 'loss' ? '#f43f5e' : '#fbbf24');
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderGridFreqChart() {
    const canvas = $('chart-grid-freq');
    if (!canvas) return;
    const { ctx, w, h } = setupCanvasDPI(canvas);
    ctx.clearRect(0, 0, w, h);

    const textCol = getCssVar('--text-secondary', '#cbd5e1');
    const accent = getCssVar('--accent-primary', '#8b5cf6');
    const entries = Object.entries(appData.stats.gridFreq || {});
    if (entries.length === 0) {
      ctx.fillStyle = textCol;
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Play on different grid sizes to populate frequency chart.', w / 2, h / 2);
      return;
    }

    const top = entries.sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxVal = Math.max(1, ...top.map((e) => e[1]));
    top.forEach(([label, val], idx) => {
      const y = 30 + idx * 36;
      const barMaxW = w - 150;
      const barW = (val / maxVal) * barMaxW;
      ctx.fillStyle = textCol;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 16, y + 14);
      ctx.fillStyle = accent;
      drawRoundedRect(ctx, 96, y, Math.max(10, barW), 18, 5);
      ctx.fill();
      ctx.fillStyle = textCol;
      ctx.fillText(String(val), 104 + Math.max(10, barW), y + 14);
    });
  }

  /* ------------------------------------------------------------------------
   * 15. PROFILES, LEADERBOARD & TOURNAMENTS
   * ------------------------------------------------------------------------ */
  function renderProfilesAndLeaderboard() {
    const active = getActiveProfile();
    const info = calcLevelInfo(active.xp);
    $('active-profile-banner').innerHTML = `
      <div>
        <strong>${escapeHtml(active.avatar)} ${escapeHtml(active.name)}</strong>
        <p class="text-sm text-muted">${info.rank.icon} ${info.rank.title} • Level ${info.level} (${active.xp} XP)</p>
      </div>
      <span class="badge badge-accent">Active Profile</span>
    `;

    const list = $('profiles-list');
    list.innerHTML = '';
    appData.profiles.forEach((p) => {
      const pInfo = calcLevelInfo(p.xp);
      const div = document.createElement('div');
      div.className = 'profile-card';
      div.innerHTML = `
        <div>
          <strong>${escapeHtml(p.avatar)} ${escapeHtml(p.name)}</strong>
          <div class="text-xs text-muted">Lv ${pInfo.level} • ${p.wins}W / ${p.losses}L / ${p.draws}D</div>
        </div>
        <div class="action-row">
          ${p.id === appData.activeProfileId
            ? '<span class="badge badge-outline">Current</span>'
            : `<button class="btn btn-xs btn-secondary switch-prof-btn" data-id="${p.id}" type="button">Switch</button>`}
        </div>
      `;
      list.appendChild(div);
    });

    list.querySelectorAll('.switch-prof-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        appData.activeProfileId = btn.dataset.id;
        saveAppData();
        updateHeaderProfileUI();
        renderProfilesAndLeaderboard();
      });
    });

    const sortBy = $('leaderboard-sort').value;
    const sorted = [...appData.profiles].sort((a, b) => {
      if (sortBy === 'wins') return b.wins - a.wins;
      if (sortBy === 'streak') return b.bestStreak - a.bestStreak;
      if (sortBy === 'winrate') {
        const wrA = a.wins / Math.max(1, a.wins + a.losses + a.draws);
        const wrB = b.wins / Math.max(1, b.wins + b.losses + b.draws);
        return wrB - wrA;
      }
      return b.xp - a.xp;
    });

    const tbody = $('leaderboard-tbody');
    tbody.innerHTML = '';
    sorted.forEach((p, idx) => {
      const inf = calcLevelInfo(p.xp);
      const total = p.wins + p.losses + p.draws;
      const wr = total > 0 ? Math.round((p.wins / total) * 100) : 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${escapeHtml(p.avatar)} ${escapeHtml(p.name)}</td>
        <td>${inf.rank.title}</td>
        <td>Lv ${inf.level}</td>
        <td>${p.wins}/${p.losses}/${p.draws}</td>
        <td>${wr}%</td>
        <td><strong>${p.xp}</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function startNewTournament() {
    const participants = appData.config.players
      .slice(0, Math.max(2, appData.config.playerCount))
      .map((p, i) => ({
        ...p,
        tIndex: i,
        points: 0,
        wins: 0
      }));
    const matches = [];
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        matches.push({ p1: i, p2: j, winnerName: null, completed: false });
      }
    }
    appData.tournament = {
      id: `t_${Date.now()}`,
      participants,
      matches,
      currentMatchIdx: 0,
      completed: false
    };
    saveAppData();
    launchTournamentMatch(0);
  }

  function launchTournamentMatch(idx) {
    const t = appData.tournament;
    if (!t || idx >= t.matches.length) return;
    t.currentMatchIdx = idx;
    const m = t.matches[idx];
    const p1 = { ...t.participants[m.p1], index: 0 };
    const p2 = { ...t.participants[m.p2], index: 1 };
    const tCfg = {
      ...appData.config,
      mode: 'tournament',
      playerCount: 2,
      players: [p1, p2]
    };
    switchView('play');
    startNewGame(tCfg);
  }

  function recordTournamentResult(winner) {
    const t = appData.tournament;
    if (!t) return;
    const m = t.matches[t.currentMatchIdx];
    m.completed = true;
    if (winner) {
      m.winnerName = winner.name;
      const partIdx = winner.index === 0 ? m.p1 : m.p2;
      t.participants[partIdx].points += 3;
      t.participants[partIdx].wins += 1;
    } else {
      m.winnerName = 'Draw';
      t.participants[m.p1].points += 1;
      t.participants[m.p2].points += 1;
    }

    if (t.currentMatchIdx + 1 >= t.matches.length) {
      t.completed = true;
      const champ = [...t.participants].sort((a, b) => b.points - a.points)[0];
      showToast('🥇', 'Tournament Complete!', `${champ.name} is the Tournament Champion!`);
      unlockAchievement('tournament_champ');
    }
  }

  function renderTournamentPanel() {
    const container = $('tournament-panel-body');
    const t = appData.tournament;
    if (!t) {
      container.innerHTML = '<p class="text-muted text-sm">No active tournament. Click "Start New Tournament" to launch a round-robin bracket with your configured players.</p>';
      return;
    }
    const standings = [...t.participants].sort((a, b) => b.points - a.points);
    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Player</th><th>Wins</th><th>Points</th></tr></thead>
          <tbody>
            ${standings.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.wins}</td><td><strong>${s.points}</strong></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="tournament-matches-grid">
        ${t.matches.map((m, idx) => `
          <div class="tourney-match-card">
            <strong>Match #${idx + 1}: ${escapeHtml(t.participants[m.p1].name)} vs ${escapeHtml(t.participants[m.p2].name)}</strong>
            <span class="text-xs text-muted">${m.completed ? `Result: ${escapeHtml(m.winnerName)}` : 'Pending'}</span>
            ${!m.completed ? `<button class="btn btn-xs btn-primary launch-t-match" data-idx="${idx}" type="button">Play Match</button>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    container.querySelectorAll('.launch-t-match').forEach((btn) => {
      btn.addEventListener('click', () => launchTournamentMatch(Number(btn.dataset.idx)));
    });
  }

  /* ------------------------------------------------------------------------
   * 16. GAMIFICATION & ACHIEVEMENTS VIEW
   * ------------------------------------------------------------------------ */
  let currentAchFilter = 'all';

  function renderGamificationView() {
    const prof = getActiveProfile();
    const info = calcLevelInfo(prof.xp);
    $('gamify-rank-icon').textContent = info.rank.icon;
    $('gamify-rank-title').textContent = info.rank.title;
    $('gamify-level-badge').textContent = `Level ${info.level}`;
    $('gamify-xp-text').textContent = `${prof.xp} / ${info.nextReq} XP (${info.pct}% to Lv ${info.level + 1})`;
    $('gamify-xp-fill').style.width = `${info.pct}%`;
    $('gamify-unlocked-count').textContent = String(appData.achievements.length);
    const doneDailies = appData.daily.challenges.filter((c) => c.completed).length;
    $('gamify-challenges-done').textContent = `${doneDailies}/${appData.daily.challenges.length}`;

    const dcList = $('daily-challenges-list');
    dcList.innerHTML = '';
    appData.daily.challenges.forEach((c) => {
      const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
      const div = document.createElement('div');
      div.className = `challenge-item${c.completed ? ' completed' : ''}`;
      div.innerHTML = `
        <div class="panel-header-row">
          <strong>${escapeHtml(c.title)}</strong>
          <span class="badge ${c.completed ? 'badge-accent' : 'badge-outline'}">${c.completed ? 'Completed' : `+${c.xp} XP`}</span>
        </div>
        <span class="text-xs text-muted">${escapeHtml(c.desc)} (${c.progress}/${c.target})</span>
        <div class="xp-bar-mini"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
      `;
      dcList.appendChild(div);
    });

    const ulList = $('unlockables-list');
    ulList.innerHTML = '';
    UNLOCKABLES.forEach((u) => {
      const unlocked = info.level >= u.reqLv;
      const div = document.createElement('div');
      div.className = 'unlockable-item';
      div.innerHTML = `
        <div class="panel-header-row">
          <strong>${unlocked ? '🔓' : '🔒'} ${escapeHtml(u.name)}</strong>
          <span class="badge ${unlocked ? 'badge-accent' : 'badge-outline'}">${unlocked ? 'Unlocked' : `Lv ${u.reqLv}`}</span>
        </div>
        <span class="text-xs text-muted">${escapeHtml(u.desc)}</span>
      `;
      ulList.appendChild(div);
    });

    const grid = $('achievements-grid');
    grid.innerHTML = '';
    ACHIEVEMENTS_CATALOG.forEach((a) => {
      const isUnlocked = appData.achievements.includes(a.id);
      if (currentAchFilter === 'unlocked' && !isUnlocked) return;
      if (currentAchFilter === 'locked' && isUnlocked) return;
      const card = document.createElement('div');
      card.className = `achievement-card${isUnlocked ? ' unlocked' : ''}`;
      card.innerHTML = `
        <span class="achievement-icon" aria-hidden="true">${a.icon}</span>
        <div>
          <strong>${escapeHtml(a.title)}</strong>
          <p class="text-xs text-muted">${escapeHtml(a.desc)}</p>
          <span class="text-xs" style="color:var(--accent-tertiary)">+${a.xp} XP ${isUnlocked ? '• Unlocked' : '• Locked'}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------------
   * 17. SAVED GAMES, MATCH HISTORY & MOVE REPLAY THEATER
   * ------------------------------------------------------------------------ */
  function saveCurrentGame() {
    const saveItem = {
      id: `save_${Date.now()}`,
      name: `${game.rows}×${game.cols} ${game.mode} (${game.moveCount} moves)`,
      savedAt: new Date().toLocaleString(),
      snapshot: {
        rows: game.rows,
        cols: game.cols,
        connectN: game.connectN,
        directions: game.directions,
        mode: game.mode,
        teamMode: game.teamMode,
        timerMode: game.timerMode,
        turnSeconds: game.turnSeconds,
        matchMinutes: game.matchMinutes,
        aiDepth: game.aiDepth,
        board: game.board,
        players: game.players,
        currentPlayerIdx: game.currentPlayerIdx,
        moveCount: game.moveCount,
        moveLog: game.moveLog,
        winningCells: game.winningCells,
        finished: game.finished,
        turnTimeLeft: game.turnTimeLeft,
        matchTimeSec: game.matchTimeSec
      }
    };
    appData.savedGames.unshift(saveItem);
    if (appData.savedGames.length > 15) appData.savedGames.pop();
    saveAppData();
    showToast('💾', 'Game Saved', `Saved "${saveItem.name}" locally.`);
  }

  function loadSavedGame(saveId) {
    const found = appData.savedGames.find((s) => s.id === saveId);
    if (!found) return;
    clearTimers();
    const snap = found.snapshot;
    Object.assign(game, JSON.parse(JSON.stringify(snap)));
    game.undoStack = [];
    game.redoStack = [];
    game.paused = false;
    game.isAiTurn = false;
    game.lastTurnStartMs = Date.now();
    game.matchStartMs = Date.now();

    const root = document.documentElement;
    root.style.setProperty('--grid-cols', String(game.cols));
    root.style.setProperty('--grid-rows', String(game.rows));
    switchView('play');
    renderArenaAll();
    startTimers();
    scheduleAiIfNeeded();
    showToast('📂', 'Match Loaded', `Resumed ${found.name}.`);
  }

  function renderSavedAndHistory() {
    const savedEl = $('saved-games-list');
    if (appData.savedGames.length === 0) {
      savedEl.innerHTML = '<p class="text-muted text-sm">No saved games yet. Click "Save" in the Play Arena anytime.</p>';
    } else {
      savedEl.innerHTML = '';
      appData.savedGames.forEach((s) => {
        const div = document.createElement('div');
        div.className = 'saved-item';
        div.innerHTML = `
          <div>
            <strong>${escapeHtml(s.name)}</strong>
            <div class="text-xs text-muted">${escapeHtml(s.savedAt)}</div>
          </div>
          <div class="action-row">
            <button class="btn btn-xs btn-primary load-save-btn" data-id="${s.id}" type="button">Load</button>
            <button class="btn btn-xs btn-danger-outline del-save-btn" data-id="${s.id}" type="button">Delete</button>
          </div>
        `;
        savedEl.appendChild(div);
      });
      savedEl.querySelectorAll('.load-save-btn').forEach((b) => b.addEventListener('click', () => loadSavedGame(b.dataset.id)));
      savedEl.querySelectorAll('.del-save-btn').forEach((b) => b.addEventListener('click', () => {
        appData.savedGames = appData.savedGames.filter((x) => x.id !== b.dataset.id);
        saveAppData();
        renderSavedAndHistory();
      }));
    }

    const histEl = $('match-history-list');
    if (appData.matchHistory.length === 0) {
      histEl.innerHTML = '<p class="text-muted text-sm">Complete a match to record its replay log.</p>';
    } else {
      histEl.innerHTML = '';
      appData.matchHistory.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'saved-item';
        div.innerHTML = `
          <div>
            <strong>${escapeHtml(m.winnerName)} (${m.rows}×${m.cols} • Connect ${m.connectN})</strong>
            <div class="text-xs text-muted">${m.moves.length} moves • ${m.durationSec}s • ${new Date(m.timestamp).toLocaleString()}</div>
          </div>
          <button class="btn btn-xs btn-secondary watch-replay-btn" data-id="${m.id}" type="button">🎞️ Replay</button>
        `;
        histEl.appendChild(div);
      });
      histEl.querySelectorAll('.watch-replay-btn').forEach((b) => b.addEventListener('click', () => openReplayTheater(b.dataset.id)));
    }
  }

  function openReplayTheater(matchId) {
    const match = appData.matchHistory.find((m) => m.id === matchId);
    if (!match) return;
    stopReplayPlayback();
    replayState.match = match;
    replayState.step = 0;

    $('replay-theater').classList.remove('hidden');
    $('replay-match-meta').textContent = `${match.rows}×${match.cols} • Connect ${match.connectN} • Winner: ${match.winnerName}`;
    renderReplayBoard();
    $('replay-theater').scrollIntoView({ behavior: 'smooth' });
  }

  function stopReplayPlayback() {
    replayState.playing = false;
    if (replayState.intervalId) {
      clearInterval(replayState.intervalId);
      replayState.intervalId = null;
    }
    $('btn-replay-play').textContent = '▶️ Play';
  }

  function renderReplayBoard() {
    const m = replayState.match;
    if (!m) return;
    const boardEl = $('replay-board');
    boardEl.style.setProperty('--grid-cols', String(m.cols));
    boardEl.style.setProperty('--grid-rows', String(m.rows));
    boardEl.innerHTML = '';

    const grid = Array.from({ length: m.rows }, () => Array(m.cols).fill(null));
    for (let i = 0; i < replayState.step && i < m.moves.length; i++) {
      const mv = m.moves[i];
      if (mv.row < m.rows && mv.col < m.cols) {
        grid[mv.row][mv.col] = mv.playerIdx;
      }
    }

    for (let r = 0; r < m.rows; r++) {
      for (let c = 0; c < m.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const val = grid[r][c];
        if (val !== null) {
          const p = m.players[val] || { color: '#06b6d4', symbol: 'X' };
          const piece = document.createElement('div');
          piece.className = 'cell-piece';
          piece.style.background = `${p.color}cc`;
          piece.style.color = '#fff';
          piece.textContent = p.symbol;
          cell.appendChild(piece);
        }
        boardEl.appendChild(cell);
      }
    }
    $('replay-step-counter').textContent = `Move ${replayState.step} / ${m.moves.length}`;
  }

  /* ------------------------------------------------------------------------
   * 18. EVENT BINDINGS, KEYBOARD CONTROLS & PWA REGISTRATION
   * ------------------------------------------------------------------------ */
  function bindEvents() {
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    $('theme-select').addEventListener('change', (e) => switchTheme(e.target.value));
    $('btn-color-mode').addEventListener('click', () => {
      appData.settings.colorMode = appData.settings.colorMode === 'dark' ? 'light' : 'dark';
      applySettings();
      saveAppData();
    });
    $('btn-sound-toggle').addEventListener('click', () => {
      appData.settings.soundEnabled = !appData.settings.soundEnabled;
      applySettings();
      saveAppData();
    });
    $('btn-quick-profile').addEventListener('click', () => switchView('leaderboard'));

    $('btn-modal-close').addEventListener('click', closeModal);
    $('app-modal').addEventListener('click', (e) => {
      if (e.target === $('app-modal')) closeModal();
    });

    $('btn-new-game').addEventListener('click', () => startNewGame());
    $('btn-reset-game').addEventListener('click', () => startNewGame());
    $('btn-go-setup').addEventListener('click', () => switchView('setup'));

    const togglePause = () => {
      if (game.finished) return;
      game.paused = !game.paused;
      $('board-pause-overlay').classList.toggle('hidden', !game.paused);
      $('btn-pause-resume').textContent = game.paused ? '▶️ Resume' : '⏸️ Pause';
      if (!game.paused) {
        game.lastTurnStartMs = Date.now();
        scheduleAiIfNeeded();
      }
      renderBoard();
    };
    $('btn-pause-resume').addEventListener('click', togglePause);
    $('btn-overlay-resume').addEventListener('click', togglePause);

    $('btn-undo').addEventListener('click', () => {
      if (game.undoStack.length === 0 || game.finished) return;
      game.redoStack.push(snapshotState());
      const prev = game.undoStack.pop();
      restoreSnapshot(prev);
    });
    $('btn-redo').addEventListener('click', () => {
      if (game.redoStack.length === 0 || game.finished) return;
      game.undoStack.push(snapshotState());
      const next = game.redoStack.pop();
      restoreSnapshot(next);
    });
    $('btn-save-game').addEventListener('click', saveCurrentGame);
    $('btn-hint').addEventListener('click', () => {
      if (game.paused || game.finished || game.isAiTurn) return;
      const active = game.players[game.currentPlayerIdx];
      const suggested = chooseAiColumn({ ...active, aiLevel: 6 });
      if (suggested !== -1) {
        game.hintCol = suggested;
        renderBoard();
        showToast('💡', 'AI Hint', `Recommended drop: Column ${suggested + 1}`);
      }
    });

    $('btn-toggle-coords').addEventListener('click', () => {
      appData.settings.showCoords = !appData.settings.showCoords;
      saveAppData();
      renderBoard();
    });
    $('btn-toggle-ghost').addEventListener('click', () => {
      appData.settings.showGhost = !appData.settings.showGhost;
      saveAppData();
      renderBoard();
    });

    $('btn-result-rematch').addEventListener('click', () => startNewGame());
    $('btn-result-next-tourney').addEventListener('click', () => {
      if (appData.tournament) {
        launchTournamentMatch(appData.tournament.currentMatchIdx + 1);
      }
    });
    $('btn-result-replay').addEventListener('click', () => {
      $('game-result-overlay').classList.add('hidden');
      switchView('history');
      if (appData.matchHistory[0]) openReplayTheater(appData.matchHistory[0].id);
    });
    $('btn-result-close').addEventListener('click', () => $('game-result-overlay').classList.add('hidden'));

    $('cfg-rows').addEventListener('input', (e) => { $('cfg-rows-val').textContent = e.target.value; });
    $('cfg-cols').addEventListener('input', (e) => { $('cfg-cols-val').textContent = e.target.value; });
    $('cfg-ai-depth').addEventListener('input', (e) => { $('cfg-ai-depth-val').textContent = e.target.value; });
    $('cfg-connect-preset').addEventListener('change', (e) => {
      if (e.target.value !== 'custom') $('cfg-connect-n').value = e.target.value;
    });
    $('cfg-connect-n').addEventListener('input', (e) => {
      const val = e.target.value;
      $('cfg-connect-preset').value = ['4', '5', '6'].includes(val) ? val : 'custom';
    });
    $('cfg-player-count').addEventListener('change', renderPlayerSetupCards);
    document.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });
    $('btn-start-configured-game').addEventListener('click', () => {
      applyConfigFromForm();
      switchView('play');
      startNewGame();
    });

    $('btn-refresh-charts').addEventListener('click', () => {
      renderStatsKPIs();
      renderAllCharts();
    });
    $('btn-export-stats').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(appData.stats, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gravity-grid-stats.json';
      a.click();
      URL.revokeObjectURL(url);
    });
    $('btn-reset-stats').addEventListener('click', () => {
      openModal('Reset Statistics', '<p>Are you sure you want to clear all local match statistics?</p>', [
        { label: 'Cancel', cls: 'btn-ghost' },
        {
          label: 'Reset All',
          cls: 'btn-danger-outline',
          onClick: () => {
            appData.stats = createDefaultState().stats;
            saveAppData();
            renderStatsKPIs();
            renderAllCharts();
            showToast('🗑️', 'Statistics Reset', 'Local analytics cleared.');
          }
        }
      ]);
    });

    $('leaderboard-sort').addEventListener('change', renderProfilesAndLeaderboard);
    $('btn-create-profile').addEventListener('click', () => {
      openModal('Create Player Profile', `
        <div class="form-row">
          <label for="new-prof-name">Player Name</label>
          <input id="new-prof-name" type="text" maxlength="18" placeholder="Enter name" />
        </div>
        <div class="form-row">
          <label for="new-prof-avatar">Avatar Emoji</label>
          <input id="new-prof-avatar" type="text" maxlength="2" value="🚀" />
        </div>
      `, [
        { label: 'Cancel', cls: 'btn-ghost' },
        {
          label: 'Create Profile',
          cls: 'btn-primary',
          onClick: () => {
            const name = ($('new-prof-name').value || '').trim() || `Player ${appData.profiles.length + 1}`;
            const avatar = ($('new-prof-avatar').value || '').trim() || '🚀';
            const id = `prof_${Date.now()}`;
            appData.profiles.push({ id, name, avatar, xp: 0, wins: 0, losses: 0, draws: 0, bestStreak: 0 });
            appData.activeProfileId = id;
            saveAppData();
            updateHeaderProfileUI();
            renderProfilesAndLeaderboard();
          }
        }
      ]);
    });
    $('btn-start-tournament').addEventListener('click', startNewTournament);

    document.querySelectorAll('.ach-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentAchFilter = btn.dataset.filter;
        document.querySelectorAll('.ach-filter-btn').forEach((b) => {
          b.classList.toggle('btn-primary', b === btn);
          b.classList.toggle('btn-ghost', b !== btn);
        });
        renderGamificationView();
      });
    });

    $('btn-clear-history').addEventListener('click', () => {
      appData.matchHistory = [];
      saveAppData();
      renderSavedAndHistory();
    });
    $('btn-replay-close').addEventListener('click', () => {
      stopReplayPlayback();
      $('replay-theater').classList.add('hidden');
    });
    $('btn-replay-start').addEventListener('click', () => {
      stopReplayPlayback();
      replayState.step = 0;
      renderReplayBoard();
    });
    $('btn-replay-end').addEventListener('click', () => {
      stopReplayPlayback();
      if (replayState.match) replayState.step = replayState.match.moves.length;
      renderReplayBoard();
    });
    $('btn-replay-prev').addEventListener('click', () => {
      stopReplayPlayback();
      replayState.step = Math.max(0, replayState.step - 1);
      renderReplayBoard();
    });
    $('btn-replay-next').addEventListener('click', () => {
      stopReplayPlayback();
      if (replayState.match) {
        replayState.step = Math.min(replayState.match.moves.length, replayState.step + 1);
        renderReplayBoard();
      }
    });
    $('btn-replay-play').addEventListener('click', () => {
      if (!replayState.match) return;
      if (replayState.playing) {
        stopReplayPlayback();
        return;
      }
      if (replayState.step >= replayState.match.moves.length) replayState.step = 0;
      replayState.playing = true;
      $('btn-replay-play').textContent = '⏸️ Pause';
      replayState.intervalId = setInterval(() => {
        if (!replayState.match || replayState.step >= replayState.match.moves.length) {
          stopReplayPlayback();
          return;
        }
        replayState.step += 1;
        renderReplayBoard();
      }, 450);
    });

    // Keyboard navigation: 1-9 direct column drop, ArrowLeft/ArrowRight + Enter/Space
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if ($('view-play').hidden) return;
      if (e.key === 'Escape' && !$('app-modal').classList.contains('hidden')) {
        closeModal();
        return;
      }

      const num = Number(e.key);
      if (num >= 1 && num <= 9 && num <= game.cols) {
        handleHumanColumnClick(num - 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        highlightColumn(game.selectedCol, false);
        game.selectedCol = (game.selectedCol - 1 + game.cols) % game.cols;
        highlightColumn(game.selectedCol, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        highlightColumn(game.selectedCol, false);
        game.selectedCol = (game.selectedCol + 1) % game.cols;
        highlightColumn(game.selectedCol, true);
      } else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.tagName !== 'BUTTON') {
        e.preventDefault();
        handleHumanColumnClick(game.selectedCol);
      }
    });

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      $('install-banner').classList.remove('hidden');
      $('btn-header-install').classList.remove('hidden');
    });

    const triggerInstall = async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $('install-banner').classList.add('hidden');
      $('btn-header-install').classList.add('hidden');
    };
    $('btn-install-accept').addEventListener('click', triggerInstall);
    $('btn-header-install').addEventListener('click', triggerInstall);
    $('btn-install-dismiss').addEventListener('click', () => $('install-banner').classList.add('hidden'));
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {
        // Silent fallback if running on unsupported origin such as file://
      });
    }
  }

  /* ------------------------------------------------------------------------
   * 19. APPLICATION INITIALIZATION
   * ------------------------------------------------------------------------ */
  function init() {
    applySettings();
    updateHeaderProfileUI();
    bindEvents();
    syncSetupFormFromConfig();
    startNewGame();
    registerServiceWorker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
