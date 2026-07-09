import React from 'react';
import Player from './Player.jsx';
import { formatValue } from '../../logics/utils.js';
import '../styles/components/market.css';

const Market = ({ pool, market, transfers, gameDate, money, onBuy, buy4month, poolSize, buy4monthPrice, poolSizePrice, onBuyBuy4month, onBuyPoolSize }) => {
  const canBuyBuy4month = money >= buy4monthPrice;
  const canBuyPoolSize = money >= poolSizePrice;
  return (
    <div className="market-container">
      <div className="market-header-row">
        <h2 className="market-header">CAN BUY {buy4month} / {poolSize}</h2>
        <button className={`button ${canBuyBuy4month ? 'button-enabled' : 'button-disabled'}`} disabled={!canBuyBuy4month} onClick={onBuyBuy4month} title={canBuyBuy4month ? `Buy buy for ${formatValue(buy4monthPrice)}` : 'Not enough money'}>
          <span className="button-top">+ BUY</span>
          <span className="button-bottom">{formatValue(buy4monthPrice)}</span>
        </button>
        <button className={`button ${canBuyPoolSize ? 'button-enabled' : 'button-disabled'}`} disabled={!canBuyPoolSize} onClick={onBuyPoolSize} title={canBuyPoolSize ? `Buy pool size for ${formatValue(poolSizePrice)}` : 'Not enough money'}>
          <span className="button-top">+ POOL</span>
          <span className="button-bottom">{formatValue(poolSizePrice)}</span>
        </button>
      </div>
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

export default Market;
