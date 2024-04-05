import React, { useState, useMemo } from "react";
import "./RecipeList.scss";

interface Recipe {
  id: string;
  title: string;
  dateAdded: string;
}

// Directly define mockRecipes for demonstration purposes
const mockRecipes: Recipe[] = [
  { id: "1", title: "Apple Pie", dateAdded: "2024-04-01" },
  { id: "2", title: "Banana Bread", dateAdded: "2024-04-15" },
  // Add more recipes as needed
];

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
  const [recipes] = useState<Recipe[]>(mockRecipes); // Use useState if you plan to dynamically add/remove recipes

  const sortedRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
    });
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
      {sortedRecipes.map((recipe) => (
        <div key={recipe.id} className="recipe-list__item">
          <p className="recipe-list__date">
            {new Date(recipe.dateAdded).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>{recipe.title}</p>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
