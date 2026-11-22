import React, { useState } from 'react';
import { Copy, Check, Code, FileText } from 'lucide-react';

/**
 * Syntax highlighters for JSON strings
 */
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  if (!json) return '';

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'tok-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'tok-key';
        } else {
          cls = 'tok-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'tok-boolean';
      } else if (/null/.test(match)) {
        cls = 'tok-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function JsonViewer({ title, data, rawString, emptyMessage = "No parsed output yet. Click 'Parse FormData' to generate result." }) {
  const [copied, setCopied] = useState(false);

  const formattedJson = rawString || (data !== undefined && data !== null ? JSON.stringify(data, null, 2) : '');

  const handleCopy = () => {
    if (!formattedJson) return;
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container">
      <div className="code-toolbar">
        <div className="code-title">
          <Code size={15} />
          <span>{title || 'JSON Result'}</span>
        </div>
        {formattedJson && (
          <button
            onClick={handleCopy}
            className="btn-copy-quick"
            style={{ color: '#cbd5e1' }}
            title="Copy JSON to clipboard"
          >
            {copied ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#86efac' }}>
                <Check size={14} /> Copied!
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Copy size={14} /> Copy JSON
              </span>
            )}
          </button>
        )}
      </div>

      {formattedJson ? (
        <pre
          className="code-pre"
          dangerouslySetInnerHTML={{ __html: syntaxHighlight(formattedJson) }}
        />
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
          <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
