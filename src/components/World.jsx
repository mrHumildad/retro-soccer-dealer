import React from 'react';
import PoolPlayer from './PoolPlayer.jsx';

const World = ({ pool, market, transfers, gameDate, money, onBuy }) => {
  return (
    <div className="world-container">
      <div className="pool-list">
        {pool.map(player => (
          <PoolPlayer
            key={player.player_id}
            player={player}
            gameDate={gameDate}
            market={market}
            transfers={transfers}
            money={money}
            onBuy={onBuy}
          />
        ))}
      </div>
    </div>
  );
};

export default World;
