import React from 'react';
import { formatValue } from '../../logics/utils.js';

function getAge(dateOfBirth, gameDate) {
  const birth = new Date(dateOfBirth);
  const game = new Date(gameDate);
  let age = game.getFullYear() - birth.getFullYear();
  const monthDiff = game.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && game.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getMarketValue(playerId, gameDate, market) {
  const entries = market
    .filter(m => m.player_id === playerId && m.date <= gameDate)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (entries.length === 0) return null;
  return parseFloat(entries[0].value);
}

function getClub(playerId, gameDate, transfers) {
  const playerTransfers = transfers
    .filter(t => t.player_id === playerId)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (playerTransfers.length === 0) return null;
  if (playerTransfers[0].date > gameDate) return playerTransfers[0].from_team_name;
  const current = playerTransfers.reverse().find(t => t.date <= gameDate);
  return current ? current.to_team_name : null;
}

const PoolPlayer = ({ player, gameDate, market, transfers, money, onBuy }) => {
  const age = getAge(player.date_of_birth, gameDate);
  const value = getMarketValue(player.player_id, gameDate, market);
  const club = getClub(player.player_id, gameDate, transfers);
  const canBuy = value !== null && value <= money;

  return (
    <div className="pool-player">
      <div className="pool-player-img-wrapper">
        <img
          className="pool-player-img"
          src={player.player_image_url}
          alt={player.player_name}
        />
      </div>
      <div className="pool-player-info">
        <span className="pool-player-name">{player.player_name}</span>
        <div className="pool-player-details">
          <span className="pool-player-nationality">{player.citizenship}</span>
          <span className="pool-player-age">Age: {age}</span>
        </div>
        <div className="pool-player-details">
          <span className="pool-player-club">{club ?? '-'}</span>
          <span className="pool-player-value">{formatValue(value)}</span>
        </div>
        {canBuy && (
          <button className="buy-button" onClick={() => onBuy(player.player_id, value)}>
            {formatValue(value)}
          </button>
        )}
      </div>
    </div>
  );
};

export default PoolPlayer;
