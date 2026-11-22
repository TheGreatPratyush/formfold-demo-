import React, { useState, useRef } from 'react';
import { parseFormData } from 'formfold';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Plus, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sliders, 
  HelpCircle,
  FileCode,
  FileText
} from 'lucide-react';
import JsonViewer from './JsonViewer';
import { formatResultForDisplay, compareWithObjectFromEntries } from '../utils/serializer';

const INITIAL_FORM_STATE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  age: '24',
  hobbies: ['coding', 'reading', 'badminton'],
  userName: 'Rahul',
  userCity: 'Mumbai',
  userCountry: 'India',
  skills: ['JavaScript', 'React', 'TypeScript'],
  isActive: 'true',
  customKey: '',
  customVal: ''
};

export default function Playground() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form State
  const [formDataState, setFormDataState] = useState(INITIAL_FORM_STATE);
  const [selectedFile, setSelectedFile] = useState(null);

  // Formfold Parser Options
  const [castNumbers, setCastNumbers] = useState(true);
  const [castBooleans, setCastBooleans] = useState(true);
  const [maxDepth, setMaxDepth] = useState(10);

  // Parser Execution State
  const [rawOutput, setRawOutput] = useState(null);
  const [displayOutput, setDisplayOutput] = useState(null);
  const [fromEntriesOutput, setFromEntriesOutput] = useState(null);
  const [rawFormDataList, setRawFormDataList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('formfold'); // 'formfold' | 'fromEntries' | 'entries' | 'files'

  // Handle Dynamic Repeated Hobbies
  const addHobby = () => {
    setFormDataState(prev => ({ ...prev, hobbies: [...prev.hobbies, ''] }));
  };

  const updateHobby = (index, value) => {
    setFormDataState(prev => {
      const next = [...prev.hobbies];
      next[index] = value;
      return { ...prev, hobbies: next };
    });
  };

  const removeHobby = (index) => {
    setFormDataState(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  // Handle Dynamic Skills Array
  const addSkill = () => {
    setFormDataState(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  };

  const updateSkill = (index, value) => {
    setFormDataState(prev => {
      const next = [...prev.skills];
      next[index] = value;
      return { ...prev, skills: next };
    });
  };

  const removeSkill = (index) => {
    setFormDataState(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Handle File Input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Core Parse Action using the real Formfold package
  const handleParse = (overrideFormData = null) => {
    setErrorMessage(null);

    try {
      let fd;
      if (overrideFormData instanceof FormData) {
        fd = overrideFormData;
      } else if (formRef.current) {
        fd = new FormData(formRef.current);
      } else {
        fd = new FormData();
      }

      // Collect raw entries for visual inspection
      const entries = [];
      for (const [key, val] of fd.entries()) {
        entries.push({
          key,
          value: val instanceof File ? `[File: ${val.name} (${val.size} bytes)]` : String(val),
          isFile: val instanceof File,
          fileRef: val instanceof File ? val : null
        });
      }
      setRawFormDataList(entries);

      // 1. Comparison with Object.fromEntries
      const flat = compareWithObjectFromEntries(fd);
      setFromEntriesOutput(flat);

      // 2. Call the real published Formfold parser!
      const parsed = parseFormData(fd, {
        castNumbers,
        castBooleans,
        maxDepth: Number(maxDepth) || 10
      });

      // Preserve raw output in state
      setRawOutput(parsed);

      // Format for safe JSON preview (preserves File instances in rawOutput, formats for UI preview)
      const formatted = formatResultForDisplay(parsed);
      setDisplayOutput(formatted);
    } catch (err) {
      console.error('Formfold parsing error:', err);
      setErrorMessage(err.message || 'An error occurred while parsing FormData');
      setRawOutput(null);
      setDisplayOutput(null);
    }
  };

  // Reset Form
  const handleReset = () => {
    setFormDataState({
      name: '',
      email: '',
      age: '',
      hobbies: [''],
      userName: '',
      userCity: '',
      userCountry: '',
      skills: [''],
      isActive: 'true',
      customKey: '',
      customVal: ''
    });
    clearFile();
    setErrorMessage(null);
  };

  // Load Sample Data
  const handleLoadSample = () => {
    setFormDataState(INITIAL_FORM_STATE);
    setErrorMessage(null);
  };

  // Clear Output
  const handleClearOutput = () => {
    setRawOutput(null);
    setDisplayOutput(null);
    setFromEntriesOutput(null);
    setRawFormDataList([]);
    setErrorMessage(null);
  };

  // Preset Demonstrations for Error Scenarios
  const loadPreset = (type) => {
    const fd = new FormData();

    if (type === 'sample') {
      handleLoadSample();
      setTimeout(() => handleParse(), 50);
      return;
    }

    if (type === 'typeCasting') {
      fd.append('age', '28');
      fd.append('temperature', '-3.5');
      fd.append('pi', '3.14159');
      fd.append('zipCode', '00123'); // Should remain string!
      fd.append('phone', '+919876543210'); // Should remain string!
      fd.append('isStudent', 'true');
      fd.append('hasLicense', 'false');
      fd.append('otherString', 'truthy');
      handleParse(fd);
      return;
    }

    if (type === 'malformedKey') {
      fd.append('[invalid_key', 'someValue');
      handleParse(fd);
      return;
    }

    if (type === 'conflict') {
      fd.append('user', 'Rahul');
      fd.append('user[name]', 'Amit');
      handleParse(fd);
      return;
    }

    if (type === 'prototypeSecurity') {
      fd.append('user[__proto__][isAdmin]', 'true');
      handleParse(fd);
      return;
    }

    if (type === 'v1Limitation') {
      fd.append('user[][name]', 'Rahul');
      handleParse(fd);
      return;
    }
  };

  // Check if parsed output contains any files
  const fileEntries = rawFormDataList.filter(item => item.isFile);

  return (
    <section id="playground" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-badge">Live Interactive Sandbox</span>
          <h2 className="section-title">Formfold Playground</h2>
          <p className="section-subtitle">
            Configure HTML form inputs, choose parser options, and inspect how Formfold converts standard FormData into deeply structured objects.
          </p>
        </div>

        {/* Quick Presets Toolbar */}
        <div className="presets-toolbar">
          <span className="preset-label">Quick Test Scenarios:</span>
          <button onClick={() => loadPreset('sample')} className="btn-preset">
            Sample Profile
          </button>
          <button onClick={() => loadPreset('typeCasting')} className="btn-preset">
            Number/Boolean Casting
          </button>
          <button onClick={() => loadPreset('conflict')} className="btn-preset danger-preset" title="Tests conflicting structure detection">
            Conflicting Key (Error)
          </button>
          <button onClick={() => loadPreset('malformedKey')} className="btn-preset danger-preset" title="Tests malformed key validation">
            Malformed Key (Error)
          </button>
          <button onClick={() => loadPreset('prototypeSecurity')} className="btn-preset danger-preset" title="Tests prototype pollution defense">
            Unsafe Key (__proto__)
          </button>
          <button onClick={() => loadPreset('v1Limitation')} className="btn-preset danger-preset" title="Tests v1 array-of-objects rejection">
            v1 Limitation (user[][name])
          </button>
        </div>

        {/* Main 2-Column Grid */}
        <div className="playground-grid">
          {/* Column 1: Interactive HTML Form */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <Layers size={18} color="#4f46e5" />
                <h3 className="card-title">HTML Form Inputs</h3>
              </div>
              <span className="card-badge">Native FormData</span>
            </div>

            <div className="card-body">
              <form
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleParse();
                }}
              >
                {/* 1. Basic Fields */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>1. Basic Primitive Fields</span>
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <span className="key-tag">name</span>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input"
                      value={formDataState.name}
                      onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <span className="key-tag">email</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      value={formDataState.email}
                      onChange={(e) => setFormDataState({ ...formDataState, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="age" className="form-label">Age (Numeric String)</label>
                      <span className="key-tag">age</span>
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="text"
                      className="form-input"
                      value={formDataState.age}
                      onChange={(e) => setFormDataState({ ...formDataState, age: e.target.value })}
                      placeholder="e.g. 24"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="isActive" className="form-label">Account Active (Boolean String)</label>
                      <span className="key-tag">isActive</span>
                    </div>
                    <select
                      id="isActive"
                      name="isActive"
                      className="form-select"
                      value={formDataState.isActive}
                      onChange={(e) => setFormDataState({ ...formDataState, isActive: e.target.value })}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                      <option value="not_a_boolean">not_a_boolean</option>
                    </select>
                  </div>
                </div>

                {/* 2. Repeated Fields */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>2. Repeated Fields (hobby)</span>
                    <span className="card-badge">Same key, multiple entries</span>
                  </div>

                  {formDataState.hobbies.map((hobby, index) => (
                    <div key={`hobby-${index}`} className="dynamic-row">
                      <input
                        name="hobby"
                        type="text"
                        className="form-input"
                        value={hobby}
                        onChange={(e) => updateHobby(index, e.target.value)}
                        placeholder={`Hobby #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeHobby(index)}
                        className="btn-remove"
                        title="Remove hobby"
                        aria-label="Remove hobby"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addHobby}
                    className="btn-add-item"
                  >
                    <Plus size={14} /> Add Hobby Entry (name="hobby")
                  </button>
                </div>

                {/* 3. Nested Objects */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>3. Nested Objects (Bracket Notation)</span>
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="user-name" className="form-label">User Display Name</label>
                      <span className="key-tag">user[name]</span>
                    </div>
                    <input
                      id="user-name"
                      name="user[name]"
                      type="text"
                      className="form-input"
                      value={formDataState.userName}
                      onChange={(e) => setFormDataState({ ...formDataState, userName: e.target.value })}
                      placeholder="e.g. Rahul"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="user-city" className="form-label">City</label>
                      <span className="key-tag">user[address][city]</span>
                    </div>
                    <input
                      id="user-city"
                      name="user[address][city]"
                      type="text"
                      className="form-input"
                      value={formDataState.userCity}
                      onChange={(e) => setFormDataState({ ...formDataState, userCity: e.target.value })}
                      placeholder="e.g. Mumbai"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-wrap">
                      <label htmlFor="user-country" className="form-label">Country</label>
                      <span className="key-tag">user[address][country]</span>
                    </div>
                    <input
                      id="user-country"
                      name="user[address][country]"
                      type="text"
                      className="form-input"
                      value={formDataState.userCountry}
                      onChange={(e) => setFormDataState({ ...formDataState, userCountry: e.target.value })}
                      placeholder="e.g. India"
                    />
                  </div>
                </div>

                {/* 4. Explicit Arrays */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>4. Explicit Array Syntax (skills[])</span>
                    <span className="card-badge">name="skills[]"</span>
                  </div>

                  {formDataState.skills.map((skill, index) => (
                    <div key={`skill-${index}`} className="dynamic-row">
                      <input
                        name="skills[]"
                        type="text"
                        className="form-input"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder={`Skill #${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="btn-remove"
                        title="Remove skill"
                        aria-label="Remove skill"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-add-item"
                  >
                    <Plus size={14} /> Add Skill Entry (name="skills[]")
                  </button>
                </div>

                {/* 5. File Upload Support */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>5. File / Blob Preservation</span>
                    <span className="key-tag">attachment</span>
                  </div>

                  <div className="file-upload-box" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={24} color="#6366f1" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      {selectedFile ? 'Click to replace selected file' : 'Click to select a file (PDF, TXT, PNG, etc.)'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                      Formfold preserves real File instances without corrupting them into "[object File]".
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    name="attachment"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {selectedFile && (
                    <div className="file-info-badge">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileCode size={16} color="#4f46e5" />
                        <div>
                          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                            {selectedFile.name}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'text/plain'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="btn-remove"
                        style={{ width: '28px', height: '28px' }}
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Parser Options Switchers */}
                <div className="options-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <Sliders size={16} color="#4f46e5" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                      Formfold Parser Options
                    </span>
                  </div>

                  <div className="options-grid">
                    <label className="toggle-item">
                      <span className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={castNumbers}
                          onChange={(e) => setCastNumbers(e.target.checked)}
                        />
                        <span className="slider"></span>
                      </span>
                      <span className="toggle-text">
                        <span className="toggle-title">castNumbers</span>
                        <span className="toggle-desc">Converts "25" to 25 (preserves "00123" and phone)</span>
                      </span>
                    </label>

                    <label className="toggle-item">
                      <span className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={castBooleans}
                          onChange={(e) => setCastBooleans(e.target.checked)}
                        />
                        <span className="slider"></span>
                      </span>
                      <span className="toggle-text">
                        <span className="toggle-title">castBooleans</span>
                        <span className="toggle-desc">Converts "true" / "false" to booleans</span>
                      </span>
                    </label>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label htmlFor="maxDepth" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      maxDepth (default 10):
                    </label>
                    <input
                      id="maxDepth"
                      type="number"
                      min="1"
                      max="30"
                      value={maxDepth}
                      onChange={(e) => setMaxDepth(e.target.value)}
                      style={{ width: '70px', padding: '4px 8px', fontSize: '0.82rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="form-actions">
                  <button type="submit" className="btn-action btn-primary">
                    <Play size={16} />
                    <span>Parse FormData</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="btn-action btn-secondary"
                  >
                    <span>Load Sample Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-action btn-secondary"
                  >
                    <RotateCcw size={15} />
                    <span>Reset Form</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Column 2: Output Inspector */}
          <div className="card output-card">
            <div className="card-header">
              <div className="output-header-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'formfold' ? 'active' : ''}`}
                  onClick={() => setActiveTab('formfold')}
                >
                  Formfold Output
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'fromEntries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fromEntries')}
                >
                  Object.fromEntries
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'entries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('entries')}
                >
                  Raw Entries ({rawFormDataList.length})
                </button>
                {fileEntries.length > 0 && (
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                    onClick={() => setActiveTab('files')}
                  >
                    Files ({fileEntries.length})
                  </button>
                )}
              </div>

              {rawOutput && (
                <button
                  onClick={handleClearOutput}
                  className="btn-action btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  title="Clear result"
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              {/* Error Alert Display */}
              {errorMessage && (
                <div className="alert-error">
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>
                      Formfold Strict Parser Error
                    </strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* View 1: Formfold Structured Output */}
              {activeTab === 'formfold' && (
                <JsonViewer
                  title="Structured Object (via formfold)"
                  data={displayOutput}
                  emptyMessage="Form not submitted yet. Fill the inputs on the left and click 'Parse FormData' or choose a quick scenario above."
                />
              )}

              {/* View 2: Object.fromEntries comparison */}
              {activeTab === 'fromEntries' && (
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                    <strong>Standard Object.fromEntries(formData.entries())</strong> treats keys as literal strings and overwrites duplicate keys:
                  </div>
                  <JsonViewer
                    title="Object.fromEntries(formData.entries())"
                    data={fromEntriesOutput}
                    emptyMessage="Submit the form to inspect flat Object.fromEntries output."
                  />
                </div>
              )}

              {/* View 3: Raw FormData.entries() inspection */}
              {activeTab === 'entries' && (
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#475569' }}>
                    All raw key-value pairs appended to the native <code>FormData</code> instance:
                  </div>
                  {rawFormDataList.length > 0 ? (
                    <table className="entries-table">
                      <thead>
                        <tr>
                          <th>Index</th>
                          <th>Key (Raw Name)</th>
                          <th>Value</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawFormDataList.map((entry, idx) => (
                          <tr key={`entry-${idx}`}>
                            <td>#{idx + 1}</td>
                            <td><code>{entry.key}</code></td>
                            <td>{entry.value}</td>
                            <td>
                              <span className="card-badge" style={{ fontSize: '0.7rem' }}>
                                {entry.isFile ? 'File' : typeof entry.value}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <p>No FormData entries recorded yet. Click 'Parse FormData' to inspect.</p>
                    </div>
                  )}
                </div>
              )}

              {/* View 4: Preserved Files Inspector */}
              {activeTab === 'files' && (
                <div>
                  <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#475569' }}>
                    Formfold preserves standard <code>File</code> / <code>Blob</code> objects unmodified in the parsed result:
                  </div>
                  {fileEntries.map((item, idx) => (
                    <div key={`file-badge-${idx}`} className="file-info-badge" style={{ marginBottom: '10px' }}>
                      <div>
                        <strong>{item.fileRef?.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          Size: {item.fileRef?.size} bytes • Type: {item.fileRef?.type || 'unknown'} • Key: <code>{item.key}</code>
                        </div>
                      </div>
                      <span className="alert-success" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                        <CheckCircle2 size={13} />
                        Preserved Native File Instance
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
