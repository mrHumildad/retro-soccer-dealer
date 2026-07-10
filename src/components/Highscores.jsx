import { useState, useEffect } from 'react';
import { formatValue } from '../../logics/utils.js';
import '../styles/screens/highscores.css';

const STORAGE_KEY = 'retro_soccer_highscores';

function Highscores({ onBack }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setScores(stored);
    } catch (e) {
      console.warn('Failed to load highscores', e);
      setScores([]);
    }
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="highscores">
      <div className="highscores-panel">
        <h2 className="highscores-title">HIGHSCORES</h2>
        {scores.length === 0 ? (
          <p className="highscores-empty">No scores yet. Play a game!</p>
        ) : (
          <ol className="highscores-list">
            {scores.slice(0, 3).map((entry, index) => (
              <li key={index} className="highscores-item">
                <span className="highscores-rank mono">{index + 1}</span>
                <span className="highscores-score mono">{formatValue(entry.score)}</span>
                <span className="highscores-date">{formatDate(entry.date)}</span>
              </li>
            ))}
          </ol>
        )}
        <button className="highscores-button" onClick={onBack}>BACK</button>
      </div>
    </div>
  );
}

export default Highscores;
