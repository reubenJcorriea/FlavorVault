import React, { useState, useEffect } from 'react';
import './SearchBar.scss';

// Utility hook for debouncing input values
const useDebounce = (value: string, delay: number = 500): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchRecipes(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Function to fetch recipes from the backend
  const fetchRecipes = async (searchTerm: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/search?term=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Problem fetching recipes');
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  };

  return (
    <div className="search-bar">
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button className="search-bar__button" type="button" onClick={() => fetchRecipes(searchTerm)}>Search</button>
    </div>
  );
};

export default SearchBar;
