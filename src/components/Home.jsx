import React from 'react';
import { formatValue } from '../../logics/utils.js';
import Player from './Player.jsx';
import '../styles/components/squad.css';

const Home = ({ ownedPlayers = [], gameDate, prevTotalValue, onSell }) => {
  if (ownedPlayers.length === 0) return null;
  const totalValue = ownedPlayers.reduce((acc, player) => acc + (player.marketValue || 0), 0);
  const totalValueClass = prevTotalValue !== undefined
    ? totalValue > prevTotalValue
      ? 'text-green'
      : totalValue < prevTotalValue
        ? 'text-red'
        : ''
    : '';
  return (
    <div>
      <h2 className="squad-header">Your Players ( <span className={`mono ${totalValueClass}`}>{formatValue(totalValue)}</span> )</h2>
      <ul className="squad-list">
        {ownedPlayers.map(player => (
          <Player 
            key={player.player_id} 
            player={player} 
            gameDate={gameDate} 
            onSell={onSell} 
          />
        ))}
      </ul>
    </div>
  );
}

export default Home;
