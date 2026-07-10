export function parseCsv(text) {
  const lines = text.trim().split('\n')
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    const obj = {}
    headers.forEach((h, i) => obj[h] = values[i] || '')
    return obj
  })
}

function parseCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function formatValue(v) {
  if (!v) return '-'
  const num = parseFloat(v)
  if (isNaN(num)) return v
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toString()
}

export function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function getMarketValueAtDate(playerId, gameDate, market) {
  const entries = market
    .filter(m => m.player_id === playerId && m.date <= gameDate)
    .sort((a, b) => b.date.localeCompare(a.date))
  if (entries.length === 0) return null
  return parseFloat(entries[0].value)
}

export const getClubLogoUrl = (clubId ) => {
  return `https://tmssl.akamaized.net/images/wappen/medium/${clubId}.png`
}

export function getClubAtDate(playerId, gameDate, transfers) {
  const playerTransfers = (transfers || [])
    .filter(t => t.player_id === playerId)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (playerTransfers.length === 0) return null
  if (playerTransfers[0].date > gameDate) return { to_team_id: playerTransfers[0].from_team_id, to_team_name: playerTransfers[0].from_team_name }
  const current = [...playerTransfers].reverse().find(t => t.date <= gameDate)
  return current || null
}

export function getAge(dateOfBirth, gameDate) {
  if (!dateOfBirth || !gameDate) return null;
  const birth = new Date(dateOfBirth);
  const game = new Date(gameDate);
  if (isNaN(birth.getTime()) || isNaN(game.getTime())) return null;
  let age = game.getFullYear() - birth.getFullYear();
  const monthDiff = game.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && game.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const getRole = (player) => {
  const firstChar = player.position?.charAt(0).toUpperCase() || '';
  switch (firstChar) {
    case 'G':
      return 'GK';
    case 'D':
      return 'DEF';
    case 'M':
      return 'MID';
    case 'A':
      return 'FWD';
    default:
      return 'Unknown';
  }
}