# Preview-only publication boundary

This AEM Diff Engine documentation experience is an engineering-preview surface.

## Allowed

- Git branches and commits in `somarc/aem-diff-engine`.
- DA source authoring for `somarc/aem-diff-engine`.
- Code-bus synchronization.
- Preview activation and verification on `*.aem.page`.
- Read-only audits, browser validation, source/preview freshness checks, and evidence capture.

## Not allowed without a separate explicit human approval

- `da publish`, `da deploy`, or any operation that promotes DA source to `*.aem.live`.
- Recursive or bulk live publication.
- A promotion pipeline.
- Treating a Git merge or code-bus synchronization as authorization to publish authored content.

## Current proof

`da site doctor --agent --deep` reports all nine DA routes healthy on preview and missing on live. `da site freshness / --include-shared` reports every DA route as `preview-only`. This is the intended boundary, not a defect.

If live publication is authorized later, add a reviewed canonical-page manifest and a separate promotion pipeline. Do not weaken or repurpose `dogfood/certify.yaml`; it is preview certification only.
