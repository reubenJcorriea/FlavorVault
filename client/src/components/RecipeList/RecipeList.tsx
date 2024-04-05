import React, { useState, useEffect, useMemo } from "react";
import "./RecipeList.scss";

interface Recipe {
  id: string;
  title: string;
  dateAdded: string;
}

const SortButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button className={`sort-button ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const RecipeList: React.FC = () => {
  const [sortOrder, setSortOrder] = useState<"alphabetical" | "date">("date");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Replace 'http://localhost:5000/api/recipes' with your actual API endpoint
    fetch("http://localhost:5000/api/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Failed to fetch recipes:", error));
  }, []);

  const groupedRecipes = useMemo(() => {
    const grouped: { [key: string]: Recipe[] } = {};
    recipes.forEach((recipe) => {
      let key;
      if (sortOrder === "alphabetical") {
        key = recipe.title[0].toUpperCase();
      } else {
        const date = new Date(recipe.dateAdded);
        key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(recipe);
    });
    return grouped;
  }, [recipes, sortOrder]);

  return (
    <div className="recipe-list">
      <div className="recipe-list__sort-controls">
        <SortButton
          active={sortOrder === "alphabetical"}
          onClick={() => setSortOrder("alphabetical")}
        >
          Alphabetical
        </SortButton>
        <SortButton
          active={sortOrder === "date"}
          onClick={() => setSortOrder("date")}
        >
          By Date
        </SortButton>
      </div>
      {Object.entries(groupedRecipes).map(([key, recipes]) => (
        <div key={key}>
          <h2 className="recipe-list__group-title">{key}</h2>
          {recipes.map((recipe: Recipe) => (
            <div key={recipe.id} className="recipe-list__item">
              <p>{recipe.title}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
