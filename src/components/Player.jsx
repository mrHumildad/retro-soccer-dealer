import React from 'react';
import { formatValue, getAge, getMarketValueAtDate, getClubAtDate, getClubLogoUrl } from '../../logics/utils.js';
import '../styles/components/player-card.css';
import CountryFlag from './CountryFlag.jsx';
const Player = ({ player, gameDate, owned = true, onSell, onBuy, market, transfers, money }) => {
  const age = getAge(player.date_of_birth, gameDate);
  let trendClass = '';
  let clubChanged = false;
  let marketValue, club;

  if (owned) {
    marketValue = player.marketValue;
    const prevClub = player.prevClub;
    club = player.club;
    if (player.prevMarketValue !== undefined && player.prevMarketValue !== null) {
      if (player.marketValue > player.prevMarketValue) { trendClass = 'up'; }
      else if (player.marketValue < player.prevMarketValue) { trendClass = 'down'; }
    }
    if (prevClub?.to_team_id && club?.to_team_id && prevClub.to_team_id !== club.to_team_id) {
      trendClass = 'up';
    }
    clubChanged = prevClub?.to_team_id && club?.to_team_id && prevClub.to_team_id !== club.to_team_id;
  } else {
    marketValue = getMarketValueAtDate(player.player_id, gameDate, market);
    club = getClubAtDate(player.player_id, gameDate, transfers);
  }


  return (
    <li className="player-card">
      <img
        className="player-card-portrait"
        src={player.player_image_url.replace('/header/', '/small/')}
        alt={player.player_name}
      />
      <div className="player-card-info">
        <span className="player-card-name">{player.player_name} ({age})</span>
        <span className="player-card-club-row">
          <img
            className="player-card-club-logo"
            src={getClubLogoUrl(club?.to_team_id)}
            alt={club?.to_team_name}
          />
          <span className={`player-card-sub ${clubChanged ? 'text-green' : ''}`}>{club?.to_team_name ?? '-'}</span>
        </span>
        <span>

          <span className="player-card-sub">
            <CountryFlag country= {player.country_of_birth} title={player.country_of_birth} size={16} />
          </span>
          <span className="player-card-sub">{player.position ?? '-'}</span>
        </span>
      </div>
      <div className="player-card-action">
        {owned ? (
            <button className={`button button-danger ${trendClass ? `button-trend-${trendClass}` : ''}`} onClick={() => onSell(player.player_id, marketValue)}>
            <span className="button-top">SELL</span>
            <span className="button-bottom">
              {formatValue(marketValue)}
            </span>
          </button>
        ) : (
          marketValue !== null && marketValue !== undefined && (
            <button
              className={`button ${money >= marketValue ? 'button-secondary' : 'button-disabled'}`}
              onClick={() => onBuy(player.player_id, marketValue)}
              disabled={money < marketValue}
            >
              <span className="button-top">BUY</span>
              <span className="button-bottom">{formatValue(marketValue)}</span>
            </button>
          )
        )}
      </div>
    </li>
  );
};

export default Player;
