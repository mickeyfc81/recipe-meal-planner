let recipes = [];
let lastMealPlan = [];
let isLoggedIn = false;

// ==================== AUTH ====================
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = prompt('Enter a name for your recipe collection:');
    if (username && username.trim()) {
        localStorage.setItem('username', username.trim());
        loginUser();
    }
});

function loginUser() {
    isLoggedIn = true;
    const username = localStorage.getItem('username') || 'Recipe Lover';
    
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('loginPrompt').style.display = 'none';
    document.getElementById('authStatus').innerHTML = `<span style="color: #155724;">Welcome, ${escapeHtml(username)}! Your recipes are saved on this device.</span>`;
    
    loadRecipes();
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    isLoggedIn = false;
    recipes = [];
    localStorage.removeItem('username');
    localStorage.removeItem('recipes');
    
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginPrompt').style.display = 'block';
    document.getElementById('authStatus').innerHTML = '';
});

// ==================== RECIPE MANAGEMENT ====================
document.getElementById('addRecipeBtn').addEventListener('click', addRecipe);

async function addRecipe() {
    const link = document.getElementById('recipeLink').value.trim();
    const category = document.getElementById('recipeCategory').value;

    if (!link) {
        showStatus('Please enter a recipe link or name', 'error');
        return;
    }

    const recipe = {
        link,
        category,
        dateAdded: new Date().toLocaleDateString(),
        id: Date.now()
    };

    recipes.push(recipe);
    await saveRecipesToSheet(recipes);
    
    document.getElementById('recipeLink').value = '';
    document.getElementById('recipeCategory').value = '';
    
    renderRecipeList();
    showStatus('Recipe added!', 'success');
}

async function saveRecipesToSheet(recipesToSave) {
    localStorage.setItem('recipes', JSON.stringify(recipesToSave));
}

function loadRecipes() {
    const saved = localStorage.getItem('recipes');
    recipes = saved ? JSON.parse(saved) : [];