import React from 'react';
import { formatValue } from '../../logics/utils.js';
import Player from './Player.jsx';

const Home = ({ ownedPlayers = [], gameDate, prevTotalValue, onSell }) => {
  if (ownedPlayers.length === 0) return null;
  const totalValue = ownedPlayers.reduce((acc, player) => acc + (player.marketValue || 0), 0);
  const totalValueClass = prevTotalValue !== undefined
    ? totalValue > prevTotalValue
      ? 'total-increase'
      : totalValue < prevTotalValue
        ? 'total-decrease'
        : ''
    : '';
  return (
    <div className="home-container">
      <h2>Your Players ( {formatValue(totalValue)} )</h2>
      <ul className="owned-players">
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
