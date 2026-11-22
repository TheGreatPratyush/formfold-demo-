# Formfold Playground

[![npm version](https://img.shields.io/npm/v/formfold?color=4f46e5&label=formfold)](https://www.npmjs.com/package/formfold)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build & Test](https://img.shields.io/badge/Tests-10%20passing-brightgreen.svg)]()

> A modern, interactive web application demonstrating [**formfold**](https://www.npmjs.com/package/formfold) — a TypeScript utility that safely converts native JavaScript `FormData` into structured objects.

**Live Production Demo:** [https://formfold-demo.vercel.app](https://formfold-demo.vercel.app) *(or active deployment link)*

---

## 📌 Project Architecture & Separation

This repository contains the **interactive demo application and playground**.

The original `formfold` npm package source code is maintained separately:
- **NPM Package:** [https://www.npmjs.com/package/formfold](https://www.npmjs.com/package/formfold)
- **Original Source Repository:** [https://github.com/TheGreatPratyush/formfold](https://github.com/TheGreatPratyush/formfold)
- **Playground Repository:** [https://github.com/TheGreatPratyush/formfold-demo-](https://github.com/TheGreatPratyush/formfold-demo-)
- **Author:** Pratyush Gupta

This playground installs and demonstrates the **real published npm package**:
```bash
npm install formfold
```

```javascript
import { parseFormData } from "formfold";
```

No internal parsing logic has been duplicated.

---

## ✨ Features Demonstrated

1. **Basic Fields:** Maps standard form inputs (`name`, `email`, `age`) directly to object keys.
2. **Repeated Fields:** Automatically combines repeated keys (e.g. multiple `hobby` fields) into a JavaScript array `["coding", "reading"]`.
3. **Deep Nested Objects:** Parses bracket notation such as `user[name]`, `user[address][city]`, and `user[address][country]` into structured objects.
4. **Explicit Arrays:** Supports explicit array syntax `skills[]`, ensuring single or multiple items are always converted into arrays.
5. **Type Coercion Options:**
   - `castNumbers: true`: Safely coerces numbers (`"25"` → `25`, `"-5"` → `-5`) while intelligently protecting leading zeros (`"00123"`) and phone numbers (`"+919876543210"`).
   - `castBooleans: true`: Converts `"true"` and `"false"` into boolean primitives.
   - `maxDepth`: Configurable limit to prevent nesting DoS attacks (default `10`).
6. **Native File & Blob Preservation:** Unlike `Object.fromEntries` or manual parsers that turn files into `"[object File]"`, `formfold` keeps real `File` and `Blob` instances intact.
7. **Security & Validation:**
   - Strict defense against prototype pollution (`__proto__`, `constructor`, `prototype`).
   - Fast-fail detection for malformed bracket syntax (e.g., `[name`, `user[[name]]`).
   - Detection of conflicting structures (e.g., trying to overwrite a primitive with an object).
8. **Educational Comparison:** Live comparison between `formfold` and native `Object.fromEntries(formData.entries())`, illustrating why native conversion loses duplicate keys and fails on nested objects.
9. **Transparent Limitations:** Clearly documents and illustrates the v1 limitation (`user[][name]` array-of-objects syntax is intentionally rejected in v1).

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Bundler & Dev Server:** Vite 6
- **Language:** Modern JavaScript (ES Modules)
- **Styling:** Custom CSS with CSS variables, responsive flex/grid layouts, and syntax styling
- **Icons:** Lucide React
- **Testing:** Vitest
- **Package Manager:** npm

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone the Repository

```bash
git clone https://github.com/TheGreatPratyush/formfold-demo-.git
cd formfold-demo-
```

### 2. Install Dependencies

```bash
npm install
```

This installs `formfold` directly from npm along with React and Vite.

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the playground.

### 4. Run Automated Tests

```bash
npm test
```

Executes the suite of 10 Vitest integration tests covering parsing, nested keys, type coercion, File preservation, and error handling.

### 5. Build for Production

```bash
npm run build
```

Generates an optimized static production build in the `dist/` directory.

---

## 🔬 How Formfold is Integrated

In [src/components/Playground.jsx](file:///src/components/Playground.jsx):

```javascript
import { parseFormData } from "formfold";

const handleParse = () => {
  // 1. Create native FormData from form DOM node
  const formData = new FormData(formRef.current);

  // 2. Pass FormData to real published Formfold package
  const result = parseFormData(formData, {
    castNumbers: true,
    castBooleans: true,
    maxDepth: 10
  });

  // 3. Output contains deep nested objects, arrays, and preserved File instances!
  console.log(result);
};
```

---

## 📊 Comparison: `Object.fromEntries` vs `formfold`

| Feature | `Object.fromEntries()` | `formfold` |
|---|---|---|
| Basic fields (`name=Rahul`) | ✅ `{ name: "Rahul" }` | ✅ `{ name: "Rahul" }` |
| Duplicate keys (`hobby=a`, `hobby=b`) | ❌ Overwrites (`{ hobby: "b" }`) | ✅ `{ hobby: ["a", "b"] }` |
| Explicit array syntax (`skills[]=a`) | ❌ `{"skills[]": "a"}` | ✅ `{ skills: ["a"] }` |
| Nested bracket notation (`user[city]=Mumbai`) | ❌ `{"user[city]": "Mumbai"}` | ✅ `{ user: { city: "Mumbai" } }` |
| Preserves `File` instances | ⚠️ Coerced / raw | ✅ Unmodified instance |
| Prototype pollution defense | ❌ Vulnerable to `__proto__` | ✅ Strict rejection |
| Optional type coercion | ❌ None | ✅ `castNumbers`, `castBooleans` |

---

## 📄 License

MIT © [Pratyush Gupta](https://github.com/TheGreatPratyush)
