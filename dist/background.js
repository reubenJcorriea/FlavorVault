"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    switch (message.action) {
        case "saveRecipe":
            if (message.data) {
                try {
                    yield saveRecipeData(message.data);
                    updateIcon((_b = (_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0, true);
                    sendResponse({ status: "success", detail: "Recipe saved" });
                }
                catch (error) {
                    console.error("Error saving recipe:", error);
                    sendResponse({ status: "error", detail: "Failed to save recipe" });
                }
            }
            break;
        case "invalidPage":
            updateIcon((_d = (_c = sender.tab) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 0, false);
            sendResponse({ status: "success", detail: "Invalid page detected" });
            break;
            console.error("Scraping failed for", (_e = sender.tab) === null || _e === void 0 ? void 0 : _e.url);
        case "fetchRecipes":
            const recipes = yield fetchRecipes();
            sendResponse({ status: "success", data: recipes });
            break;
    }
    return true; // Indicates an asynchronous response
}));
// Save recipe data
function saveRecipeData(recipeData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const id = new URL(recipeData.url).hostname + new URL(recipeData.url).pathname;
            chrome.storage.local.set({ [id]: recipeData }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error saving recipe for ${id}:`, chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                }
                else {
                    console.log(`Recipe data for ${id} saved.`);
                    resolve();
                }
            });
        });
    });
}
// Update the extension icon
function updateIcon(tabId, isValid) {
    const path = isValid ? "icons/icon-valid.png" : "icons/icon-invalid.png";
    chrome.action.setIcon({ tabId, path });
}
// Fetch saved recipes
function fetchRecipes() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (items) => {
                const recipes = Object.values(items);
                resolve(recipes);
            });
        });
    });
}
//# sourceMappingURL=background.js.map