import React from 'react';
import Player from './Player.jsx';
import '../styles/components/market.css';

const World = ({ pool, market, transfers, gameDate, money, onBuy }) => {
  return (
    <div className="market-container">
      <h2 className="market-header">Market</h2>
      <ul className="market-list">
        {pool.map(player => (
          <Player
            key={player.player_id}
            owned={false}
            player={player}
            gameDate={gameDate}
            market={market}
            transfers={transfers}
            money={money}
            onBuy={onBuy}
          />
        ))}
      </ul>
    </div>
  );
};

export default World;
