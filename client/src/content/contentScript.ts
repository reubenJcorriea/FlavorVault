export {};

interface RecipeData {
  url: string;
  title: string;
  ingredients: string[];
  directions: string[];
  image?: string;
  cookingTime?: string;
  servings?: string;
}

const getTextContent = (selector: string): string => {
  const element = document.querySelector(selector);
  return element ? element.textContent?.trim() || "Unknown" : "Unknown";
};

const getListContent = (selector: string): string[] => {
  return Array.from(document.querySelectorAll(selector))
              .map(el => el.textContent?.trim() || "")
              .filter(text => text.length > 0); // Filter out empty strings
};

const scrapeRecipeData = (): RecipeData | null => {
  if (!document.querySelector("[itemprop='recipeIngredient'], .ingredients li")) {
    console.error("Not a recipe page or recipe schema not found.");
    sendMessageToBackground({ action: "invalidPage", data: { url: window.location.href, title: "", ingredients: [], directions: [] } });
    return null;
  }

  const recipeData: RecipeData = {
    url: window.location.href,
    title: getTextContent("h1"),
    ingredients: getListContent("[itemprop='recipeIngredient'], .ingredients li"),
    directions: getListContent("[itemprop='recipeInstructions'], .directions li, .instructions li"),
    image: document.querySelector("[itemprop='image']")?.getAttribute("src") ?? "",
    cookingTime: getTextContent("[itemprop='totalTime']"),
    servings: getTextContent("[itemprop='recipeYield']")
  };

  console.log("Scraped recipe data:", recipeData);
  return recipeData;
};

const sendMessageToBackground = (message: { action: string; data?: RecipeData }) => {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message to background script:', chrome.runtime.lastError);
    } else {
      console.log('Response from background:', response);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const recipeData = scrapeRecipeData();
  if (recipeData) {
    sendMessageToBackground({ action: "saveRecipe", data: recipeData });
  }
});

window.addEventListener('myCustomEvent', (event) => {
  const customEvent = event as CustomEvent;
  chrome.runtime.sendMessage(customEvent.detail);
});
