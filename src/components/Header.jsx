import React from 'react';

const Header = ({ money, year, month }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="header-container">
      <span>{money} $ | {monthNames[month - 1]} {year}</span>
    </div>
  );
}

export default Header;
