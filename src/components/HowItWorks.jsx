import React from 'react';
import { KeyRound, GitMerge, FileCheck2, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      icon: <KeyRound size={20} color="#4f46e5" />,
      title: 'Key Tokenization & Security Check',
      desc: 'Each FormData key is parsed for bracket notation (e.g. user[address][city]). The parser checks whether it ends with [] (forceArray) and verifies against __proto__, constructor, and prototype to eliminate prototype pollution.',
      code: 'user[address][city] -> ["user", "address", "city"]'
    },
    {
      num: '2',
      icon: <GitMerge size={20} color="#4f46e5" />,
      title: 'Safe Recursive Descent & Conflict Detection',
      desc: 'Formfold descends into the object graph creating sub-objects as needed. If an existing property already holds a primitive or array and an incoming key tries to treat it as an object (e.g. user vs user[name]), it throws a descriptive error.',
      code: 'user: {} -> user.address: {} -> user.address.city = "..."'
    },
    {
      num: '3',
      icon: <FileCheck2 size={20} color="#4f46e5" />,
      title: 'Smart Coercion & Value Preservation',
      desc: 'Values undergo optional castNumbers and castBooleans. File and Blob instances are preserved unmodified. When encountering an already-existing property, addValue automatically transforms it into an array of values.',
      code: 'Repeated keys -> [val1, val2] | File -> Native File instance'
    }
  ];

  return (
    <section id="how-it-works" className="section section-alt">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-badge">Parser Internals</span>
          <h2 className="section-title">How Formfold Works</h2>
          <p className="section-subtitle">
            A 3-stage pipeline designed for predictability, security, and developer ergonomics.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              <div style={{ marginTop: '16px', background: '#0f172a', padding: '10px 14px', borderRadius: '8px', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                {step.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
