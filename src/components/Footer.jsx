import React from 'react';
import '../styles/components/footer.css';

const Footer = ({ onNextMonth }) => {
  return (
    <div className="footer-container">
      <button className="footer-button" onClick={onNextMonth}>next month</button>
    </div>
  );
}

export default Footer;