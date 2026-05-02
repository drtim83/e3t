// ── Rate Card Data ────────────────────────────────────────────────────────────
let RATE_CARD = [
    { code: '00S36F', title: 'Technology Consultant I',    category: 'Technology',   list: 90.10,  cost: 41.50 },
    { code: '00S36G', title: 'Technology Consultant II',   category: 'Technology',   list: 137.80, cost: 70.17 },
    { code: '00S36H', title: 'Technology Consultant III',  category: 'Technology',   list: 180.20, cost: 99.95 },
    { code: '00S36I', title: 'Technology Consultant IV',   category: 'Technology',   list: 302.10, cost: 155.22 },
    { code: '00S36J', title: 'Technology Consultant V',    category: 'Technology',   list: 371.00, cost: 213.57 },
    { code: '00S44F', title: 'Business Consulting I',      category: 'Consulting',   list: 90.10,  cost: 41.50 },
    { code: '00S44G', title: 'Business Consulting II',     category: 'Consulting',   list: 137.80, cost: 70.17 },
    { code: '00S44H', title: 'Business Consulting III',    category: 'Consulting',   list: 180.20, cost: 99.95 },
    { code: '00S44I', title: 'Business Consulting IV',     category: 'Consulting',   list: 302.10, cost: 155.22 },
    { code: '00S44J', title: 'Business Consulting V',      category: 'Consulting',   list: 371.00, cost: 213.57 },
    { code: '00S44K', title: 'Business Consulting VI',     category: 'Consulting',   list: 450.50, cost: 214.58 },
    { code: '00S46F', title: 'Svc Info Developer I',       category: 'Development',  list: 90.10,  cost: 41.50 },
    { code: '00S46G', title: 'Svc Info Developer II',      category: 'Development',  list: 137.80, cost: 70.17 },
    { code: '00S46H', title: 'Svc Info Developer III',     category: 'Development',  list: 180.20, cost: 99.95 },
    { code: '00S46I', title: 'Svc Info Developer IV',      category: 'Development',  list: 302.10, cost: 155.22 },
    { code: '00S46J', title: 'Svc Info Developer V',       category: 'Development',  list: 371.00, cost: 213.57 },
    { code: '00S37H', title: 'Info Systems Architect III', category: 'Architecture', list: 192.81, cost: 99.95 },
];

// ── Sample Effort Data ────────────────────────────────────────────────────────
const TC2 = [1.0,1.0,11.0,22.0,36.0,40.0,35.0,14.5,10.5,10.5,4.5,4.5,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,5.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0,4.0];
const TC3 = [1.5,3.0,6.0,7.0,9.0,9.0,7.0,4.0,5.0,5.0,4.0,3.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,2.0,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5];

const SAMPLE_RESOURCES = [
    { name: 'Team — TC Level II',    code: '00S36G', effort: [...TC2] },
    { name: 'Team — TC Level III',   code: '00S36H', effort: [...TC3] },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Default Forex Rates ──────────────────────────────────────────────────────
const DEFAULT_FOREX = [
    { code: 'MYR', name: 'Malaysian Ringgit', rate: 1.0000 },
    { code: 'USD', name: 'US Dollar',         rate: 0.2245 },
    { code: 'SGD', name: 'Singapore Dollar',  rate: 0.3010 },
    { code: 'GBP', name: 'British Pound',     rate: 0.1785 },
    { code: 'EUR', name: 'Euro',              rate: 0.2085 },
];

// ── Application State ─────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
    customerName: 'Affin Bank',
    projectName: 'Data Lake & EDW Implementation',
    projectId: 'OPX-0020000290',
    contractType: 'Fixed Price (FP)',
    currency: 'MYR',
    startDate: '2019-10-01',
    duration: 60,
    hoursPerMonth: 146,
    riskReserve: 0.05,
    globalDiscount: 0.00,
    globalAllowance: 0.0866,
};

let state = {
    config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
    resources: [],
    visibleMonths: 60,
    rcSelected: new Set(),
    rpSelected: new Set(),
    forex: JSON.parse(JSON.stringify(DEFAULT_FOREX)),
    selectedForex: 'USD',
    displayCurrency: 'MYR',
    secondaryCurrency: 'MYR',
};

let currentProject = null; // null = unsaved new project
let modalMode = 'add'; // 'add' or 'edit'
let modalEditIdx = -1;
let pendingLoadProject = null; // project name waiting for confirmation

const STORAGE_KEY = 'e3t_projects';

// ── Project Persistence (localStorage) ────────────────────────────────────────
function getProjectList() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
}

function saveProject(name) {
    const projects = getProjectList();
    projects[name] = {
        config: state.config,
        rateCard: RATE_CARD,
        resources: state.resources,
        visibleMonths: state.visibleMonths,
        forex: state.forex,
        selectedForex: state.selectedForex,
        savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    currentProject = name;
    renderProjectSelector();
    showToast('Project saved: ' + name);
}

function loadProject(name) {
    const projects = getProjectList();
    const proj = projects[name];
    if (!proj) return;

    state.config = JSON.parse(JSON.stringify(proj.config));
    RATE_CARD.length = 0;
    proj.rateCard.forEach(rc => RATE_CARD.push(rc));
    state.resources = proj.resources.map(r => ({
        name: r.name,
        code: r.code,
        effort: r.effort ? [...r.effort] : new Array(60).fill(null),
    }));
    state.visibleMonths = proj.visibleMonths || 60;
    state.forex = proj.forex ? JSON.parse(JSON.stringify(proj.forex)) : JSON.parse(JSON.stringify(DEFAULT_FOREX));
    state.selectedForex = proj.selectedForex || 'USD';
    state.rcSelected = new Set();
    state.rpSelected = new Set();

    currentProject = name;
    document.getElementById('visible-months').value = state.visibleMonths;

    bindConfig();
    recalcAll();
    renderProjectSelector();
    showToast('Loaded: ' + name);
}

function deleteProject(name) {
    const projects = getProjectList();
    delete projects[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    if (currentProject === name) currentProject = null;
    renderProjectSelector();
    showToast('Deleted: ' + name);
}

function renderProjectSelector() {
    const sel = document.getElementById('project-select');
    const projects = getProjectList();
    const names = Object.keys(projects).sort();

    sel.innerHTML = '<option value="">— New Project —</option>';
    names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        const d = new Date(projects[n].savedAt);
        const label = n + '  (' + d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ')';
        opt.textContent = label;
        if (n === currentProject) opt.selected = true;
        sel.appendChild(opt);
    });

    document.getElementById('project-delete').disabled = !currentProject;
}

function hasChanges() {
    if (!currentProject) {
        const def = JSON.stringify(DEFAULT_CONFIG);
        const cur = JSON.stringify(state.config);
        if (cur !== def) return true;
        if (state.resources.some(r => r.code || r.name)) return true;
        return false;
    }
    return true;
}

function tryLoadProject(name) {
    if (hasChanges()) {
        pendingLoadProject = name;
        document.getElementById('loadconfirm-overlay').classList.remove('hidden');
    } else {
        loadProject(name);
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ── New / Save / Save As ──────────────────────────────────────────────────────
document.getElementById('btn-new').addEventListener('click', () => {
    if (hasChanges()) {
        pendingLoadProject = null;
        document.getElementById('loadconfirm-overlay').classList.remove('hidden');
        document.querySelector('#loadconfirm-overlay .modal-body p').textContent =
            'You have unsaved changes. Starting a new project will discard them.';
        document.querySelector('#loadconfirm-overlay .modal-body p:last-of-type').textContent =
            'Would you like to save first?';
    } else {
        resetToNew();
    }
});

function resetToNew() {
    state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    initState();
    state.rcSelected = new Set();
    state.rpSelected = new Set();
    state.forex = JSON.parse(JSON.stringify(DEFAULT_FOREX));
    state.selectedForex = 'USD';
    fxSelected.clear();
    currentProject = null;
    document.getElementById('visible-months').value = 60;
    bindConfig();
    renderRateCard();
    recalcAll();
    renderProjectSelector();
}

document.getElementById('btn-save').addEventListener('click', () => {
    if (currentProject) {
        saveProject(currentProject);
    } else {
        openSaveAsModal();
    }
});

document.getElementById('btn-saveas').addEventListener('click', openSaveAsModal);

function openSaveAsModal(existingName) {
    const overlay = document.getElementById('saveas-overlay');
    overlay.classList.remove('hidden');
    const nameInput = document.getElementById('saveas-name');
    nameInput.value = existingName || (currentProject ? currentProject : state.config.projectName || '');
    nameInput.focus();
    nameInput.select();
    checkSaveAsConflict();
}

function checkSaveAsConflict() {
    const name = document.getElementById('saveas-name').value.trim();
    const projects = getProjectList();
    document.getElementById('saveas-warning').classList.toggle('hidden', !projects[name] || name === currentProject);
}

document.getElementById('saveas-name').addEventListener('input', checkSaveAsConflict);

document.getElementById('saveas-close').addEventListener('click', () => {
    document.getElementById('saveas-overlay').classList.add('hidden');
});

document.getElementById('saveas-cancel').addEventListener('click', () => {
    document.getElementById('saveas-overlay').classList.add('hidden');
});

document.getElementById('saveas-confirm').addEventListener('click', () => {
    const name = document.getElementById('saveas-name').value.trim();
    if (!name) { alert('Please enter a project name.'); return; }
    document.getElementById('saveas-overlay').classList.add('hidden');
    saveProject(name);
});

// Load confirmation modal
document.getElementById('loadconfirm-close').addEventListener('click', () => {
    document.getElementById('loadconfirm-overlay').classList.add('hidden');
    pendingLoadProject = null;
});

document.getElementById('loadconfirm-cancel').addEventListener('click', () => {
    document.getElementById('loadconfirm-overlay').classList.add('hidden');
    pendingLoadProject = null;
});

document.getElementById('loadconfirm-discard').addEventListener('click', () => {
    document.getElementById('loadconfirm-overlay').classList.add('hidden');
    if (pendingLoadProject) {
        loadProject(pendingLoadProject);
    } else {
        resetToNew();
    }
    pendingLoadProject = null;
});

let deferAction = null;

document.getElementById('loadconfirm-save').addEventListener('click', () => {
    document.getElementById('loadconfirm-overlay').classList.add('hidden');
    const target = pendingLoadProject;
    const isNew = pendingLoadProject === null;

    if (currentProject) {
        saveProject(currentProject);
        if (isNew) resetToNew();
        else if (target) loadProject(target);
    } else {
        deferAction = isNew ? 'new' : 'load';
        document.getElementById('saveas-overlay').classList.remove('hidden');
        document.getElementById('saveas-name').value = state.config.projectName || '';
        document.getElementById('saveas-name').focus();
    }
    pendingLoadProject = null;
});

// When Save As is confirmed via the load-confirm flow
let pendingLoadAction = null; // 'load' or 'new'
const origSaveAsConfirm = document.getElementById('saveas-confirm');

document.getElementById('saveas-confirm').addEventListener('click', () => {
    const name = document.getElementById('saveas-name').value.trim();
    if (!name) { alert('Please enter a project name.'); return; }
    document.getElementById('saveas-overlay').classList.add('hidden');
    saveProject(name);
    if (deferAction === 'load' && pendingLoadProject) {
        loadProject(pendingLoadProject);
        pendingLoadProject = null;
        deferAction = null;
    } else if (deferAction === 'new') {
        resetToNew();
        deferAction = null;
    }
});

// Project selector
document.getElementById('project-select').addEventListener('change', (e) => {
    const name = e.target.value;
    if (!name) {
        if (hasChanges()) {
            pendingLoadProject = null;
            document.getElementById('loadconfirm-overlay').classList.remove('hidden');
            document.querySelector('#loadconfirm-overlay .modal-body p').textContent =
                'You have unsaved changes. Starting a new project will discard them.';
        } else {
            resetToNew();
        }
    } else {
        tryLoadProject(name);
    }
});

// Delete project button
document.getElementById('project-delete').addEventListener('click', () => {
    if (!currentProject) return;
    if (confirm('Delete saved project "' + currentProject + '"? This cannot be undone.')) {
        deleteProject(currentProject);
    }
});

// ── Initialize with sample resources ──────────────────────────────────────────
function initState() {
    state.resources = SAMPLE_RESOURCES.map(s => ({
        name: s.name,
        code: s.code,
        effort: s.effort.map(v => v === 0 ? null : v),
    }));
    for (let i = 0; i < 18; i++) {
        state.resources.push({ name: '', code: '', effort: new Array(60).fill(null) });
    }
}

// ── Utility Functions ─────────────────────────────────────────────────────────
function fmtMYR(n) {
    if (n === null || isNaN(n) || n === 0) return '-';
    return n.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtCurrency(n) {
    if (n === null || isNaN(n) || n === 0) return '-';
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDual(n, myr = true) {
    if (n === null || isNaN(n) || n === 0) return '-';
    const main = n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    if (myr) return main;
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;
    const converted = (n * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${main} <span style="color:var(--slate-light);font-size:11px;">(${converted} ${state.secondaryCurrency})</span>`;
}

function fmtDual2(n, myr = true) {
    if (n === null || isNaN(n) || n === 0) return '-';
    const main = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (myr) return main;
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;
    const converted = (n * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${main} <span style="color:var(--slate-light);font-size:11px;">(${converted} ${state.secondaryCurrency})</span>`;
}

function fmtPMDual(n) {
    if (n === null || isNaN(n) || n === 0) return '-';
    return n.toFixed(1);
}

function fmtMYR2(n) {
    if (n === null || isNaN(n)) return '-';
    return n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPM(n) {
    if (n === null || isNaN(n) || n === 0) return '-';
    return n.toFixed(1);
}

function fmtPCT(n) {
    if (n === null || isNaN(n)) return '-';
    return (n * 100).toFixed(1) + '%';
}

function getRateByCode(code) {
    return RATE_CARD.find(r => r.code === code) || null;
}

function getMonthLabel(startDate, offset) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + offset);
    return MONTHS[d.getMonth()] + '-' + String(d.getFullYear()).slice(-2);
}

function calcResource(r) {
    const rate = getRateByCode(r.code);
    if (!rate) {
        return { name: r.name || '-', title: '', category: '', list: 0, cost: 0, sell: 0, disc: 0, allow: 0, marginPct: 0,
                 totalPM: 0, totalHours: 0, revenue: 0, costTotal: 0, margin: 0 };
    }

    const disc = state.config.globalDiscount;
    const allow = state.config.globalAllowance;
    const sell = rate.list * (1 - disc) * (1 + allow);

    const totalPM = r.effort.reduce((sum, v) => sum + (v || 0), 0);
    const totalHours = totalPM * state.config.hoursPerMonth;
    const revenue = totalHours * sell;
    const costTotal = totalHours * rate.cost;
    const margin = revenue - costTotal;
    const marginPct = revenue > 0 ? margin / revenue : 0;

    return {
        name: r.name || '-',
        title: rate.title,
        category: rate.category,
        list: rate.list,
        cost: rate.cost,
        sell: sell,
        disc: disc,
        allow: allow,
        marginPct: marginPct,
        totalPM: totalPM,
        totalHours: totalHours,
        revenue: revenue,
        costTotal: costTotal,
        margin: margin,
    };
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Forex Management ──────────────────────────────────────────────────────────
let fxSelected = new Set();
let fxModalMode = 'add';
let fxModalEditIdx = -1;

function showFxModal(mode, idx) {
    fxModalMode = mode;
    fxModalEditIdx = idx;
    const overlay = document.getElementById('fx-modal-overlay');
    overlay.classList.remove('hidden');

    if (mode === 'add') {
        document.getElementById('fx-modal-title').textContent = 'Add Currency';
        document.getElementById('fx-modal-code').value = '';
        document.getElementById('fx-modal-code').disabled = false;
        document.getElementById('fx-modal-name').value = '';
        document.getElementById('fx-modal-rate').value = '';
        document.getElementById('fx-modal-inverse').textContent = '-';
    } else {
        const fx = state.forex[idx];
        document.getElementById('fx-modal-title').textContent = 'Edit Currency';
        document.getElementById('fx-modal-code').value = fx.code;
        document.getElementById('fx-modal-code').disabled = true;
        document.getElementById('fx-modal-name').value = fx.name;
        document.getElementById('fx-modal-rate').value = fx.rate;
        updateFxModalInverse();
    }
    updateFxModalInverse();
}

function hideFxModal() {
    document.getElementById('fx-modal-overlay').classList.add('hidden');
}

function updateFxModalInverse() {
    const rate = parseFloat(document.getElementById('fx-modal-rate').value) || 0;
    document.getElementById('fx-modal-inverse').textContent = rate > 0 ? (1 / rate).toFixed(4) : '-';
}

function renderForexTab() {
    const tbody = document.getElementById('fx-tbody');
    tbody.innerHTML = '';

    state.forex.forEach((fx, i) => {
        const inv = fx.rate > 0 ? (1 / fx.rate).toFixed(4) : '-';
        const tr = document.createElement('tr');
        if (fxSelected.has(i)) tr.classList.add('selected');
        tr.dataset.idx = i;

        tr.innerHTML = `
            <td><input type="checkbox" class="fx-check" data-idx="${i}" ${fxSelected.has(i) ? 'checked' : ''}></td>
            <td class="text-left"><strong>${fx.code}</strong></td>
            <td class="text-left">${fx.name}</td>
            <td>${fx.rate.toFixed(4)}</td>
            <td>${inv}</td>
            <td class="text-center" style="color:var(--slate-light);font-size:12px;">-</td>
        `;
        tbody.appendChild(tr);
    });

    // Bind events
    tbody.querySelectorAll('.fx-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.idx, 10);
            if (e.target.checked) fxSelected.add(idx);
            else fxSelected.delete(idx);
            updateFxButtons();
            updateFxRowVisual();
        });
    });

    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return;
            const idx = parseInt(tr.dataset.idx, 10);
            if (fxSelected.has(idx)) fxSelected.delete(idx);
            else fxSelected.add(idx);
            updateFxButtons();
            updateFxRowVisual();
            const cb = tr.querySelector('.fx-check');
            if (cb) cb.checked = fxSelected.has(idx);
        });
    });

    // Update convert dropdown
    const sel = document.getElementById('fx-convert-select');
    const prevVal = sel.value;
    sel.innerHTML = '<option value="">— Select Currency —</option>';
    state.forex.forEach(fx => {
        if (fx.code === 'MYR') return;
        const opt = document.createElement('option');
        opt.value = fx.code;
        opt.textContent = `${fx.code} — ${fx.name}`;
        sel.appendChild(opt);
    });
    if (prevVal && [...sel.options].some(o => o.value === prevVal)) {
        sel.value = prevVal;
    } else {
        sel.value = state.selectedForex;
    }

    updateConvertResults();
}

function updateFxRowVisual() {
    document.querySelectorAll('#fx-tbody tr').forEach(tr => {
        const idx = parseInt(tr.dataset.idx, 10);
        tr.classList.toggle('selected', fxSelected.has(idx));
    });
}

function updateFxButtons() {
    const hasSel = fxSelected.size > 0;
    document.getElementById('fx-edit').disabled = !hasSel || fxSelected.size > 1;
    document.getElementById('fx-delete').disabled = !hasSel;
}

function updateConvertResults() {
    const container = document.getElementById('convert-results');
    const code = document.getElementById('fx-convert-select').value;
    state.selectedForex = code;

    // Calculate totals
    let totalRev = 0, totalCost = 0, totalMargin = 0, totalPM = 0, totalHours = 0;
    state.resources.forEach(r => {
        if (!r.code) return;
        const c = calcResource(r);
        totalRev += c.revenue;
        totalCost += c.costTotal;
        totalMargin += c.margin;
        totalPM += c.totalPM;
        totalHours += c.totalHours;
    });

    if (!code) {
        container.innerHTML = '<div class="convert-item" style="grid-column:1/-1;text-align:center;color:var(--slate-light);padding:24px;">Select a currency to see converted totals</div>';
        return;
    }

    const fx = state.forex.find(f => f.code === code);
    const rate = fx ? fx.rate : 0;

    const items = [
        { label: 'Total Revenue', original: fmtMYR(totalRev), converted: fmtMYR(totalRev * rate), rate },
        { label: 'Total Cost', original: fmtMYR(totalCost), converted: fmtMYR(totalCost * rate), rate },
        { label: 'Gross Margin', original: fmtMYR(totalMargin), converted: fmtMYR(totalMargin * rate), rate },
        { label: 'Total Person-Months', original: fmtPM(totalPM), converted: fmtPM(totalPM), rate: null },
        { label: 'Blended Sell Rate/hr', original: totalHours > 0 ? fmtMYR2(totalRev / totalHours) : '-', converted: totalHours > 0 ? fmtMYR2((totalRev * rate) / totalHours) : '-', rate },
        { label: 'Blended Cost Rate/hr', original: totalHours > 0 ? fmtMYR2(totalCost / totalHours) : '-', converted: totalHours > 0 ? fmtMYR2((totalCost * rate) / totalHours) : '-', rate },
    ];

    container.innerHTML = items.map(it => `
        <div class="convert-item">
            <div class="convert-item-label">${it.label}</div>
            <div class="convert-item-value original">${it.original}</div>
            <div class="convert-item-value converted">${it.converted} ${it.rate ? code : ''}</div>
            ${it.rate ? `<div class="convert-rate">Rate: 1 MYR = ${it.rate.toFixed(4)} ${code} | 1 ${code} = ${(1/it.rate).toFixed(4)} MYR</div>` : ''}
        </div>
    `).join('');
}

// Forex event bindings
document.getElementById('fx-add').addEventListener('click', () => showFxModal('add', -1));
document.getElementById('fx-edit').addEventListener('click', () => {
    if (fxSelected.size === 1) showFxModal('edit', [...fxSelected][0]);
});
document.getElementById('fx-delete').addEventListener('click', () => {
    if (fxSelected.size === 0) return;
    const codes = [...fxSelected].map(i => state.forex[i].code);
    if (codes.includes('MYR')) {
        alert('Cannot delete the base currency (MYR).');
        return;
    }
    if (!confirm(`Delete ${fxSelected.size} currency(ies)?`)) return;
    const indices = [...fxSelected].sort((a, b) => b - a);
    indices.forEach(idx => state.forex.splice(idx, 1));
    fxSelected.clear();
    renderForexTab();
});

document.getElementById('fx-select-all').addEventListener('change', (e) => {
    if (e.target.checked) state.forex.forEach((_, i) => fxSelected.add(i));
    else fxSelected.clear();
    renderForexTab();
    updateFxButtons();
});

document.getElementById('fx-modal-close').addEventListener('click', hideFxModal);
document.getElementById('fx-modal-cancel').addEventListener('click', hideFxModal);
document.getElementById('fx-modal-rate').addEventListener('input', updateFxModalInverse);

document.getElementById('fx-modal-save').addEventListener('click', () => {
    const code = document.getElementById('fx-modal-code').value.trim().toUpperCase();
    const name = document.getElementById('fx-modal-name').value.trim();
    const rate = parseFloat(document.getElementById('fx-modal-rate').value) || 0;

    if (!code || code.length !== 3) { alert('Please enter a valid 3-letter currency code.'); return; }
    if (!name) { alert('Please enter a currency name.'); return; }
    if (rate <= 0) { alert('Please enter a valid exchange rate.'); return; }

    if (fxModalMode === 'add') {
        if (state.forex.find(f => f.code === code)) {
            alert('Currency code already exists.');
            return;
        }
        state.forex.push({ code, name, rate, updated: new Date().toISOString() });
        state.forex.sort((a, b) => {
            if (a.code === 'MYR') return -1;
            if (b.code === 'MYR') return 1;
            return a.code.localeCompare(b.code);
        });
    } else {
        state.forex[fxModalEditIdx].name = name;
        state.forex[fxModalEditIdx].rate = rate;
        state.forex[fxModalEditIdx].updated = new Date().toISOString();
    }

    hideFxModal();
    fxSelected.clear();
    renderForexTab();
    showToast('Currency saved');
});

document.getElementById('fx-convert-select').addEventListener('change', () => updateConvertResults());

document.getElementById('fx-modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('fx-modal-overlay')) hideFxModal();
});

// ── Tab Switching ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ── Modal ─────────────────────────────────────────────────────────────────────
function showModal(mode, idx) {
    modalMode = mode;
    modalEditIdx = idx;

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');

    if (mode === 'add') {
        document.getElementById('modal-title').textContent = 'Add Rate';
        document.getElementById('modal-code').value = '';
        document.getElementById('modal-code').disabled = false;
        document.getElementById('modal-title-input').value = '';
        document.getElementById('modal-category').value = 'Technology';
        document.getElementById('modal-list').value = '';
        document.getElementById('modal-cost').value = '';
        document.getElementById('modal-margin-preview').textContent = '-';
    } else {
        const rc = RATE_CARD[idx];
        document.getElementById('modal-title').textContent = 'Edit Rate';
        document.getElementById('modal-code').value = rc.code;
        document.getElementById('modal-code').disabled = true;
        document.getElementById('modal-title-input').value = rc.title;
        document.getElementById('modal-category').value = rc.category;
        document.getElementById('modal-list').value = rc.list;
        document.getElementById('modal-cost').value = rc.cost;
        updateModalMargin();
    }
    updateModalMargin();
}

function hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function updateModalMargin() {
    const list = parseFloat(document.getElementById('modal-list').value) || 0;
    const cost = parseFloat(document.getElementById('modal-cost').value) || 0;
    const preview = document.getElementById('modal-margin-preview');
    if (list > 0) {
        preview.textContent = fmtPCT((list - cost) / list);
    } else {
        preview.textContent = '-';
    }
}

document.getElementById('modal-close').addEventListener('click', hideModal);
document.getElementById('modal-cancel').addEventListener('click', hideModal);
document.getElementById('modal-list').addEventListener('input', updateModalMargin);
document.getElementById('modal-cost').addEventListener('input', updateModalMargin);

document.getElementById('modal-save').addEventListener('click', () => {
    const code = document.getElementById('modal-code').value.trim();
    const title = document.getElementById('modal-title-input').value.trim();
    const category = document.getElementById('modal-category').value;
    const list = parseFloat(document.getElementById('modal-list').value) || 0;
    const cost = parseFloat(document.getElementById('modal-cost').value) || 0;

    if (!code || !title || list <= 0) {
        alert('Please fill in Job Code, Role Title, and a valid List Price.');
        return;
    }

    if (modalMode === 'add') {
        if (RATE_CARD.find(r => r.code === code)) {
            alert('Job Code already exists.');
            return;
        }
        RATE_CARD.push({ code, title, category, list, cost });
        RATE_CARD.sort((a, b) => a.code.localeCompare(b.code));
    } else {
        RATE_CARD[modalEditIdx].title = title;
        RATE_CARD[modalEditIdx].category = category;
        RATE_CARD[modalEditIdx].list = list;
        RATE_CARD[modalEditIdx].cost = cost;
    }

    hideModal();
    state.rcSelected.clear();
    renderRateCard();
    recalcAll();
});

// ── Rate Card Tab ─────────────────────────────────────────────────────────────
function renderRateCard() {
    const tbody = document.getElementById('rate-card-body');
    tbody.innerHTML = '';

    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;

    RATE_CARD.forEach((rc, i) => {
        const margin = rc.list > 0 ? (rc.list - rc.cost) / rc.list : 0;
        const tr = document.createElement('tr');
        if (state.rcSelected.has(i)) tr.classList.add('selected');
        tr.dataset.idx = i;

        const listDual = showDual ? `${fmtMYR2(rc.list)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(rc.list * rate)} ${state.secondaryCurrency})</span>` : fmtMYR2(rc.list);
        const costDual = showDual ? `${fmtMYR2(rc.cost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(rc.cost * rate)} ${state.secondaryCurrency})</span>` : fmtMYR2(rc.cost);

        tr.innerHTML = `
            <td><input type="checkbox" class="rc-check" data-idx="${i}" ${state.rcSelected.has(i) ? 'checked' : ''}></td>
            <td class="text-left">${rc.code}</td>
            <td class="text-left">${rc.title}</td>
            <td class="text-center">${rc.category}</td>
            <td>${listDual}</td>
            <td>${costDual}</td>
            <td>${fmtPCT(margin)}</td>
        `;

        tbody.appendChild(tr);
    });

    // Bind checkbox events
    tbody.querySelectorAll('.rc-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.idx, 10);
            if (e.target.checked) {
                state.rcSelected.add(idx);
            } else {
                state.rcSelected.delete(idx);
            }
            updateRCButtons();
            trSelectVisual();
        });
    });

    // Bind row click for selection
    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return;
            const idx = parseInt(tr.dataset.idx, 10);
            if (state.rcSelected.has(idx)) {
                state.rcSelected.delete(idx);
            } else {
                state.rcSelected.add(idx);
            }
            updateRCButtons();
            trSelectVisual();
            const cb = tr.querySelector('.rc-check');
            if (cb) cb.checked = state.rcSelected.has(idx);
        });
    });

    const avgList = RATE_CARD.reduce((s, r) => s + r.list, 0) / RATE_CARD.length;
    const avgCost = RATE_CARD.reduce((s, r) => s + r.cost, 0) / RATE_CARD.length;
    const avgMargin = avgList > 0 ? (avgList - avgCost) / avgList : 0;
    const avgListDual = showDual ? `${fmtMYR2(avgList)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(avgList * rate)} ${state.secondaryCurrency})</span>` : fmtMYR2(avgList);
    const avgCostDual = showDual ? `${fmtMYR2(avgCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(avgCost * rate)} ${state.secondaryCurrency})</span>` : fmtMYR2(avgCost);

    document.getElementById('avg-list').innerHTML = avgListDual;
    document.getElementById('avg-cost').innerHTML = avgCostDual;
    document.getElementById('avg-margin').textContent = fmtPCT(avgMargin);
}

function trSelectVisual() {
    document.querySelectorAll('#rate-card-body tr').forEach(tr => {
        const idx = parseInt(tr.dataset.idx, 10);
        tr.classList.toggle('selected', state.rcSelected.has(idx));
    });
}

function updateRCButtons() {
    const hasSel = state.rcSelected.size > 0;
    document.getElementById('rc-edit').disabled = !hasSel || state.rcSelected.size > 1;
    document.getElementById('rc-delete').disabled = !hasSel;
}

// Select all
document.getElementById('rc-select-all').addEventListener('change', (e) => {
    if (e.target.checked) {
        RATE_CARD.forEach((_, i) => state.rcSelected.add(i));
    } else {
        state.rcSelected.clear();
    }
    renderRateCard();
    updateRCButtons();
});

// Add
document.getElementById('rc-add').addEventListener('click', () => showModal('add', -1));

// Edit
document.getElementById('rc-edit').addEventListener('click', () => {
    if (state.rcSelected.size === 1) {
        showModal('edit', [...state.rcSelected][0]);
    }
});

// Delete
document.getElementById('rc-delete').addEventListener('click', () => {
    if (!confirm(`Delete ${state.rcSelected.size} selected rate(s)?`)) return;
    const indices = [...state.rcSelected].sort((a, b) => b - a);
    indices.forEach(idx => RATE_CARD.splice(idx, 1));
    state.rcSelected.clear();
    renderRateCard();
    recalcAll();
});

// ── Config Tab ────────────────────────────────────────────────────────────────
function bindConfig() {
    const fields = [
        { key: 'customerName', id: 'customer-name', type: 'text' },
        { key: 'projectName', id: 'project-name', type: 'text' },
        { key: 'projectId', id: 'project-id', type: 'text' },
        { key: 'contractType', id: 'contract-type', type: 'text' },
        { key: 'currency', id: 'currency', type: 'text', readonly: true },
        { key: 'startDate', id: 'start-date', type: 'date' },
        { key: 'duration', id: 'duration', type: 'number' },
        { key: 'hoursPerMonth', id: 'hours-per-month', type: 'number' },
        { key: 'riskReserve', id: 'risk-reserve', type: 'pct' },
        { key: 'globalDiscount', id: 'global-discount', type: 'pct' },
        { key: 'globalAllowance', id: 'global-allowance', type: 'pct' },
    ];

    fields.forEach(({ key, id, type, readonly }) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = type === 'pct' ? (state.config[key] * 100).toFixed(2) : state.config[key];
        if (readonly) el.setAttribute('readonly', '');
        el.addEventListener('input', () => {
            if (type === 'number') {
                state.config[key] = parseFloat(el.value) || 0;
            } else if (type === 'pct') {
                state.config[key] = (parseFloat(el.value) || 0) / 100;
            } else {
                state.config[key] = el.value;
            }
            recalcAll();
        });
    });

    document.getElementById('reset-config').addEventListener('click', () => {
        state.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        bindConfig();
        recalcAll();
    });

    document.getElementById('visible-months').addEventListener('change', (e) => {
        state.visibleMonths = parseInt(e.target.value, 10);
        renderResourcePlan();
    });

    // Currency selectors
    populateCurrencySelectors();

    const dispSel = document.getElementById('display-currency');
    const secSel = document.getElementById('secondary-currency');
    dispSel.value = state.displayCurrency;
    secSel.value = state.secondaryCurrency;

    dispSel.addEventListener('change', (e) => {
        state.displayCurrency = e.target.value;
        recalcAll();
    });

    secSel.addEventListener('change', (e) => {
        state.secondaryCurrency = e.target.value;
        recalcAll();
    });
}

function populateCurrencySelectors() {
    const dispSel = document.getElementById('display-currency');
    const secSel = document.getElementById('secondary-currency');
    const codes = state.forex.map(f => f.code);

    dispSel.innerHTML = '';
    secSel.innerHTML = '<option value="MYR">MYR only</option>';

    codes.forEach(code => {
        const opt1 = document.createElement('option');
        opt1.value = code;
        opt1.textContent = code;
        if (code === 'MYR') opt1.textContent = 'MYR (Base)';
        dispSel.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = code;
        opt2.textContent = code;
        secSel.appendChild(opt2);
    });
}

function updateDerivedMetrics() {
    document.getElementById('total-months').textContent = state.config.duration;
    document.getElementById('effective-hours').textContent =
        (state.config.duration * state.config.hoursPerMonth).toLocaleString();

    if (state.config.startDate && state.config.duration) {
        const start = new Date(state.config.startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + state.config.duration);
        document.getElementById('end-date').textContent = end.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }
}

// ── Resource Plan Tab ─────────────────────────────────────────────────────────
function renderResourcePlan() {
    renderRPBanner();
    renderRPHead();
    renderRPBody();
    renderRPFoot();
}

function renderRPBanner() {
    const cfg = state.config;
    document.getElementById('rp-banner').textContent =
        `${cfg.projectName}  |  Customer: ${cfg.customerName}  |  Currency: ${cfg.currency}  |  Start: ${getMonthLabel(cfg.startDate, 0)}  |  Duration: ${cfg.duration} months  |  ${cfg.hoursPerMonth} hrs/month`;
}

function renderRPHead() {
    const thead = document.getElementById('rp-thead');
    const vm = state.visibleMonths;
    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;

    const listHeader = showDual ? `List Price<br>(MYR / ${state.secondaryCurrency})` : 'List Price<br>(MYR/hr)';
    const sellHeader = showDual ? `Sell Price<br>(MYR / ${state.secondaryCurrency})` : 'Sell Price<br>(MYR/hr)';
    const costHeader = showDual ? `Cost Rate<br>(MYR / ${state.secondaryCurrency})` : 'Cost Rate<br>(MYR/hr)';

    const revHeader = showDual ? `Revenue (MYR / ${state.secondaryCurrency})` : 'Revenue (MYR)';
    const costTotHeader = showDual ? `Total Cost (MYR / ${state.secondaryCurrency})` : 'Total Cost (MYR)';
    const marginHeader = showDual ? `Gross Margin (MYR / ${state.secondaryCurrency})` : 'Gross Margin (MYR)';

    let html = '<tr class="year-header">';
    html += '<th rowspan="2"><input type="checkbox" id="rp-select-all"></th>';
    html += '<th rowspan="2">#</th>';
    html += '<th rowspan="2">Resource Name</th>';
    html += '<th rowspan="2">Job Code</th>';
    html += '<th rowspan="2">Role Title</th>';
    html += '<th rowspan="2">Category</th>';
    html += `<th rowspan="2">${listHeader}</th>`;
    html += '<th rowspan="2">Disc %</th>';
    html += '<th rowspan="2">Allow %</th>';
    html += `<th rowspan="2">${sellHeader}</th>`;
    html += `<th rowspan="2">${costHeader}</th>`;
    html += '<th rowspan="2">Del<br>Margin %</th>';

    for (let yi = 0; yi < 5; yi++) {
        const mStart = yi * 12;
        const mEnd = Math.min(mStart + 12, vm) - 1;
        if (mStart >= vm) break;
        html += `<th colspan="${mEnd - mStart + 1}">YEAR ${yi + 1}</th>`;
    }
    html += '<th rowspan="2" class="summary-header">Total PM</th>';
    html += '<th rowspan="2" class="summary-header">Total Hours</th>';
    html += `<th rowspan="2" class="summary-header">${revHeader}</th>`;
    html += `<th rowspan="2" class="summary-header">${costTotHeader}</th>`;
    html += `<th rowspan="2" class="summary-header">${marginHeader}</th>`;
    html += '<th rowspan="2" class="summary-header">Margin %</th>';
    html += '<th rowspan="2" class="th-action"></th>';
    html += '</tr>';

    html += '<tr>';
    for (let m = 0; m < vm; m++) {
        html += `<th class="month-col">${getMonthLabel(state.config.startDate, m)}</th>`;
    }
    html += '</tr>';

    thead.innerHTML = html;

    // Bind select all
    const selectAll = document.getElementById('rp-select-all');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            document.querySelectorAll('.rp-check').forEach(cb => {
                cb.checked = e.target.checked;
                const idx = parseInt(cb.dataset.idx, 10);
                if (e.target.checked) {
                    state.rpSelected.add(idx);
                } else {
                    state.rpSelected.delete(idx);
                }
            });
            updateRPDeleteBtn();
        });
    }
}

// Add selected state for resource plan
state.rpSelected = new Set();

function renderRPBody() {
    const tbody = document.getElementById('rp-tbody');
    const vm = state.visibleMonths;
    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;
    tbody.innerHTML = '';

    state.resources.forEach((r, idx) => {
        if (!r.code && !r.name && idx >= SAMPLE_RESOURCES.length + 2) return;

        const c = calcResource(r);
        const tr = document.createElement('tr');
        if (state.rpSelected.has(idx)) tr.classList.add('selected');

        const listDual = showDual && c.list ? `${fmtMYR2(c.list)} <span style="color:var(--slate-light);font-size:10px;">(${fmtMYR2(c.list * rate)} ${state.secondaryCurrency})</span>` : (c.list ? fmtMYR2(c.list) : '-');
        const sellDual = showDual && c.sell ? `${fmtMYR2(c.sell)} <span style="color:var(--slate-light);font-size:10px;">(${fmtMYR2(c.sell * rate)} ${state.secondaryCurrency})</span>` : (c.sell ? fmtMYR2(c.sell) : '-');
        const costDual = showDual && c.cost ? `${fmtMYR2(c.cost)} <span style="color:var(--slate-light);font-size:10px;">(${fmtMYR2(c.cost * rate)} ${state.secondaryCurrency})</span>` : (c.cost ? fmtMYR2(c.cost) : '-');
        const hrsDual = showDual && c.totalHours ? `${fmtMYR(c.totalHours)} <span style="color:var(--slate-light);font-size:10px;">(${fmtCurrency(c.totalHours * rate)} ${state.secondaryCurrency})</span>` : (c.totalHours ? fmtMYR(c.totalHours) : '-');
        const revDual = showDual && c.revenue ? `${fmtMYR(c.revenue)} <span style="color:var(--slate-light);font-size:10px;">(${fmtCurrency(c.revenue * rate)} ${state.secondaryCurrency})</span>` : (c.revenue ? fmtMYR(c.revenue) : '-');
        const costTotDual = showDual && c.costTotal ? `${fmtMYR(c.costTotal)} <span style="color:var(--slate-light);font-size:10px;">(${fmtCurrency(c.costTotal * rate)} ${state.secondaryCurrency})</span>` : (c.costTotal ? fmtMYR(c.costTotal) : '-');
        const marginDual = showDual && c.margin ? `${fmtMYR(c.margin)} <span style="color:var(--slate-light);font-size:10px;">(${fmtCurrency(c.margin * rate)} ${state.secondaryCurrency})</span>` : (c.margin ? fmtMYR(c.margin) : '-');

        let html = `<td><input type="checkbox" class="rp-check" data-idx="${idx}" ${state.rpSelected.has(idx) ? 'checked' : ''}></td>`;
        html += `<td class="text-center">${idx + 1}</td>`;
        html += `<td><input type="text" class="rp-name" data-idx="${idx}" value="${escHtml(r.name)}"></td>`;

        html += `<td><select class="rp-code" data-idx="${idx}">`;
        html += `<option value="">-- select --</option>`;
        RATE_CARD.forEach(rt => {
            const sel = rt.code === r.code ? 'selected' : '';
            html += `<option value="${rt.code}" ${sel}>${rt.code}</option>`;
        });
        html += `</select></td>`;

        html += `<td class="calc">${c.title}</td>`;
        html += `<td class="calc text-center">${c.category}</td>`;
        html += `<td class="calc">${listDual}</td>`;
        html += `<td class="calc">${fmtPCT(c.disc)}</td>`;
        html += `<td class="calc">${fmtPCT(c.allow)}</td>`;
        html += `<td class="calc">${sellDual}</td>`;
        html += `<td class="calc">${costDual}</td>`;
        html += `<td class="calc">${fmtPCT(c.marginPct)}</td>`;

        for (let m = 0; m < vm; m++) {
            const val = r.effort[m] !== null ? r.effort[m] : '';
            html += `<td class="month-col"><input type="number" class="rp-effort" data-idx="${idx}" data-m="${m}" value="${val}" step="0.5" min="0"></td>`;
        }

        html += `<td class="total">${fmtPM(c.totalPM)}</td>`;
        html += `<td class="total">${hrsDual}</td>`;
        html += `<td class="total">${revDual}</td>`;
        html += `<td class="total">${costTotDual}</td>`;
        html += `<td class="total">${marginDual}</td>`;
        html += `<td class="total">${fmtPCT(c.marginPct)}</td>`;
        html += `<td><button class="delete-btn rp-del-row" data-idx="${idx}" title="Delete row">&times;</button></td>`;

        tr.innerHTML = html;
        tbody.appendChild(tr);
    });

    bindRPInputs();
}

function renderRPFoot() {
    const tfoot = document.getElementById('rp-tfoot');
    const vm = state.visibleMonths;
    const activeResources = state.resources.filter(r => r.code);
    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;

    let html = '<tr>';
    html += '<td colspan="12">PROJECT TOTALS</td>';

    for (let m = 0; m < vm; m++) {
        const total = activeResources.reduce((sum, r) => sum + (r.effort[m] || 0), 0);
        html += `<td class="month-col total">${total > 0 ? fmtPM(total) : '-'}</td>`;
    }

    let totalPM = 0, totalHours = 0, totalRev = 0, totalCost = 0, totalMargin = 0;
    activeResources.forEach(r => {
        const c = calcResource(r);
        totalPM += c.totalPM;
        totalHours += c.totalHours;
        totalRev += c.revenue;
        totalCost += c.costTotal;
        totalMargin += c.margin;
    });

    const revDual = showDual ? `${fmtMYR(totalRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalRev * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalRev);
    const costDual = showDual ? `${fmtMYR(totalCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalCost * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalCost);
    const marginDual = showDual ? `${fmtMYR(totalMargin)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalMargin * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalMargin);
    const hrsDual = showDual ? `${fmtMYR(totalHours)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalHours * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalHours);

    html += `<td class="total">${fmtPM(totalPM)}</td>`;
    html += `<td class="total">${totalHours ? hrsDual : '-'}</td>`;
    html += `<td class="total">${totalRev ? revDual : '-'}</td>`;
    html += `<td class="total">${totalCost ? costDual : '-'}</td>`;
    html += `<td class="total">${totalMargin ? marginDual : '-'}</td>`;
    html += `<td class="total">${totalRev > 0 ? fmtPCT(totalMargin / totalRev) : '-'}</td>`;
    html += '<td></td>';
    html += '</tr>';

    tfoot.innerHTML = html;
}

function bindRPInputs() {
    // Checkbox selection
    document.querySelectorAll('.rp-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.idx, 10);
            if (e.target.checked) {
                state.rpSelected.add(idx);
            } else {
                state.rpSelected.delete(idx);
            }
            updateRPDeleteBtn();
            updateRPRowVisual();
        });
    });

    // Row click to select
    document.querySelectorAll('#rp-tbody tr').forEach(tr => {
        tr.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox' || e.target.classList.contains('rp-effort') ||
                e.target.classList.contains('rp-name') || e.target.tagName === 'SELECT' ||
                e.target.classList.contains('delete-btn')) return;
            const row = tr.closest('tr');
            const cb = row.querySelector('.rp-check');
            const idx = parseInt(cb.dataset.idx, 10);
            if (state.rpSelected.has(idx)) {
                state.rpSelected.delete(idx);
                cb.checked = false;
            } else {
                state.rpSelected.add(idx);
                cb.checked = true;
            }
            updateRPDeleteBtn();
            updateRPRowVisual();
        });
    });

    // Name inputs
    document.querySelectorAll('.rp-name').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            state.resources[idx].name = e.target.value;
            renderResourcePlan();
        });
    });

    // Code dropdowns
    document.querySelectorAll('.rp-code').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            state.resources[idx].code = e.target.value;
            if (e.target.value) {
                const rate = getRateByCode(e.target.value);
                if (rate && !state.resources[idx].name) {
                    state.resources[idx].name = rate.title;
                }
            }
            renderResourcePlan();
        });
    });

    // Effort inputs
    document.querySelectorAll('.rp-effort').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx, 10);
            const m = parseInt(e.target.dataset.m, 10);
            const val = parseFloat(e.target.value);
            state.resources[idx].effort[m] = isNaN(val) || val === 0 ? null : val;
            renderResourcePlan();
        });
    });

    // Delete row button
    document.querySelectorAll('.rp-del-row').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.dataset.idx, 10);
            deleteResourceRow(idx);
        });
    });

    // Add resource button
    document.getElementById('add-resource').addEventListener('click', () => {
        const emptyIdx = state.resources.findIndex(r => !r.code && !r.name);
        if (emptyIdx < 0) {
            state.resources.push({ name: '', code: '', effort: new Array(60).fill(null) });
        }
        renderResourcePlan();
    });

    // Delete selected button
    document.getElementById('delete-selected-resources').addEventListener('click', deleteSelectedResources);
}

function updateRPRowVisual() {
    document.querySelectorAll('#rp-tbody tr').forEach(tr => {
        const cb = tr.querySelector('.rp-check');
        if (cb) {
            const idx = parseInt(cb.dataset.idx, 10);
            tr.classList.toggle('selected', state.rpSelected.has(idx));
        }
    });
}

function updateRPDeleteBtn() {
    document.getElementById('delete-selected-resources').disabled = state.rpSelected.size === 0;
}

function deleteResourceRow(idx) {
    state.resources[idx] = { name: '', code: '', effort: new Array(60).fill(null) };
    state.rpSelected.delete(idx);
    renderResourcePlan();
}

function deleteSelectedResources() {
    if (state.rpSelected.size === 0) return;
    if (!confirm(`Delete ${state.rpSelected.size} selected resource row(s)?`)) return;
    state.rpSelected.forEach(idx => {
        state.resources[idx] = { name: '', code: '', effort: new Array(60).fill(null) };
    });
    state.rpSelected.clear();
    renderResourcePlan();
}

// ── P&L Summary Tab ───────────────────────────────────────────────────────────
function renderPLSummary() {
    renderPLBanner();
    renderSummaryTable();
    renderCategoryBreakdown();
    renderMetrics();
    renderYearBreakdown();
}

function renderPLBanner() {
    const cfg = state.config;
    document.getElementById('pl-banner').textContent =
        `${cfg.projectName}  |  Customer: ${cfg.customerName}  |  Currency: ${cfg.currency}  |  Duration: ${cfg.duration} months`;
}

function renderSummaryTable() {
    const tbody = document.getElementById('summary-tbody');
    tbody.innerHTML = '';

    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const rate = fx ? fx.rate : 1;

    let totalPM = 0, totalRev = 0, totalCost = 0;

    state.resources.forEach(r => {
        if (!r.code) return;
        const c = calcResource(r);
        totalPM += c.totalPM;
        totalRev += c.revenue;
        totalCost += c.costTotal;

        const revDual = showDual && c.revenue ? `${fmtMYR(c.revenue)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(c.revenue * rate)} ${state.secondaryCurrency})</span>` : (c.revenue ? fmtMYR(c.revenue) : '-');
        const costDual = showDual && c.costTotal ? `${fmtMYR(c.costTotal)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(c.costTotal * rate)} ${state.secondaryCurrency})</span>` : (c.costTotal ? fmtMYR(c.costTotal) : '-');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.title}</td>
            <td class="text-center">${c.category}</td>
            <td>${fmtPM(c.totalPM)}</td>
            <td>${revDual}</td>
            <td>${costDual}</td>
            <td>${fmtPCT(c.marginPct)}</td>
        `;
        tbody.appendChild(tr);
    });

    const totalMargin = totalRev - totalCost;
    document.getElementById('s-total-pm').textContent = fmtPM(totalPM);
    document.getElementById('s-total-rev').innerHTML = totalRev ? (showDual ? `${fmtMYR(totalRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalRev * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalRev)) : '-';
    document.getElementById('s-total-cost').innerHTML = totalCost ? (showDual ? `${fmtMYR(totalCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalCost * rate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalCost)) : '-';
    document.getElementById('s-total-margin').textContent = totalRev > 0 ? fmtPCT(totalMargin / totalRev) : '-';
}

function renderCategoryBreakdown() {
    const tbody = document.getElementById('category-tbody');
    tbody.innerHTML = '';

    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const fxRate = fx ? fx.rate : 1;

    const categories = ['Technology', 'Consulting', 'Development', 'Architecture'];
    const catData = {};
    categories.forEach(cat => { catData[cat] = { pm: 0, rev: 0, cost: 0 }; });

    state.resources.forEach(r => {
        if (!r.code) return;
        const rt = getRateByCode(r.code);
        if (!rt) return;
        const c = calcResource(r);
        catData[rt.category].pm += c.totalPM;
        catData[rt.category].rev += c.revenue;
        catData[rt.category].cost += c.costTotal;
    });

    let gPM = 0, gRev = 0, gCost = 0;

    categories.forEach(cat => {
        const d = catData[cat];
        if (d.pm === 0) return;
        gPM += d.pm;
        gRev += d.rev;
        gCost += d.cost;

        const revDual = showDual && d.rev ? `${fmtMYR(d.rev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(d.rev * fxRate)} ${state.secondaryCurrency})</span>` : (d.rev ? fmtMYR(d.rev) : '-');
        const costDual = showDual && d.cost ? `${fmtMYR(d.cost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(d.cost * fxRate)} ${state.secondaryCurrency})</span>` : (d.cost ? fmtMYR(d.cost) : '-');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat}</td>
            <td>${fmtPM(d.pm)}</td>
            <td>${revDual}</td>
            <td>${costDual}</td>
            <td>${d.rev > 0 ? fmtPCT((d.rev - d.cost) / d.rev) : '-'}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('c-total-pm').textContent = fmtPM(gPM);
    document.getElementById('c-total-rev').innerHTML = gRev ? (showDual ? `${fmtMYR(gRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(gRev * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(gRev)) : '-';
    document.getElementById('c-total-cost').innerHTML = gCost ? (showDual ? `${fmtMYR(gCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(gCost * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(gCost)) : '-';
    document.getElementById('c-total-margin').textContent = gRev > 0 ? fmtPCT((gRev - gCost) / gRev) : '-';
}

function renderMetrics() {
    const tbody = document.getElementById('metrics-tbody');
    tbody.innerHTML = '';

    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const fxRate = fx ? fx.rate : 1;

    let totalRev = 0, totalCost = 0, totalPM = 0, totalHours = 0;
    state.resources.forEach(r => {
        if (!r.code) return;
        const c = calcResource(r);
        totalRev += c.revenue;
        totalCost += c.costTotal;
        totalPM += c.totalPM;
        totalHours += c.totalHours;
    });

    const totalMargin = totalRev - totalCost;
    const riskReserve = totalRev * state.config.riskReserve;
    const blendSell = totalHours > 0 ? totalRev / totalHours : 0;
    const blendCost = totalHours > 0 ? totalCost / totalHours : 0;

    const revVal = showDual ? `${fmtMYR(totalRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalRev * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalRev);
    const costVal = showDual ? `${fmtMYR(totalCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalCost * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalCost);
    const marginVal = showDual ? `${fmtMYR(totalMargin)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(totalMargin * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(totalMargin);
    const rrVal = showDual ? `${fmtMYR(riskReserve)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(riskReserve * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(riskReserve);
    const sellVal = showDual ? `${fmtMYR2(blendSell)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(blendSell * fxRate)} ${state.secondaryCurrency})</span>` : (blendSell ? fmtMYR2(blendSell) : '-');
    const costRateVal = showDual ? `${fmtMYR2(blendCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtMYR2(blendCost * fxRate)} ${state.secondaryCurrency})</span>` : (blendCost ? fmtMYR2(blendCost) : '-');

    const metrics = [
        { label: 'Gross Revenue (before allowances)', value: totalRev ? revVal : '-' },
        { label: 'Total Cost (excl. Risk Reserve)', value: totalCost ? costVal : '-' },
        { label: 'Gross Margin (MYR)', value: totalRev > 0 ? marginVal : '-' },
        { label: 'Gross Margin %', value: totalRev > 0 ? fmtPCT(totalMargin / totalRev) : '-' },
        { label: 'Risk Reserve (MYR)', value: riskReserve ? rrVal : '-' },
        { label: 'Total Project Value (TCV)', value: totalRev ? revVal : '-' },
        { label: 'Total Person-Months', value: fmtPM(totalPM) },
        { label: 'Blended Sell Rate (MYR/hr)', value: sellVal },
        { label: 'Blended Cost Rate (MYR/hr)', value: costRateVal },
    ];

    metrics.forEach(m => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${m.label}</td><td>${m.value}</td><td></td><td></td>`;
        tbody.appendChild(tr);
    });
}

function renderYearBreakdown() {
    const tbody = document.getElementById('year-breakdown-tbody');
    tbody.innerHTML = '';

    const cfg = state.config;
    const vm = Math.min(cfg.duration, 60);
    const years = Math.ceil(vm / 12);
    const showDual = state.secondaryCurrency !== 'MYR';
    const fx = state.forex.find(f => f.code === state.secondaryCurrency);
    const fxRate = fx ? fx.rate : 1;

    let gPM = 0, gRev = 0, gCost = 0;

    for (let y = 0; y < years; y++) {
        const mStart = y * 12;
        const mEnd = Math.min(mStart + 12, vm);
        
        let yPM = 0, yRev = 0, yCost = 0;

        state.resources.forEach(r => {
            if (!r.code) return;
            const c = calcResource(r);
            const rc = getRateByCode(r.code);
            if (!rc) return;

            for (let m = mStart; m < mEnd; m++) {
                const pm = r.effort[m] || 0;
                yPM += pm;
                const hrs = pm * cfg.hoursPerMonth;
                yRev += hrs * c.sell;
                yCost += hrs * c.cost;
            }
        });

        const yMargin = yRev - yCost;
        gPM += yPM;
        gRev += yRev;
        gCost += yCost;

        const revDual = showDual && yRev ? `${fmtMYR(yRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(yRev * fxRate)} ${state.secondaryCurrency})</span>` : (yRev ? fmtMYR(yRev) : '-');
        const costDual = showDual && yCost ? `${fmtMYR(yCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(yCost * fxRate)} ${state.secondaryCurrency})</span>` : (yCost ? fmtMYR(yCost) : '-');
        const marginDual = showDual && yMargin ? `${fmtMYR(yMargin)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(yMargin * fxRate)} ${state.secondaryCurrency})</span>` : (yMargin ? fmtMYR(yMargin) : '-');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>Year ${y + 1}</td>
            <td>${fmtPM(yPM)}</td>
            <td>${revDual}</td>
            <td>${costDual}</td>
            <td>${marginDual}</td>
            <td>${yRev > 0 ? fmtPCT(yMargin / yRev) : '-'}</td>
        `;
        tbody.appendChild(tr);
    }

    const gMargin = gRev - gCost;
    document.getElementById('yb-total-pm').textContent = fmtPM(gPM);
    document.getElementById('yb-total-rev').innerHTML = gRev ? (showDual ? `${fmtMYR(gRev)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(gRev * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(gRev)) : '-';
    document.getElementById('yb-total-cost').innerHTML = gCost ? (showDual ? `${fmtMYR(gCost)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(gCost * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(gCost)) : '-';
    document.getElementById('yb-total-margin').innerHTML = gRev > 0 ? (showDual ? `${fmtMYR(gMargin)} <span style="color:var(--slate-light);font-size:11px;">(${fmtCurrency(gMargin * fxRate)} ${state.secondaryCurrency})</span>` : fmtMYR(gMargin)) : '-';
    document.getElementById('yb-total-margin-pct').textContent = gRev > 0 ? fmtPCT(gMargin / gRev) : '-';
}

// ── Export ─────────────────────────────────────────────────────────────────────
document.getElementById('export-pdf').addEventListener('click', () => {
    window.print();
});

document.getElementById('show-readme').addEventListener('click', () => {
    document.getElementById('readme-overlay').classList.remove('hidden');
});

document.getElementById('readme-close').addEventListener('click', () => {
    document.getElementById('readme-overlay').classList.add('hidden');
});

document.getElementById('readme-done').addEventListener('click', () => {
    document.getElementById('readme-overlay').classList.add('hidden');
});

document.getElementById('export-excel').addEventListener('click', async () => {
    try {
        const wb = XLSX.utils.book_new();
        const cfg = state.config;

        // ── Config Sheet ──
        const configData = [
            ['PROJECT CONFIGURATION'],
            [],
            ['Customer Name', cfg.customerName],
            ['Project Name', cfg.projectName],
            ['Project / Opp ID', cfg.projectId],
            ['Contract Type', cfg.contractType],
            ['Currency', cfg.currency],
            ['Project Start Date', cfg.startDate],
            ['Project Duration (Months)', cfg.duration],
            ['Working Hours per Month', cfg.hoursPerMonth],
            ['Risk Reserve %', cfg.riskReserve],
            ['Global Discount %', cfg.globalDiscount],
            ['Global Allowance %', cfg.globalAllowance],
            ['Display Currency', state.displayCurrency],
            ['Secondary Currency', state.secondaryCurrency],
        ];
        const wsConfig = XLSX.utils.aoa_to_sheet(configData);
        XLSX.utils.book_append_sheet(wb, wsConfig, 'Config');

        // ── Rate Card Sheet ──
        const rcHeaders = ['Job Code', 'Role Title', 'Category', 'List Price (MYR/hr)', 'Std Cost Rate (MYR/hr)', 'Margin %'];
        const rcData = [rcHeaders];
        RATE_CARD.forEach(rc => {
            rcData.push([rc.code, rc.title, rc.category, rc.list, rc.cost, rc.list > 0 ? (rc.list - rc.cost) / rc.list : 0]);
        });
        rcData.push(['Blended Average', '', '', 
            RATE_CARD.reduce((s,r) => s+r.list, 0) / RATE_CARD.length,
            RATE_CARD.reduce((s,r) => s+r.cost, 0) / RATE_CARD.length, 0]);
        const wsRC = XLSX.utils.aoa_to_sheet(rcData);
        XLSX.utils.book_append_sheet(wb, wsRC, 'Rate_Card');

        // ── Resource Plan Sheet ──
        const months = 60;
        const startDate = new Date(cfg.startDate);
        const headers = ['#', 'Resource Name', 'Job Code', 'Role Title', 'Category', 
                        'List Price (MYR/hr)', 'Disc %', 'Allow %', 'Sell Price (MYR/hr)',
                        'Cost Rate (MYR/hr)', 'Del Margin %'];
        for (let m = 0; m < months; m++) {
            const d = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
            headers.push(d.toLocaleString('en-GB', { month: 'short', year: '2-digit' }));
        }
        headers.push('Total PM', 'Total Hours', 'Revenue (MYR)', 'Total Cost (MYR)', 'Gross Margin (MYR)', 'Margin %');

        const rpData = [headers];
        const activeResources = state.resources.filter(r => r.code);
        const rateMap = {};
        RATE_CARD.forEach(rc => rateMap[rc.code] = rc);
        const disc = cfg.globalDiscount;
        const allow = cfg.globalAllowance;

        activeResources.forEach((res, idx) => {
            const rc = rateMap[res.code];
            const list = rc ? rc.list : 0;
            const cost = rc ? rc.cost : 0;
            const sell = list > 0 ? list * (1 - disc) * (1 + allow) : 0;
            const row = [idx + 1, res.name, res.code, rc ? rc.title : '', rc ? rc.category : '', 
                         list, disc, allow, sell, cost, sell > 0 ? (sell - cost) / sell : 0];
            
            row.push(...res.effort.map(v => v || 0));
            
            const totalPM = res.effort.reduce((s, v) => s + (v || 0), 0);
            const totalHrs = totalPM * cfg.hoursPerMonth;
            const revenue = totalHrs * sell;
            const costTotal = totalHrs * cost;
            const margin = revenue - costTotal;
            row.push(totalPM, totalHrs, revenue, costTotal, margin, revenue > 0 ? margin / revenue : 0);
            
            rpData.push(row);
        });
        const wsRP = XLSX.utils.aoa_to_sheet(rpData);
        XLSX.utils.book_append_sheet(wb, wsRP, 'Resource_Plan');

        // ── Forex Sheet ──
        const fxFX = [['FOREX RATES'], [], ['Currency Code', 'Currency Name', 'Rate (per 1 MYR)', '1 Foreign = ? MYR']];
        state.forex.forEach(fx => {
            fxFX.push([fx.code, fx.name, fx.rate, fx.rate > 0 ? (1 / fx.rate).toFixed(4) : '-']);
        });

        const secFx = state.forex.find(f => f.code === state.secondaryCurrency);
        if (secFx && state.secondaryCurrency !== 'MYR') {
            fxFX.push([]);
            fxFX.push(['Display Currency', state.displayCurrency]);
            fxFX.push(['Secondary Currency', secFx.code + ' — ' + secFx.name]);
            
            let totRev = 0, totCost = 0, totMargin = 0;
            state.resources.filter(r => r.code).forEach(r => {
                const c = calcResource(r);
                totRev += c.revenue; totCost += c.costTotal; totMargin += c.margin;
            });
            fxFX.push([]);
            fxFX.push(['', 'MYR', secFx.code]);
            fxFX.push(['Total Revenue', totRev, totRev * secFx.rate]);
            fxFX.push(['Total Cost', totCost, totCost * secFx.rate]);
            fxFX.push(['Gross Margin', totMargin, totMargin * secFx.rate]);
        }
        const wsFX = XLSX.utils.aoa_to_sheet(fxFX);
        XLSX.utils.book_append_sheet(wb, wsFX, 'Forex');

        XLSX.writeFile(wb, 'E3T_Effort_Planner.xlsx');
    } catch (err) {
        alert('Export failed: ' + err.message);
    }
});

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) hideModal();
});

document.getElementById('readme-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('readme-overlay')) {
        document.getElementById('readme-overlay').classList.add('hidden');
    }
});

// ── Main ──────────────────────────────────────────────────────────────────────
function recalcAll() {
    updateDerivedMetrics();
    renderRateCard();
    renderResourcePlan();
    renderPLSummary();
    renderForexTab();
}

initState();
bindConfig();
renderProjectSelector();
recalcAll();
