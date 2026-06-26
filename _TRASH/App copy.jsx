import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function parseCsv(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',')
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => obj[h] = values[i])
    return obj
  })
}

function formatValue(v) {
  if (!v) return '-'
  const num = parseFloat(v)
  if (isNaN(num)) return v
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toString()
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function logTransferHistory(selected, transfersRaw) {
  const lines = transfersRaw.trim().split('\n')
  const headers = lines[0].split(',')
  const transfers = lines.slice(1).map(line => {
    const values = line.split(',')
    const obj = {}
    headers.forEach((h, i) => obj[h] = values[i])
    return obj
  })
  const selectedIds = new Set(selected.map(p => String(p.player_id)))
  const relevant = transfers.filter(t => selectedIds.has(String(t.player_id)))
  relevant.sort((a, b) => {
    if (a.player_id !== b.player_id) return String(a.player_id).localeCompare(String(b.player_id))
    return String(a.transfer_date).localeCompare(String(b.transfer_date))
  })
  console.log('=== Transfer history for selected players ===')
  console.log('Selected players:', selected.map(p => `${p.player_name} (${p.player_id})`))
  console.log('Transfers:', JSON.stringify(relevant, null, 2))
  console.log('Total transfers:', relevant.length)
}

const COLORS = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4']

function ValueChart({ players, market }) {
  const selectedIds = new Set(players.map(p => String(p.player_id)))
  const filtered = market.filter(m => selectedIds.has(String(m.player_id)))

  console.log('Selected players:', players.map(p => ({ id: p.player_id, name: p.player_name })))
  console.log('Filtered market entries:', filtered.length)
  console.log('Sample market entry:', filtered[0])

  const byDate = {}
  for (const m of filtered) {
    const player = players.find(p => String(p.player_id) === String(m.player_id))
    if (!player) continue
    const key = m.date
    if (!byDate[key]) byDate[key] = { date: key }
    byDate[key][player.player_name] = parseFloat(m.value)
  }

  const chartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))

  console.log('Chart data:', chartData)

  const selectedNames = players.map(p => p.player_name)

  return (
    <div style={{ width: '100%', height: 320, marginTop: 32 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => '€' + formatValue(v)} tick={{ fontSize: 11 }} />
          <Tooltip formatter={v => '€' + formatValue(v)} />
          <Legend />
          {selectedNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function PlayerCard({ player, market }) {
  const entries = market.filter(m => String(m.player_id) === String(player.player_id))
  const latest = entries.length ? entries[entries.length - 1] : null

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 280 }}>
      <img
        src={player.player_image_url}
        alt={player.player_name}
        width="100%"
        height={180}
        style={{ objectFit: 'cover', borderRadius: 4 }}
      />
      <h2 style={{ margin: '8px 0 4px' }}>{player.player_name}</h2>
      <p style={{ margin: '2px 0', color: '#666', fontSize: 13 }}>
        {player.position} · {player.foot} foot · {player.height}cm
      </p>
      <p style={{ margin: '2px 0', color: '#666', fontSize: 13 }}>
        {player.current_club_name} · {player.citizenship}
      </p>
      {latest && (
        <p style={{ margin: '8px 0 0', fontWeight: 'bold' }}>
          Value: €{formatValue(latest.value)}
        </p>
      )}
    </div>
  )
}

function App() {
  const [players, setPlayers] = useState([])
  const [market, setMarket] = useState([])
  const [selected, setSelected] = useState([])
  const transfersRef = useRef('')

  useEffect(() => {
    Promise.all([fetch('/players.csv'), fetch('/market.csv'), fetch('/transfers.csv')])
      .then(([p, m, t]) => Promise.all([p.text(), m.text(), t.text()]))
      .then(([pt, mt, tt]) => {
        const p = parseCsv(pt)
        const m = parseCsv(mt)
        transfersRef.current = tt
        setPlayers(p)
        setMarket(m)
        const sel = pickRandom(p, 3)
        setSelected(sel)
        logTransferHistory(sel, tt)
      })
  }, [])

  const reroll = () => {
    const sel = pickRandom(players, 3)
    setSelected(sel)
    if (transfersRef.current) logTransferHistory(sel, transfersRef.current)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <button onClick={reroll} style={{ marginBottom: 24, padding: '8px 16px' }}>
        Draw 3 Players
      </button>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {selected.map(p => (
          <PlayerCard key={p.player_id} player={p} market={market} />
        ))}
      </div>
      {selected.length > 0 && <ValueChart players={selected} market={market} />}
    </div>
  )
}

export default App
