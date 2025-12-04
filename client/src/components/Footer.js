import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Cricket Store</h3>
            <p className="footer-desc">
              Your trusted partner for premium cricket equipment. Quality gear for players at every level.
            </p>
            <div className="footer-social">
              <a className="footer-social-link" href="#" aria-label="Facebook">Facebook</a>
              <a className="footer-social-link" href="#" aria-label="Twitter / X">Twitter</a>
              <a className="footer-social-link" href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=bats">Cricket Bats</Link></li>
              <li><Link to="/products?category=balls">Cricket Balls</Link></li>
              <li><Link to="/products?category=gloves">Gloves</Link></li>
              <li><Link to="/products?category=pads">Pads</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns &amp; Exchanges</a></li>
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul className="footer-links">
              <li>📧 support@cricketstore.co.uk</li>
              <li>📞 +44 20 7946 0958</li>
              <li>📍 123 Cricket Lane, London, UK</li>
              <li>🕒 Mon-Sat: 9AM-6PM GMT</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2024 Cricket Store. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;