document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.popup__button--search');
    const saveButton = document.querySelector('.popup__button--save');
    const searchInput = document.querySelector('.popup__search');
    const recipesList = document.querySelector('.popup__recipes');

    // Function to handle recipe search
    const searchRecipes = () => {
        const query = searchInput.value.trim();
        // Storing recipes in chrome.storage.local
        chrome.storage.local.get(null, (items) => {
            const recipes = Object.values(items);
            const filteredRecipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(query.toLowerCase()));
            
            displayRecipes(filteredRecipes);
        });
    };

    // Function to display recipes in the popup
    const displayRecipes = (recipes) => {
        recipesList.innerHTML = ''; // Clear current list
        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.textContent = recipe.title; // Simple display
            recipesList.appendChild(li);
        });
    };

    // Function to save the current page as a recipe
    const saveCurrentPage = () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "saveRecipe"});
        });
    };

    // Event listeners
    searchButton.addEventListener('click', searchRecipes);
    saveButton.addEventListener('click', saveCurrentPage);
});
