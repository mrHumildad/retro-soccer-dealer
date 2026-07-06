import { useState, useEffect, useRef, useCallback } from 'react'

import Header from './components/Header.jsx'
import World from './components/World.jsx'
import Home from './components/Home.jsx'
import Footer from './components/Footer.jsx'
import GameOver from './components/GameOver.jsx'
import SplashScreen from './components/SplashScreen.jsx'
import MainMenu from './components/MainMenu.jsx'
import HowToPlay from './components/HowToPlay.jsx'
import { initGame } from '../logics/initGame.js'
import { parseCsv, formatValue } from '../logics/utils.js'
import { getPool } from '../logics/mechanics.js'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDate(year, month) {
  return `${MONTH_NAMES[month - 1]} ${year}`
}

function App() {
  const [screen, setScreen] = useState('splash')
  const [players, setPlayers] = useState([])
  const [market, setMarket] = useState([])
  const [transfers, setTransfers] = useState([])
  const [gameData, setGameData] = useState(initGame())
  const [pool, setPool] = useState([])

  const [buysThisMonth, setBuysThisMonth] = useState(gameData.buy4month)
  const viewportRef = useRef(null)

  const handleBuy = (playerId, value) => {
    if (buysThisMonth <= 0) return;
    setGameData(prev => {
      const player = players.find(p => p.player_id === playerId)
      if (!player) return prev
      const gameDate = prev.year + '-' + String(prev.month).padStart(2, '0') + '-01'
      const marketValue = market
        .filter(m => m.player_id === playerId && m.date <= gameDate)
        .sort((a, b) => b.date.localeCompare(a.date))
      const currentValue = marketValue.length > 0 ? parseFloat(marketValue[0].value) : null
      const currentClub = (() => {
        const pt = (transfers || [])
          .filter(t => t.player_id === playerId)
          .sort((a, b) => a.date.localeCompare(b.date))
        if (pt.length === 0) return null
        if (pt[0].date > gameDate) return { to_team_id: pt[0].from_team_id, to_team_name: pt[0].from_team_name }
        const t = [...pt].reverse().find(t => t.date <= gameDate)
        return t ? { to_team_id: t.to_team_id, to_team_name: t.to_team_name } : null
      })()
      return {
        ...prev,
        money: prev.money - value,
        players: [...prev.players, { ...player, marketValue: currentValue, club: currentClub, prevClub: null }]
      }
    })
    setBuysThisMonth(prev => prev - 1)
    setPool(prevPool => prevPool.filter(p => p.player_id !== playerId))
  }

  const handleSell = (playerId, value) => {
    setGameData(prev => ({ ...prev, money: prev.money + value, players: prev.players.filter(p => p.player_id !== playerId) }))
  }

  const nextMonth = () => {
    setBuysThisMonth(gameData.buy4month)
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
              ? { to_team_id: pt[0].from_team_id, to_team_name: pt[0].from_team_name }
              : (() => {
                  const mt = [...pt].reverse().find(t => t.date <= newDateStr)
                  return mt ? { to_team_id: mt.to_team_id, to_team_name: mt.to_team_name } : p.club
                })())
          : p.club
        return { ...p, marketValue: newValue, club: newClub, prevMarketValue: oldValue, prevClub: oldClub }
      })
      setPool(getPool(prev.poolSize, newDateStr, updatedPlayers.map(p => p.player_id), players))
      return {
        ...prev,
        month: nextMonthNum > 12 ? 1 : nextMonthNum,
        year: nextYear,
        players: updatedPlayers,
        prevTotalValue: oldTotalValue
      }
    })
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    Promise.all([fetch(`${base}players.csv`), fetch(`${base}market.csv`), fetch(`${base}transfers.csv`)])
      .then(([p, m, t]) => Promise.all([p.arrayBuffer(), m.arrayBuffer(), t.arrayBuffer()]))
      .then(([pb, mb, tb]) => {
        const pt = new TextDecoder('utf-8').decode(pb)
        const mt = new TextDecoder('utf-8').decode(mb)
        const tt = new TextDecoder('utf-8').decode(tb)
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
      {screen === 'splash' && <SplashScreen onComplete={() => setScreen('menu')} />}
      {screen === 'menu' && <MainMenu onStart={() => setScreen('game')} onHowToPlay={() => setScreen('howToPlay')} />}
      {screen === 'howToPlay' && (
        <HowToPlay
          onBack={() => setScreen('menu')}
          startDate={formatDate(gameData.year, gameData.month)}
          endDate={formatDate(gameData.endYear, gameData.endMonth)}
        />
      )}
      {screen === 'game' && (
        <div className="game-screen">
          <Header money={formatValue(gameData.money)} year={gameData.year} month={gameData.month} />
          {isGameOver ? (
            <GameOver money={gameData.money} ownedPlayers={gameData.players} />
          ) : (
            <div className="game-viewport" ref={viewportRef}>
              {buysThisMonth > 0 && (
                <World
                  pool={pool}
                  market={market}
                  transfers={transfers}
                  gameDate={dateStr}
                  money={gameData.money}
                  onBuy={handleBuy}
                />
              )}
              <Home ownedPlayers={gameData.players} gameDate={dateStr} prevTotalValue={gameData.prevTotalValue} onSell={handleSell} />
              {!isGameOver && <Footer onNextMonth={() => players.length > 0 && nextMonth()} />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
