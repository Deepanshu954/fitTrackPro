// Update Live Clock
function updateClock() {
    const now = new Date();
    
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('liveTime').textContent = timeString;
    document.getElementById('liveDate').textContent = dateString;
}

// Update Progress Circle
function updateProgressCircle(id, value, max) {
    const circle = document.getElementById(id + 'Circle');
    const valueEl = document.getElementById(id + 'Value');
    const goalMap = { steps: 'stepGoal', calories: 'calorieGoal', water: 'waterGoal' };
    const goalEl = document.getElementById(goalMap[id]);

    if (!circle || !valueEl || !max || max < 1) return;

    const safeValue = Math.max(0, Number(value) || 0);
    const safeMax = Math.max(1, Number(max) || 1);
    const percentage = Math.min((safeValue / safeMax) * 100, 100);
    const circumference = 2 * Math.PI * 70; // radius = 70
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;

    valueEl.textContent = safeValue.toLocaleString();

    if (goalEl) {
        goalEl.textContent = Math.round(percentage) + '%';
    }
}

// Load Dashboard Data
function loadDashboard() {
    // Always recompute wellness from sources for fresh data
    if (typeof recomputeWellnessFromSources === 'function') {
        recomputeWellnessFromSources();
    } else if (typeof syncWellnessWithLogs === 'function') {
        syncWellnessWithLogs();
    }

    const wellnessData = getWellnessData();
    const goals = typeof getGoals === 'function' ? getGoals() : { steps: 10000, calories: 3000, water: 8 };

    updateProgressCircle('steps', wellnessData.steps, goals.steps);
    updateProgressCircle('calories', wellnessData.calories, goals.calories);
    updateProgressCircle('water', wellnessData.water, goals.water);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
    
    loadDashboard();
    // Live updates when localStorage changes (other pages modify data)
    window.addEventListener('storage', (e) => {
        if (!e.key) return;
        const relevant = ['fittrack_wellness','fittrack_activities','fittrack_logs','fittrack_goals'];
        if (relevant.includes(e.key)) {
            loadDashboard();
        }
    });
});
