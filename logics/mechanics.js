import { pickRandom } from './utils.js'

export const getPool = (size, date, ownedIDS, players) => {
  if (!Array.isArray(players)) return []
  const dateStr = String(date) + '-01-01'
  const availablePlayers = players.filter(
    p => !ownedIDS.includes(p.player_id) && p.first_entry <= dateStr
  )
  return pickRandom(availablePlayers, size)
}
