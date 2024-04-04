export {};

// Define interfaces for better type checking and readability
interface ScrapedRecipeData {
  title: string;
  ingredients: string[];
  directions: string[];
  image: string;
  cookingTime: string;
  servings: string;
}

interface MessageToBackground {
  action: "saveRecipe" | "invalidPage";
  data?: ScrapedRecipeData;
}

// Utility function to get text content from a selector
const querySelectorText = (selector: string): string => {
  return (
    (document.querySelector(selector) as HTMLElement)?.innerText.trim() ||
    "Unknown"
  );
};

// Utility function to get an array of text contents from a list of elements matched by a selector
const querySelectorAllText = (selector: string): string[] => {
  return Array.from(document.querySelectorAll(selector)).map((el) =>
    (el as HTMLElement).innerText.trim()
  );
};

// Check if the current page is a recipe page based on specific schema markup
const isRecipePage = (): boolean => {
  return Boolean(
    document.querySelector(
      "[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"
    )
  );
};

// Scrape recipe data from the current page
const scrapeRecipeData = (): ScrapedRecipeData => {
  const title = querySelectorText("h1");
  const ingredients = querySelectorAllText(
    "[itemprop='recipeIngredient'], .ingredients li"
  );
  const directions = querySelectorAllText(
    "[itemprop='recipeInstructions'], .directions li, .instructions li"
  );
  const image =
    document.querySelector("[itemprop='image']")?.getAttribute("src") || "";
  const cookingTime = querySelectorText("[itemprop='totalTime']");
  const servings = querySelectorText("[itemprop='recipeYield']");

  return { title, ingredients, directions, image, cookingTime, servings };
};

//   Send a message to the background script
const sendMessageToBackground = (message: MessageToBackground) => {
  chrome.runtime.sendMessage(message);
};

// Main function to execute when the DOM is fully loaded
const main = () => {
  if (isRecipePage()) {
    const recipeData = scrapeRecipeData();
    console.log("Scraped recipe data:", recipeData);
    sendMessageToBackground({ action: "saveRecipe", data: recipeData });
  } else {
    console.error("Not a recipe page or recipe schema not found.");
    sendMessageToBackground({ action: "invalidPage" });
  }
};

document.addEventListener("DOMContentLoaded", main);
