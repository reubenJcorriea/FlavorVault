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
    case "startScraping":
      // Code to inject contentScript.js into the current tab, which scrapes the recipe data
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['contentScript.js']
          }).then(() => {
            console.log("Content script has been injected for scraping.");
          }).catch(error => {
            console.error("Failed to inject content script:", error);
            sendResponse({ status: "error", detail: "Failed to start scraping." });
          });
        }
      });
      break;
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
    case "fetchRecipes":
      const recipes = await fetchRecipes();
      sendResponse({ status: "success", data: recipes });
      break;
    // Handle other cases...
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



