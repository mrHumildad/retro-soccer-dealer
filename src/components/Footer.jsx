import React from 'react';
import '../styles/components/footer.css';

const Footer = ({ onNextMonth }) => {
  return (
    <div className="footer-container">
      <button className="footer-button" onClick={onNextMonth} aria-label="Next Month">
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