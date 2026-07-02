import React from 'react';
import { formatValue, getAge, getMarketValueAtDate, getClubAtDate } from '../../logics/utils.js';

const Player = ({ player, gameDate, owned = true, onSell, onBuy, market, transfers, money }) => {
  const age = getAge(player.date_of_birth, gameDate);
  let valueClass = '';
  let marketValue, club;

  if (owned) {
    marketValue = player.marketValue;
    club = player.club;
    if (player.prevMarketValue !== undefined && player.prevMarketValue !== null) {
      if (player.marketValue > player.prevMarketValue) valueClass = 'value-increase';
      else if (player.marketValue < player.prevMarketValue) valueClass = 'value-decrease';
    }
  } else {
    marketValue = getMarketValueAtDate(player.player_id, gameDate, market);
    club = getClubAtDate(player.player_id, gameDate, transfers);
  }

  const clubClass = player.prevClub !== undefined && player.prevClub !== null && player.prevClub !== club
    ? 'club-change'
    : '';

  return (
    <li className="owned-player">
      <img
        className="owned-player-img"
        src={player.player_image_url}
        alt={player.player_name}
      />
      <span className="owned-player-name">{player.player_name}</span>
      <span className="owned-player-age">Age: {age}</span>
      <span className={`owned-player-price ${valueClass}`}>{formatValue(marketValue)}</span>
      <span className={`owned-player-club ${clubClass}`}>{club ?? '-'}</span>
      <span className="owned-player-nationality">{player.citizenship}</span>
      {owned ? (
        <button className="sell-button" onClick={() => onSell(player.player_id, marketValue)}>
          {formatValue(marketValue)}
        </button>
      ) : (
        marketValue !== null && marketValue !== undefined && marketValue <= money && (
          <button className="sell-button" onClick={() => onBuy(player.player_id, marketValue)}>
            {formatValue(marketValue)}
          </button>
        )
      )}
    </li>
  );
};

export default Player;
