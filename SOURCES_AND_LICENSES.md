# 📜 Sources & License Record

**Project:** BDH vs. KV Caching — Synaptic Short-Term Memory Simulator
**Submission:** DataForge 2026 · Pathway Track
**Document purpose:** A complete, auditable record of where every piece of code, data, graphic, font, and reused component in this project comes from, and under which license it may be used and redistributed.

---

## How this record was compiled

- npm dependency licenses were read **directly from the installed packages** in `node_modules/` (the `license` field of each `package.json`, cross-checked against each package's `LICENSE`/`LICENSE.md` file where present).
- Font, paper, and external-repository licenses were verified against the **official upstream sources** (Google Fonts, JetBrains, Tokotype, arXiv, GitHub).
- This file should be kept in sync whenever dependencies are added, removed, or upgraded. A quick way to re-verify declared licenses: `npm ls --all` or read `node_modules/<pkg>/package.json`.

---

## 1. Original project code (own work)

| Asset | Path(s) | Source | License |
|---|---|---|---|
| All application source code | `src/**` (components, utils, types, styles), `index.html`, `vite.config.ts`, `.github/workflows/deploy.yml`, `package.json` | Written from scratch for this DataForge 2026 submission by the project authors | **Not yet licensed** — see note below |
| Project documentation | `README.md`, this file | Original authorship | Same as above |
| Authored research summary | `The Architecture of AI Memory.docx` (project-root document) | Original authored content by the project team | Same as above |

> ⚠️ **Note:** this repository currently has **no `LICENSE` file of its own**. Until one is added, the default copyright rules apply ("all rights reserved" by the authors) even though the code is public on GitHub. If you intend to let others reuse the code, add a license (e.g., MIT) and reference it here.

---

## 2. Third-party code — npm dependencies

All packages below are declared in `package.json` and installed under `node_modules/`. Versions listed are the **installed** versions at the time of writing.

### Runtime dependencies

| Package | Installed | License (SPDX) | Copyright / attribution | Upstream |
|---|---|---|---|---|
| `react` | 19.2.8 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates | https://github.com/facebook/react |
| `react-dom` | 19.2.8 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates | https://github.com/facebook/react |
| `three` | 0.185.1 | MIT | Copyright © 2010–2026 three.js authors | https://github.com/mrdoob/three.js |
| `@react-three/fiber` | 9.7.0 | MIT | pmndrs / react-three-fiber contributors | https://github.com/pmndrs/react-three-fiber |
| `@react-three/drei` | 10.7.8 | MIT | Copyright (c) 2020 react-spring (pmndrs) | https://github.com/pmndrs/drei |
| `framer-motion` | 13.2.0 | MIT | Copyright (c) 2018 Framer B.V. | https://github.com/framer/motion |
| `canvas-confetti` | 1.9.4 | ISC | Copyright (c) 2020 Kiril Vatev | https://github.com/catdad/canvas-confetti |
| `lucide-react` | 1.41.0 | ISC | Copyright (c) 2026 Lucide Icons and Contributors; base icon set © Cole Bemis (Feather) | https://github.com/lucide-icons/lucide |
| `tailwindcss` | 4.3.3 | MIT | Copyright (c) Tailwind Labs, Inc. | https://github.com/tailwindlabs/tailwindcss |
| `@tailwindcss/vite` | 4.3.3 | MIT | Copyright (c) Tailwind Labs, Inc. | https://github.com/tailwindlabs/tailwindcss |

> ℹ️ **Note on `three`, `@react-three/fiber`, and `@react-three/drei`:** these are declared dependencies, but the app's 3D scene (`Model3DSimulator`) is rendered with a **hand-rolled, dependency-free Canvas 2D projection**. The three.js stack may therefore be unused at runtime in the current build; it is retained as declared dependencies and licensed as above.

### Development dependencies

| Package | Installed | License (SPDX) | Copyright / attribution | Upstream |
|---|---|---|---|---|
| `vite` | 8.2.2 | MIT | Copyright (c) 2019–present VoidZero Inc. and Vite contributors | https://github.com/vitejs/vite |
| `@vitejs/plugin-react` | 6.1.1 | MIT | Copyright (c) 2019–present Yuxi (Evan) You and Vite contributors | https://github.com/vitejs/vite-plugin-react |
| `typescript` | 6.0.3 | Apache-2.0 | Copyright (c) Microsoft Corporation and contributors | https://github.com/microsoft/TypeScript |
| `oxlint` | 1.81.0 | MIT | Copyright (c) 2024–present VoidZero Inc. & Contributors; © 2023 Boshen | https://github.com/oxc-project/oxc |
| `@types/react` | 19.2.18 | MIT | DefinitelyTyped contributors | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/react-dom` | 19.2.7 | MIT | DefinitelyTyped contributors | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/three` | 0.185.4 | MIT | DefinitelyTyped contributors | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/canvas-confetti` | 1.9.0 | MIT | DefinitelyTyped contributors | https://github.com/DefinitelyTyped/DefinitelyTyped |
| `@types/node` | 24.13.3 | MIT | DefinitelyTyped contributors | https://github.com/DefinitelyTyped/DefinitelyTyped |

*(TypeScript is Apache-2.0: redistribution requires including the license, the `NOTICE` file content, and noting any modifications. The full Apache-2.0 text ships in `node_modules/typescript/LICENSE.txt`.)*

---

## 3. Fonts

The app loads fonts from the **Google Fonts CDN** (see `index.html`); no font files are bundled in the repository. Both fonts are free for commercial and non-commercial use.

| Font | Used for | License | Copyright | Source |
|---|---|---|---|---|
| **Plus Jakarta Sans** | UI text (`--font-sans`) | SIL Open Font License 1.1 (OFL-1.1) | © 2020 Tokotype (+Jakarta Studio) | https://fonts.google.com/specimen/Plus+Jakarta+Sans |
| **JetBrains Mono** | Data / code (`--font-mono`) | SIL Open Font License 1.1 (OFL-1.1) | © 2020 The JetBrains Mono Project Authors | https://fonts.google.com/specimen/JetBrains+Mono |

**OFL obligations (if the fonts are ever redistributed/bundled):** include the OFL text, do not sell the fonts by themselves, and respect the Reserved Font Names. Since fonts are only loaded from Google's CDN, these obligations are currently satisfied by Google's own distribution.

---

## 4. Graphics, icons & visual assets

| Asset | Path | Source | License / status |
|---|---|---|---|
| Favicon (purple spark/lightning glyph) | `public/favicon.svg` | Shipped with the create-vite React-TS starter template | Template code: MIT (Vite). The mark is based on the **Vite brand logo** — the Vite logo is a trademark of VoidZero Inc. / Vite contributors; reproduced here as part of the template |
| Social icon sprite (GitHub, X, Discord, Bluesky, docs, gear) | `public/icons.svg` | Shipped with the create-vite React-TS starter template | Template code: MIT. The individual brand logos are trademarks of their owners (**GitHub**, **X Corp.**, **Discord**, **Bluesky**) and are used for identification only |
| Emoji used as tokens (🍎 🍌 🐱 …) | inline in `src/utils/mathEngine.ts` | Rendered from the **user's operating-system emoji font** (Apple Color Emoji, Noto Color Emoji, Segoe UI Emoji, etc.) — no emoji assets are bundled | Emoji glyph designs © their respective creators (Apple, Google, Microsoft, etc.); the Unicode characters themselves are unencumbered. **Not distributed as part of this project** |
| All other graphics (charts, matrices, 3D scene, heatmaps) | rendered at runtime in `src/components/**` | Generated live in the browser by this project's own code | Original work — see §1 |

> The **lucide-react** icons used throughout the UI (CPU, Brain, Flame, Trophy, etc.) are covered under the `lucide-react` license in §2 (ISC).

---

## 5. Data

| Item | Status |
|---|---|
| **Datasets** | **None.** The project consumes no external datasets and makes no network calls for data. |
| **Simulation data** | All token sequences, Key/Value vectors, and matrices are **generated client-side** from seeded random vectors (`generateRandomUnitVector` / `generateTokenSequence` in `src/utils/mathEngine.ts`, default seed 42, regenerated by incrementing the seed). No real-world or proprietary data is used. |
| **LLM preset parameters** (Toy, Llama 3 8B, Llama 3 70B) | Public configuration numbers (layers, heads, hidden dim, FP16) from **Meta's published Llama 3 model card / widely known public specs**, used only as arithmetic inputs to the VRAM calculator. No weights or model artifacts are involved. |
| **Pathway claims quoted in-app** | Short quotations from the BDH paper (e.g., "activation vectors of BDH are sparse and positive", "GPU-friendly formulation"), labeled **"reported by Pathway"** in the UI and linked to their source (see §7). |

---

## 6. Model weights & artifacts

**None.** This is a 100% client-side teaching simulator. It contains no trained model, no weights, no checkpoints, and no inference engine. The "models" are toy arithmetic procedures (a KV-table lookup and a matrix-vector product) implemented in ~200 lines of plain TypeScript.

---

## 7. Reused research material (referenced, not copied)

| Material | Reference | License / usage terms |
|---|---|---|
| **The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain** — A. Kosowski et al. (2025) | [arXiv:2509.26507](https://arxiv.org/abs/2509.26507) | **arXiv.org perpetual non-exclusive license.** Authors retain copyright; arXiv is granted non-exclusive rights to distribute. The project **quotes short passages with attribution** (fair-use-style scholarly quotation) and links the source |
| **Pathway BDH repository** | [github.com/pathwaycom/bdh](https://github.com/pathwaycom/bdh) | **MIT** — Copyright 2025 Pathway Technology, Inc. The project does **not** copy code from this repository; it is linked from the UI (Victory Dashboard) as the cited source |
| Pathway blog announcement | https://pathway.com/blog/arxiv-bdh | Used only as a link/reference; no content reproduced |

> **Compliance note:** the app's own BDH simulation is an original, from-scratch teaching reimplementation (see the amber disclosure banner in the UI). No source code or model implementation from `pathwaycom/bdh` is copied into this project — only the citation, the name, and the reported paper figures with attribution.

---

## 8. Reused components & starter template

| Item | Source | License |
|---|---|---|
| Project scaffolding (Vite + React + TS template files: `index.html` shell, `public/favicon.svg`, `public/icons.svg`, `.oxlintrc.json` conventions) | `create-vite` (React-TS template) | MIT — Copyright (c) 2019–present VoidZero Inc. and Vite contributors |

The original template README boilerplate has been replaced by the project's own `README.md`.

---

## 9. Brand & trademark notices

The following names and marks appear in the app for **identification and reference only**; this project is not affiliated with, endorsed by, or sponsored by the respective owners:

- **Pathway / Dragon Hatchling (BDH)** — Pathway Technology, Inc.
- **Llama** — Meta Platforms, Inc.
- **DataForge 2026** — hackathon organizer(s)
- **Vite** — VoidZero Inc. and contributors
- **Tailwind CSS** — Tailwind Labs, Inc.
- **JetBrains** — JetBrains s.r.o.
- **GitHub, X, Discord, Bluesky** — their respective owners (icon glyphs in `public/icons.svg`)

---

## 10. Obligations summary & compliance checklist

| Category | Obligation | Status |
|---|---|---|
| **MIT / ISC packages** | Include the copyright + permission notice in copies or substantial portions of the software. The notices ship in each package's `LICENSE` file inside `node_modules/` | ✅ Satisfied |
| **Apache-2.0 (TypeScript)** | Include the Apache-2.0 text and NOTICE, and indicate modified files if redistributed | ✅ Satisfied for dev-only use (`tsc`); full text in `node_modules/typescript/LICENSE.txt` |
| **SIL OFL fonts** | Include OFL text and respect reserved names *if the fonts are redistributed*; not required for CDN use | ✅ Satisfied (fonts loaded from Google Fonts CDN) |
| **arXiv paper** | Keep author attribution and link to the arXiv abstract; do not re-publish the paper itself | ✅ Satisfied (short attributed quotes + links only) |
| **Pathway BDH repo (MIT)** | Include the MIT notice if code is copied — **no code is copied**, only cited | ✅ Satisfied (no copied code) |
| **Trademarks** | Use marks only for nominative identification; don't imply endorsement | ✅ Satisfied (see §9) |
| **Own code** | Decide and add a license for the project's own source (currently unlicensed / all rights reserved) | ⚠️ **Action recommended** — add a `LICENSE` file and reference it in §1 |

**Production distribution note:** the built site (`dist/`) bundles minified third-party code without the individual `LICENSE` files. If you distribute the built artifacts outside this repository, it is good practice to include this file (or a generated `THIRD_PARTY_NOTICES.txt`) alongside the build output so the MIT/ISC/Apache notices remain accessible to recipients.

---

*Record generated: September 2026. Verified against installed packages and official upstream sources.*