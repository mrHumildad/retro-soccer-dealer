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

const Home = ({ ownedPlayers, gameDate }) => {
  if (ownedPlayers.length === 0) return null;

  return (
    <div className="home-container">
      <h2>Your Players</h2>
      <ul className="owned-players">
        {ownedPlayers.map(player => {
          const age = getAge(player.date_of_birth, gameDate);
          return (
            <li key={player.player_id} className="owned-player">
              <img
                className="owned-player-img"
                src={player.player_image_url}
                alt={player.player_name}
              />
              <span className="owned-player-name">{player.player_name}</span>
              <span className="owned-player-age">Age: {age}</span>
              <span className="owned-player-price">{formatValue(player.marketValue)}</span>
              <span className="owned-player-club">{player.club ?? '-'}</span>
              <span className="owned-player-nationality">{player.citizenship}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
