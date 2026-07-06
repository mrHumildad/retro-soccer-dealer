import { pickRandom, getAge } from './utils.js'

export const getPool = (size, date, ownedIDS, players) => {
  if (!Array.isArray(players)) return []
  const dateStr = String(date)
  const availablePlayers = players.filter(
    p => !ownedIDS.includes(p.player_id) && p.first_entry <= dateStr && getAge(p.date_of_birth, dateStr) <= 25
  )
  return pickRandom(availablePlayers, size)
}
