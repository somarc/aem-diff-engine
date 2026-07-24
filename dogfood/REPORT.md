# AEM Diff Engine — DA / EDS greenfield report

**Date:** 2026-07-24  
**Git repository:** `somarc/aem-diff-engine`  
**DA source:** `somarc/aem-diff-engine`  
**Main preview:** https://main--aem-diff-engine--somarc.aem.page/  
**Workflow Explorer:** https://main--aem-diff-engine--somarc.aem.page/tools/workflow-explorer.html  
**Live publication:** not performed  
**Runtime source documented:** `AEM-CoInnovation-Engineering/aem-diff-engine@b9bf49d`  
**Site code at certification:** `somarc/aem-diff-engine@91d089d`  
**Operator:** AEM Co-Innovation Engineering

## Result

A greenfield AEM boilerplate and empty DA content source became a complete, preview-only product and engineering experience for AEM Diff Engine.

DA owns nine source documents:

- `/` — product proposition and interactive Version Lens;
- `/how-it-works` — one edit from activation through API evidence;
- `/architecture` — runtime ownership, threads, services, security, and decisions;
- `/jcr-model` — exact `/var` and JCR version-storage model;
- `/references-launches` — federated XFs, CFs, assets, and Launch baselines;
- `/api` — the four OpenAPI 0.1.0 contracts;
- `/readiness` — evidence, current limits, and finish-line order;
- `/nav` and `/footer` — unified shared shell and provenance.

Git owns:

- The Version Lens design system;
- four product-specific EDS blocks (`version-lens-hero`, `signal-flow`, `jcr-tree`, `change-ledger`);
- the static Workflow Explorer;
- runtime and site-shell contracts;
- preview certification and immutable evidence;
- the explicit no-live-publication boundary.

No authored DA page is mirrored into Git.

## Flagship Workflow Explorer

The static Workflow Explorer contains:

- **18** deep-linkable workflows;
- **24** runtime nodes;
- **37** graph edges;
- explicit sync, queued, read, durable-write, and response semantics;
- core tracking, references, Launches, API/review, recovery, and limit groups;
- step pinning, Escape reset, shareable URLs, keyboard focus behavior, and ARIA state;
- `DEMONSTRATED`, `DESIGNED`, `OPEN`, `BOUNDARY`, and `NEEDS LIVE AEM` postures;
- runtime/API/source markers pinned to `1.0.0-SNAPSHOT`, `0.1.0`, and `b9bf49d`.

The checked validator rejects unknown graph nodes/edges, invalid postures or edge kinds, broken workflow steps, stale runtime/API/source markers, missing accessibility state, and shell-navigation drift.

## DA CLI certification

CLI under test:

- source tree: `/Users/mhess/aem/aem-code/da/da-cli`;
- commit: `a97601d`;
- package runtime reported: `0.5.1`;
- release cohort: DA CLI `0.6.0` certification candidate.

Preview pipeline:

- definition: `dogfood/certify.yaml`;
- run ID: `da10ea17`;
- result: **18/18 completed**;
- duration: 2026-07-24T17:47:50.059Z → 2026-07-24T17:48:05.815Z;
- durable result: `dogfood/evidence/certify-da10ea17.json`;
- original result SHA-256: `6518afc53b42c34ed83a7d767a523e2036036b4bff908bcce7d1b7f85f8c6059`.

The pipeline proves:

```text
status
→ site model
→ deep agent briefing
→ block/code contract audit
→ DA tree preview + rendered verification
→ source/render explanation
→ seven page audits + homepage design audit
→ preview freshness
→ Workflow Explorer and global-style code proof
→ final deep doctor
```

It has no publish step and no corresponding promotion pipeline.

## Hosted validation

### Content and contracts

- Nine DA source documents pushed through the managed `.da/workspace` add/commit/push flow.
- `preview tree / --verify`: **9/9 ok**.
- Full audits on all seven narrative routes: **0 errors, 0 warnings**.
- Contract/code-bus audit: eight authored/autoblock contracts resolve; **zero missing assets**.
- Homepage design audit: **zero findings**.
- Local standalone Workflow Explorer design audit: **zero findings**.
- `site doctor --agent --deep`: all checks green; 9/9 sampled; no section-shape violations.

### Browser runtime

- Homepage and Workflow Explorer: zero console errors.
- Every narrative route: one H1, shared header/footer present, zero block-error states.
- 375px and 1440px sweep across all seven narrative routes: zero horizontal overflow.
- Workflow Explorer at 375px, 900px, and 1440px: zero page overflow; internal graph scrolling remains intentionally bounded.
- Compact Explorer menu: full viewport width; Source action remains within the menu.
- DA compact menu: full-width navigation; body scroll locks while open; Escape closes and restores focus.
- Skip link is the first keyboard target and focuses visibly at the top of the page.
- Reduced-motion rules and a no-JavaScript body fallback are present.

### Measured shell geometry

At a 1600px desktop viewport, both the DA-authored shell and static Explorer shell report:

- header rail height: 72px;
- brand centerline: 36px;
- route centerline: 36px;
- Source centerline: 36px;
- route-group offset from viewport center: 0–1px;
- page overflow: 0.

The DA footer uses a 390px / 650px provenance grid with a 120px gutter. Both row pairs share exact top coordinates, and the preview boundary spans the full 1160px content rail.

## Publication boundary

`site freshness / --include-shared` reports all nine DA routes as:

- source: HTTP 200;
- preview: HTTP 200 and fresh;
- live: HTTP 404;
- verdict: `preview-only`.

This is the intended result. See `dogfood/NO-LIVE-PUBLISH.md`.

No `da publish`, `da deploy`, live tree operation, or promotion pipeline was run.

## Build provenance

The public footer records:

- **FluffyJaws Dev Studio 0.2.4**;
- operator: **AEM Co-Innovation Engineering**;
- `@somarc/da-cli` 0.6.0 certification candidate `a97601d`;
- package runtime truth: `0.5.1`;
- no-live-publication boundary.

The DA-authored and static Explorer navigation share the same checked eight-link shell contract.

## Friction and findings

### F-001 — New repository requires manual AEM Code Sync installation

Configuration Service registration succeeded during `site create`, but preview code did not become available until the AEM Code Sync GitHub App was manually installed for `somarc/aem-diff-engine`. Browser passkey support in the Studio browser was partial, so the operator completed installation manually.

### F-002 — `site pin-target --branch` did not persist the branch

The command wrote org/repo but emitted an empty branch and omitted it from `.da.json`. The project file was corrected directly to pin `branch: main`.

### F-003 — `code sync` cannot address literal static HTML or `head.html`

Per-file code sync succeeds for JS/CSS but returns `Not found` for `/tools/workflow-explorer.html` and a 400 for `/head.html`. Root sync canonicalizes to `/index` and fails when no Git `index` exists. Literal code-bus HTML is browser-visible and route classification recognizes the existing static-route exception, but the mutation/status contract remains inconsistent.

### F-004 — External-style design audit can report scanner-shape false positives

The URL-level static HTML audit does not load external CSS before regex checks, so it initially flagged generic class names and failed to recognize the real mobile-nav safeguards. The shell now uses non-template class names and embeds the small mobile containment contract needed by the static document; the local design audit is clean.

### F-005 — AIDesigner was unavailable in this Studio session

The AIDesigner OAuth MCP connection and API-key fallback were not available. No AIDesigner run is claimed. The Version Lens was designed and implemented repo-native with EDS primitives, then validated through DA, browser, and static contract checks.

## Current product truth represented by the site

The site is intentionally confident about the problem and value while distinguishing:

- a rolling, event-driven ledger from an arbitrary query-time full-tree diff;
- reference-aware composition from a complete dependency graph;
- version-backed state from permanently retained history;
- deterministic heuristic summary from AI judgment;
- strong unit evidence from missing current real-AEM end-to-end coverage;
- demonstrated behavior from complex-tree, ordering, concurrency, and operations gaps.

This documentation experience is ready for peer review on main preview. It is not a claim that the AEM Diff Engine runtime is GA or compliance-grade.
