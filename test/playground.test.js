import { describe, it, expect } from 'vitest';
import { parseFormData } from 'formfold';
import { formatResultForDisplay, compareWithObjectFromEntries } from '../src/utils/serializer';

describe('Formfold Playground Integration Tests', () => {
  it('parses basic fields', () => {
    const fd = new FormData();
    fd.append('name', 'Rahul');
    fd.append('age', '24');

    const result = parseFormData(fd);
    expect(result).toEqual({ name: 'Rahul', age: '24' });
  });

  it('parses repeated fields into arrays', () => {
    const fd = new FormData();
    fd.append('hobby', 'coding');
    fd.append('hobby', 'reading');
    fd.append('hobby', 'gaming');

    const result = parseFormData(fd);
    expect(result).toEqual({ hobby: ['coding', 'reading', 'gaming'] });
  });

  it('parses nested bracket keys', () => {
    const fd = new FormData();
    fd.append('user[name]', 'Rahul');
    fd.append('user[address][city]', 'Mumbai');
    fd.append('user[address][country]', 'India');

    const result = parseFormData(fd);
    expect(result).toEqual({
      user: {
        name: 'Rahul',
        address: {
          city: 'Mumbai',
          country: 'India'
        }
      }
    });
  });

  it('parses explicit arrays with [] suffix', () => {
    const fd = new FormData();
    fd.append('skills[]', 'JavaScript');
    fd.append('skills[]', 'React');

    const result = parseFormData(fd);
    expect(result).toEqual({ skills: ['JavaScript', 'React'] });
  });

  it('handles type coercion for numbers and booleans', () => {
    const fd = new FormData();
    fd.append('count', '42');
    fd.append('ratio', '3.14');
    fd.append('zip', '00123'); // Should remain string
    fd.append('isActive', 'true');
    fd.append('isArchived', 'false');

    const result = parseFormData(fd, { castNumbers: true, castBooleans: true });
    expect(result).toEqual({
      count: 42,
      ratio: 3.14,
      zip: '00123',
      isActive: true,
      isArchived: false
    });
  });

  it('preserves native File instances intact', () => {
    const fd = new FormData();
    const file = new File(['hello world'], 'sample.txt', { type: 'text/plain' });
    fd.append('document', file);

    const result = parseFormData(fd);
    expect(result.document).toBe(file);
    expect(result.document instanceof File).toBe(true);

    // Test presentation serializer
    const serialized = formatResultForDisplay(result);
    expect(serialized.document._type).toBe('File');
    expect(serialized.document.name).toBe('sample.txt');
  });

  it('contrasts with Object.fromEntries properly', () => {
    const fd = new FormData();
    fd.append('user[name]', 'Rahul');
    fd.append('hobby', 'coding');
    fd.append('hobby', 'gaming');

    const flat = compareWithObjectFromEntries(fd);
    expect(flat).toEqual({
      'user[name]': 'Rahul',
      hobby: 'gaming' // Overwritten!
    });

    const parsed = parseFormData(fd);
    expect(parsed).toEqual({
      user: { name: 'Rahul' },
      hobby: ['coding', 'gaming']
    });
  });

  it('strictly validates conflicting keys and throws descriptive error', () => {
    const fd = new FormData();
    fd.append('user', 'Rahul');
    fd.append('user[name]', 'Amit');

    expect(() => parseFormData(fd)).toThrow(/already contains a value/);
  });

  it('strictly blocks prototype pollution', () => {
    const fd = new FormData();
    fd.append('__proto__', 'polluted');
    expect(() => parseFormData(fd)).toThrow(/Unsafe FormData key/);
  });

  it('rejects unsupported v1 array-of-objects syntax', () => {
    const fd = new FormData();
    fd.append('user[][name]', 'Rahul');
    expect(() => parseFormData(fd)).toThrow(/Invalid FormData key/);
  });
});
