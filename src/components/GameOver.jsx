import { useEffect } from 'react';
import { formatValue } from '../../logics/utils.js';
import '../styles/screens/game-over.css';

const STORAGE_KEY = 'retro_soccer_highscores';

function saveHighscore(score) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push({ score, date: new Date().toISOString() });
    existing.sort((a, b) => b.score - a.score);
    const trimmed = existing.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save highscore', e);
  }
}

const GameOver = ({ money, ownedPlayers = [] }) => {
  const playersValue = ownedPlayers.reduce((acc, p) => acc + (p.marketValue || 0), 0);
  const finalScore = money + playersValue;

  useEffect(() => {
    saveHighscore(finalScore);
  }, [finalScore]);

  return (
    <div className="game-over-container">
      <h1 className="game-over-title">Covid Measures Ends Forever with Humans</h1>
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
