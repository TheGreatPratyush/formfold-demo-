import React from 'react';
import { Package, Github, ExternalLink, Code2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#" className="brand-wrap">
          <div className="brand-logo-icon">
            <Package size={20} />
          </div>
          <span className="brand-text">Formfold</span>
          <span className="brand-version">v1.0.0</span>
        </a>

        <nav className="nav-links">
          <a href="#playground" className="nav-link">Playground</a>
          <a href="#comparison" className="nav-link">Object.fromEntries vs Formfold</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#limitations" className="nav-link">Limitations</a>
        </nav>

        <div className="header-actions">
          <a
            href="https://www.npmjs.com/package/formfold"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="View Formfold on npm"
          >
            <Package size={16} />
            <span>npm</span>
          </a>

          <a
            href="https://github.com/TheGreatPratyush/formfold"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="View Formfold source repository"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
