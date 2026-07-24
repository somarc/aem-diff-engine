# AEM Diff Engine — DA content architecture

This EDS site is both the product narrative and the living engineering manual for AEM Diff Engine. DA is the sole source of truth for authored HTML and shared documents. Git owns block code, design intent, certification pipelines, and evidence; it does not mirror DA pages.

## Two lenses

### Product lens

Answer three questions quickly:

1. What problem does the Diff Engine solve?
2. Why is its output more useful than a visual page comparison alone?
3. Where can a reviewer or integration use it?

### Engineering lens

Make the implementation inspectable:

1. What establishes the published baseline?
2. How does a repository event become a change record?
3. Where does data live in JCR?
4. How are references and Launches composed?
5. What works today, and where are the correctness boundaries?

## Route map

| Route | Job | Primary proof surface |
|---|---|---|
| `/` | State the product value and create desire | Version Lens hero, outcomes, compact flow |
| `/how-it-works` | Follow one edit end to end | signal flow, change ledger |
| `/architecture` | Explain components, threads, and ownership | runtime map, service cards |
| `/jcr-model` | Show exact persistence and complex-tree behavior | JCR tree, baseline comparison |
| `/references-launches` | Explain federated references and synthetic baselines | reference graph, Launch sequence |
| `/api` | Describe consumer-facing contracts | endpoint cards, request/response anatomy |
| `/readiness` | Separate demonstrated capability from open work | claim board, finish-line sequence |
| `/tools/workflow-explorer.html` | Interactively trace runtime paths, alternate branches, and recovery behavior | static SVG graph, workflow steps, deep links |
| `/nav` | Global route spine | shared document |
| `/footer` | Ownership, source, and preview boundary | shared document |

## Homepage narrative

**Eyebrow:** `PUBLISH · CHANGE · EXPLAIN`

**H1:** `See what changed. Know why it matters.`

**Lede:** `AEM Diff Engine turns the space between published and current into an attributable, reference-aware review surface—across pages, fragments, assets, and Launches.`

Primary CTA: `/how-it-works` — **Follow a change**  
Secondary CTA: `/architecture` — **Open the architecture**

### Value outcomes

1. **Publish-relative** — every review begins from a known AEM version.
2. **Attributable** — users and timestamps travel with each recorded transition.
3. **Reference-aware** — pages can compose changes from XFs, CFs, and assets.
4. **Launch-aware** — synthetic baselines preserve review context before promotion.

### Product truth

`The engine stores a compact change ledger and points to AEM version history. It does not copy the full page tree into its own repository structure.`

## Technical narrative

Use one canonical example across pages:

```text
/content/wknd/en/adventures/alpine
  jcr:content
    jcr:title = "Winter in Chamonix" → "Above the clouds"
    root/hero
      fileReference = hero-v1.jpg → hero-v2.jpg
      ctaText = ∅ → "Plan your route"
```

The same example should appear as:

- a published/current hero specimen;
- an observation event and Sling Job;
- a frozen-node comparison;
- a `/var/aem/changetracking` record;
- an API response;
- a before/current rendered review.

## Claim labels

| Label | Meaning |
|---|---|
| `DEMONSTRATED` | Current code and tests support the claim |
| `DESIGNED` | Intentional current architecture or accepted decision |
| `OPEN` | Known correctness, scaling, or operational gap |
| `BOUNDARY` | Deliberately out of scope |

The `/readiness` page is not an apology page. It demonstrates engineering control: known limits are named, prioritized, and tied to evidence.

## Navigation

```text
AEM Diff Engine
How it works
Architecture
JCR model
References + Launches
API
Workflow Explorer
Readiness
GitHub
```

Keep navigation flat. Deep sections live within each route, not in nested menus.

## Metadata contract

Every narrative route declares one nested body metadata block with:

- `Title`
- `Description`
- `Nav` = `/nav`
- `Footer` = `/footer`
- `Theme` = `version-lens`
- `Kind` = `product` or `technical`
- `Status` = `living`

Do not combine document-head metadata with a body Metadata block.

## Publication boundary

- Git work occurs on `version-lens`.
- DA source is authored and activated only on the matching feature preview.
- No page is promoted to `*.aem.live`.
- Any future live promotion requires a separate reviewed manifest and an explicit human-approved command.
