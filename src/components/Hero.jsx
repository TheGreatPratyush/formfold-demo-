import React, { useState } from 'react';
import { ArrowRight, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'npm install formfold';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="hero-section">
      <div className="hero-glow"></div>
      <div className="container">
        <div className="hero-pill">
          <span className="hero-pill-badge">Zero Dependencies</span>
          <span>100% Native Web API FormData Parser</span>
        </div>

        <h1 className="hero-title">
          Turn FormData into <span className="hero-title-accent">structured JavaScript objects.</span>
        </h1>

        <p className="hero-description">
          Experiment with nested fields, repeated values, arrays, and type conversion using Formfold.
          Safely parse native HTML form submissions without prototype pollution or silent data overwrites.
        </p>

        <div className="hero-actions">
          <a href="#playground" className="btn-primary">
            <span>Explore Playground</span>
            <ArrowRight size={18} />
          </a>

          <a
            href="https://github.com/TheGreatPratyush/formfold"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <span>GitHub Repository</span>
            <ExternalLink size={16} />
          </a>
        </div>

        <div>
          <div className="hero-terminal-pill">
            <Terminal size={16} color="#94a3b8" />
            <code>{installCmd}</code>
            <button
              onClick={handleCopy}
              className="btn-copy-quick"
              title="Copy install command"
              aria-label="Copy install command"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
