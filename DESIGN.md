# DESIGN.md — AEM Diff Engine

## Visual direction: The Version Lens

**Product posture:** a launch-quality product story and a technically exact living manual.

**One-line thesis:** Freeze published truth, reveal authored change, and make every transition explainable.

The visual system treats a page as one identity in two states: the frozen published baseline and the current authored state. A movable lens reveals additions, modifications, deletions, attribution, and referenced-content impact without turning the experience into a generic dashboard.

## Emotional operating system

1. **Clarity** — a reviewer understands the value in one glance.
2. **Traceability** — paths, versions, users, and timestamps remain visible.
3. **Continuity** — the page keeps its identity while its state changes.
4. **Depth** — technical readers can follow the system down to JCR nodes and job boundaries.
5. **Honesty** — demonstrated behavior, deliberate scope, and open limits are visually distinct.

## Domain language

- **Published state** — frozen cyan; stable, quiet, exact.
- **Current state** — signal green; active authoring and forward motion.
- **Modified** — violet bridge between two known values.
- **Added** — green insertion mark.
- **Deleted** — coral strike and retained provenance.
- **Unknown baseline** — amber, never silently presented as certainty.
- **Version lens** — a soft, pointer-driven reveal between the two states.
- **JCR strata** — nested paths presented as depth, not decorative code rain.

Avoid generic AI glows, glass dashboards, red/green-only meaning, fake terminal chrome, stock teams, and visual claims of completeness the engine does not support.

## Color system

| Role | Value | Intent |
|---|---:|---|
| Night | `#080a0f` | primary field |
| Ink | `#0f131c` | panels and diagrams |
| Raised | `#171d29` | secondary surfaces |
| Hairline | `#2a3446` | structure |
| Primary text | `#f4f7fb` | high-contrast editorial text |
| Secondary text | `#aab5c5` | supporting copy |
| Published | `#79d8ff` | frozen baseline |
| Current | `#b9ff66` | active authored state |
| Modified | `#b79cff` | transition |
| Deleted | `#ff7a7a` | removal |
| Warning | `#ffc96b` | unknown or bounded behavior |

Color is always paired with labels, icons, or text. Diff meaning never depends on hue alone.

## Typography

- **Display:** `Iowan Old Style`, `Baskerville`, `Georgia`, serif — product confidence and editorial depth.
- **Body:** local `Roboto`, system sans-serif fallback — durable, readable documentation.
- **Labels:** local `Roboto Condensed`, tracked uppercase — states, paths, receipts, and claims.
- **Code:** `SFMono-Regular`, `Consolas`, monospace — JCR paths, values, and API surfaces.

## Experience anatomy

### Homepage

1. Version Lens hero: marketing proposition plus a published/current JCR specimen.
2. Four value outcomes: publish-relative, attributable, reference-aware, launch-aware.
3. One edit through the complete pipeline.
4. The data contract: frozen version, compact ledger, no duplicated page tree under `/var`.
5. Review surfaces: API, summary, snapshot recovery, and version render.
6. Honest readiness band linking to limits and proof.

### Technical pages

- `/how-it-works` — one change from activation through API response.
- `/architecture` — runtime components, thread boundaries, and service ownership.
- `/jcr-model` — exact storage layout, versioning, baselines, and complex page behavior.
- `/references-launches` — federated references, XFs/CFs/assets, and synthetic Launch baselines.
- `/api` — the four endpoint contracts and consumer flow.
- `/readiness` — demonstrated behavior, known limits, and finish-line priorities.
- `/tools/workflow-explorer.html` — a static, deep-linkable runtime atlas for core, reference, Launch, API, and recovery journeys.

## Authorable block system

| Block | Author contract | Purpose |
|---|---|---|
| `version-lens-hero` | copy cell + published specimen + current specimen | dual-state product hero |
| `signal-flow` | step, owner, action, durable output | end-to-end architecture flow |
| `jcr-tree` | path/label rows with optional state | semantic repository diagram |
| `change-ledger` | field, before, after, attribution rows | inspectable change record |
| `cards` variants | normal card rows | outcomes, concepts, and limits |
| `columns` variants | standard columns | prose/diagram and comparison layouts |

No authored copy is embedded in JavaScript. DA owns narrative HTML and shared documents. Git owns block code, visual tokens, pipelines, and durable engineering evidence.

## Motion and interaction

- The Version Lens follows pointer or touch within the hero stage only.
- The no-JavaScript state shows both published and current specimens in sequence.
- Reduced motion freezes the lens at a readable resting position.
- No scroll-jacking, WebGL, autoplay video, or framework runtime.
- Diagrams use semantic lists and remain readable before decoration.

## Performance and accessibility contract

1. Text is the LCP candidate; the first section has no blocking media dependency.
2. Custom block JavaScript is small, dependency-free, and progressively enhanced.
3. One H1 per route, logical heading order, visible focus, and 44px interactive targets.
4. 375px, 900px, and 1440px layouts must have no horizontal overflow.
5. Every status uses text in addition to color.
6. Feature preview is the review boundary. No `*.aem.live` publication without a separate explicit approval.

## Claim discipline

- **DEMONSTRATED** — implemented and covered by current evidence.
- **DESIGNED** — intentional contract in the present architecture.
- **OPEN** — known correctness, scaling, or operational gap.
- **BOUNDARY** — behavior deliberately outside the current scope.

Marketing copy may be confident about the problem and value. Technical copy must distinguish the rolling event ledger from an arbitrary query-time tree diff and must not imply compliance-grade completeness before the open correctness gaps close.
