import React from 'react';
import '../styles/components/footer.css';

const Footer = ({ onNextMonth, currentNews }) => {
  const handleClick = () => {
    if (currentNews && currentNews.length > 0) {
      console.log('📰 Full News Log:', currentNews)
    }
    onNextMonth()
  }

  const newsText = currentNews && currentNews.length > 0
    ? currentNews.map(n => n.text).join(' - ')
    : ''

  return (
    <div className="footer-container">
      <div className="footer-ticker-wrapper">
        <div className="footer-ticker">
          {newsText && (
            <>
              <div className="footer-ticker-track">
                <span className="footer-ticker-text">{newsText}</span>
                <span className="footer-ticker-separator"> - </span>
                <span className="footer-ticker-text">{newsText}</span>
                <span className="footer-ticker-separator"> - </span>
              </div>
            </>
          )}
        </div>
      </div>
      <button className="footer-button" onClick={handleClick} aria-label="Next Month">
        <span className="footer-arrow-flow" aria-hidden="true">
          <span className="footer-arrow-track">
            {Array.from({ length: 2 }).map((_, g) => (
              <span className="footer-arrow-group" key={g}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span className="footer-arrow" key={i}>&gt;</span>
                ))}
              </span>
            ))}
          </span>
        </span>
      </button>
    </div>
  );
}

export default Footer;