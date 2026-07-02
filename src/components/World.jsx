import React from 'react';
import Player from './Player.jsx';

const World = ({ pool, market, transfers, gameDate, money, onBuy }) => {
  return (
    <div className="world-container">
      <h2>Market</h2>
      <ul className="owned-players">
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
