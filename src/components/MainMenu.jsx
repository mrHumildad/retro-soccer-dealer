import '../styles/screens/main-menu.css'
import fullLogo from '../assets/logo_full.png'

function MainMenu({ onStart, onHowToPlay }) {
  return (
    <div className="main-menu">
      <img src={fullLogo} className="main-menu-logo" alt="Retro Soccer Dealer" />
      <button className="main-menu-button" onClick={onStart}>START GAME</button>
      <button className="main-menu-button main-menu-button--secondary" onClick={onHowToPlay}>HOW TO PLAY</button>
    </div>
  )
}

export default MainMenu
