import { useState, useEffect } from 'react'
import './App.css'

import Header from './components/Header.jsx'
import World from './components/World.jsx'
import Home from './components/Home.jsx'
import Footer from './components/Footer.jsx'
import GameOver from './components/GameOver.jsx'
import { initGame } from '../logics/initGame.js'
import { parseCsv, formatValue } from '../logics/utils.js'
import { getPool } from '../logics/mechanics.js'

function App() {
  const [players, setPlayers] = useState([])
  const [market, setMarket] = useState([])
  const [transfers, setTransfers] = useState([])
  const [gameData, setGameData] = useState(initGame())
  const [pool, setPool] = useState([])

  const handleBuy = (playerId, value) => {
    setGameData(prev => {
      const player = players.find(p => p.player_id === playerId)
      if (!player) return prev
      const gameDate = prev.year + '-' + String(prev.month).padStart(2, '0') + '-01'
      const marketValue = market
        .filter(m => m.player_id === playerId && m.date <= gameDate)
        .sort((a, b) => b.date.localeCompare(a.date))
      const currentValue = marketValue.length > 0 ? parseFloat(marketValue[0].value) : null
      const playerTransfers = transfers
        .filter(t => t.player_id === playerId)
        .sort((a, b) => a.date.localeCompare(b.date))
      const currentClub = playerTransfers.length > 0
        ? (playerTransfers[0].date > gameDate
            ? playerTransfers[0].from_team_name
            : (playerTransfers.reverse().find(t => t.date <= gameDate)?.to_team_name ?? null))
        : null
      return {
        ...prev,
        money: prev.money - value,
        players: [...prev.players, { ...player, marketValue: currentValue, club: currentClub }]
      }
    })
    setPool(prevPool => prevPool.filter(p => p.player_id !== playerId))
  }

  const handleSell = (playerId, value) => {
    setGameData(prev => ({ ...prev, money: prev.money + value, players: prev.players.filter(p => p.player_id !== playerId) }))
  }

  const nextMonth = () => {
    setGameData(prev => {
      const oldTotalValue = prev.players.reduce((acc, p) => acc + (p.marketValue || 0), 0)
      const nextMonthNum = prev.month + 1
      const nextYear = prev.year + (nextMonthNum > 12 ? 1 : 0)
      const newDateStr = nextYear + '-' + String(nextMonthNum > 12 ? 1 : nextMonthNum).padStart(2, '0') + '-01'
      const updatedPlayers = prev.players.map(p => {
        const oldValue = p.marketValue
        const oldClub = p.club
        const mv = market
          .filter(m => m.player_id === p.player_id && m.date <= newDateStr)
          .sort((a, b) => b.date.localeCompare(a.date))
        const newValue = mv.length > 0 ? parseFloat(mv[0].value) : p.marketValue
        const pt = transfers
          .filter(t => t.player_id === p.player_id)
          .sort((a, b) => a.date.localeCompare(b.date))
        const newClub = pt.length > 0
          ? (pt[0].date > newDateStr
              ? pt[0].from_team_name
              : (pt.reverse().find(t => t.date <= newDateStr)?.to_team_name ?? p.club))
          : p.club
        return { ...p, marketValue: newValue, club: newClub, prevMarketValue: oldValue, prevClub: oldClub }
      })
      console.log('Updated players:', prev.poolSize)
      setPool(getPool(prev.poolSize, newDateStr, updatedPlayers.map(p => p.player_id), players))
      return {
        ...prev,
        month: nextMonthNum > 12 ? 1 : nextMonthNum,
        year: nextYear,
        players: updatedPlayers,
        prevTotalValue: oldTotalValue
      }
    })
  }

  useEffect(() => {
    Promise.all([fetch('/players.csv'), fetch('/market.csv'), fetch('/transfers.csv')])
      .then(([p, m, t]) => Promise.all([p.text(), m.text(), t.text()]))
      .then(([pt, mt, tt]) => {
        const p = parseCsv(pt)
        const m = parseCsv(mt)
        const t = parseCsv(tt)
        setPlayers(p)
        setMarket(m)
        setTransfers(t)
        setPool(getPool(gameData.poolSize, gameData.year + '-' + String(gameData.month).padStart(2, '0') + '-01', [], p))
      })
  }, [])

  const dateStr = gameData.year + '-' + String(gameData.month).padStart(2, '0') + '-01'
  const isGameOver = gameData.year > gameData.endYear || (gameData.year === gameData.endYear && gameData.month >= gameData.endMonth)

  return (
    <div className="app-container">
      <Header money={formatValue(gameData.money)} year={gameData.year} month={gameData.month} />
      {isGameOver ? (
        <GameOver money={gameData.money} ownedPlayers={gameData.players} />
      ) : (
        <>
          <World
            pool={pool}
            market={market}
            transfers={transfers}
            gameDate={dateStr}
            money={gameData.money}
            onBuy={handleBuy}
          />
          <Home ownedPlayers={gameData.players} gameDate={dateStr} prevTotalValue={gameData.prevTotalValue} onSell={handleSell} />
          <Footer onNextMonth={() => players.length > 0 && nextMonth()} />
        </>
      )}
    </div>
  )
}

export default App
