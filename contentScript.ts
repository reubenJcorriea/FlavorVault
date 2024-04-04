interface RecipeData {
    title: string;
    ingredients: string[];
    directions: string[];
    image: string;
    cookingTime: string;
    servings: string;
}

const isRecipePage = (): boolean => {
    return Boolean(document.querySelector("[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"));
};

const scrapeRecipeData = (): RecipeData => {
    const title = document.querySelector("h1")?.innerText || "Unknown Title";
    const ingredients = Array.from(document.querySelectorAll("[itemprop='recipeIngredient'], .ingredients li"))
                             .map((el: Element) => (el as HTMLElement).innerText.trim());
    const directions = Array.from(document.querySelectorAll("[itemprop='recipeInstructions'], .directions li, .instructions li"))
                           .map((el: Element) => (el as HTMLElement).innerText.trim());
    const image = document.querySelector("[itemprop='image']")?.getAttribute("src") || "";
    const cookingTime = (document.querySelector("[itemprop='totalTime']") as HTMLElement)?.innerText || "Unknown";
    const servings = (document.querySelector("[itemprop='recipeYield']") as HTMLElement)?.innerText || "Serves Unknown";

    return { title, ingredients, directions, image, cookingTime, servings };
};

const sendMessageToBackground = (message: { action: string; data?: RecipeData }) => {
    chrome.runtime.sendMessage(message);
};

document.addEventListener("DOMContentLoaded", () => {
    if (isRecipePage()) {
        const recipeData = scrapeRecipeData();
        sendMessageToBackground({ action: "saveRecipe", data: recipeData });
    } else {
        sendMessageToBackground({ action: "invalidPage" });
    }
});

export {};
