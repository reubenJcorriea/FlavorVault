import React from 'react';
import './styles/popup.scss';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import RecipeList from './components/RecipeList/RecipeList';
import Footer from './components/Footer/Footer';

const App: React.FC = () => {
  const handleSearch = (searchTerm: string) => {
    console.log('Perform search with:', searchTerm);
    // Implement your search logic here
    // This could involve setting state that RecipeList uses to filter recipes
  };

  return (
    <div className="popup">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <RecipeList />
      <Footer />
    </div>
  );
};

export default App;
