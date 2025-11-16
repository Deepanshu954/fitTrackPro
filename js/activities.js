let currentFilter = 'all';

// Render Activities
function renderActivities() {
    const activities = getActivities();
    const filtered = currentFilter === 'all' 
        ? activities 
        : activities.filter(a => a.timeOfDay === currentFilter);
    
    const listEl = document.getElementById('activitiesList');
    
    if (filtered.length === 0) {
        listEl.innerHTML = '<div class="empty-state">No activities found</div>';
        return;
    }
    
    listEl.innerHTML = filtered.map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <h4>${activity.name}</h4>
                <div class="activity-meta">
                    <span>⏱️ ${activity.duration} mins</span>
                    <span>🔥 ${activity.calories} kcal</span>
                    <span>🕐 ${capitalize(activity.timeOfDay)}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="handleDeleteActivity('${activity.id}', '${activity.name}')">
                🗑️ Delete
            </button>
        </div>
    `).join('');
}

// Update Total Calories
function updateTotalCalories() {
    const activities = getActivities();
    const total = activities.reduce((sum, a) => sum + a.calories, 0);
    document.getElementById('totalCalories').textContent = total.toLocaleString();
}

// Handle Filter
function handleFilter(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderActivities();
}

// Handle Delete
function handleDeleteActivity(id, name) {
    if (typeof showConfirm === 'function') {
        showConfirm({
            title: 'Delete Activity',
            message: `Delete "${name}"? This cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        }).then(ok => {
            if (!ok) return;
            deleteActivity(id);
            renderActivities();
            updateTotalCalories();
            showToast(`${name} deleted successfully`);
            if (typeof syncWellnessWithLogs === 'function') {
                syncWellnessWithLogs();
            }
        });
    } else {
        // fallback
        if (confirm(`Delete "${name}"?`)) {
            deleteActivity(id);
            renderActivities();
            updateTotalCalories();
            showToast(`${name} deleted successfully`);
            if (typeof syncWellnessWithLogs === 'function') {
                syncWellnessWithLogs();
            }
        }
    }
}

// Modal Controls
const modal = document.getElementById('activityModal');
const addBtn = document.getElementById('addActivityBtn');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('activityForm');

addBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    form.reset();
    clearErrors();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        form.reset();
        clearErrors();
    }
});

// Form Validation
function validateForm() {
    clearErrors();
    let isValid = true;
    
    const name = document.getElementById('activityName').value.trim();
    const duration = parseInt(document.getElementById('duration').value);
    const calories = parseInt(document.getElementById('calories').value);
    
    if (!name) {
        showError('nameError', 'Activity name is required');
        isValid = false;
    } else if (name.length > 100) {
        showError('nameError', 'Name must be less than 100 characters');
        isValid = false;
    }
    
    if (!duration || duration < 1 || duration > 300) {
        showError('durationError', 'Duration must be between 1 and 300 minutes');
        isValid = false;
    }
    
    if (!calories || calories < 1 || calories > 2000) {
        showError('caloriesError', 'Calories must be between 1 and 2000');
        isValid = false;
    }
    
    return isValid;
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const activity = {
        name: document.getElementById('activityName').value.trim(),
        duration: parseInt(document.getElementById('duration').value),
        calories: parseInt(document.getElementById('calories').value),
        timeOfDay: document.getElementById('timeOfDay').value
    };
    
    saveActivity(activity);
    
    modal.classList.remove('active');
    form.reset();
    renderActivities();
    updateTotalCalories();
    
    showToast(`${activity.name} added successfully!`);
    if (typeof syncWellnessWithLogs === 'function') {
        syncWellnessWithLogs();
    }
});

// Filter Tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderActivities();
    });
});

// Helper
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderActivities();
    updateTotalCalories();
});
