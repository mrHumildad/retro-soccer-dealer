import { useState, useEffect } from 'react'
import '../styles/screens/splash.css'
import fullLogo from'../assets/logo_full.png'
function SplashScreen({ onComplete }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const minTimer = setTimeout(() => {
      setFading(true)
      const fadeTimer = setTimeout(() => {
        onComplete()
      }, 300)
      return () => clearTimeout(fadeTimer)
    }, 5000)

    return () => clearTimeout(minTimer)
  }, [onComplete])

  return (
    <div className={`splash ${fading ? 'fade-out' : ''}`}>
      <img src={fullLogo} className="splash-logo" alt="Retro Soccer Dealer" />
      <p className="splash-text">Loading transfer market...</p>
      <div className="splash-bar">
        <div className="splash-fill" />
      </div>
    </div>
  )
}

export default SplashScreen
