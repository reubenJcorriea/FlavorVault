import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
    const handleClick = () => {
        chrome.runtime.sendMessage({ action: "startScraping" });
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
