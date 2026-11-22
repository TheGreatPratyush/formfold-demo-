import React from 'react';
import { Package, Github, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-logo-icon" style={{ width: '28px', height: '28px', borderRadius: '7px' }}>
                <Package size={16} />
              </div>
              <span className="footer-brand-title">Formfold</span>
            </div>
            <p className="footer-desc">
              A lightweight, secure, and zero-dependency utility to convert native JavaScript FormData into deeply structured objects.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Original Package</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://www.npmjs.com/package/formfold"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  npm Package Registry
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TheGreatPratyush/formfold"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub Source Code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TheGreatPratyush/formfold#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Documentation & Tests
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Playground Demo</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/TheGreatPratyush/formfold-demo-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Demo GitHub Repository
                </a>
              </li>
              <li>
                <a href="#playground" className="footer-link">
                  Interactive Sandbox
                </a>
              </li>
              <li>
                <a href="#comparison" className="footer-link">
                  Object.fromEntries Comparison
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            Crafted by <strong>Pratyush Gupta</strong> • Published on npm as <code>formfold</code>
          </div>
          <div>
            MIT Licensed • College Project Demonstration
          </div>
        </div>
      </div>
    </footer>
  );
}
