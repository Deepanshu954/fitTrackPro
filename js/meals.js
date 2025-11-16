// Render Meals by Type
function renderMealsByType(type) {
    const meals = getMeals().filter(m => m.type === type);
    const listEl = document.getElementById(type + 'List');
    const caloriesEl = document.getElementById(type + 'Calories');
    
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    caloriesEl.textContent = totalCalories + ' kcal';
    
    if (meals.length === 0) {
        listEl.innerHTML = '<div class="empty-state">No meals added yet</div>';
        return;
    }
    
    listEl.innerHTML = meals.map(meal => `
        <div class="meal-item">
            <div class="meal-item-info">
                <h4>${meal.name}</h4>
                <p>${meal.calories} kcal</p>
            </div>
            <button class="delete-btn" onclick="handleDeleteMeal('${meal.id}', '${meal.name}')">
                🗑️
            </button>
        </div>
    `).join('');
}

// Render All Meals
function renderAllMeals() {
    renderMealsByType('breakfast');
    renderMealsByType('lunch');
    renderMealsByType('dinner');
    updateTotalCalories();
}

// Update Total Calories
function updateTotalCalories() {
    const meals = getMeals();
    const total = meals.reduce((sum, m) => sum + m.calories, 0);
    document.getElementById('totalMealCalories').textContent = total.toLocaleString();
}

// Handle Delete
function handleDeleteMeal(id, name) {
    if (typeof showConfirm === 'function') {
        showConfirm({
            title: 'Delete Meal',
            message: `Remove "${name}" from today?`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        }).then(ok => {
            if (!ok) return;
            deleteMeal(id);
            renderAllMeals();
            showToast(`${name} removed successfully`);
        });
    } else {
        if (confirm(`Delete "${name}"?`)) {
            deleteMeal(id);
            renderAllMeals();
            showToast(`${name} removed successfully`);
        }
    }
}

// Modal Controls
const modal = document.getElementById('mealModal');
const addBtn = document.getElementById('addMealBtn');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('mealForm');

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
    
    const name = document.getElementById('mealName').value.trim();
    const calories = parseInt(document.getElementById('mealCalories').value);
    
    if (!name) {
        showError('nameError', 'Meal name is required');
        isValid = false;
    } else if (name.length > 100) {
        showError('nameError', 'Name must be less than 100 characters');
        isValid = false;
    }
    
    if (!calories || calories < 1 || calories > 3000) {
        showError('caloriesError', 'Calories must be between 1 and 3000');
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
    
    const meal = {
        name: document.getElementById('mealName').value.trim(),
        calories: parseInt(document.getElementById('mealCalories').value),
        type: document.getElementById('mealType').value
    };
    
    saveMeal(meal);
    
    modal.classList.remove('active');
    form.reset();
    renderAllMeals();
    
    showToast(`${meal.name} added successfully!`);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderAllMeals();
});
