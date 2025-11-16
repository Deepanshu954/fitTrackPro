// Storage Keys
const STORAGE_KEYS = {
    ACTIVITIES: 'fittrack_activities',
    MEALS: 'fittrack_meals',
    WELLNESS: 'fittrack_wellness',
    GOALS: 'fittrack_goals',
    LOGS: 'fittrack_logs'
};

// Default Data
const DEFAULT_ACTIVITIES = [
    {
        id: '1',
        name: 'Morning Run',
        duration: 30,
        calories: 300,
        timeOfDay: 'morning',
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: '2',
        name: 'Yoga Session',
        duration: 45,
        calories: 150,
        timeOfDay: 'morning',
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: '3',
        name: 'Cycling',
        duration: 60,
        calories: 400,
        timeOfDay: 'afternoon',
        date: new Date().toISOString().split('T')[0]
    }
];

const DEFAULT_MEALS = [
    { id: '1', name: 'Oatmeal with Berries', calories: 350, type: 'breakfast', date: new Date().toISOString().split('T')[0] },
    { id: '2', name: 'Banana & Almonds', calories: 200, type: 'breakfast', date: new Date().toISOString().split('T')[0] },
    { id: '3', name: 'Grilled Chicken Salad', calories: 450, type: 'lunch', date: new Date().toISOString().split('T')[0] },
    { id: '4', name: 'Quinoa Bowl', calories: 380, type: 'lunch', date: new Date().toISOString().split('T')[0] },
    { id: '5', name: 'Salmon with Vegetables', calories: 550, type: 'dinner', date: new Date().toISOString().split('T')[0] },
    { id: '6', name: 'Brown Rice & Tofu', calories: 420, type: 'dinner', date: new Date().toISOString().split('T')[0] }
];

const DEFAULT_WELLNESS = {
    steps: 8543,
    calories: 2340,
    water: 6,
    date: new Date().toISOString().split('T')[0]
};

// Goals & Logs Defaults
const DEFAULT_GOALS = {
    steps: 10000,
    calories: 3000,
    water: 8
};

const DEFAULT_LOGS = [
    {
        id: 'l1',
        type: 'steps',
        amount: 3200,
        note: 'Morning walk',
        date: new Date().toISOString().split('T')[0],
        time: '08:30 AM'
    },
    {
        id: 'l2',
        type: 'calories',
        amount: 300,
        note: 'AM run burn',
        date: new Date().toISOString().split('T')[0],
        time: '09:15 AM'
    },
    {
        id: 'l3',
        type: 'water',
        amount: 2,
        note: 'Hydration start',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM'
    },
    {
        id: 'l4',
        type: 'steps',
        amount: 2500,
        note: 'Midday errands',
        date: new Date().toISOString().split('T')[0],
        time: '12:40 PM'
    },
    {
        id: 'l5',
        type: 'water',
        amount: 1,
        note: 'With lunch',
        date: new Date().toISOString().split('T')[0],
        time: '01:10 PM'
    }
];

// Storage Functions
function getActivities() {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
        return DEFAULT_ACTIVITIES;
    }
    return JSON.parse(stored);
}

function saveActivity(activity) {
    const activities = getActivities();
    const newActivity = {
        ...activity,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
    };
    activities.push(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    return newActivity;
}

function deleteActivity(id) {
    const activities = getActivities().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

function getMeals() {
    const stored = localStorage.getItem(STORAGE_KEYS.MEALS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(DEFAULT_MEALS));
        return DEFAULT_MEALS;
    }
    return JSON.parse(stored);
}

function saveMeal(meal) {
    const meals = getMeals();
    const newMeal = {
        ...meal,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
    };
    meals.push(newMeal);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    return newMeal;
}

function deleteMeal(id) {
    const meals = getMeals().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
}

function getWellnessData() {
    const stored = localStorage.getItem(STORAGE_KEYS.WELLNESS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(DEFAULT_WELLNESS));
        return DEFAULT_WELLNESS;
    }
    return JSON.parse(stored);
}

function updateWellnessData(data) {
    const current = getWellnessData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(updated));
}

function resetAllData() {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(DEFAULT_MEALS));
    localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(DEFAULT_WELLNESS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
}

// Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Goals Storage
function getGoals() {
    const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
        return { ...DEFAULT_GOALS };
    }
    try {
        const parsed = JSON.parse(stored);
        return {
            steps: Number(parsed.steps) || DEFAULT_GOALS.steps,
            calories: Number(parsed.calories) || DEFAULT_GOALS.calories,
            water: Number(parsed.water) || DEFAULT_GOALS.water
        };
    } catch {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
        return { ...DEFAULT_GOALS };
    }
}

function saveGoals(goals) {
    const sanitized = {
        steps: Math.max(1, Number(goals.steps) || DEFAULT_GOALS.steps),
        calories: Math.max(1, Number(goals.calories) || DEFAULT_GOALS.calories),
        water: Math.max(1, Number(goals.water) || DEFAULT_GOALS.water)
    };
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(sanitized));
    return sanitized;
}

// Logs Storage (for steps, calories burned, water intake)
function getLogs() {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
        return DEFAULT_LOGS;
    }
    try {
        return JSON.parse(stored);
    } catch {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
        return DEFAULT_LOGS;
    }
}

function saveLog(entry) {
    const logs = getLogs();
    const newEntry = {
        id: Date.now().toString(),
        type: entry.type, // 'steps' | 'calories' | 'water'
        amount: Number(entry.amount) || 0,
        note: entry.note || '',
        date: (entry.date || new Date().toISOString()).split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    logs.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return newEntry;
}

function updateLog(id, updates) {
    const logs = getLogs();
    const updated = logs.map(l => l.id === id ? { ...l, ...updates, amount: Number(updates.amount ?? l.amount) } : l);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
}

function deleteLog(id) {
    const logs = getLogs().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

function getTodayTotalsFromLogs() {
    const today = new Date().toISOString().split('T')[0];
    const logs = getLogs().filter(l => l.date === today);
    return logs.reduce((acc, l) => {
        if (l.type === 'steps') acc.steps += l.amount;
        if (l.type === 'calories') acc.calories += l.amount;
        if (l.type === 'water') acc.water += l.amount;
        return acc;
    }, { steps: 0, calories: 0, water: 0, date: today });
}

function syncWellnessWithLogs() {
    const today = new Date().toISOString().split('T')[0];
    const logs = getLogs().filter(l => l.date === today);
    const activitiesToday = (getActivities() || []).filter(a => a.date === today);

    // Aggregate from logs
    const aggregated = logs.reduce((acc, l) => {
        if (l.type === 'steps') acc.steps += Number(l.amount) || 0;
        if (l.type === 'calories') acc.calories += Number(l.amount) || 0;
        if (l.type === 'water') acc.water += Number(l.amount) || 0;
        return acc;
    }, { steps: 0, calories: 0, water: 0 });

    // Add calories from activities (avoid double counting: assume log calories are supplemental)
    const activityCalories = activitiesToday.reduce((sum, a) => sum + (Number(a.calories) || 0), 0);
    aggregated.calories += activityCalories;

    const totals = { ...aggregated, date: today };
    updateWellnessData(totals);
    return totals;
}

// Recompute wellness without mutating logs/goals directly (used on dashboard load)
function recomputeWellnessFromSources() {
    return syncWellnessWithLogs();
}
