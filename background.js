chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case "saveRecipe":
      try {
        await saveRecipeData(message.data);
        updateIcon(sender.tab.id, true);
        sendResponse({ status: "success", detail: "Recipe saved" });
      } catch (error) {
        console.error("Error saving recipe:", error);
        sendResponse({ status: "error", detail: "Failed to save recipe" });
      }
      break;
    case "invalidPage":
      updateIcon(sender.tab.id, false);
      sendResponse({ status: "success", detail: "Invalid page detected" });
      break;
    case "scrapeFailed":
      console.error("Scraping failed for", sender.tab.url);
      sendResponse({ status: "error", detail: "Scraping failed" });
      break;
    case "fetchRecipes":
      const recipes = await fetchRecipes();
      sendResponse({ status: "success", data: recipes });
      break;
  }
  return true; // Keep the messaging channel open for asynchronous response
});

async function saveRecipeData(recipeData) {
  return new Promise((resolve, reject) => {
    const id =
      new URL(recipeData.url).hostname + new URL(recipeData.url).pathname;
    chrome.storage.local.set({ [id]: recipeData }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          `Error saving recipe for ${id}:`,
          chrome.runtime.lastError
        );
        reject(chrome.runtime.lastError);
      } else {
        console.log(`Recipe data for ${id} saved.`);
        resolve();
      }
    });
  });
}

function updateIcon(tabId, isValid) {
  const path = isValid ? "icons/icon-valid.png" : "icons/icon-invalid.png";
  chrome.action.setIcon({ tabId, path });
}

async function fetchRecipes() {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      const recipes = Object.values(items);
      resolve(recipes);
    });
  });
}
