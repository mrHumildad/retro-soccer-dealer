import '../styles/screens/how-to-play.css'

function HowToPlay({ onBack, startDate, endDate }) {
  return (
    <div className="how-to-play">
      <div className="how-to-play-panel">
        <h2 className="how-to-play-title">HOW TO PLAY</h2>
        <ol className="how-to-play-list">
          <li>Buy players from the world market before others do.</li>
          <li>Keep an eye on player values — they change every month.</li>
          <li>Sell players for a profit when their value rises.</li>
          <li>Build the most valuable squad before the season ends.</li>
        </ol>
        <div className="how-to-play-meta">
          <div className="how-to-play-date">
            <span className="how-to-play-date-label">Season start</span>
            <span className="how-to-play-date-value">{startDate}</span>
          </div>
          <div className="how-to-play-date">
            <span className="how-to-play-date-label">Season end</span>
            <span className="how-to-play-date-value">{endDate}</span>
          </div>
        </div>
        <p className="how-to-play-disclaimer">This is a hobbyist prototype — data, prices, and mechanics may change over time.</p>
        <button className="how-to-play-button" onClick={onBack}>BACK</button>
      </div>
    </div>
  )
}

export default HowToPlay
