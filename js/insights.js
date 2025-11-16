// Weekly Data (Simulated for display)
const weeklyActivityData = [
    { day: 'Mon', value: 4, label: '4 activities' },
    { day: 'Tue', value: 3, label: '3 activities' },
    { day: 'Wed', value: 5, label: '5 activities' },
    { day: 'Thu', value: 2, label: '2 activities' },
    { day: 'Fri', value: 4, label: '4 activities' },
    { day: 'Sat', value: 6, label: '6 activities' },
    { day: 'Sun', value: 3, label: '3 activities' }
];

const weeklyCalorieData = [
    { day: 'Mon', value: 2500, label: '2500 kcal' },
    { day: 'Tue', value: 2200, label: '2200 kcal' },
    { day: 'Wed', value: 2800, label: '2800 kcal' },
    { day: 'Thu', value: 2100, label: '2100 kcal' },
    { day: 'Fri', value: 2600, label: '2600 kcal' },
    { day: 'Sat', value: 3000, label: '3000 kcal' },
    { day: 'Sun', value: 2400, label: '2400 kcal' }
];

// Render Chart (div bars, no libraries)
function renderChart(containerId, data, isAccent = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const maxValue = Math.max(1, ...data.map(d => d.value));
    
    container.innerHTML = data.map(item => {
        const height = (item.value / maxValue) * 200;
        const barClass = isAccent ? 'bar accent-bar' : 'bar';
        
        return `
            <div class="chart-bar">
                <div class="${barClass}" style="height: ${height}px;">
                    <div class="bar-tooltip">${item.label}</div>
                </div>
                <div class="bar-label">${item.day}</div>
            </div>
        `;
    }).join('');
}

// Update Stats from localStorage
function updateStats() {
    const activities = getActivities();
    const meals = getMeals();
    
    const totalActivities = activities.length;
    const totalCaloriesBurned = activities.reduce((sum, a) => sum + (Number(a.calories) || 0), 0);
    const totalMeals = meals.length;
    const totalCaloriesConsumed = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
    
    document.getElementById('totalActivities').textContent = totalActivities;
    document.getElementById('totalCaloriesBurned').textContent = totalCaloriesBurned.toLocaleString();
    document.getElementById('totalMeals').textContent = totalMeals;
    document.getElementById('totalCaloriesConsumed').textContent = totalCaloriesConsumed.toLocaleString();
}

// Download Summary (simulated)
function handleDownload() {
    const activities = getActivities();
    const meals = getMeals();
    
    const summary = {
        generatedAt: new Date().toISOString(),
        activities: {
            total: activities.length,
            caloriesBurned: activities.reduce((sum, a) => sum + (Number(a.calories) || 0), 0),
            list: activities
        },
        meals: {
            total: meals.length,
            caloriesConsumed: meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0),
            list: meals
        }
    };
    
    const dataStr = JSON.stringify(summary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fittrack-summary-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast('Summary downloaded successfully!');
}

// Reset Dashboard (clears localStorage)
function handleReset() {
    if (typeof showConfirm === 'function') {
        showConfirm({
            title: 'Reset All Data',
            message: 'Reset all activities, meals, wellness and goals? This cannot be undone.',
            confirmText: 'Reset',
            cancelText: 'Cancel'
        }).then(ok => {
            if (!ok) return;
            resetAllData();
            updateStats();
            showToast('Dashboard reset successfully!');
            setTimeout(() => window.location.reload(), 800);
        });
    } else {
        if (confirm('Are you sure you want to reset all dashboard data? This cannot be undone.')) {
            resetAllData();
            updateStats();
            showToast('Dashboard reset successfully!');
            setTimeout(() => window.location.reload(), 800);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderChart('activityChart', weeklyActivityData);
    renderChart('calorieChart', weeklyCalorieData, true);
    updateStats();
    
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);
    document.getElementById('resetBtn').addEventListener('click', handleReset);
});
