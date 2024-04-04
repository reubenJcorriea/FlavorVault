// Utility function to get text content from a selector
const querySelectorText = (selector) => {
    var _a;
    return (((_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.innerText.trim()) ||
        "Unknown");
};
// Utility function to get an array of text contents from a list of elements matched by a selector
const querySelectorAllText = (selector) => {
    return Array.from(document.querySelectorAll(selector)).map((el) => el.innerText.trim());
};
// Check if the current page is a recipe page based on specific schema markup
const isRecipePage = () => {
    return Boolean(document.querySelector("[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"));
};
// Scrape recipe data from the current page
const scrapeRecipeData = () => {
    var _a;
    const title = querySelectorText("h1");
    const ingredients = querySelectorAllText("[itemprop='recipeIngredient'], .ingredients li");
    const directions = querySelectorAllText("[itemprop='recipeInstructions'], .directions li, .instructions li");
    const image = ((_a = document.querySelector("[itemprop='image']")) === null || _a === void 0 ? void 0 : _a.getAttribute("src")) || "";
    const cookingTime = querySelectorText("[itemprop='totalTime']");
    const servings = querySelectorText("[itemprop='recipeYield']");
    return { title, ingredients, directions, image, cookingTime, servings };
};
//   Send a message to the background script
const sendMessageToBackground = (message) => {
    chrome.runtime.sendMessage(message);
};
// Main function to execute when the DOM is fully loaded
const main = () => {
    if (isRecipePage()) {
        const recipeData = scrapeRecipeData();
        console.log("Scraped recipe data:", recipeData);
        sendMessageToBackground({ action: "saveRecipe", data: recipeData });
    }
    else {
        console.error("Not a recipe page or recipe schema not found.");
        sendMessageToBackground({ action: "invalidPage" });
    }
};
document.addEventListener("DOMContentLoaded", main);
export {};
//# sourceMappingURL=contentScript.js.map