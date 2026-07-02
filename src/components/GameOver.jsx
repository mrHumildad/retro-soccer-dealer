import React from 'react';
import { formatValue } from '../../logics/utils.js';

const GameOver = ({ money, ownedPlayers = [] }) => {
  const playersValue = ownedPlayers.reduce((acc, p) => acc + (p.marketValue || 0), 0);
  const finalScore = money + playersValue;
  return (
    <div className="gameover-container">
      <h1>Game Over</h1>
      <div className="gameover-score">
        <span className="gameover-label">Final Score</span>
        <span className="gameover-value">{formatValue(finalScore)}</span>
      </div>
      <div className="gameover-details">
        <div className="gameover-detail">
          <span className="gameover-detail-label">Money</span>
          <span className="gameover-detail-value">{formatValue(money)} $</span>
        </div>
        <div className="gameover-detail">
          <span className="gameover-detail-label">Players</span>
          <span className="gameover-detail-value">{formatValue(playersValue)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
