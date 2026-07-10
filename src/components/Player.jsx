import React, { useState, useEffect } from 'react';
import { formatValue, getAge, getRole, getMarketValueAtDate, getClubAtDate, getClubLogoUrl } from '../../logics/utils.js';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import '../styles/components/player-card.css';
import CountryFlag from './CountryFlag.jsx';
const Player = ({ player, gameDate, owned = true, onSell, onBuy, market, transfers, money }) => {
  const age = getAge(player.date_of_birth, gameDate);
  const role = getRole(player);
  let trendClass = '';
  let monthlyDelta = null;
  let clubChanged = false;
  let marketValue, club;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [gameDate]);

  if (owned) {
    marketValue = player.marketValue;
    const prevClub = player.prevClub;
    club = player.club;
    if (player.prevMarketValue !== undefined && player.prevMarketValue !== null) {
      if (player.marketValue > player.prevMarketValue) { trendClass = 'up'; }
      else if (player.marketValue < player.prevMarketValue) { trendClass = 'down'; }
    }

    if (player.prevMarketValue !== undefined && player.prevMarketValue !== null && player.prevMarketValue !== 0
        && player.marketValue !== undefined && player.marketValue !== null) {
      monthlyDelta = ((player.marketValue - player.prevMarketValue) / player.prevMarketValue) * 100;
    }

    clubChanged = prevClub?.to_team_id && club?.to_team_id && prevClub.to_team_id !== club.to_team_id;
  } else {
    marketValue = getMarketValueAtDate(player.player_id, gameDate, market);
    club = getClubAtDate(player.player_id, gameDate, transfers);
  }

  const chartData = (() => {
    if (!owned || !flipped || !market || !player.buyDate) return null;
    const entries = market
      .filter(m => m.player_id === player.player_id && m.date >= player.buyDate && m.date <= gameDate)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (entries.length === 0) return [];
    return entries.map((e, i) => {
      const entryAge = getAge(player.date_of_birth, e.date);
      const prevAge = i > 0 ? getAge(player.date_of_birth, entries[i - 1].date) : null;
      const showAge = entryAge !== null && (i === 0 || entryAge !== prevAge);
      return { age: entryAge, value: parseFloat(e.value), showAge };
    });
  })();

  const buyValue = player.buyValue;
  const valueDelta = (buyValue !== undefined && buyValue !== null && buyValue !== 0 && marketValue !== null && marketValue !== undefined)
    ? ((marketValue - buyValue) / buyValue) * 100
    : null;

  const buyTrendClass = valueDelta !== null ? (valueDelta > 0 ? 'up' : valueDelta < 0 ? 'down' : '') : '';

  const AgeTick = ({ x, y, index }) => {
    const d = chartData?.[index];
    if (!d || d.age === null || d.age === undefined || !d.showAge) return null;
    return (
      <text x={x} y={y} dy={10} fill="var(--cream)" fontSize={8} textAnchor="middle" fontFamily="var(--font-mono)">
        {d.age}
      </text>
    );
  };

  return (
    <li className="player-card-wrapper" onClick={owned ? () => setFlipped(!flipped) : undefined}>
      <div className={`player-card ${flipped ? 'flipped' : ''}`}>
        <div className="player-card-front">
          <img
            className="player-card-portrait"
            src={player.player_image_url.replace('/header/', '/small/')}
            alt={player.player_name}
          />
          <div className="player-card-info">
            <span className="player-card-name">{player.player_name} ({age ?? '-'})</span>
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
              <span className="player-card-sub"> {role ?? '-'}</span>
            </span>
          </div>
          <div className="player-card-action">
              {owned ? (
                  <button
                    className={`button button-danger button-disabled ${trendClass ? `button-trend-${trendClass}` : ''}`}
                  >
                  <span className="button-top">
                    {monthlyDelta === null || monthlyDelta === 0 ? '-' : (
                      <>
                        {monthlyDelta > 0 ? '↑' : '↓'}{Math.abs(monthlyDelta).toFixed(1)}%
                      </>
                    )}
                  </span>
                  <span className="button-bottom">
                    {formatValue(marketValue)}
                  </span>
                </button>
            ) : (
              marketValue !== null && marketValue !== undefined && (
                <button
                  className={`button ${money >= marketValue ? 'button-enabled' : 'button-disabled'}`}
                  onClick={(e) => { e.stopPropagation(); onBuy(player.player_id, marketValue); }}
                  disabled={money < marketValue}
                >
                  <span className="button-top">BUY</span>
                  <span className="button-bottom">{formatValue(marketValue)}</span>
                </button>
              )
            )}
          </div>
        </div>
        <div className="player-card-back">
          <div className="player-card-back-chart">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="age" tick={<AgeTick />} axisLine={false} tickLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)' }}
                  itemStyle={{ color: 'var(--cream)' }}
                  formatter={(v) => formatValue(v)}
                  labelStyle={{ color: 'var(--gold)', fontSize: '0.55rem' }}
                />
                <ReferenceLine y={buyValue} stroke="var(--cream)" strokeDasharray="3 2" label={{ value: formatValue(buyValue), position: 'insideTopRight', fill: 'var(--cream)', fontSize: 8, fontFamily: 'var(--font-mono)' }} />
                <Area type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={1.5} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <span className="player-card-sub">No data</span>
          )}
          </div>
          <div className="player-card-back-stats">
            <span>BOUGHT {formatValue(buyValue)}</span>
            <span>NOW {formatValue(marketValue)}</span>
            {valueDelta !== null && (
              <span className={valueDelta >= 0 ? 'text-green' : 'text-red'}>
                {valueDelta >= 0 ? '▲' : '▼'} {Math.abs(valueDelta).toFixed(0)}%
              </span>
            )}
          </div>
          {owned && (
            <div className="player-card-back-sell player-card-action">
              <button
                className={`button button-danger ${buyTrendClass ? `button-trend-${buyTrendClass}` : ''}`}
                onClick={(e) => { e.stopPropagation(); onSell(player.player_id, marketValue); }}
              >
                <span className="button-top">SELL</span>
                <span className="button-bottom">{formatValue(marketValue)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default Player;
