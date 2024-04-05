import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
    // Placeholder function for initiating script or adding recipe
    const handleClick = () => {
        console.log("Header clicked. Initiate action.");
        // Here you would trigger the script to add a recipe or another action
    };

    return (
        <header className="header" onClick={handleClick}>
            <div className="header__content">
                <h1 className="header__title">FlavorVault</h1>
            </div>
        </header>
    );
};

export default Header;
