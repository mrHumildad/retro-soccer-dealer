import React from 'react';
import { formatValue } from '../../logics/utils.js';
import Player from './Player.jsx';
import '../styles/components/squad.css';

const Home = ({ ownedPlayers = [], gameDate, prevTotalValue, onSell, slots, slotPrice, money, onBuySlot, market }) => {
  if (ownedPlayers.length === 0) return null;
  const totalValue = ownedPlayers.reduce((acc, player) => acc + (player.marketValue || 0), 0);
  const totalValueClass = prevTotalValue !== undefined
    ? totalValue > prevTotalValue
      ? 'text-green'
      : totalValue < prevTotalValue
        ? 'text-red'
        : ''
    : '';
  const canBuy = money >= slotPrice;
  return (
    <div>
      <div className="squad-header-row">
        <h2 className="squad-header">{ownedPlayers.length}/{slots} SLOTS ( <span className={totalValueClass}>{formatValue(totalValue)}</span> )</h2>
        <button className={`button ${canBuy ? 'button-enabled' : 'button-disabled'}`} disabled={!canBuy} onClick={onBuySlot} title={`Buy slot for ${formatValue(slotPrice)}`}>
          <span className="button-top">+ SLOT</span>
          <span className="button-bottom">{formatValue(slotPrice)}</span>
        </button>
      </div>
      <ul className="squad-list">
        {ownedPlayers
        .slice()
        .sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0))
        .map(player => (
          <Player 
            key={player.player_id} 
            player={player} 
            gameDate={gameDate} 
            onSell={onSell} 
            market={market}
          />
        ))}
      </ul>
    </div>
  );
}

export default Home;
