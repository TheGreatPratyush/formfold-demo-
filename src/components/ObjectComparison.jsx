import React from 'react';
import { AlertCircle, CheckCircle, Code2, ArrowRight } from 'lucide-react';

export default function ObjectComparison() {
  const exampleInput = [
    { key: 'user[name]', val: 'Rahul' },
    { key: 'user[address][city]', val: 'Mumbai' },
    { key: 'user[address][country]', val: 'India' },
    { key: 'hobby', val: 'coding' },
    { key: 'hobby', val: 'gaming' }
  ];

  const fromEntriesResult = `{
  "user[name]": "Rahul",
  "user[address][city]": "Mumbai",
  "user[address][country]": "India",
  "hobby": "gaming"
}`;

  const formfoldResult = `{
  "user": {
    "name": "Rahul",
    "address": {
      "city": "Mumbai",
      "country": "India"
    }
  },
  "hobby": [
    "coding",
    "gaming"
  ]
}`;

  return (
    <section id="comparison" className="section section-alt">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-badge">Architectural Comparison</span>
          <h2 className="section-title">Object.fromEntries() vs Formfold</h2>
          <p className="section-subtitle">
            Why <code>Object.fromEntries(formData.entries())</code> falls short for modern structured web forms.
          </p>
        </div>

        {/* Input Table */}
        <div style={{ maxWidth: '640px', margin: '0 auto 36px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Submitted FormData Key-Value Pairs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {exampleInput.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: '4px 0', borderBottom: idx < exampleInput.length - 1 ? '1px dashed #f1f5f9' : 'none' }}>
                <span style={{ color: '#4f46e5' }}>{item.key}</span>
                <span style={{ color: '#0f172a' }}>"{item.val}"</span>
              </div>
            ))}
          </div>
        </div>

        <div className="comparison-container">
          {/* Box 1: Object.fromEntries */}
          <div className="comparison-box">
            <div className="comparison-box-header">
              <h3>
                <AlertCircle size={18} color="#dc2626" />
                <span>Object.fromEntries()</span>
              </h3>
              <span className="card-badge" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
                Flat String Keys & Data Loss
              </span>
            </div>

            <div className="comparison-box-body">
              <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem', lineHeight: '1.5', overflowX: 'auto', marginBottom: '16px' }}>
                <code>{fromEntriesResult}</code>
              </pre>

              <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Issues with native fromEntries:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    <strong>No nested structure:</strong> Treats <code>"user[address][city]"</code> as one flat string literal key instead of creating nested sub-objects.
                  </li>
                  <li>
                    <strong>Silent data overwrite:</strong> The first <code>hobby="coding"</code> was completely overwritten by <code>"gaming"</code>!
                  </li>
                  <li>
                    <strong>No type casting:</strong> Numbers and booleans always remain raw strings.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Box 2: Formfold */}
          <div className="comparison-box formfold-box">
            <div className="comparison-box-header">
              <h3>
                <CheckCircle size={18} color="#16a34a" />
                <span>Formfold parseFormData()</span>
              </h3>
              <span className="card-badge" style={{ color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}>
                Deep Nesting & Array Preservation
              </span>
            </div>

            <div className="comparison-box-body">
              <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', color: '#f8fafc', fontSize: '0.85rem', lineHeight: '1.5', overflowX: 'auto', marginBottom: '16px' }}>
                <code>{formfoldResult}</code>
              </pre>

              <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>How Formfold handles it:</strong>
                </p>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    <strong>Deep nested objects:</strong> Parses bracket notation <code>user[address][city]</code> into nested JavaScript objects.
                  </li>
                  <li>
                    <strong>Automatic array aggregation:</strong> Preserves multiple entries of repeated key <code>hobby</code> as an array <code>["coding", "gaming"]</code>.
                  </li>
                  <li>
                    <strong>Native Web API standard:</strong> Works seamlessly with browser <code>FormData</code> and server endpoints.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
