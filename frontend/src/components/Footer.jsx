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
        <div className="spotify-container">
          <iframe
            data-testid="embed-iframe"
            className="spotify-embed"
            src="https://open.spotify.com/embed/playlist/3mSEthCx9XauDTZMQ0AV67?utm_source=generator&theme=0"

            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </footer>
  );
}

export default Footer;