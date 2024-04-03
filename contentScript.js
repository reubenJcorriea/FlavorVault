var isRecipePage = function () {
    // This function needs to be tailored based on the structure of the target websites.
    // As an example, let's assume we're looking for a specific HTML structure
    return Boolean(document.querySelector("[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"));
};
var scrapeRecipeData = function () {
    var _a, _b, _c, _d;
    // Placeholder logic for scraping a recipe. This will need to be adjusted.
    var title = ((_a = document.querySelector("h1")) === null || _a === void 0 ? void 0 : _a.innerText) || "Unknown Title";
    var ingredients = Array.from(document.querySelectorAll("[itemprop='recipeIngredient'], .ingredients li")).map(function (el) { return el.innerText.trim(); });
    var directions = Array.from(document.querySelectorAll("[itemprop='recipeInstructions'], .directions li, .instructions li")).map(function (el) { return el.innerText.trim(); });
    var image = ((_b = document.querySelector("[itemprop='image']")) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) || "";
    // Extract additional information as needed, such as cooking time, serving size, etc.
    var cookingTime = ((_c = document.querySelector("[itemprop='totalTime']")) === null || _c === void 0 ? void 0 : _c.innerText) ||
        "Unknown";
    var servings = ((_d = document.querySelector("[itemprop='recipeYield']")) === null || _d === void 0 ? void 0 : _d.innerText) ||
        "Serves Unknown";
    return {
        title: title,
        ingredients: ingredients,
        directions: directions,
        image: image,
        cookingTime: cookingTime,
        servings: servings,
    };
};
var sendMessageToBackground = function (message) {
    chrome.runtime.sendMessage(message);
};
document.addEventListener("DOMContentLoaded", function () {
    if (isRecipePage()) {
        console.log("Recipe page detected.");
        var recipeData = scrapeRecipeData();
        console.log("Scraped recipe data:", recipeData);
        // Sending a message to the background script with the action to save the recipe data
        sendMessageToBackground({ action: "saveRecipe", data: recipeData });
    }
    else {
        console.log("Not a recipe page.");
        // Sending a message to the background script that it's an invalid page
        sendMessageToBackground({ action: "invalidPage" });
    }
});
