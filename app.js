// Toast 與原生 alert 分流管理
let toastTimer = null;

function showToast(message, duration = 2500) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// 保留原生系統彈窗供除錯使用
const nativeAlert = window.alert.bind(window);

// Web Audio API 音效與震動回饋機制
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playWinSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  } catch (e) {
    // 略過音效錯誤
  }
}

function triggerHaptic(type = 'light') {
  try {
    if (navigator.vibrate) {
      if (type === 'win') navigator.vibrate([40, 60, 80]);
    }
  } catch (e) {
    // 略過不支援的裝置
  }
}

function updateAppThemeColor() {
  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  if (bgColor) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = bgColor;
  }
}
window.addEventListener('DOMContentLoaded', updateAppThemeColor);

const UI_FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Sans TC", sans-serif';

const DEFAULT_XP_POOL = [
  { name: "去", desc: "" },
  { name: "不去", desc: "" },
  { name: "去", desc: "" },
  { name: "不去", desc: "" },
  { name: "去", desc: "" },
  { name: "不去", desc: "" },
  { name: "去", desc: "" },
  { name: "不去", desc: "" },
  { name: "去", desc: "" },
  { name: "不去", desc: "" }
];

const DEFAULT_DARK_PALETTE = [
  '#EC4899', '#8B5CF6', '#F43F5E', '#A855F7', 
  '#DB2777', '#7C3AED', '#FB7185', '#6366F1'
];

const DEFAULT_LIGHT_PALETTE = [
  '#F472B6', '#A78BFA', '#FB7185', '#C084FC',
  '#F43F5E', '#8B5CF6', '#FDA4AF', '#818CF8'
];

const THEME_VARS_META = [
  { varName: '--bg', label: '整體背景色', desc: '整個頁面的最底層背景底色。' },
  { varName: '--card-bg', label: '卡片與彈窗背景色', desc: '後台面板、抽中結果彈窗與轉盤中心圓球的底色。' },
  { varName: '--card-hover', label: '卡片懸停色', desc: '互動區塊懸停底色。' },
  { varName: '--primary', label: '主品牌主題色', desc: '所有主要按鈕、選中外框、旋轉按鈕漸層終點色。' },
  { varName: '--primary-hover', label: '主要主題色懸停效果', desc: '滑鼠懸停於主要紫色按鈕時的加深顏色。' },
  { varName: '--primary-light', label: '主題淺色 / 輔助高亮', desc: '列表操作編輯按鈕文字與全域變數名稱高亮。' },
  { varName: '--accent', label: '強調色', desc: '旋轉按鈕漸層起始色、彈窗霓虹外框與光暈效果。' },
  { varName: '--accent-hover', label: '強調色懸停效果', desc: '旋轉按鈕或強調區塊懸停加深色。' },
  { varName: '--text-main', label: '主要標題文字色', desc: '大標題、卡片標題、抽中項目名稱等主要文字。' },
  { varName: '--text-sub', label: '次要文字與說明文字色', desc: '副標題、各區塊格式說明文字與項目備註描述。' },
  { varName: '--text-muted', label: '弱化輔助文字色', desc: '表格欄位標題與預設空值提示色。' },
  { varName: '--border-card', label: '邊框與轉盤輪廓色', desc: '後台卡片邊框、轉盤周圍陰影環外框與輸入框框線。' },
  { varName: '--bar-bg', label: '區塊條背景色', desc: '輸入框、表格內部、頂端轉盤切換列背景底色。' },
  { varName: '--wheel-text', label: '轉盤文字色', desc: '轉盤圓形畫布上繪製之項目文字顏色。' },
  { varName: '--wheel-result-desc', label: '結果描述框文字色', desc: '抽中命運彈窗中描述文字專用顏色。' }
];

const DEFAULT_DARK_THEME_VARS = {
  '--bg': '#121214',
  '--card-bg': '#1e1e24',
  '--card-hover': '#26262e',
  '--primary': '#8b5cf6',
  '--primary-hover': '#7c3aed',
  '--primary-light': '#a78bfa',
  '--accent': '#ec4899',
  '--accent-hover': '#db2777',
  '--text-main': '#f3f4f6',
  '--text-sub': '#9ca3af',
  '--text-muted': '#6b7280',
  '--border-card': '#2e2e38',
  '--bar-bg': '#272730',
  '--wheel-text': '#ffffff',
  '--wheel-result-desc': '#fce7f3'
};

const DEFAULT_LIGHT_THEME_VARS = {
  '--bg': '#fafafa',
  '--card-bg': '#ffffff',
  '--card-hover': '#f5f5f5',
  '--primary': '#8b5cf6',
  '--primary-hover': '#7c3aed',
  '--primary-light': '#a78bfa',
  '--accent': '#ec4899',
  '--accent-hover': '#db2777',
  '--text-main': '#1f2937',
  '--text-sub': '#6b7280',
  '--text-muted': '#9ca3af',
  '--border-card': '#e5e7eb',
  '--bar-bg': '#f3f4f6',
  '--wheel-text': '#ffffff',
  '--wheel-result-desc': '#be185d'
};

let customGlobalThemes;
try {
  customGlobalThemes = JSON.parse(localStorage.getItem('wheel_custom_global_themes_v1')) || {
    dark: { ...DEFAULT_DARK_THEME_VARS },
    light: { ...DEFAULT_LIGHT_THEME_VARS }
  };
} catch (e) {
  customGlobalThemes = {
    dark: { ...DEFAULT_DARK_THEME_VARS },
    light: { ...DEFAULT_LIGHT_THEME_VARS }
  };
}

let currentEditingThemeTab = 'dark';

function applyCustomThemeStyles() {
  const styleEl = document.getElementById('customThemeStyle');
  let darkCss = '';
  for (const [k, v] of Object.entries(customGlobalThemes.dark)) {
    darkCss += `${k}: ${v};\n`;
  }
  let lightCss = '';
  for (const [k, v] of Object.entries(customGlobalThemes.light)) {
    lightCss += `${k}: ${v};\n`;
  }
  styleEl.textContent = `
    :root {\n${darkCss}}\n
    body.theme-light {\n${lightCss}}\n
  `;
}

applyCustomThemeStyles();

function getThemeMode() {
  return localStorage.getItem('wheel_theme_mode_v3') || 'auto';
}

function isLightMode() {
  const mode = getThemeMode();
  if (mode === 'auto') {
    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return mode === 'light';
}

function applyTheme() {
  const isLight = isLightMode();
  if (isLight) {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
  
  updateThemeButtonLabels();
  updateAppThemeColor();
  drawWheel();
  initColorSettings();
}

function toggleTheme() {
  const current = getThemeMode();
  let next = 'auto';
  
  if (current === 'auto') {
    next = 'dark';
  } else if (current === 'dark') {
    next = 'light';
  } else {
    next = 'auto';
  }

  localStorage.setItem('wheel_theme_mode_v3', next);
  applyTheme();
}

function updateThemeButtonLabels() {
  const mode = getThemeMode();
  let label = '✨ 跟隨系統';
  if (mode === 'dark') label = '🌙 夜間模式';
  if (mode === 'light') label = '☀️ 日間模式';

  ['frontThemeToggleBtn', 'adminThemeToggleBtn', 'themeAdminToggleBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.textContent = label;
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getThemeMode() === 'auto') {
    applyTheme();
  }
});

let adminThemeClickCount = 0;
let adminThemeClickTimer = null;

function handleAdminThemeClick() {
  toggleTheme();
  adminThemeClickCount++;
  clearTimeout(adminThemeClickTimer);
  adminThemeClickTimer = setTimeout(() => {
    adminThemeClickCount = 0;
  }, 2500);
  if (adminThemeClickCount >= 5) {
    adminThemeClickCount = 0;
    openThemeAdminView();
  }
}

function navigateToView(viewId, pushHistory = true) {
  if (pushHistory) {
    history.pushState({ view: viewId }, '', '#' + viewId);
  }
  
  document.getElementById('frontView').style.display = 'none';
  document.getElementById('adminView').classList.remove('show');
  document.getElementById('themeAdminView').classList.remove('show');
  document.getElementById('cheatView').classList.remove('show');

  if (viewId === 'frontView') {
    document.getElementById('frontView').style.display = 'flex';
    drawWheel();
    updateWheelSelect();
  } else if (viewId === 'adminView') {
    document.getElementById('adminView').classList.add('show');
    initColorSettings();
    renderAdminList();
  } else if (viewId === 'themeAdminView') {
    document.getElementById('themeAdminView').classList.add('show');
    switchThemeEditTab(isLightMode() ? 'light' : 'dark');
  } else if (viewId === 'cheatView') {
    document.getElementById('cheatView').classList.add('show');
    updateCheatWheelSelect();
    renderCheatList();
  }
}

window.addEventListener('popstate', (e) => {
  const targetView = (e.state && e.state.view) ? e.state.view : 'frontView';
  navigateToView(targetView, false);
  if (targetView === 'frontView') {
    drawWheel();
    updateWheelSelect();
  }
});

function openAdminView() { navigateToView('adminView'); }
function goBackToFront() { history.back(); }
function openThemeAdminView() { navigateToView('themeAdminView'); }
function closeThemeAdminView() { history.back(); }

function openCheatViewDirect() {
  navigateToView('cheatView');
  document.getElementById('cheatVisualToggle').checked = cheatVisualMode;
}

function closeCheatView() { history.back(); }

let cheatVisualMode = localStorage.getItem('wheel_cheat_visual_v1') === 'true';

function isCheatVisualEnabled() { return cheatVisualMode; }

function toggleCheatVisualMode() {
  cheatVisualMode = document.getElementById('cheatVisualToggle').checked;
  localStorage.setItem('wheel_cheat_visual_v1', cheatVisualMode ? 'true' : 'false');
  drawWheel();
}

function updateCheatWheelSelect() {
  const cheatSelect = document.getElementById('cheatWheelSelect');
  cheatSelect.innerHTML = '';
  wheelsData.forEach(w => {
    const totalItemsCount = w.items.length;
    const opt = document.createElement('option');
    opt.value = w.id;
    opt.textContent = `${w.title} (${totalItemsCount})`;
    if (w.id === activeWheelId) opt.selected = true;
    cheatSelect.appendChild(opt);
  });
}

function onCheatWheelSelectChange() {
  activeWheelId = document.getElementById('cheatWheelSelect').value;
  saveWheels();
  renderCheatList();
  drawWheel();
}

function cheatItemMatchesSearch(item, term) {
  if (!term) return true;
  const needle = term.trim().toLowerCase();
  if (!needle) return true;
  return item.name.toLowerCase().includes(needle);
}

function renderCheatList() {
  const wheel = getActiveWheel();
  const tbody = document.getElementById('cheatTableBody');
  const searchTerm = document.getElementById('cheatSearchInput').value;
  tbody.innerHTML = '';

  const allVisible = wheel.items.filter(item => !item.hidden);
  const totalWeight = allVisible.reduce((sum, item) => sum + ((item.weight && item.weight > 0) ? item.weight : 1), 0);

  const visible = sortIndexedItems(wheel.items
    .map((item, index) => ({ item, index }))
    .filter(x => !x.item.hidden)
    .filter(x => cheatItemMatchesSearch(x.item, searchTerm)), cheatSortMode, cheatSortDir);

  if (visible.length === 0) {
    const emptyMsg = allVisible.length > 0 ? '沒有符合搜尋條件的項目' : '目前沒有顯示中的項目';
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.style.cssText = 'text-align:center; color:var(--text-muted); padding:16px;';
    td.textContent = emptyMsg;
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  visible.forEach(({ item, index }) => {
    const weight = (item.weight && item.weight > 0) ? item.weight : 1;
    const pct = totalWeight > 0 ? Number((weight / totalWeight * 100).toFixed(3)) : 0;
    
    const tr = document.createElement('tr');
    tr.setAttribute('data-cheat-index', index);

    const tdName = document.createElement('td');
    tdName.className = 'item-name';
    tdName.textContent = item.name;

    const tdInput = document.createElement('td');
    tdInput.style.cssText = 'width: 32%; padding-left: 4px; padding-right: 4px;';
    const weightInput = document.createElement('input');
    weightInput.type = 'text';
    weightInput.inputMode = 'decimal';
    weightInput.className = 'admin-input cheat-weight-input';
    weightInput.style.cssText = 'margin-bottom: 0; height: 32px; font-family: monospace; text-align: right;';
    weightInput.value = weight;
    weightInput.oninput = function() { updateItemWeight(index, this.value); };
    weightInput.addEventListener('focus', function() { this.select(); });
    tdInput.appendChild(weightInput);

    const tdProb = document.createElement('td');
    tdProb.style.cssText = 'width: 32%; text-align: right; white-space: nowrap; padding-left: 4px; padding-right: 4px;';
    
    const probWrapper = document.createElement('div');
    probWrapper.style.cssText = 'display: inline-flex; align-items: center; justify-content: flex-end; width: 100%; gap: 8px; background: var(--bar-bg); border: 1px solid var(--border-card); border-radius: 8px; padding: 0 8px; height: 32px; box-sizing: border-box;';

    const probInput = document.createElement('input');
    probInput.type = 'text';
    probInput.inputMode = 'decimal';
    probInput.className = 'cheat-prob-input';
    probInput.style.cssText = 'border: none; background: transparent; outline: none; font-family: monospace; text-align: right; color: var(--primary-light); font-weight: 700; width: 100%; font-size: 0.875rem; padding: 0;';
    probInput.value = pct;
    probInput.oninput = function() { updateItemProbability(index, this.value); };
    probInput.addEventListener('focus', function() { this.select(); });

    const percentSign = document.createElement('span');
    percentSign.style.cssText = 'font-weight: 700; color: var(--text-sub); font-size: 0.875rem; flex-shrink: 0;';
    percentSign.textContent = '%';

    probWrapper.appendChild(probInput);
    probWrapper.appendChild(percentSign);
    tdProb.appendChild(probWrapper);

    tr.appendChild(tdName);
    tr.appendChild(tdInput);
    tr.appendChild(tdProb);
    tbody.appendChild(tr);
  });
}

function refreshCheatProbabilities() {
  const wheel = getActiveWheel();
  const allVisible = wheel.items.filter(item => !item.hidden);
  const totalWeight = allVisible.reduce((sum, item) => sum + ((item.weight && item.weight > 0) ? item.weight : 1), 0);

  document.querySelectorAll('#cheatTableBody [data-cheat-index]').forEach(row => {
    const idx = parseInt(row.getAttribute('data-cheat-index'), 10);
    const item = wheel.items[idx];
    if (!item) return;
    const weight = (item.weight && item.weight > 0) ? item.weight : 1;
    const pct = totalWeight > 0 ? Number((weight / totalWeight * 100).toFixed(3)) : 0;
    
    const probInput = row.querySelector('.cheat-prob-input');
    if (probInput && document.activeElement !== probInput) {
      probInput.value = pct;
    }
  });
}

function updateItemWeight(index, value) {
  const wheel = getActiveWheel();
  const item = wheel.items[index];
  if (!item) return;
  let w = parseFloat(value);
  if (isNaN(w) || w <= 0) return;
  item.weight = w;
  saveWheels();
  refreshCheatProbabilities();
  if (isCheatVisualEnabled()) drawWheel();
}

function updateItemProbability(index, value) {
  const wheel = getActiveWheel();
  const item = wheel.items[index];
  if (!item) return;

  let pct = parseFloat(value);
  if (isNaN(pct) || pct < 0) return;
  if (pct > 100) pct = 100;

  const allVisible = wheel.items.filter(it => !it.hidden);
  if (allVisible.length <= 1) return;

  const otherItems = allVisible.filter(it => it !== item);
  const otherWeightSum = otherItems.reduce((sum, it) => sum + ((it.weight && it.weight > 0) ? it.weight : 1), 0);

  let newWeight;
  if (pct >= 100) {
    newWeight = otherWeightSum > 0 ? otherWeightSum * 1000 : 1000;
  } else if (pct <= 0) {
    newWeight = 0.001;
  } else {
    const ratio = pct / 100;
    newWeight = (otherWeightSum * ratio) / (1 - ratio);
  }

  item.weight = Number(Math.max(0.001, newWeight).toFixed(3));
  saveWheels();
  
  const totalWeight = otherWeightSum + item.weight;
  document.querySelectorAll('#cheatTableBody [data-cheat-index]').forEach(row => {
    const idx = parseInt(row.getAttribute('data-cheat-index'), 10);
    const rowItem = wheel.items[idx];
    if (!rowItem) return;
    const rowWeight = (rowItem.weight && rowItem.weight > 0) ? rowItem.weight : 1;
    const rowPct = totalWeight > 0 ? Number((rowWeight / totalWeight * 100).toFixed(3)) : 0;
    
    const probInput = row.querySelector('.cheat-prob-input');
    if (probInput && document.activeElement !== probInput) {
      probInput.value = rowPct;
    }

    const weightInput = row.querySelector('.cheat-weight-input');
    if (weightInput && document.activeElement !== weightInput) {
      weightInput.value = rowWeight;
    }
  });

  if (isCheatVisualEnabled()) drawWheel();
}

function resetCheatWeights() {
  const wheel = getActiveWheel();
  wheel.items.forEach(item => { delete item.weight; });
  saveWheels();
  renderCheatList();
  if (isCheatVisualEnabled()) drawWheel();
  showToast('已重置為公平機率！');
}

function switchThemeEditTab(tab) {
  currentEditingThemeTab = tab;
  document.getElementById('tabDarkBtn').classList.toggle('active', tab === 'dark');
  document.getElementById('tabLightBtn').classList.toggle('active', tab === 'light');
  renderGlobalThemeSettings();
}

function renderGlobalThemeSettings() {
  const container = document.getElementById('globalThemeInputsContainer');
  container.innerHTML = '';
  const themeSet = customGlobalThemes[currentEditingThemeTab];

  THEME_VARS_META.forEach(meta => {
    const val = themeSet[meta.varName] || '#000000';
    const row = document.createElement('div');
    row.className = 'global-theme-item';

    row.innerHTML = `
      <div id="preview_${meta.varName}" class="global-theme-preview" style="background: ${val};"></div>
      <input type="text" class="global-theme-input" 
             value="${val.toUpperCase()}" 
             maxlength="7"
             placeholder="#HEX"
             oninput="this.value = normalizeHexInput(this.value);"
             onchange="updateGlobalThemeVariable('${meta.varName}', this.value, this)">
      <div class="global-theme-info">
        <div class="global-theme-varname">${meta.varName} <span style="font-weight:600; color:var(--text-main); margin-left:6px;">${meta.label}</span></div>
        <div class="global-theme-desc">${meta.desc}</div>
      </div>
    `;
    container.appendChild(row);
  });
}

function updateGlobalThemeVariable(varName, value, inputEl) {
  const cleanHex = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (cleanHex.length !== 6) {
    nativeAlert('請輸入合法的 6 碼色號！(例如：#114514)');
    renderGlobalThemeSettings();
    return;
  }
  const fullHex = '#' + cleanHex;
  customGlobalThemes[currentEditingThemeTab][varName] = fullHex;
  try {
    localStorage.setItem('wheel_custom_global_themes_v1', JSON.stringify(customGlobalThemes));
  } catch (e) {
    nativeAlert('【除錯提示】儲存失敗：LocalStorage 容量可能已滿。');
  }
  applyCustomThemeStyles();

  if (inputEl) inputEl.value = fullHex;
  const preview = document.getElementById(`preview_${varName}`);
  if (preview) preview.style.background = fullHex;

  drawWheel();
  updateAppThemeColor();
}

function resetCurrentThemeVariables() {
  const modeName = currentEditingThemeTab === 'dark' ? '夜間模式' : '日間模式';
  if (!confirm(`確定要重置「${modeName}」的所有整體介面配色為系統預設值嗎？`)) return;

  if (currentEditingThemeTab === 'dark') {
    customGlobalThemes.dark = { ...DEFAULT_DARK_THEME_VARS };
  } else {
    customGlobalThemes.light = { ...DEFAULT_LIGHT_THEME_VARS };
  }
  try {
    localStorage.setItem('wheel_custom_global_themes_v1', JSON.stringify(customGlobalThemes));
  } catch (e) {
    nativeAlert('【除錯提示】儲存失敗：LocalStorage 容量已滿。');
  }
  applyCustomThemeStyles();
  renderGlobalThemeSettings();
  drawWheel();
  updateAppThemeColor();
  showToast(`已重置「${modeName}」的配色設定！`);
}

function exportGlobalThemesJson() {
  const exportData = { type: 'global_theme_colors', themes: customGlobalThemes };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `全站主題配色備份_${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportGlobalThemeJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onerror = () => {
    nativeAlert('【除錯提示】檔案讀取失敗，請檢查檔案權限或狀態。');
    e.target.value = '';
  };
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.type === 'global_theme_colors' && data.themes) {
        customGlobalThemes = {
          dark: { ...DEFAULT_DARK_THEME_VARS, ...(data.themes.dark || {}) },
          light: { ...DEFAULT_LIGHT_THEME_VARS, ...(data.themes.light || {}) }
        };
      } else if (data.dark || data.light) {
        customGlobalThemes = {
          dark: { ...DEFAULT_DARK_THEME_VARS, ...(data.dark || {}) },
          light: { ...DEFAULT_LIGHT_THEME_VARS, ...(data.light || {}) }
        };
      } else {
        nativeAlert('【除錯提示】無法辨識此配色檔案格式！');
        return;
      }

      localStorage.setItem('wheel_custom_global_themes_v1', JSON.stringify(customGlobalThemes));
      applyCustomThemeStyles();
      renderGlobalThemeSettings();
      drawWheel();
      updateAppThemeColor();
      showToast('成功匯入全站主題配色！');
    } catch (err) {
      nativeAlert(`【除錯提示】JSON 解析失敗。錯誤原因：${err.message}`);
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

let wheelsData;
try {
  wheelsData = JSON.parse(localStorage.getItem('xp_wheels_store_v1')) || [
    { 
      id: 'default_xp', 
      title: '去或不去', 
      items: DEFAULT_XP_POOL, 
      darkPalette: [...DEFAULT_DARK_PALETTE],
      lightPalette: [...DEFAULT_LIGHT_PALETTE]
    }
  ];
} catch (e) {
  wheelsData = [
    { 
      id: 'default_xp', 
      title: '去或不去', 
      items: DEFAULT_XP_POOL, 
      darkPalette: [...DEFAULT_DARK_PALETTE],
      lightPalette: [...DEFAULT_LIGHT_PALETTE]
    }
  ];
}

let activeWheelId = localStorage.getItem('xp_active_wheel_id') || wheelsData[0].id;
let autoHideConfig = localStorage.getItem('xp_auto_hide_v1') === 'true';

wheelsData.forEach(w => {
  if (!w.darkPalette) {
    w.darkPalette = (w.palette && Array.isArray(w.palette) && w.palette.length > 0) 
      ? [...w.palette] 
      : [...DEFAULT_DARK_PALETTE];
  }
  if (!w.lightPalette) {
    w.lightPalette = [...DEFAULT_LIGHT_PALETTE];
  }
});

let isSpinning = false;
let currentDegree = 0;

let adminSortMode = 'original';
let adminSortDir = 'asc';
let cheatSortMode = 'original';
let cheatSortDir = 'asc';

function sortIndexedItems(pairs, mode, dir) {
  const arr = pairs.slice();
  const dirMult = dir === 'desc' ? -1 : 1;
  if (mode === 'alpha') {
    arr.sort((a, b) => dirMult * a.item.name.localeCompare(b.item.name, 'zh-Hant'));
  } else if (mode === 'length') {
    arr.sort((a, b) => dirMult * (a.item.name.length - b.item.name.length) || (a.index - b.index));
  } else if (mode === 'weight') {
    const w = (it) => (it.weight && it.weight > 0) ? it.weight : 1;
    arr.sort((a, b) => dirMult * (w(a.item) - w(b.item)) || (a.index - b.index));
  } else {
    arr.sort((a, b) => dirMult * (a.index - b.index));
  }
  return arr;
}

function onAdminSortChange() {
  adminSortMode = document.getElementById('adminSortSelect').value;
  renderAdminList();
}

function toggleAdminSortDir() {
  adminSortDir = adminSortDir === 'asc' ? 'desc' : 'asc';
  const btn = document.getElementById('adminSortDirBtn');
  if (btn) btn.textContent = adminSortDir === 'asc' ? '⬆️' : '⬇️';
  renderAdminList();
}

function toggleAdminSortMenu(event) {
  if (event) event.stopPropagation();
  const select = document.getElementById('adminSortSelect');
  const btn = document.getElementById('adminSortDirBtn');
  const willOpen = !select.classList.contains('show');
  select.classList.toggle('show', willOpen);
  if (btn) btn.classList.toggle('menu-open', willOpen);
  if (willOpen) select.focus();
}

function openAdminSortMenu() {
  const select = document.getElementById('adminSortSelect');
  const btn = document.getElementById('adminSortDirBtn');
  select.classList.add('show');
  if (btn) btn.classList.add('menu-open');
  select.focus();
}

function closeAdminSortMenu() {
  document.getElementById('adminSortSelect').classList.remove('show');
  const btn = document.getElementById('adminSortDirBtn');
  if (btn) btn.classList.remove('menu-open');
}

function onCheatSortChange() {
  cheatSortMode = document.getElementById('cheatSortSelect').value;
  renderCheatList();
}

function toggleCheatSortDir() {
  cheatSortDir = cheatSortDir === 'asc' ? 'desc' : 'asc';
  const btn = document.getElementById('cheatSortDirBtn');
  if (btn) btn.textContent = cheatSortDir === 'asc' ? '⬆️' : '⬇️';
  renderCheatList();
}

function toggleCheatSortMenu(event) {
  if (event) event.stopPropagation();
  const select = document.getElementById('cheatSortSelect');
  const btn = document.getElementById('cheatSortDirBtn');
  const willOpen = !select.classList.contains('show');
  select.classList.toggle('show', willOpen);
  if (btn) btn.classList.toggle('menu-open', willOpen);
  if (willOpen) select.focus();
}

function openCheatSortMenu() {
  const select = document.getElementById('cheatSortSelect');
  const btn = document.getElementById('cheatSortDirBtn');
  select.classList.add('show');
  if (btn) btn.classList.add('menu-open');
  select.focus();
}

function closeCheatSortMenu() {
  document.getElementById('cheatSortSelect').classList.remove('show');
  const btn = document.getElementById('cheatSortDirBtn');
  if (btn) btn.classList.remove('menu-open');
}

function setupSortDirButton(btnId, toggleDirFn, toggleMenuFn, openMenuFn) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  let pressTimer = null;
  let longPressFired = false;
  let clickTimer = null;

  const startPress = () => {
    longPressFired = false;
    pressTimer = setTimeout(() => {
      longPressFired = true;
      openMenuFn();
    }, 500);
  };
  const cancelPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = null;
  };

  btn.addEventListener('mousedown', startPress);
  btn.addEventListener('touchstart', startPress, { passive: true });
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => btn.addEventListener(evt, cancelPress));

  btn.addEventListener('click', () => {
    if (longPressFired) { longPressFired = false; return; }
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      return;
    }
    clickTimer = setTimeout(() => {
      clickTimer = null;
      toggleDirFn();
    }, 280);
  });
  btn.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
    toggleMenuFn();
  });
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

setupSortDirButton('adminSortDirBtn', toggleAdminSortDir, toggleAdminSortMenu, openAdminSortMenu);
setupSortDirButton('cheatSortDirBtn', toggleCheatSortDir, toggleCheatSortMenu, openCheatSortMenu);

document.addEventListener('click', (e) => {
  const adminSection = document.getElementById('adminItemsSectionWrap');
  if (adminSection && !adminSection.contains(e.target) && e.target.id !== 'adminSortSelect') closeAdminSortMenu();
  const cheatWrap = document.getElementById('cheatSortDirBtn')?.closest('.admin-search-row');
  const cheatTable = document.getElementById('cheatTableContainer');
  const insideCheatProtected = (cheatWrap && cheatWrap.contains(e.target)) || (cheatTable && cheatTable.contains(e.target));
  if (!insideCheatProtected && e.target.id !== 'cheatSortSelect') closeCheatSortMenu();
}, true);

// 搜尋欄最右側清除按鈕控制
function onAdminSearchInput() {
  const input = document.getElementById('adminItemsSearch');
  const clearBtn = document.getElementById('adminItemsSearchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = input.value.trim() !== '' ? 'flex' : 'none';
  }
  renderAdminList();
}

function clearAdminSearch() {
  const input = document.getElementById('adminItemsSearch');
  const clearBtn = document.getElementById('adminItemsSearchClearBtn');
  input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  input.focus();
  renderAdminList();
}

function onCheatSearchInput() {
  const input = document.getElementById('cheatSearchInput');
  const clearBtn = document.getElementById('cheatSearchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = input.value.trim() !== '' ? 'flex' : 'none';
  }
  renderCheatList();
}

function clearCheatSearch() {
  const input = document.getElementById('cheatSearchInput');
  const clearBtn = document.getElementById('cheatSearchClearBtn');
  input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  input.focus();
  renderCheatList();
}

function getActiveWheel() {
  return wheelsData.find(w => w.id === activeWheelId) || wheelsData[0];
}

function getActiveWheelCurrentPalette() {
  const wheel = getActiveWheel();
  const isLight = isLightMode();
  if (isLight) {
    if (!wheel.lightPalette || !Array.isArray(wheel.lightPalette) || wheel.lightPalette.length === 0) {
      wheel.lightPalette = [...DEFAULT_LIGHT_PALETTE];
    }
    return wheel.lightPalette;
  } else {
    if (!wheel.darkPalette || !Array.isArray(wheel.darkPalette) || wheel.darkPalette.length === 0) {
      wheel.darkPalette = [...DEFAULT_DARK_PALETTE];
    }
    return wheel.darkPalette;
  }
}

function saveWheels() {
  try {
    localStorage.setItem('xp_wheels_store_v1', JSON.stringify(wheelsData));
    localStorage.setItem('xp_active_wheel_id', activeWheelId);
  } catch (e) {
    nativeAlert('【除錯提示】儲存失敗：LocalStorage 容量可能已滿或遭到瀏覽器限制。');
  }
}

function saveAppConfig() {
  const isChecked = document.getElementById('autoHideCheckbox').checked;
  localStorage.setItem('xp_auto_hide_v1', isChecked);
}

document.getElementById('autoHideCheckbox').checked = autoHideConfig;

const STASH_KEY = 'xp_result_stash_text_v1';

function loadStash() {
  const textarea = document.getElementById('stashTextarea');
  textarea.value = localStorage.getItem(STASH_KEY) || '';
  updateStashCount();
}

function saveStash() {
  const textarea = document.getElementById('stashTextarea');
  try {
    localStorage.setItem(STASH_KEY, textarea.value);
  } catch (e) {
    // 忽略
  }
  updateStashCount();
}

function updateStashCount() {
  const text = document.getElementById('stashTextarea').value;
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  document.getElementById('stashCount').textContent = lines.length;
}

function appendResultToStash(item) {
  const textarea = document.getElementById('stashTextarea');
  const line = item.name;
  textarea.value = textarea.value.trim() === '' ? line : `${textarea.value}\n${line}`;
  saveStash();
  textarea.scrollTop = textarea.scrollHeight;
}

function copyStash() {
  const textarea = document.getElementById('stashTextarea');
  const text = textarea.value;
  if (!text.trim()) return showToast('目前沒有可複製的結果！');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('已複製全部結果到剪貼簿！');
    }).catch(() => {
      fallbackCopyStash(textarea);
    });
  } else {
    fallbackCopyStash(textarea);
  }
}

function fallbackCopyStash(textarea) {
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('已複製全部結果到剪貼簿！');
  } catch (e) {
    showToast('複製失敗。');
  }
  window.getSelection().removeAllRanges();
}

function resetStash() {
  const textarea = document.getElementById('stashTextarea');
  if (!textarea.value.trim()) return showToast('目前沒有暫存的結果可重置！');
  if (!confirm('確定要清空所有暫存的結果嗎？')) return;
  textarea.value = '';
  saveStash();
  showToast('暫存結果已全數清空！');
}

function updateWheelSelect() {
  const frontSelect = document.getElementById('wheelSelect');
  const adminSelect = document.getElementById('adminWheelSelect');
  
  frontSelect.innerHTML = '';
  if (adminSelect) adminSelect.innerHTML = '';

  wheelsData.forEach(w => {
    const activeItemsCount = w.items.filter(i => !i.hidden).length;
    const totalItemsCount = w.items.length;
    const countText = totalItemsCount === activeItemsCount ? `${totalItemsCount}` : `${activeItemsCount}/${totalItemsCount}`;

    const opt1 = document.createElement('option');
    opt1.value = w.id;
    opt1.textContent = `${w.title} (${countText})`;
    if (w.id === activeWheelId) opt1.selected = true;
    frontSelect.appendChild(opt1);

    if (adminSelect) {
      const opt2 = document.createElement('option');
      opt2.value = w.id;
      opt2.textContent = `${w.title} (${totalItemsCount})`;
      if (w.id === activeWheelId) opt2.selected = true;
      adminSelect.appendChild(opt2);
    }
  });
  const deleteBtn = document.getElementById('btnDeleteWheel');
  if (deleteBtn) deleteBtn.style.display = wheelsData.length > 1 ? 'inline-block' : 'none';
}

function onWheelSelectChange() {
  activeWheelId = document.getElementById('wheelSelect').value;
  saveWheels();
  drawWheel();
  initColorSettings();
  renderAdminList();
  updateWheelSelect();
}

function onAdminWheelSelectChange() {
  activeWheelId = document.getElementById('adminWheelSelect').value;
  saveWheels();
  drawWheel();
  initColorSettings();
  renderAdminList();
  updateWheelSelect();
}

let wheelNameModalMode = null;

function promptCreateWheel() {
  wheelNameModalMode = 'create';
  document.getElementById('wheelNameModalTitle').textContent = '📝 新增轉盤';
  document.getElementById('wheelNameInput').value = '自訂轉盤';
  document.getElementById('wheelNameModal').classList.add('show');
}

function renameCurrentWheel() {
  const wheel = getActiveWheel();
  wheelNameModalMode = 'rename';
  document.getElementById('wheelNameModalTitle').textContent = '📝 重新命名';
  document.getElementById('wheelNameInput').value = wheel.title;
  document.getElementById('wheelNameModal').classList.add('show');
}

function closeWheelNameModal() {
  wheelNameModalMode = null;
  document.getElementById('wheelNameModal').classList.remove('show');
}

function saveWheelNameModal() {
  const name = document.getElementById('wheelNameInput').value.trim();
  if (!name) return showToast('轉盤名稱不能為空！');

  if (wheelNameModalMode === 'create') {
    const newId = 'wheel_' + Date.now();
    wheelsData.push({
      id: newId,
      title: name,
      items: [],
      darkPalette: [...DEFAULT_DARK_PALETTE],
      lightPalette: [...DEFAULT_LIGHT_PALETTE]
    });
    activeWheelId = newId;
    saveWheels();
    updateWheelSelect();
    drawWheel();
    initColorSettings();
    renderAdminList();
    showToast(`成功建立轉盤「${name}」！`);
  } else if (wheelNameModalMode === 'rename') {
    const wheel = getActiveWheel();
    wheel.title = name;
    saveWheels();
    updateWheelSelect();
    showToast(`已重新命名為「${name}」！`);
  }

  closeWheelNameModal();
}

function deleteCurrentWheel() {
  if (wheelsData.length <= 1) return showToast('至少需保留一個轉盤！');
  const deletedWheelTitle = getActiveWheel().title;
  if (!confirm(`確定刪除轉盤「${deletedWheelTitle}」嗎？`)) return;

  wheelsData = wheelsData.filter(w => w.id !== activeWheelId);
  activeWheelId = wheelsData[0].id;
  saveWheels();
  updateWheelSelect();
  drawWheel();
  initColorSettings();
  renderAdminList();
  showToast(`已成功刪除轉盤「${deletedWheelTitle}」！`);
}

function exportCurrentWheel() {
  const wheel = getActiveWheel();
  const exportData = {
    type: 'xp_wheel_single',
    title: wheel.title,
    items: wheel.items,
    darkPalette: wheel.darkPalette,
    lightPalette: wheel.lightPalette
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${wheel.title}_題庫.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAllWheels() {
  const blob = new Blob([JSON.stringify(wheelsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `所有轉盤備份_${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCurrentColors() {
  const wheel = getActiveWheel();
  const exportData = {
    type: 'wheel_colors_single',
    title: wheel.title,
    darkPalette: wheel.darkPalette || [...DEFAULT_DARK_PALETTE],
    lightPalette: wheel.lightPalette || [...DEFAULT_LIGHT_PALETTE]
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${wheel.title}_顏色設定.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAllColors() {
  const exportData = {
    type: 'wheel_colors_all',
    wheelsColors: wheelsData.map(w => ({
      id: w.id,
      title: w.title,
      darkPalette: w.darkPalette || [...DEFAULT_DARK_PALETTE],
      lightPalette: w.lightPalette || [...DEFAULT_LIGHT_PALETTE]
    }))
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `所有轉盤顏色備份_${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function applyColorsToAllWheels() {
  const isLight = isLightMode();
  const modeName = isLight ? '日間' : '夜間';
  if (!confirm(`確定要將當前轉盤的「${modeName}模式顏色」應用到所有轉盤嗎？`)) return;

  const currentPalette = getActiveWheelCurrentPalette();
  wheelsData.forEach(w => {
    if (isLight) {
      w.lightPalette = [...currentPalette];
    } else {
      w.darkPalette = [...currentPalette];
    }
  });

  saveWheels();
  drawWheel();
  initColorSettings();
  showToast(`已成功將「${modeName}顏色」同步套用到所有轉盤！`);
}

// 暫存準備匯入的資料
let pendingImportData = null;

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const isTxt = /\.txt$/i.test(file.name);
  const reader = new FileReader();
  reader.onerror = () => {
    nativeAlert('【除錯提示】檔案讀取失敗，請檢查檔案權限或狀態。');
    e.target.value = '';
  };

  if (isTxt) {
    reader.onload = (event) => {
      try {
        const rawText = event.target.result;
        const newItems = parseTextItems(rawText);

        if (newItems.length === 0) {
          nativeAlert('【除錯提示】未能從 TXT 檔案中識別到有效項目！請確認內容是否符合「名稱,描述」或分行格式。');
          e.target.value = '';
          return;
        }

        pendingImportData = {
          type: 'txt',
          fileName: file.name.replace(/\.txt$/i, ''),
          items: newItems
        };
        showImportPreviewModal();
      } catch (err) {
        nativeAlert(`【除錯提示】TXT 檔案解析發生錯誤：${err.message}`);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
    return;
  }

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      
      // 1. 純單一轉盤顏色 (Single Colors)
      if (data.type === 'wheel_colors_single' || (data.darkPalette && data.lightPalette && !data.items)) {
        const wheel = getActiveWheel();
        if (data.darkPalette && Array.isArray(data.darkPalette)) wheel.darkPalette = [...data.darkPalette];
        if (data.lightPalette && Array.isArray(data.lightPalette)) wheel.lightPalette = [...data.lightPalette];
        saveWheels();
        initColorSettings();
        drawWheel();
        showToast(`已成功將顏色套用至當前轉盤「${wheel.title}」！`);
        e.target.value = '';
        return;
      }
      
      // 2. 全部轉盤顏色 (All Colors)
      if (data.type === 'wheel_colors_all' && Array.isArray(data.wheelsColors)) {
        data.wheelsColors.forEach(item => {
          const targetWheel = wheelsData.find(w => w.id === item.id || w.title === item.title);
          if (targetWheel) {
            if (item.darkPalette) targetWheel.darkPalette = [...item.darkPalette];
            if (item.lightPalette) targetWheel.lightPalette = [...item.lightPalette];
          }
        });
        saveWheels();
        initColorSettings();
        drawWheel();
        showToast('已成功還原所有轉盤的顏色設定！');
        e.target.value = '';
        return;
      }

      let extractedItems = [];
      let defaultTitle = file.name.replace('.json', '');

      if (Array.isArray(data) && data[0] && data[0].items) {
        extractedItems = data[0].items;
      } else if (data.items && Array.isArray(data.items)) {
        extractedItems = data.items;
      } else if (Array.isArray(data) && data[0] && data[0].name) {
        extractedItems = data;
      } else if (data.pool && Array.isArray(data.pool)) {
        extractedItems = data.pool.map(i => ({ name: i.name, desc: i.desc }));
      }

      if (extractedItems.length === 0) {
        nativeAlert('【除錯提示】JSON 檔案中找不到有效的轉盤項目結構。');
        e.target.value = '';
        return;
      }

      pendingImportData = {
        type: 'json',
        fileName: defaultTitle,
        items: extractedItems,
        fullData: data
      };
      showImportPreviewModal();

    } catch (err) {
      nativeAlert(`【除錯提示】JSON 格式錯誤或解析失敗：\n${err.message}`);
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function showImportPreviewModal() {
  if (!pendingImportData) return;
  const tbody = document.getElementById('importPreviewTableBody');
  tbody.innerHTML = '';

  const items = pendingImportData.items;
  document.getElementById('importPreviewTip').textContent = 
    `檔案「${pendingImportData.fileName}」共解析出 ${items.length} 個項目，請確認內容：`;

  items.forEach(it => {
    const tr = document.createElement('tr');
    
    const tdName = document.createElement('td');
    tdName.className = 'item-name';
    tdName.textContent = it.name;

    const tdDesc = document.createElement('td');
    tdDesc.style.color = 'var(--text-sub)';
    tdDesc.textContent = it.desc && it.desc.trim() !== '' ? it.desc : '-';

    tr.appendChild(tdName);
    tr.appendChild(tdDesc);
    tbody.appendChild(tr);
  });

  // 判斷是否為「匯入至現有轉盤」：只有 TXT 勾選合併時才會顯示去重勾選框
  const isMergeTxt = (pendingImportData.type === 'txt' && document.getElementById('txtImportMergeCurrent').checked);
  const dupLabel = document.getElementById('previewDuplicateLabel');
  if (dupLabel) {
    dupLabel.style.display = isMergeTxt ? 'inline-flex' : 'none';
  }

  document.getElementById('importPreviewModal').classList.add('show');
}

function closeImportPreviewModal() {
  pendingImportData = null;
  document.getElementById('importPreviewModal').classList.remove('show');
}

function confirmImportItems() {
  if (!pendingImportData) return;

  const skipDuplicate = document.getElementById('previewCheckDuplicate').checked;
  const wheel = getActiveWheel();
  let newItems = pendingImportData.items;

  // 判斷是否為「匯入至現有轉盤」
  const isMergeTxt = (pendingImportData.type === 'txt' && document.getElementById('txtImportMergeCurrent').checked);
  
  if (isMergeTxt) {
    // 情況 A：匯入至現有轉盤 -> 僅與「目前被選取的轉盤」比對去重
    if (skipDuplicate) {
      const currentWheelNames = new Set(wheel.items.map(it => it.name.trim().toLowerCase()));
      const filtered = [];
      newItems.forEach(it => {
        const key = it.name.trim().toLowerCase();
        if (!currentWheelNames.has(key)) {
          filtered.push({ name: it.name, desc: it.desc || '', hidden: false });
          currentWheelNames.add(key);
        }
      });
      newItems = filtered;
    } else {
      newItems = newItems.map(it => ({ name: it.name, desc: it.desc || '', hidden: false }));
    }

    wheel.items.unshift(...newItems);
    showToast(`成功匯入 ${newItems.length} 個項目到「${wheel.title}」！`);

  } else {
    // 情況 B：作為全新轉盤匯入 -> 不與任何其他轉盤比較，僅過濾該批次內部重複
    const seenInBatch = new Set();
    const filtered = [];
    newItems.forEach(it => {
      const key = it.name.trim().toLowerCase();
      if (!seenInBatch.has(key)) {
        filtered.push({ name: it.name, desc: it.desc || '', hidden: false });
        seenInBatch.add(key);
      }
    });
    newItems = filtered;

    if (pendingImportData.type === 'txt') {
      const newId = 'wheel_' + Date.now();
      wheelsData.unshift({
        id: newId,
        title: pendingImportData.fileName,
        items: newItems,
        darkPalette: [...DEFAULT_DARK_PALETTE],
        lightPalette: [...DEFAULT_LIGHT_PALETTE]
      });
      activeWheelId = newId;
      showToast(`成功建立新轉盤「${pendingImportData.fileName}」，共 ${newItems.length} 個項目！`);
    } else {
      const data = pendingImportData.fullData;
      if (Array.isArray(data) && data[0] && data[0].id && data[0].items) {
        data.forEach(importedWheel => {
          importedWheel.id = 'wheel_' + Date.now() + Math.random().toString(36).substring(2, 7);
          if (!importedWheel.darkPalette) importedWheel.darkPalette = [...DEFAULT_DARK_PALETTE];
          if (!importedWheel.lightPalette) importedWheel.lightPalette = [...DEFAULT_LIGHT_PALETTE];
          wheelsData.unshift(importedWheel);
        });
        activeWheelId = wheelsData[0].id;
        showToast(`成功匯入 ${data.length} 個轉盤！`);
      } else {
        const newId = 'wheel_' + Date.now();
        wheelsData.unshift({
          id: newId,
          title: pendingImportData.fileName,
          items: newItems.length > 0 ? newItems : pendingImportData.items,
          darkPalette: data.darkPalette || [...DEFAULT_DARK_PALETTE],
          lightPalette: data.lightPalette || [...DEFAULT_LIGHT_PALETTE]
        });
        activeWheelId = newId;
        showToast(`成功匯入轉盤「${pendingImportData.fileName}」！`);
      }
    }
  }

  saveWheels();
  updateWheelSelect();
  drawWheel();
  initColorSettings();
  renderAdminList();
  closeImportPreviewModal();
}

function normalizeHexInput(input) {
  if (!input) return '';
  let str = input.toUpperCase().trim();
  let hasHash = str.startsWith('#');
  let pureHex = str.replace(/[^0-9A-F]/g, '').slice(0, 6);
  return hasHash ? ('#' + pureHex) : pureHex;
}

function initColorSettings() {
  const palette = getActiveWheelCurrentPalette();
  const container = document.getElementById('colorSettingsContainer');
  const countLabel = document.getElementById('colorCountLabel');
  const modeLabel = document.getElementById('currentModeLabel');
  const addBtn = document.getElementById('btnAddColor');
  const isLight = isLightMode();

  if (countLabel) countLabel.textContent = palette.length;
  if (modeLabel) modeLabel.textContent = isLight ? '日間' : '夜間';
  if (addBtn) addBtn.style.display = palette.length >= 10 ? 'none' : 'flex';

  container.innerHTML = '';
  
  const leftColIndices = [];
  const rightColIndices = [];

  for (let i = 0; i < palette.length; i++) {
    if (i % 2 === 0) leftColIndices.push(i);
    else rightColIndices.push(i);
  }
  
  const createColorGroup = (indices) => {
    const groupDiv = document.createElement('div');
    groupDiv.style.flex = '1';
    groupDiv.style.minWidth = '0';
    groupDiv.style.display = 'flex';
    groupDiv.style.flexDirection = 'column';
    groupDiv.style.gap = '8px';
    
    indices.forEach((index) => {
      let color = palette[index];
      if (!color.startsWith('#')) color = '#' + color;
      const displayHex = color.toUpperCase();
      const itemDiv = document.createElement('div');
      itemDiv.style.display = 'flex';
      itemDiv.style.alignItems = 'center';
      itemDiv.style.gap = '4px';
      itemDiv.style.width = '100%';
      
      const delButtonHtml = palette.length > 1 
        ? `<button class="btn-color-del" title="刪除此顏色" onclick="deletePaletteColor(${index})">✕</button>` 
        : '';

      itemDiv.innerHTML = `
        <div id="colorPreview_${index}" style="width: 38px; height: 38px; background: ${displayHex}; border: 1.5px solid var(--border-card); border-radius: 6px; flex-shrink: 0; box-sizing: border-box;"></div>
        <input type="text" 
               value="${displayHex}" 
               placeholder="#EC4899" 
               maxlength="7"
               oninput="this.value = normalizeHexInput(this.value);" 
               onchange="updateWheelPaletteColor(${index}, this.value, this);" 
               style="flex: 1; min-width: 0; height: 38px; box-sizing: border-box; background: var(--bar-bg); border: 1px solid var(--border-card); color: var(--text-main); padding: 0 8px; border-radius: 6px; font-size: 0.875rem; font-family: monospace; text-transform: uppercase;">
        ${delButtonHtml}
      `;
      groupDiv.appendChild(itemDiv);
    });
    return groupDiv;
  };
  
  container.appendChild(createColorGroup(leftColIndices));
  if (rightColIndices.length > 0) {
    container.appendChild(createColorGroup(rightColIndices));
  }
}

function addNewPaletteColor() {
  const palette = getActiveWheelCurrentPalette();
  if (palette.length >= 10) return showToast('轉盤顏色最多設定 10 個！');

  const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  palette.push(randomHex);
  saveWheels();
  initColorSettings();
  drawWheel();
  showToast('已新增顏色！');
}

function deletePaletteColor(index) {
  const palette = getActiveWheelCurrentPalette();
  if (palette.length <= 1) return showToast('轉盤至少需要保留 1 個顏色！');

  palette.splice(index, 1);
  saveWheels();
  initColorSettings();
  drawWheel();
  showToast('已移除顏色！');
}

function updateWheelPaletteColor(index, value, inputEl) {
  const cleanHex = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (cleanHex.length !== 6) {
    nativeAlert('【除錯提示】請輸入完整的 6 碼十六進制色號！');
    initColorSettings();
    return;
  }
  
  const fullHex = '#' + cleanHex;
  const palette = getActiveWheelCurrentPalette();
  palette[index] = fullHex;
  saveWheels();

  if (inputEl) inputEl.value = fullHex;
  const previewBox = document.getElementById(`colorPreview_${index}`);
  if (previewBox) previewBox.style.background = fullHex;

  drawWheel();
}

function resetColorsToDefault() {
  const isLight = isLightMode();
  const modeName = isLight ? '日間' : '夜間';
  if (!confirm(`確定要重置目前轉盤「${modeName}」的顏色為預設值嗎？`)) return;
  const wheel = getActiveWheel();
  if (isLight) wheel.lightPalette = [...DEFAULT_LIGHT_PALETTE];
  else wheel.darkPalette = [...DEFAULT_DARK_PALETTE];
  saveWheels();
  initColorSettings();
  drawWheel();
  showToast(`已重置「${modeName}」顏色為預設！`);
}

function getWheelSliceLayout(wheel) {
  const visibleData = wheel.items
    .map((item, index) => ({ item, originalIndex: index }))
    .filter(x => !x.item.hidden);

  const total = visibleData.length;
  const weights = visibleData.map(x => (x.item.weight && x.item.weight > 0) ? x.item.weight : 1);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const useWeightedVisual = isCheatVisualEnabled();

  let cursorDeg = 0;
  return visibleData.map((x, i) => {
    const fraction = useWeightedVisual ? (weights[i] / totalWeight) : (1 / total);
    const sliceDeg = fraction * 360;
    const startDeg = cursorDeg;
    cursorDeg += sliceDeg;
    return { item: x.item, originalIndex: x.originalIndex, startDeg, sliceDeg, weight: weights[i] };
  });
}

function drawWheel() {
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const wheel = getActiveWheel();
  const palette = getActiveWheelCurrentPalette();
  const layout = getWheelSliceLayout(wheel);
  const total = layout.length;

  const wheelTextColor = getComputedStyle(document.documentElement).getPropertyValue('--wheel-text').trim() || '#ffffff';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 16;

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1e24';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2e2e38';
    ctx.stroke();

    ctx.fillStyle = '#6b7280';
    ctx.font = `bold 28px ${UI_FONT_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('轉盤目前沒有可顯示的項目', centerX, centerY);
    return;
  }

  for (let i = 0; i < total; i++) {
    const angle = (layout[i].startDeg * Math.PI) / 180;
    const arcSize = (layout[i].sliceDeg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
    ctx.closePath();

    ctx.fillStyle = palette[i % palette.length];
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(18, 18, 20, 0.4)';
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = wheelTextColor;

    const sliceDeg = layout[i].sliceDeg;
    let fontSize = 28;
    let maxChars = 7;
    let textRadiusOffset = 28;

    if (sliceDeg < 10) {
      fontSize = 14;
      maxChars = 4;
      textRadiusOffset = 42;
    } else if (sliceDeg < 18) {
      fontSize = 18;
      maxChars = 5;
      textRadiusOffset = 36;
    } else if (sliceDeg < 25) {
      fontSize = 22;
      maxChars = 6;
      textRadiusOffset = 32;
    }

    ctx.font = `bold ${fontSize}px ${UI_FONT_STACK}`;

    let text = layout[i].item.name;
    if (text.length > maxChars) {
      text = text.substring(0, maxChars - 1) + '…';
    }
    ctx.fillText(text, radius - textRadiusOffset, 0);
    ctx.restore();
  }
}

function pickWeightedIndex(weights) {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

let guideModalActionType = 'empty';

function showGuideModal(type) {
  guideModalActionType = type;
  const modal = document.getElementById('guideModal');
  const titleEl = document.getElementById('guideModalTitle');
  const descEl = document.getElementById('guideModalDesc');
  const btnEl = document.getElementById('guideModalBtn');
  const iconEl = document.getElementById('guideModalIcon');

  if (type === 'empty') {
    iconEl.textContent = '🎡';
    titleEl.textContent = '這個轉盤目前沒有可用的項目';
    descEl.textContent = '趕快新增一些選項，或者到後台解除隱藏吧！';
    btnEl.textContent = '前往後台管理';
  } else if (type === 'lessThanTwo') {
    iconEl.textContent = '⚠️';
    titleEl.textContent = '項目數量不足';
    descEl.textContent = '至少需要 2 個「顯示中」項目才能開始！\n請至後台解除隱藏或新增項目。';
    btnEl.textContent = '前往後台管理';
  }

  modal.classList.add('show');
}

function closeGuideModal() {
  document.getElementById('guideModal').classList.remove('show');
  if (guideModalActionType === 'empty' || guideModalActionType === 'lessThanTwo') {
    openAdminView();
  }
}

function spinWheel() {
  const wheel = getActiveWheel();
  const visibleItems = wheel.items.filter(item => !item.hidden);

  if (visibleItems.length === 0) {
    showGuideModal('empty');
    return;
  }

  const layout = getWheelSliceLayout(wheel);

  if (layout.length < 2) {
    showGuideModal('lessThanTwo');
    return;
  }
  if (isSpinning) return;

  isSpinning = true;
  document.getElementById('spinBtn').disabled = true;

  const weights = layout.map(x => x.weight);
  const winningIndex = pickWeightedIndex(weights);
  const winnerSlice = layout[winningIndex];

  const targetDegCenter = winnerSlice.startDeg + winnerSlice.sliceDeg / 2;

  const extraRounds = 360 * (6 + Math.floor(Math.random() * 3));
  const targetRotation = extraRounds + (270 - targetDegCenter);

  const finalAngle = currentDegree + (targetRotation - (currentDegree % 360)) + (360 * 5);
  currentDegree = finalAngle;

  const canvas = document.getElementById('wheelCanvas');
  canvas.style.transform = `rotate(${finalAngle}deg)`;

  setTimeout(() => {
    isSpinning = false;
    document.getElementById('spinBtn').disabled = false;

    playWinSound();
    triggerHaptic('win');

    showResultModal(winnerSlice.item, winnerSlice.originalIndex);
    appendResultToStash(winnerSlice.item);

    if (document.getElementById('autoHideCheckbox').checked) {
      wheel.items[winnerSlice.originalIndex].hidden = true;
      saveWheels();
      drawWheel();
      updateWheelSelect();
    }

  }, 4100);
}

let currentResultOriginalIndex = null;

function showResultModal(item, originalIndex) {
  currentResultOriginalIndex = originalIndex;
  document.getElementById('modalResultName').textContent = item.name;
  
  const descEl = document.getElementById('modalResultDesc');
  if (item.desc && item.desc.trim() !== '') {
    descEl.textContent = item.desc;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }
  
  document.getElementById('resultModal').classList.add('show');
}

function closeResultModal() {
  document.getElementById('resultModal').classList.remove('show');
}

function hideResultItem() {
  if (currentResultOriginalIndex === null) {
    closeResultModal();
    return;
  }

  const wheel = getActiveWheel();
  const item = wheel.items[currentResultOriginalIndex];
  if (item) {
    item.hidden = true;
    saveWheels();
    drawWheel();
    updateWheelSelect();
    showToast(`已隱藏「${item.name}」！`);
  }

  closeResultModal();
}

function addSingleItem() {
  const nameInput = document.getElementById('singleName');
  const descInput = document.getElementById('singleDesc');
  const name = nameInput.value.trim();
  const desc = descInput.value.trim();

  if (!name) return showToast('請輸入項目名稱！');

  const wheel = getActiveWheel();
  wheel.items.unshift({ name, desc, hidden: false });
  saveWheels();

  nameInput.value = '';
  descInput.value = '';
  renderAdminList();
  updateWheelSelect();
  drawWheel();
  showToast(`已新增項目「${name}」！`);
}

function parseSingleLine(line) {
  const commaIndex = line.indexOf(',');
  let name, desc;
  if (commaIndex === -1) {
    name = line.trim();
    desc = '';
  } else {
    name = line.slice(0, commaIndex).trim();
    desc = line.slice(commaIndex + 1).trim();
  }
  return name ? { name, desc, hidden: false } : null;
}

function parseTextItems(rawText) {
  const blocks = rawText.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);
  const items = [];

  if (blocks.length > 1) {
    blocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) return;

      if (lines.length === 2) {
        items.push({ name: lines[0], desc: lines[1], hidden: false });
      } else {
        lines.forEach(line => {
          const parsed = parseSingleLine(line);
          if (parsed) items.push(parsed);
        });
      }
    });
  } else {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    lines.forEach(line => {
      const parsed = parseSingleLine(line);
      if (parsed) items.push(parsed);
    });
  }

  return items;
}

function findDuplicateItemNames(newItems, existingItems) {
  const existingNames = new Set(existingItems.map(it => it.name.trim().toLowerCase()));
  const seenInBatch = new Set();
  const dupSet = new Set();
  newItems.forEach(it => {
    const key = it.name.trim().toLowerCase();
    if (existingNames.has(key) || seenInBatch.has(key)) {
      dupSet.add(it.name.trim());
    }
    seenInBatch.add(key);
  });
  return Array.from(dupSet);
}

function addBatchItems() {
  const rawText = document.getElementById('batchText').value;
  if (!rawText.trim()) return showToast('請填寫批量匯入文字！');

  let newItems = parseTextItems(rawText);
  if (newItems.length === 0) return showToast('未能識別到有效項目！');

  const wheel = getActiveWheel();
  let skippedCount = 0;

  const checkDuplicate = document.getElementById('batchCheckDuplicate').checked;
  if (checkDuplicate) {
    const dupNames = findDuplicateItemNames(newItems, wheel.items);
    if (dupNames.length > 0) {
      const preview = dupNames.slice(0, 10).join('、') + (dupNames.length > 10 ? ` 等共 ${dupNames.length} 個` : '');
      const keepDup = confirm(`偵測到 ${dupNames.length} 個重複項目：\n${preview}\n\n是否仍要一起匯入這些重複項目？\n（選擇「取消」將只匯入不重複的項目）`);
      if (!keepDup) {
        const dupKeySet = new Set(dupNames.map(n => n.toLowerCase()));
        const filtered = newItems.filter(it => !dupKeySet.has(it.name.trim().toLowerCase()));
        skippedCount = newItems.length - filtered.length;
        newItems = filtered;
        if (newItems.length === 0) {
          return showToast('所有項目皆為重複項目，已取消匯入。');
        }
      }
    }
  }

  wheel.items.unshift(...newItems);
  saveWheels();

  document.getElementById('batchText').value = '';
  renderAdminList();
  updateWheelSelect();
  drawWheel();
  showToast(skippedCount > 0
    ? `成功匯入 ${newItems.length} 個項目！（已略過 ${skippedCount} 個重複）`
    : `成功匯入 ${newItems.length} 個項目！`);
}

function toggleItemVisibility(index) {
  const wheel = getActiveWheel();
  wheel.items[index].hidden = !wheel.items[index].hidden;
  saveWheels();
  renderAdminList();
  updateWheelSelect();
  drawWheel();
}

function unhideAllItems() {
  const wheel = getActiveWheel();
  const searchInputVal = document.getElementById('adminItemsSearch').value;
  
  const targetIndices = [];
  wheel.items.forEach((item, index) => {
    if (item.hidden && itemMatchesSearch(item, searchInputVal)) {
      targetIndices.push(index);
    }
  });

  if (targetIndices.length === 0) {
    return showToast('目前沒有符合條件的已隱藏項目！');
  }

  if (!confirm(`確定要取消隱藏這 ${targetIndices.length} 個項目嗎？`)) return;

  targetIndices.forEach(idx => {
    wheel.items[idx].hidden = false;
  });

  saveWheels();
  renderAdminList();
  updateWheelSelect();
  drawWheel();
  showToast(`已將 ${targetIndices.length} 個項目恢復顯示！`);
}

function batchDeleteHiddenItems() {
  const wheel = getActiveWheel();
  const searchInputVal = document.getElementById('adminItemsSearch').value;
  
  const hiddenMatchedIndices = [];
  wheel.items.forEach((item, index) => {
    if (item.hidden && itemMatchesSearch(item, searchInputVal)) {
      hiddenMatchedIndices.push(index);
    }
  });

  if (hiddenMatchedIndices.length === 0) {
    return showToast('目前沒有符合條件的已隱藏項目！');
  }

  if (!confirm(`確定要刪除這 ${hiddenMatchedIndices.length} 個已隱藏項目嗎？`)) return;

  wheel.items = wheel.items.filter((item, index) => !hiddenMatchedIndices.includes(index));

  saveWheels();
  renderAdminList();
  updateWheelSelect();
  drawWheel();
  showToast(`已成功刪除 ${hiddenMatchedIndices.length} 個項目！`);
}

function itemMatchesSearch(item, term) {
  if (!term) return true;
  const needle = term.trim().toLowerCase();
  if (!needle) return true;
  return item.name.toLowerCase().includes(needle) || (item.desc || '').toLowerCase().includes(needle);
}

function renderAdminList() {
  const wheel = getActiveWheel();
  const sharedSearch = document.getElementById('adminItemsSearch').value;
  const visibleSearch = sharedSearch;
  const hiddenSearch = sharedSearch;
  const visibleItems = [];
  const hiddenItems = [];

  wheel.items.forEach((item, index) => {
    if (item.hidden) hiddenItems.push({ item, index });
    else visibleItems.push({ item, index });
  });

  document.getElementById('adminVisibleCount').textContent = visibleItems.length;
  document.getElementById('adminHiddenCount').textContent = hiddenItems.length;

  const filteredVisible = sortIndexedItems(visibleItems.filter(({ item }) => itemMatchesSearch(item, visibleSearch)), adminSortMode, adminSortDir);
  const filteredHidden = sortIndexedItems(hiddenItems.filter(({ item }) => itemMatchesSearch(item, hiddenSearch)), adminSortMode, adminSortDir);

  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';

  if (filteredVisible.length === 0) {
    const emptyMsg = visibleItems.length === 0 ? '目前沒有顯示中的項目' : '沒有符合搜尋條件的項目';
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.cssText = 'text-align:center; color:var(--text-muted); padding:16px;';
    td.textContent = emptyMsg;
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    filteredVisible.forEach(({ item, index }) => {
      const tr = document.createElement('tr');

      const tdChk = document.createElement('td');
      tdChk.style.textAlign = 'center';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = true;
      chk.style.cssText = 'cursor:pointer; accent-color:var(--primary);';
      chk.onchange = function() { toggleItemVisibility(index); };
      tdChk.appendChild(chk);

      const tdName = document.createElement('td');
      tdName.className = 'item-name';
      tdName.textContent = item.name;

      const tdDesc = document.createElement('td');
      tdDesc.style.color = 'var(--text-sub)';
      if (item.desc && item.desc.trim() !== '') {
        tdDesc.textContent = item.desc;
      } else {
        const span = document.createElement('span');
        span.style.color = 'var(--text-muted)';
        span.textContent = '-';
        tdDesc.appendChild(span);
      }

      const tdAction = document.createElement('td');
      tdAction.style.textAlign = 'right';
      const actionDiv = document.createElement('div');
      actionDiv.style.cssText = 'display:flex; flex-direction:column; gap:4px; align-items:flex-end;';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-sm-edit';
      btnEdit.textContent = '編輯';
      btnEdit.onclick = function() { editItem(index); };

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-sm-del';
      btnDel.textContent = '刪除';
      btnDel.onclick = function() { deleteItem(index); };

      actionDiv.appendChild(btnEdit);
      actionDiv.appendChild(btnDel);
      tdAction.appendChild(actionDiv);

      tr.appendChild(tdChk);
      tr.appendChild(tdName);
      tr.appendChild(tdDesc);
      tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });
  }

  const hiddenTbody = document.getElementById('adminHiddenTableBody');
  hiddenTbody.innerHTML = '';

  if (filteredHidden.length === 0) {
    const emptyMsg = hiddenItems.length === 0 ? '目前沒有隱藏的項目' : '沒有符合搜尋條件的項目';
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.cssText = 'text-align:center; color:var(--text-muted); padding:16px;';
    td.textContent = emptyMsg;
    tr.appendChild(td);
    hiddenTbody.appendChild(tr);
  } else {
    filteredHidden.forEach(({ item, index }) => {
      const tr = document.createElement('tr');
      tr.classList.add('row-hidden');

      const tdChk = document.createElement('td');
      tdChk.style.textAlign = 'center';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.style.cssText = 'cursor:pointer; accent-color:var(--primary);';
      chk.onchange = function() { toggleItemVisibility(index); };
      tdChk.appendChild(chk);

      const tdName = document.createElement('td');
      tdName.className = 'item-name';
      tdName.textContent = item.name;

      const tdDesc = document.createElement('td');
      tdDesc.style.color = 'var(--text-sub)';
      if (item.desc && item.desc.trim() !== '') {
        tdDesc.textContent = item.desc;
      } else {
        const span = document.createElement('span');
        span.style.color = 'var(--text-muted)';
        span.textContent = '-';
        tdDesc.appendChild(span);
      }

      const tdAction = document.createElement('td');
      tdAction.style.textAlign = 'right';
      const actionDiv = document.createElement('div');
      actionDiv.style.cssText = 'display:flex; flex-direction:column; gap:4px; align-items:flex-end;';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn-sm-edit';
      btnEdit.textContent = '編輯';
      btnEdit.onclick = function() { editItem(index); };

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-sm-del';
      btnDel.textContent = '刪除';
      btnDel.onclick = function() { deleteItem(index); };

      actionDiv.appendChild(btnEdit);
      actionDiv.appendChild(btnDel);
      tdAction.appendChild(actionDiv);

      tr.appendChild(tdChk);
      tr.appendChild(tdName);
      tr.appendChild(tdDesc);
      tr.appendChild(tdAction);
      hiddenTbody.appendChild(tr);
    });
  }
}

let editingItemIndex = null;

function editItem(index) {
  const wheel = getActiveWheel();
  const item = wheel.items[index];
  if (!item) return;

  editingItemIndex = index;
  document.getElementById('editItemName').value = item.name;
  document.getElementById('editItemDesc').value = item.desc || '';
  document.getElementById('editItemModal').classList.add('show');
}

function closeEditItemModal() {
  editingItemIndex = null;
  document.getElementById('editItemModal').classList.remove('show');
}

function saveEditItemModal() {
  if (editingItemIndex === null) return closeEditItemModal();

  const newName = document.getElementById('editItemName').value.trim();
  if (!newName) return showToast('名稱不能為空！');
  const newDesc = document.getElementById('editItemDesc').value.trim();

  const wheel = getActiveWheel();
  const item = wheel.items[editingItemIndex];
  if (item) {
    item.name = newName;
    item.desc = newDesc;
    saveWheels();
    renderAdminList();
    updateWheelSelect();
    drawWheel();
    showToast(`已儲存「${newName}」！`);
  }

  closeEditItemModal();
}

function deleteItem(index) {
  const wheel = getActiveWheel();
  const item = wheel.items[index];
  if (!confirm(`確定刪除項目「${item.name}」嗎？`)) return;

  const deletedName = item.name;
  wheel.items.splice(index, 1);
  saveWheels();
  renderAdminList();
  updateWheelSelect();
  drawWheel();
  showToast(`已成功刪除「${deletedName}」！`);
}

applyTheme();
updateWheelSelect();
initColorSettings();
drawWheel();
loadStash();

if (!history.state) {
  history.replaceState({ view: 'frontView' }, '', '#frontView');
}
