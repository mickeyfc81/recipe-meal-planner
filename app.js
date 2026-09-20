let recipes = [];

function init() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const addBtn = document.getElementById('addRecipeBtn');
    const generateBtn = document.getElementById('generatePlanBtn');
    
    if (loginBtn) {
        loginBtn.onclick = function() {
            const name = prompt('Enter a name for your recipe collection:');
            if (name && name.trim()) {
                localStorage.setItem('username', name.trim());
                showLoggedIn();
            }
        };
    }
    
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('username');
            localStorage.removeItem('recipes');
            location.reload();
        };
    }
    
    if (addBtn) {
        addBtn.onclick = addRecipe;
    }
    
    if (generateBtn) {
        generateBtn.onclick = generateMealPlan;
    }
    
    const username = localStorage.getItem('username');
    if (username) {
        showLoggedIn();
    }
}

function showLoggedIn() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('loginPrompt').style.display = 'none';
    loadRecipes();
}

function addRecipe() {
    const link = document.getElementById('recipeLink').value.trim();
    const category = document.getElementById('recipeCategory').value;
    
    if (!link) {
        alert('Please enter a recipe link or name');
        return;
    }
    
    const recipe = {
        id: Date.now(),
        link: link,
        category: category
    };
    
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    document.getElementById('recipeLink').value = '';
    document.getElementById('recipeCategory').value = '';
    renderRecipeList();
    alert('Recipe added!');
}

function loadRecipes() {
    const saved = localStorage.getItem('recipes');
    recipes = saved ? JSON.parse(saved) : [];
    renderRecipeList();
}

function renderRecipeList() {
    const list = document.getElementById('recipeList');
    const count = document.getElementById('recipeCount');
    
    list.innerHTML = '';
    count.textContent = recipes.length;
    
    if (recipes.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#999;">No recipes yet. Add one to get started!</p>';
        return;
    }
    
    recipes.forEach(r => {
        const item = document.createElement('div');
        item.className = 'recipe-item';
        item.innerHTML = `
            <div class="recipe-item-info">
                <div class="recipe-item-title">${r.link}</div>
                <div class="recipe-item-category">${r.category || 'Other'}</div>
            </div>
            <button class="btn btn-danger" onclick="removeRecipe(${r.id})">Delete</button>
        `;
        list.appendChild(item);
    });
}

function removeRecipe(id) {
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    renderRecipeList();
}

function generateMealPlan() {
    if (recipes.length < 7) {
        alert('You need at least 7 recipes. You have ' + recipes.length);
        return;
    }
    
    const shuffled = [...recipes].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 7);
    
    const mealPlanSection = document.getElementById('mealPlanSection');
    const mealPlanDiv = document.getElementById('mealPlan');
    
    mealPlanSection.style.display = 'block';
    mealPlanDiv.innerHTML = '';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    selected.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'meal-day';
        div.innerHTML = `
            <div class="meal-day-header">${days[i]}</div>