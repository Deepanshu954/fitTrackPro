// Goals Page Logic
let editingLogId = null;

function fmt(n) {
    return Number(n).toLocaleString();
}

function loadGoalsIntoForm() {
    const goals = getGoals();
    document.getElementById('stepsGoal').value = goals.steps;
    document.getElementById('caloriesGoal').value = goals.calories;
    document.getElementById('waterGoal').value = goals.water;

    document.getElementById('stepsGoalValue').textContent = fmt(goals.steps);
    document.getElementById('caloriesGoalValue').textContent = fmt(goals.calories);
    document.getElementById('waterGoalValue').textContent = fmt(goals.water);
}

function handleSaveGoals() {
    const steps = parseInt(document.getElementById('stepsGoal').value, 10) || 0;
    const calories = parseInt(document.getElementById('caloriesGoal').value, 10) || 0;
    const water = parseInt(document.getElementById('waterGoal').value, 10) || 0;
    const updated = saveGoals({ steps, calories, water });
    document.getElementById('stepsGoalValue').textContent = fmt(updated.steps);
    document.getElementById('caloriesGoalValue').textContent = fmt(updated.calories);
    document.getElementById('waterGoalValue').textContent = fmt(updated.water);
    showToast('Goals saved successfully!');
}

function renderLogsByType(type) {
    const today = new Date().toISOString().split('T')[0];
    const logs = getLogs().filter(l => l.type === type && l.date === today);
    const listEl = document.getElementById(type + 'List');

    if (logs.length === 0) {
        listEl.innerHTML = '<div class="empty-state">No logs yet</div>';
    } else {
        listEl.innerHTML = logs.map(l => `
            <div class="meal-item">
                <div class="meal-item-info">
                    <h4>${type === 'steps' ? fmt(l.amount) + ' steps' : type === 'calories' ? fmt(l.amount) + ' kcal' : fmt(l.amount) + ' glasses'}</h4>
                    <p>${l.time}${l.note ? ' • ' + l.note : ''}</p>
                </div>
                <div class="button-group">
                    <button class="delete-btn" onclick="handleEditLog('${l.id}')">✏️</button>
                    <button class="delete-btn" onclick="handleDeleteLog('${l.id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    const total = logs.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);
    if (type === 'steps') document.getElementById('stepsTotal').textContent = fmt(total) + ' steps';
    if (type === 'calories') document.getElementById('caloriesTotal').textContent = fmt(total) + ' kcal';
    if (type === 'water') document.getElementById('waterTotal').textContent = fmt(total) + ' glasses';
}

function renderAllLogs() {
    renderLogsByType('steps');
    renderLogsByType('calories');
    renderLogsByType('water');
}

// Modal controls
const logModal = document.getElementById('logModal');
const closeLogModalBtn = document.getElementById('closeLogModal');
const logForm = document.getElementById('logForm');

function openLogModal(presetType = null) {
    editingLogId = null;
    document.getElementById('logModalTitle').textContent = 'Add Log';
    document.getElementById('logSubmitBtn').textContent = 'Save';
    logForm.reset();
    if (presetType) {
        document.getElementById('logType').value = presetType;
    }
    document.getElementById('amountError').textContent = '';
    logModal.classList.add('active');
}

function handleEditLog(id) {
    const log = getLogs().find(l => l.id === id);
    if (!log) return;
    editingLogId = id;
    document.getElementById('logModalTitle').textContent = 'Edit Log';
    document.getElementById('logSubmitBtn').textContent = 'Update';
    document.getElementById('logId').value = id;
    document.getElementById('logType').value = log.type;
    document.getElementById('logAmount').value = log.amount;
    document.getElementById('logNote').value = log.note || '';
    document.getElementById('amountError').textContent = '';
    logModal.classList.add('active');
}

closeLogModalBtn.addEventListener('click', () => {
    logModal.classList.remove('active');
    logForm.reset();
    editingLogId = null;
});

logModal.addEventListener('click', (e) => {
    if (e.target === logModal) {
        logModal.classList.remove('active');
        logForm.reset();
        editingLogId = null;
        document.getElementById('amountError').textContent = '';
    }
});

function validateLogForm() {
    const amount = parseInt(document.getElementById('logAmount').value, 10);
    let ok = true;
    if (!amount || amount < 1) {
        document.getElementById('amountError').textContent = 'Amount must be at least 1';
        ok = false;
    } else {
        document.getElementById('amountError').textContent = '';
    }
    return ok;
}

logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateLogForm()) return;

    const payload = {
        type: document.getElementById('logType').value,
        amount: parseInt(document.getElementById('logAmount').value, 10),
        note: document.getElementById('logNote').value.trim()
    };

    if (editingLogId) {
        updateLog(editingLogId, payload);
        showToast('Log updated');
    } else {
        saveLog(payload);
        showToast('Log added');
    }

    syncWellnessWithLogs();
    logModal.classList.remove('active');
    logForm.reset();
    editingLogId = null;
    renderAllLogs();
    if (typeof syncWellnessWithLogs === 'function') {
        syncWellnessWithLogs();
    }
});

function handleDeleteLog(id) {
    if (typeof showConfirm === 'function') {
        showConfirm({
            title: 'Delete Log',
            message: 'Delete this log entry? This action is permanent.',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        }).then(ok => {
            if (!ok) return;
            deleteLog(id);
            if (typeof syncWellnessWithLogs === 'function') {
                syncWellnessWithLogs();
            }
            renderAllLogs();
            showToast('Log deleted');
        });
    } else {
        if (!confirm('Delete this log?')) return;
        deleteLog(id);
        if (typeof syncWellnessWithLogs === 'function') {
            syncWellnessWithLogs();
        }
        renderAllLogs();
        showToast('Log deleted');
    }
}

// Add buttons
['steps','calories','water'].forEach(t => {
    document.getElementById('add' + t.charAt(0).toUpperCase() + t.slice(1) + 'Btn')
        .addEventListener('click', () => openLogModal(t));
});

// Save goals
document.getElementById('saveGoalsBtn').addEventListener('click', handleSaveGoals);

// Sync with dashboard wellness
const syncBtn = document.getElementById('syncBtn');
syncBtn.addEventListener('click', () => {
    const totals = syncWellnessWithLogs();
    showToast('Dashboard synced: steps ' + fmt(totals.steps) + ', calories ' + fmt(totals.calories) + ', water ' + fmt(totals.water));
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGoalsIntoForm();
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    renderAllLogs();
});
