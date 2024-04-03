const isRecipePage = (): boolean => {
  // This function needs to be tailored based on the structure of the target websites.
  // As an example, let's assume we're looking for a specific HTML structure
  return Boolean(
    document.querySelector(
      "[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"
    )
  );
};

const scrapeRecipeData = (): any => {
  // Placeholder logic for scraping a recipe. This will need to be adjusted.
let title = document.querySelector("h1")?.innerText || "Unknown Title";
let ingredients = Array.from(
    document.querySelectorAll("[itemprop='recipeIngredient'], .ingredients li")
).map((el) => (el as HTMLElement).innerText.trim());
let directions = Array.from(
    document.querySelectorAll(
        "[itemprop='recipeInstructions'], .directions li, .instructions li"
    )
).map((el) => (el as HTMLElement).innerText.trim());
let image =
    document.querySelector("[itemprop='image']")?.getAttribute("src") || "";

// Extract additional information as needed, such as cooking time, serving size, etc.
let cookingTime =
    (document.querySelector("[itemprop='totalTime']") as HTMLElement)?.innerText ||
    "Unknown";
let servings =
    (document.querySelector("[itemprop='recipeYield']") as HTMLElement)?.innerText ||
    "Serves Unknown";

  return {
    title,
    ingredients,
    directions,
    image,
    cookingTime,
    servings,
  };
};

declare const chrome: any;

const sendMessageToBackground = (message: any): void => {
    chrome.runtime.sendMessage(message);
};

document.addEventListener("DOMContentLoaded", () => {
  if (isRecipePage()) {
    console.log("Recipe page detected.");
    const recipeData = scrapeRecipeData();
    console.log("Scraped recipe data:", recipeData);
    // Sending a message to the background script with the action to save the recipe data
    sendMessageToBackground({ action: "saveRecipe", data: recipeData });
  } else {
    console.log("Not a recipe page.");
    // Sending a message to the background script that it's an invalid page
    sendMessageToBackground({ action: "invalidPage" });
  }
});
