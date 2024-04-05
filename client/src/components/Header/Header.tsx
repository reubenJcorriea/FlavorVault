import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
    const handleClick = () => {
        const event = new CustomEvent('FlavorVaultTrigger', {
            detail: { action: 'startScraping' }
        });
        window.dispatchEvent(event);
    };

    const handleAction = () => {
        const data = { action: 'doSomething', payload: {/* Your data here */} };
        window.dispatchEvent(new CustomEvent('myCustomEvent', { detail: data }));
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
