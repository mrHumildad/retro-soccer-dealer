import React from 'react';
import { formatValue } from '../../logics/utils.js';
import '../styles/screens/game-over.css';

const GameOver = ({ money, ownedPlayers = [] }) => {
  const playersValue = ownedPlayers.reduce((acc, p) => acc + (p.marketValue || 0), 0);
  const finalScore = money + playersValue;
  return (
    <div className="game-over-container">
      <h1 className="game-over-title">Game Over</h1>
      <div className="game-over-score">
        <span className="game-over-label">Final Score</span>
        <span className="game-over-value mono">{formatValue(finalScore)}</span>
      </div>
      <div className="game-over-details">
        <div className="game-over-detail">
          <span className="game-over-detail-label">Money</span>
          <span className="game-over-detail-value mono">{formatValue(money)} $</span>
        </div>
        <div className="game-over-detail">
          <span className="game-over-detail-label">Players</span>
          <span className="game-over-detail-value mono">{formatValue(playersValue)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
