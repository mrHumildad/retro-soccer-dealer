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
        <svg
          className="footer-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export default Footer;