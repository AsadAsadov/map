# “BİZ NİYƏ VARIQ?” — Phase 1 Architecture

## Repository audit

The current repository is an Electron desktop application named `map-leads-desktop`. It contains:

- `package.json`: Electron app metadata and build scripts for a Windows desktop app.
- `main.js`: Electron main process, OpenStreetMap/Overpass/Nominatim search logic, export handlers.
- `preload.js`: Secure IPC bridge for renderer access.
- `renderer/index.html`: Single-file renderer UI with embedded CSS and JavaScript.
- `README.md`: Azerbaijani product documentation for the existing Map Leads app.

## Technology assessment

The repository currently uses Node.js and Electron. For this book project, the recommended Phase 1 decision is to keep the existing app untouched and add a separate `/book` workspace. Later phases can introduce a reproducible publishing toolchain without breaking the existing desktop application.

Recommended future stack:

- Manuscript source: Markdown or MDX split by chapter.
- Research files: Markdown with explicit claim/source/confidence fields.
- Diagrams: SVG generated from source files where possible.
- Layout: HTML/CSS paged media or Typst, to be selected in Phase 5 after sample page tests.
- PDF build: single command such as `npm run build:book` or `make book`.
- QA: scripted checks for page count, missing assets, font embedding, Unicode, broken citations and PDF metadata.

## Book workspace

```text
/book
  /manuscript      Draft chapters and front/back matter
  /research        Fact-checking, philosophy and Islam research notes
  /assets
    /illustrations Visual direction prompts and final illustration assets
    /diagrams      Scientific diagrams and timelines
    /icons         Minimal icon system
  /layout          Templates, typography and page rules
  /scripts         Build and QA automation scripts
  /output          Generated PDFs; ignored later if outputs become large
  /qa              QA reports and review notes
  /docs            Architecture, outline, design system and planning docs
```

## Production principles

1. Do not present unknowns as known.
2. Separate scientific facts, philosophical arguments and religious claims visually and textually.
3. Prefer primary scientific sources and official institutional resources.
4. Use Qurani-Kərim as the primary Islamic source; do not invent or decontextualize ayah references.
5. Maintain a human Azerbaijani prose style: calm, direct, reflective and unsentimental.
6. Build reproducibly; every generated artifact must trace back to source files.

## Phase roadmap

1. Repository audit and architecture — current phase.
2. Detailed outline for all 30 chapters.
3. Research plan and source verification workflow.
4. Visual direction and illustration planning.
5. Design system and layout technology decision.
6. Chapter drafting.
7. Illustration asset production plan.
8. Layout engine implementation.
9. PDF generation.
10. Fact checking.
11. Editorial review.
12. Visual QA.
13. Final build.

## Phase 1 deliverables

- `/book` workspace scaffold.
- Detailed 30-chapter outline.
- Design system document.
- Research plan.
- Initial fact-check, philosophy and Islam research files.

No final PDF is produced in Phase 1.
