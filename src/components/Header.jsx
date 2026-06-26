import React from 'react';

const Header = ({ money, year, month }) => {
  console.log('Header', { money, year, month })
  return (
    <div className="header-container">
      <span>{money} | {month}/{year}</span>
    </div>
  );
}

export default Header;
