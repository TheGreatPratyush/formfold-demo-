import React from 'react';
import { 
  FolderTree, 
  ListPlus, 
  ShieldCheck, 
  FileCheck, 
  Binary, 
  ToggleLeft, 
  AlertTriangle, 
  Cpu, 
  Sparkles 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <FolderTree size={22} />,
      title: 'Deep Nested Objects',
      desc: 'Parses arbitrary bracket notation (e.g. user[address][city]) into deeply structured JavaScript objects up to a configurable maxDepth.'
    },
    {
      icon: <ListPlus size={22} />,
      title: 'Repeated Keys as Arrays',
      desc: 'When an HTML form submits multiple inputs sharing the same name (e.g. hobby=coding & hobby=music), Formfold groups them into an array.'
    },
    {
      icon: <ListPlus size={22} />,
      title: 'Explicit Array Syntax',
      desc: 'Supports PHP / standard bracket syntax skills[]. Single values like skills[]=react will still be guaranteed an array [ "react" ].'
    },
    {
      icon: <FileCheck size={22} />,
      title: 'Preserves File & Blob Instances',
      desc: 'Unlike manual parsers that coerce files into "[object File]", Formfold leaves standard browser File and Blob objects intact.'
    },
    {
      icon: <Binary size={22} />,
      title: 'Safe Number Coercion',
      desc: 'Optional castNumbers: true safely converts numeric strings to numbers, but smartly keeps leading zeroes ("00123") and phone numbers as strings.'
    },
    {
      icon: <ToggleLeft size={22} />,
      title: 'Boolean Coercion',
      desc: 'Optional castBooleans: true converts "true" and "false" into real boolean primitives, leaving non-boolean strings untouched.'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Prototype Pollution Defense',
      desc: 'Keys matching __proto__, constructor, or prototype are strictly rejected to prevent prototype pollution attacks.'
    },
    {
      icon: <AlertTriangle size={22} />,
      title: 'Conflicting Structure Detection',
      desc: 'Fails fast if a field name attempts to overwrite a primitive with an object (or vice versa), preventing silent data corruption.'
    },
    {
      icon: <Cpu size={22} />,
      title: 'Zero Dependencies',
      desc: 'Lightweight, standalone package with zero third-party runtime dependencies and native TypeScript declarations included.'
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-badge">Core Capabilities</span>
          <h2 className="section-title">Verified Features</h2>
          <p className="section-subtitle">
            Everything implemented and verified in the published <code>formfold</code> npm package.
          </p>
        </div>

        <div className="features-grid">
          {featureList.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrap">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
