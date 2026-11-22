import React from 'react';
import { AlertTriangle, Info, Check } from 'lucide-react';

export default function Limitations() {
  return (
    <section id="limitations" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-badge" style={{ color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
            Known Constraints & v1 Scope
          </span>
          <h2 className="section-title">Transparent Limitations</h2>
          <p className="section-subtitle">
            Formfold is intentionally designed to be strict, predictable, and safe rather than guessing ambiguous input patterns.
          </p>
        </div>

        <div className="limitations-box">
          <div className="limitations-header">
            <AlertTriangle size={24} color="#d97706" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Unsupported in v1: Array-of-Objects Syntax (<code>user[][name]</code>)
            </h3>
          </div>

          <div style={{ fontSize: '0.95rem', color: '#78350f', lineHeight: 1.6, marginBottom: '20px' }}>
            <p style={{ marginBottom: '12px' }}>
              In version 1.0.0, empty bracket sequences followed by child properties (such as <code>user[][name]</code> or <code>items[][id]</code>) are <strong>not supported</strong> and will intentionally throw a validation error.
            </p>
            <p>
              This design choice prevents subtle ambiguities when parsing disordered FormData streams (e.g. determining whether consecutive entries belong to the same object or a new array element).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #fecaca' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ fontSize: '1rem' }}>✗</span> Unsupported in v1:
              </div>
              <code style={{ fontSize: '0.82rem', color: '#991b1b', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px', display: 'block' }}>
                user[][name]=Rahul<br />
                user[][name]=Amit
              </code>
              <p style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '6px' }}>
                Throws: "Invalid FormData key"
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>
                <Check size={16} /> Supported Workarounds:
              </div>
              <code style={{ fontSize: '0.82rem', color: '#166534', background: '#f0fdf4', padding: '6px 10px', borderRadius: '6px', display: 'block' }}>
                users[0][name]=Rahul<br />
                users[1][name]=Amit
              </code>
              <p style={{ fontSize: '0.78rem', color: '#166534', marginTop: '6px' }}>
                Explicit indexing or repeated scalar keys (e.g. <code>hobby[]</code>)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
