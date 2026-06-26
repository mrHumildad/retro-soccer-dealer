import React from 'react';

const Footer = ({ onNextMonth }) => {
  return (
    <div className="footer-container">
      <button onClick={onNextMonth}>next month</button>
    </div>
  );
}

export default Footer;