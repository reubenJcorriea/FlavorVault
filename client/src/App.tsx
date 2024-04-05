import React from 'react';
import './styles/popup.scss';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import RecipeList from './components/RecipeList/RecipeList';
import Footer from './components/Footer/Footer';

const App: React.FC = () => {

  return (
    <div className="popup">
      <Header />
      <SearchBar />
      <RecipeList />
      <Footer />
    </div>
  );
};

export default App;
