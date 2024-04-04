"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isRecipePage = function () {
    return Boolean(document.querySelector("[itemtype='http://schema.org/Recipe'], [itemtype='https://schema.org/Recipe']"));
};
var scrapeRecipeData = function () {
    var _a, _b, _c, _d;
    var title = ((_a = document.querySelector("h1")) === null || _a === void 0 ? void 0 : _a.innerText) || "Unknown Title";
    var ingredients = Array.from(document.querySelectorAll("[itemprop='recipeIngredient'], .ingredients li"))
        .map(function (el) { return el.innerText.trim(); });
    var directions = Array.from(document.querySelectorAll("[itemprop='recipeInstructions'], .directions li, .instructions li"))
        .map(function (el) { return el.innerText.trim(); });
    var image = ((_b = document.querySelector("[itemprop='image']")) === null || _b === void 0 ? void 0 : _b.getAttribute("src")) || "";
    var cookingTime = ((_c = document.querySelector("[itemprop='totalTime']")) === null || _c === void 0 ? void 0 : _c.innerText) || "Unknown";
    var servings = ((_d = document.querySelector("[itemprop='recipeYield']")) === null || _d === void 0 ? void 0 : _d.innerText) || "Serves Unknown";
    return { title: title, ingredients: ingredients, directions: directions, image: image, cookingTime: cookingTime, servings: servings };
};
var sendMessageToBackground = function (message) {
    chrome.runtime.sendMessage(message);
};
document.addEventListener("DOMContentLoaded", function () {
    if (isRecipePage()) {
        var recipeData = scrapeRecipeData();
        sendMessageToBackground({ action: "saveRecipe", data: recipeData });
    }
    else {
        sendMessageToBackground({ action: "invalidPage" });
    }
});
