import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="#ig" className="circle-icon">IG</a>
        <a href="#tw" className="circle-icon">TW</a>
        <a href="#fb" className="circle-icon">FB</a>
      </div>

      <div className="footer-center">
        <span className="festival-name">SUBSONIC FESTIVAL</span>
      </div>

      <div className="footer-right">
        <div className="spotify-placeholder">
          Música, API SPOTIFY
        </div>
      </div>
    </footer>
  );
}

export default Footer;