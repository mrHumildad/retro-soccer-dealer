import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/header.css';
import logoRect from '../assets/logo_rect.png';
const Header = ({ money, year, month }) => {
  const [flash, setFlash] = useState(false);
  const prevMoney = useRef(money);

  useEffect(() => {
    if (money !== prevMoney.current) {
      prevMoney.current = money;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 150);
      return () => clearTimeout(t);
    }
  }, [money]);

  const monthShort = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];

  return (
    <header className="scoreboard-header">
      <div className="scoreboard-section scoreboard-left">
        <span className="scoreboard-label">MONEY</span>
        <span
          className={`scoreboard-value scoreboard-value--money ${
            flash ? 'scoreboard-value--flash' : ''
          }`}
        >
          ${money}
        </span>
      </div>
      <div className="scoreboard-section scoreboard-center">
        <img src={logoRect} alt="Retro Soccer Dealer" className="scoreboard-logo" />
      </div>
      <div className="scoreboard-section scoreboard-right">
        <span className="scoreboard-label">DATE</span>
        <span className="scoreboard-value scoreboard-value--date">
          {monthShort[month - 1]} {year}
        </span>
      </div>
    </header>
  );
};

export default Header;
