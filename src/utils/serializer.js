/**
 * Presentation serialization helper for UI preview.
 * 
 * IMPORTANT: This does NOT modify the actual parser output.
 * It is solely a presentation layer to safely represent File, Blob,
 * and circular or non-serializable objects in the JSON viewer preview.
 */
export function formatResultForDisplay(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof File !== 'undefined' && obj instanceof File) {
    return {
      _type: 'File',
      name: obj.name,
      size: `${(obj.size / 1024).toFixed(1)} KB (${obj.size} bytes)`,
      type: obj.type || 'application/octet-stream',
      lastModified: obj.lastModified ? new Date(obj.lastModified).toISOString() : 'unknown'
    };
  }

  if (typeof Blob !== 'undefined' && obj instanceof Blob) {
    return {
      _type: 'Blob',
      size: `${(obj.size / 1024).toFixed(1)} KB (${obj.size} bytes)`,
      type: obj.type || 'application/octet-stream'
    };
  }

  if (Array.isArray(obj)) {
    return obj.map(item => formatResultForDisplay(item));
  }

  if (typeof obj === 'object') {
    const copy = {};
    for (const [key, val] of Object.entries(obj)) {
      copy[key] = formatResultForDisplay(val);
    }
    return copy;
  }

  return obj;
}

/**
 * Compare Formfold with Object.fromEntries(formData.entries())
 */
export function compareWithObjectFromEntries(formData) {
  if (!formData || !(formData instanceof FormData)) {
    return {};
  }
  return Object.fromEntries(formData.entries());
}
