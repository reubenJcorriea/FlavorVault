interface RecipeData {
    title: string;
    ingredients: string[];
    directions: string[];
    image: string;
    cookingTime: string;
    servings: string;
  }
  
  const isRecipePage = (): boolean => {
    // Checks for common recipe schema markup
    return Boolean(document.querySelector("[itemtype*='schema.org/Recipe']"));
  };
  
  const scrapeRecipeData = (): RecipeData | null => {
    try {
      const title = document.querySelector("h1")?.innerText || "Unknown Title";
  
      const ingredientsSelector = document.querySelectorAll("[itemprop='recipeIngredient'], .ingredients li, ul.ingredients li");
      const ingredients = ingredientsSelector.length ? Array.from(ingredientsSelector).map(el => el.textContent?.trim() ?? "") : ["Ingredients not found"];
  
      const directionsSelector = document.querySelectorAll("[itemprop='recipeInstructions'], .directions li, ol.instructions li, ul.directions li");
      const directions = directionsSelector.length ? Array.from(directionsSelector).map(el => el.textContent?.trim() ?? "") : ["Directions not found"];
  
      const image = document.querySelector("[itemprop='image']")?.getAttribute("src") || "No image available";
  
      const cookingTime = document.querySelector("[itemprop='totalTime']")?.textContent?.trim() || "Cooking time unknown";
      const servings = document.querySelector("[itemprop='recipeYield']")?.textContent?.trim() || "Servings unknown";
  
      return {
        title,
        ingredients,
        directions,
        image,
        cookingTime,
        servings,
      };
    } catch (error) {
      console.error("Error scraping recipe data: ", error);
      return null; // Return null if scraping fails
    }
  };
  
  const sendMessageToBackground = (message: object): void => {
    chrome.runtime.sendMessage(message);
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    if (isRecipePage()) {
      console.log("Recipe page detected.");
      const recipeData = scrapeRecipeData();
      if (recipeData) {
        console.log("Scraped recipe data:", recipeData);
        sendMessageToBackground({ action: "saveRecipe", data: recipeData });
      } else {
        console.log("Failed to scrape recipe data.");
        sendMessageToBackground({ action: "scrapeFailed" });
      }
    } else {
      console.log("Not a recipe page.");
      sendMessageToBackground({ action: "invalidPage" });
    }
  });
  