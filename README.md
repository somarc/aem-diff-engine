# AEM Diff Engine — EDS Site

The product story and living technical manual for the AEM Diff Engine delivered through AEM Co-Innovation Engineering.

- **Preview:** https://main--aem-diff-engine--somarc.aem.page/
- **Workflow Explorer:** https://main--aem-diff-engine--somarc.aem.page/tools/workflow-explorer.html
- **Runtime source:** https://github.com/AEM-CoInnovation-Engineering/aem-diff-engine
- **DA source:** `somarc/aem-diff-engine`

## Content and code ownership

DA is the source of truth for authored HTML, navigation, and footer content. Git owns EDS block code, design intent, static tools, validation contracts, and build evidence. Authored DA documents are intentionally not mirrored into Git.

The design direction is documented in [DESIGN.md](./DESIGN.md), the route/content contract lives in [dogfood/CONTENT-IA.md](./dogfood/CONTENT-IA.md), and the current dogfood evidence is retained in [dogfood/REPORT.md](./dogfood/REPORT.md).

## Local development

```bash
npm install
npm run check
npx -y @adobe/aem-cli up --no-open --forward-browser-logs
```

Local server: http://localhost:3000/

## Validation

```bash
npm run lint
npm run validate:workflows
npm run validate:site-shell
npm run check

# Preview-only DA certification (dry-run first)
node /path/to/da-cli/bin/da.js --org somarc --repo aem-diff-engine --branch main \
  --format json pipeline run dogfood/certify.yaml --dry-run
```

The Workflow Explorer is a static, deep-linkable code-bus tool pinned to the checked runtime contract in `dogfood/diff-engine-runtime-contract.json`. The site-shell validator keeps its standalone navigation and attribution aligned with the DA-authored shell.

## Build provenance

Built by **FluffyJaws Dev Studio 0.2.4** for **AEM Co-Innovation Engineering**, using the `@somarc/da-cli` 0.6.0 certification candidate at `a97601d` (the source-tree runtime reports package version `0.5.1`).

## Publication boundary

This project is currently a preview-only engineering surface. DA content may be activated on `*.aem.page`; no DA-authored page is to be promoted to `*.aem.live` without a separate explicit human approval and reviewed canonical-page manifest.
