// Define interfaces for structured data
interface RecipeData {
  url: string;
  // Add other properties as needed
}

interface Message {
  action: "saveRecipe" | "invalidPage" | "scrapeFailed" | "fetchRecipes";
  data?: RecipeData;
}

interface SendResponse {
  status: "success" | "error";
  detail?: string;
  data?: RecipeData[];
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (message: Message, sender, sendResponse: (response: SendResponse) => void) => {
  switch (message.action) {
    case "saveRecipe":
      if (message.data) {
        try {
          await saveRecipeData(message.data);
          updateIcon(sender.tab?.id ?? 0, true);
          sendResponse({ status: "success", detail: "Recipe saved" });
        } catch (error) {
          console.error("Error saving recipe:", error);
          sendResponse({ status: "error", detail: "Failed to save recipe" });
        }
      }
      break;
    case "invalidPage":
      updateIcon(sender.tab?.id ?? 0, false);
      sendResponse({ status: "success", detail: "Invalid page detected" });
      break;
    console.error("Scraping failed for", sender.tab?.url);
    case "fetchRecipes":
      const recipes = await fetchRecipes();
      sendResponse({ status: "success", data: recipes });
      break;
  }
  return true; // Indicates an asynchronous response
});

// Save recipe data
async function saveRecipeData(recipeData: RecipeData): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = new URL(recipeData.url).hostname + new URL(recipeData.url).pathname;
    chrome.storage.local.set({ [id]: recipeData }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error saving recipe for ${id}:`, chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log(`Recipe data for ${id} saved.`);
        resolve();
      }
    });
  });
}

// Update the extension icon
function updateIcon(tabId: number, isValid: boolean): void {
  const path = isValid ? "icons/icon-valid.png" : "icons/icon-invalid.png";
  chrome.action.setIcon({ tabId, path });
}

// Fetch saved recipes
async function fetchRecipes(): Promise<RecipeData[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      const recipes: RecipeData[] = Object.values(items);
      resolve(recipes);
    });
  });
}
