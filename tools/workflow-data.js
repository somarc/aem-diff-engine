/* eslint-disable object-curly-newline */

export const MAP_META = {
  title: 'AEM Diff Engine Workflow Explorer',
  version: 'Engineering Preview',
  verified: '2026-07-24',
  source: 'AEM-CoInnovation-Engineering/aem-diff-engine',
  runtimeVersion: '1.0.0-SNAPSHOT',
  apiVersion: '0.1.0',
  runtimeCommit: 'b9bf49decd98843030953218c1c4d4251301999a',
};

export const NODES = [
  { id: 'activate', x: 22, y: 30, w: 180, h: 54, type: 'trigger', label: 'Replication ACTIVATE', sub: 'publish boundary' },
  { id: 'resource-change', x: 226, y: 30, w: 180, h: 54, type: 'trigger', label: 'ResourceChange', sub: 'ADDED · CHANGED · REMOVED' },
  { id: 'page-event', x: 430, y: 30, w: 180, h: 54, type: 'trigger', label: 'Launch / PageEvent', sub: 'create · delete · rollout' },
  { id: 'api-request', x: 634, y: 30, w: 180, h: 54, type: 'trigger', label: 'Bearer API request', sub: '/adobe/sites/diffEngine/*' },
  { id: 'operator', x: 838, y: 30, w: 180, h: 54, type: 'trigger', label: 'Reviewer / operator', sub: 'MFE · workflow · agent' },

  { id: 'preprocessor', x: 22, y: 145, w: 180, h: 58, type: 'entry', label: 'PublishSnapshotPreprocessor', sub: 'replication thread' },
  { id: 'listener', x: 226, y: 145, w: 180, h: 58, type: 'entry', label: 'ChangeTrackingListener', sub: 'observation thread' },
  { id: 'launch-listeners', x: 430, y: 145, w: 180, h: 58, type: 'entry', label: 'Launch listeners', sub: 'lifecycle + promotion' },
  { id: 'request-processors', x: 634, y: 145, w: 180, h: 58, type: 'entry', label: 'RequestProcessors', sub: 'auth · validation · ETag' },
  { id: 'review-mfe', x: 838, y: 145, w: 180, h: 58, type: 'consumer', label: 'Change Review MFE', sub: 'fetch + srcdoc' },

  { id: 'snapshot-service', x: 22, y: 278, w: 180, h: 58, type: 'service', label: 'PublishSnapshotService', sub: 'version + snapshot reset' },
  { id: 'change-writer', x: 226, y: 278, w: 180, h: 58, type: 'service', label: 'ChangeRecordWriter', sub: 'Sling Job consumer' },
  { id: 'launch-service', x: 430, y: 278, w: 180, h: 58, type: 'service', label: 'LaunchTrackingService', sub: 'synthetic baselines + cleanup' },
  { id: 'audit-service', x: 634, y: 278, w: 180, h: 58, type: 'service', label: 'ContentAuditService', sub: 'compose evidence' },
  { id: 'render-stack', x: 838, y: 278, w: 180, h: 58, type: 'service', label: 'Version render stack', sub: 'map · context · decorator' },

  { id: 'content', x: 22, y: 430, w: 180, h: 62, type: 'state', label: '/content/.../jcr:content', sub: 'current authored state' },
  { id: 'versions', x: 226, y: 430, w: 180, h: 62, type: 'state', label: 'JCR version storage', sub: 'frozen published state' },
  { id: 'jobs', x: 430, y: 430, w: 180, h: 62, type: 'state', label: 'Sling Jobs', sub: 'durable async work' },
  { id: 'tracking', x: 634, y: 430, w: 180, h: 62, type: 'state', label: '/var/aem/changetracking', sub: 'snapshot · ledger · baseline' },
  { id: 'promotion-cache', x: 838, y: 430, w: 180, h: 62, type: 'state', label: 'Promotion cache', sub: 'pod-local attribution window' },

  { id: 'changes-response', x: 226, y: 558, w: 180, h: 54, type: 'consumer', label: 'ContentChanges', sub: 'property · component · refs' },
  { id: 'summary-response', x: 430, y: 558, w: 180, h: 54, type: 'consumer', label: 'ChangeSummary', sub: 'deterministic heuristic' },
  { id: 'snapshot-response', x: 634, y: 558, w: 180, h: 54, type: 'consumer', label: 'SnapshotResult', sub: 'root + cascade outcomes' },
  { id: 'html-response', x: 838, y: 558, w: 180, h: 54, type: 'consumer', label: 'Version-aware HTML', sub: 'published or current' },
];

export const EDGES = [
  { id: 'activate-preprocessor', from: 'activate', to: 'preprocessor', label: 'preprocess()', color: 'trigger', kind: 'sync' },
  { id: 'preprocessor-snapshot', from: 'preprocessor', to: 'snapshot-service', label: 'create snapshot', color: 'entry', kind: 'sync' },
  { id: 'snapshot-content', from: 'snapshot-service', to: 'content', label: 'read / checkin', color: 'service', kind: 'read', srcDx: -42, dstDx: 28 },
  { id: 'snapshot-versions', from: 'snapshot-service', to: 'versions', label: 'version UUID', color: 'state', kind: 'write', srcDx: 38, dstDx: -32 },
  { id: 'snapshot-tracking', from: 'snapshot-service', to: 'tracking', label: 'reset + write', color: 'state', kind: 'write', srcDx: 68, dstDx: -58 },

  { id: 'change-listener', from: 'resource-change', to: 'listener', label: 'onChange()', color: 'trigger', kind: 'sync' },
  { id: 'listener-jobs', from: 'listener', to: 'jobs', label: 'addJob()', color: 'entry', kind: 'async', srcDx: 34, dstDx: -36 },
  { id: 'jobs-writer', from: 'jobs', to: 'change-writer', label: 'process()', color: 'state', kind: 'async', srcDx: -44, dstDx: 42 },
  { id: 'writer-content', from: 'change-writer', to: 'content', label: 'JCR now', color: 'service', kind: 'read', srcDx: -42, dstDx: 42 },
  { id: 'writer-versions', from: 'change-writer', to: 'versions', label: 'frozen node', color: 'service', kind: 'read' },
  { id: 'writer-tracking', from: 'change-writer', to: 'tracking', label: 'record + _baseline', color: 'state', kind: 'write', srcDx: 46, dstDx: -52 },
  { id: 'cache-writer', from: 'promotion-cache', to: 'change-writer', label: 'origin lookup', color: 'state', kind: 'read', srcDx: -54, dstDx: 58 },

  { id: 'page-launch-listeners', from: 'page-event', to: 'launch-listeners', label: 'observe / handle', color: 'trigger', kind: 'sync' },
  { id: 'launch-listeners-jobs', from: 'launch-listeners', to: 'jobs', label: 'deferred job', color: 'entry', kind: 'async' },
  { id: 'launch-listeners-cache', from: 'launch-listeners', to: 'promotion-cache', label: 'promotion marker', color: 'state', kind: 'write', srcDx: 48, dstDx: -44 },
  { id: 'jobs-launch-service', from: 'jobs', to: 'launch-service', label: 'baseline / cleanup', color: 'state', kind: 'async' },
  { id: 'launch-content', from: 'launch-service', to: 'content', label: 'launch pages', color: 'service', kind: 'read', srcDx: -48, dstDx: 52 },
  { id: 'launch-versions', from: 'launch-service', to: 'versions', label: 'synthetic version', color: 'service', kind: 'write', srcDx: -20, dstDx: 50 },
  { id: 'launch-tracking', from: 'launch-service', to: 'tracking', label: 'metadata + snapshots', color: 'state', kind: 'write', srcDx: 42, dstDx: -34 },

  { id: 'operator-api', from: 'operator', to: 'api-request', label: 'request', color: 'trigger', kind: 'sync' },
  { id: 'mfe-api', from: 'review-mfe', to: 'api-request', label: 'bearer fetch', color: 'consumer', kind: 'sync', srcDx: -36, dstDx: 36 },
  { id: 'api-processors', from: 'api-request', to: 'request-processors', label: 'dispatch', color: 'trigger', kind: 'sync' },
  { id: 'processors-audit', from: 'request-processors', to: 'audit-service', label: 'getChanges()', color: 'entry', kind: 'sync' },
  { id: 'processors-snapshot', from: 'request-processors', to: 'snapshot-service', label: 'POST snapshot', color: 'entry', kind: 'sync', srcDx: -50, dstDx: 52 },
  { id: 'processors-render', from: 'request-processors', to: 'render-stack', label: 'GET render', color: 'entry', kind: 'sync', srcDx: 42, dstDx: -42 },
  { id: 'audit-tracking', from: 'audit-service', to: 'tracking', label: 'snapshot + records', color: 'service', kind: 'read' },
  { id: 'audit-content', from: 'audit-service', to: 'content', label: 'live resource / refs', color: 'service', kind: 'read', srcDx: -50, dstDx: 62 },
  { id: 'audit-changes', from: 'audit-service', to: 'changes-response', label: 'map', color: 'consumer', kind: 'response', srcDx: -46, dstDx: 42 },
  { id: 'audit-summary', from: 'audit-service', to: 'summary-response', label: 'summarize', color: 'consumer', kind: 'response', srcDx: -18, dstDx: 40 },
  { id: 'snapshot-result', from: 'snapshot-service', to: 'snapshot-response', label: 'outcomes', color: 'consumer', kind: 'response', srcDx: 54, dstDx: -44 },
  { id: 'render-tracking', from: 'render-stack', to: 'tracking', label: 'version map', color: 'service', kind: 'read', srcDx: -42, dstDx: 48 },
  { id: 'render-versions', from: 'render-stack', to: 'versions', label: 'frozen resources', color: 'service', kind: 'read', srcDx: -64, dstDx: 62 },
  { id: 'render-content', from: 'render-stack', to: 'content', label: 'Sling render', color: 'service', kind: 'read', srcDx: -78, dstDx: 72 },
  { id: 'render-html', from: 'render-stack', to: 'html-response', label: 'text/html', color: 'consumer', kind: 'response' },
  { id: 'changes-mfe', from: 'changes-response', to: 'review-mfe', label: 'evidence', color: 'consumer', kind: 'response', srcDx: 34, dstDx: -48 },
  { id: 'summary-mfe', from: 'summary-response', to: 'review-mfe', label: 'risk + highlights', color: 'consumer', kind: 'response', srcDx: 22, dstDx: -22 },
  { id: 'html-mfe', from: 'html-response', to: 'review-mfe', label: 'fetch + srcdoc', color: 'consumer', kind: 'response' },
];

export const WORKFLOW_GROUPS = [
  {
    group: 'Core tracking',
    items: [
      {
        id: 'publish-baseline',
        label: 'Publish baseline',
        posture: 'DEMONSTRATED',
        summary: 'Establish the version-backed review boundary before activation proceeds.',
        steps: [
          { nodes: ['activate', 'preprocessor'], edges: ['activate-preprocessor'], owner: 'PublishSnapshotPreprocessor', text: 'AEM calls the replication preprocessor synchronously for ACTIVATE. Disabled tracking, non-activation actions, system paths, and configured exclusions return without work.' },
          { nodes: ['preprocessor', 'snapshot-service', 'content'], edges: ['preprocessor-snapshot', 'snapshot-content'], owner: 'PublishSnapshotService', text: 'The writer service user resolves the resource and inspects jcr:content. Timewarp metadata and mix:versionable are added when needed.' },
          { nodes: ['snapshot-service', 'versions'], edges: ['snapshot-versions'], owner: 'JCR VersionManager', text: 'A guarded no-op/base-version reuse path may apply; otherwise checkin and checkout create a frozen jcr:content version and return its UUID.' },
          { nodes: ['snapshot-service', 'tracking'], edges: ['snapshot-tracking'], owner: '/var/aem/changetracking', text: 'Reference paths are extracted, the prior changes subtree is removed, and one publish-snapshot is written with content path, time, version, publisher, and references.' },
          { nodes: ['activate', 'preprocessor'], edges: ['activate-preprocessor'], owner: 'Failure boundary', text: 'Tracking exceptions are logged but do not fail publication. The availability choice is deliberate; missing readiness must be surfaced later.' },
        ],
      },
      {
        id: 'author-edit',
        label: 'Record an author edit',
        posture: 'DEMONSTRATED',
        summary: 'Turn one repository event into an incremental, attributable JCR change record.',
        steps: [
          { nodes: ['resource-change', 'listener'], edges: ['change-listener'], owner: 'ChangeTrackingListener', text: 'A ResourceChange under /content is filtered for ignored users, paths, system properties, and Launch creation noise. The page root is derived from the path before /jcr:content.' },
          { nodes: ['listener', 'jobs'], edges: ['listener-jobs'], owner: 'Sling Jobs', text: 'The listener queues rootPath, changedPaths, userId, and queue time. Optional debounce coalesces same-user edits; content state is not copied into the payload.' },
          { nodes: ['jobs', 'change-writer', 'tracking'], edges: ['jobs-writer', 'writer-tracking'], owner: 'ChangeRecordWriter', text: 'The job loads the root snapshot and drops work at or before publishDate. Without a production snapshot, no record can be computed.' },
          { nodes: ['change-writer', 'content', 'versions'], edges: ['writer-content', 'writer-versions'], owner: 'Comparison', text: 'JCR-now is compared with the per-component _baseline, or with the frozen published node on the first edit. System properties are filtered and values normalized.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Ledger write', text: 'ADDED, MODIFIED, and DELETED property transitions are stored with previews, hashes, optional compact word diff, actor, and time. Current state becomes the next _baseline.' },
        ],
      },
      {
        id: 'component-delete',
        label: 'Delete a component',
        posture: 'DEMONSTRATED',
        summary: 'Retain component removal and best-effort reference provenance after the live node is gone.',
        steps: [
          { nodes: ['resource-change', 'listener', 'jobs'], edges: ['change-listener', 'listener-jobs'], owner: 'Observation', text: 'A REMOVED event is accepted and queued using the deleted path and the containing page root.' },
          { nodes: ['jobs', 'change-writer', 'content'], edges: ['jobs-writer', 'writer-content'], owner: 'Missing resource branch', text: 'The writer cannot resolve the changed resource and enters the record-level DELETED path instead of property comparison.' },
          { nodes: ['change-writer', 'versions'], edges: ['writer-versions'], owner: 'Published lookup', text: 'The frozen published component is inspected for known reference properties so a deleted XF, CF, or asset usage can retain its prior target when possible.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Deletion record', text: 'A DELETED record is stored and the per-component _baseline is removed. Recreating the same path can then be classified as ADDED.' },
        ],
      },
      {
        id: 'audit-query',
        label: 'Query change evidence',
        posture: 'DEMONSTRATED',
        summary: 'Read the rolling ledger since the latest snapshot and map it to the public ContentChanges contract.',
        steps: [
          { nodes: ['operator', 'api-request', 'request-processors'], edges: ['operator-api', 'api-processors'], owner: 'GET /changes', text: 'The request processor validates contentPath, reads includeReferences, and checks the caller’s own JCR read permission before using the reader service.' },
          { nodes: ['request-processors', 'audit-service'], edges: ['processors-audit'], owner: 'ContentAuditService', text: 'The service resolves the live resource and snapshot. No snapshot becomes NOT_YET_TRACKED or NO_TRACKING; a missing live resource currently collapses to the processor fallback.' },
          { nodes: ['audit-service', 'tracking'], edges: ['audit-tracking'], owner: 'ChangeQueryService', text: 'The changes tree is walked recursively, _baseline nodes are skipped, records at or after publishDate are loaded, and results are sorted newest first in memory.' },
          { nodes: ['audit-service', 'changes-response'], edges: ['audit-changes'], owner: 'ContentChangesMapper', text: 'Stored records become propertyChanges or componentChanges. ETag identity is derived from the response, enabling If-None-Match and 304.' },
          { nodes: ['changes-response', 'review-mfe'], edges: ['changes-mfe'], owner: 'Consumer', text: 'Approval workflows, agents, and the review MFE receive a compact transition history—not an arbitrary query-time full-tree diff.' },
        ],
      },
    ],
  },
  {
    group: 'References',
    items: [
      {
        id: 'reference-audit',
        label: 'Compose reference changes',
        posture: 'DESIGNED',
        summary: 'Join the page ledger with independently owned XF, CF, and asset ledgers at read time.',
        steps: [
          { nodes: ['request-processors', 'audit-service', 'tracking'], edges: ['processors-audit', 'audit-tracking'], owner: 'Page snapshot', text: 'The page snapshot supplies referencesAtPublish. It stores paths only; each referenced resource owns its own publish version and change subtree.' },
          { nodes: ['audit-service', 'tracking'], edges: ['audit-tracking'], owner: 'Federated reads', text: 'For each published reference, the service recursively calls its own audit path with includeReferences=false. That prevents cycles and keeps composition one hop deep.' },
          { nodes: ['audit-service', 'content'], edges: ['audit-content'], owner: 'Usage mapping', text: 'The current page tree is scanned to map known reference paths back to component locations. Duplicate path/type pairs are collapsed.' },
          { nodes: ['audit-service', 'changes-response'], edges: ['audit-changes'], owner: 'ReferencedContent', text: 'Tracked references with relevant property changes and untracked references are folded into the page response. The current public wire model omits some internal readiness metadata.' },
        ],
      },
      {
        id: 'snapshot-cascade',
        label: 'Cascade a manual snapshot',
        posture: 'DEMONSTRATED',
        summary: 'Recover onboarding gaps for a root resource and its authorized references.',
        steps: [
          { nodes: ['operator', 'api-request', 'request-processors'], edges: ['operator-api', 'api-processors'], owner: 'POST /snapshots', text: 'The request body supplies contentPath, force, includeReferences, and depth. The caller needs crx:replicate, or set_property for a Launch path.' },
          { nodes: ['request-processors', 'snapshot-service'], edges: ['processors-snapshot'], owner: 'Root snapshot', text: 'The elevated writer service performs the snapshot only after caller authorization. Existing snapshots return conflict unless force=true.' },
          { nodes: ['snapshot-service', 'content', 'versions', 'tracking'], edges: ['snapshot-content', 'snapshot-versions', 'snapshot-tracking'], owner: 'Per-resource baseline', text: 'The root and each accepted reference receive the same version-backed snapshot shape used by real publication.' },
          { nodes: ['snapshot-service', 'snapshot-response'], edges: ['snapshot-result'], owner: 'CascadeResult', text: 'Depth 1 covers direct references; depth 2 covers references of successfully processed references. Each path reports created, overwritten, existing, forbidden, or failed.' },
        ],
      },
      {
        id: 'new-reference-boundary',
        label: 'Reference added after publish',
        posture: 'OPEN',
        summary: 'The page edit is visible, but the newly referenced resource is absent from reference composition until the next snapshot.',
        steps: [
          { nodes: ['resource-change', 'listener', 'jobs', 'change-writer'], edges: ['change-listener', 'listener-jobs', 'jobs-writer'], owner: 'Page edit', text: 'Adding a new XF, CF, or asset changes a component property or adds a component, so the page’s own ledger can record the authoring transition.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Fixed reference set', text: 'The page publish-snapshot still contains only referencesAtPublish from the prior boundary. Writer records do not update that array.' },
          { nodes: ['audit-service', 'tracking'], edges: ['audit-tracking'], owner: 'Composition gap', text: 'Reference composition iterates the fixed snapshot array. A live extraction is used only to map known references, not to union newly added paths.' },
          { nodes: ['audit-service', 'changes-response'], edges: ['audit-changes'], owner: 'Result', text: 'The page-level addition may be present while the new referenced resource’s own pending changes are absent. This is a known false-negative follow-up.' },
        ],
      },
      {
        id: 'deep-tree-boundary',
        label: 'Deep JCR reference tree',
        posture: 'OPEN',
        summary: 'Ordinary deep node edits can track, while reference discovery is bounded and currently silent on truncation.',
        steps: [
          { nodes: ['snapshot-service', 'content'], edges: ['snapshot-content'], owner: 'ReferenceExtractionUtil', text: 'Page and XF extraction walks from jcr:content and checks five structured property names. Default maxReferenceDepth is 5.' },
          { nodes: ['snapshot-service', 'content'], edges: ['snapshot-content'], owner: 'Breadth guard', text: 'MAX_VISITED_NODES is hardcoded at 10,000. Crossing the guard stops useful extraction without a response flag, log, or metric.' },
          { nodes: ['resource-change', 'listener', 'jobs', 'change-writer'], edges: ['change-listener', 'listener-jobs', 'jobs-writer'], owner: 'Asymmetric behavior', text: 'The listener itself has no tree-depth limit; a deep component’s property change can still track by exact path when its own root has a snapshot.' },
          { nodes: ['audit-service', 'changes-response'], edges: ['audit-changes'], owner: 'Audit consequence', text: 'A reference missed at snapshot extraction is invisible in the parent page’s referencedContent even if the referenced resource has its own valid ledger.' },
        ],
      },
    ],
  },
  {
    group: 'Launches',
    items: [
      {
        id: 'launch-create',
        label: 'Create Launch baselines',
        posture: 'DEMONSTRATED',
        summary: 'Give author-only Launch pages a synthetic time zero without building a second diff pipeline.',
        steps: [
          { nodes: ['page-event', 'launch-listeners'], edges: ['page-launch-listeners'], owner: 'LaunchLifecycleListener', text: 'An ADDED event matching the dated Launch-root shape is deduplicated and converted into a baseline job scheduled roughly five seconds later.' },
          { nodes: ['launch-listeners', 'jobs', 'launch-service'], edges: ['launch-listeners-jobs', 'jobs-launch-service'], owner: 'LaunchBaselineJob', text: 'The defer lets AEM finish copying pages and configuring live-copy state before the engine versions Launch content.' },
          { nodes: ['launch-service', 'content', 'versions'], edges: ['launch-content', 'launch-versions'], owner: 'Synthetic baseline', text: 'Each Launch page’s own jcr:content is versioned. This captures what AEM copied at Launch creation rather than the production page’s last published state.' },
          { nodes: ['launch-service', 'tracking'], edges: ['launch-tracking'], owner: 'Per-page commit', text: 'A publish-snapshot is stored for each page and committed independently; Launch metadata is stamped separately for lifecycle cleanup.' },
        ],
      },
      {
        id: 'launch-edit',
        label: 'Classify a Launch edit',
        posture: 'DESIGNED',
        summary: 'Reuse the standard writer while distinguishing direct authoring from rollout propagation.',
        steps: [
          { nodes: ['resource-change', 'listener', 'jobs'], edges: ['change-listener', 'listener-jobs'], owner: 'Normal edit path', text: 'Launch ADDED noise and Launch metadata are filtered, while real CHANGED and REMOVED events enter the ordinary per-root job path.' },
          { nodes: ['jobs', 'change-writer', 'tracking'], edges: ['jobs-writer', 'writer-tracking'], owner: 'Synthetic snapshot', text: 'The writer finds the Launch page’s synthetic snapshot and performs the same frozen-version/_baseline comparison used for production pages.' },
          { nodes: ['change-writer', 'content'], edges: ['writer-content'], owner: 'Origin heuristic', text: 'A non-live-copy Launch change is DIRECT_EDIT. A live-copy page compares event time with cq:lastRolledout inside the configured window to choose ROLLOUT_PROPAGATED or DIRECT_EDIT.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Attributed record', text: 'changeOrigin is stored with property records. UNKNOWN is used when the live-copy signal is present but correlation cannot be established.' },
        ],
      },
      {
        id: 'launch-promotion',
        label: 'Attribute Launch promotion',
        posture: 'DESIGNED',
        summary: 'Correlate production-side rollout writes back to the recently promoted Launch.',
        steps: [
          { nodes: ['page-event', 'launch-listeners'], edges: ['page-launch-listeners'], owner: 'LaunchPromotionListener', text: 'A ROLLEDOUT PageEvent on a production target is correlated with LaunchManager candidates whose lastPromoted falls inside the configured window.' },
          { nodes: ['launch-listeners', 'promotion-cache'], edges: ['launch-listeners-cache'], owner: 'LaunchPromotionCache', text: 'The target path is mapped to the Launch root in an in-memory TTL cache and metadata is marked PROMOTED. This cache is pod-local.' },
          { nodes: ['resource-change', 'listener', 'jobs', 'change-writer'], edges: ['change-listener', 'listener-jobs', 'jobs-writer'], owner: 'Production rollout writes', text: 'The promotion updates ordinary production resources, generating the same ResourceChange and Sling Job flow as other edits.' },
          { nodes: ['promotion-cache', 'change-writer', 'tracking'], edges: ['cache-writer', 'writer-tracking'], owner: 'Origin attribution', text: 'A cache hit labels production property records LAUNCH_PROMOTION. A miss loses origin metadata but not the underlying change record.' },
        ],
      },
      {
        id: 'launch-lazy-baseline',
        label: 'Lazy Launch recovery',
        posture: 'OPEN',
        summary: 'Repair a missing Launch snapshot on first contact, while deliberately suppressing the triggering event.',
        steps: [
          { nodes: ['resource-change', 'listener', 'jobs', 'change-writer'], edges: ['change-listener', 'listener-jobs', 'jobs-writer'], owner: 'First Launch event', text: 'The writer receives a change for a Launch page whose deferred baseline has not landed or whose creation event was missed.' },
          { nodes: ['change-writer', 'launch-service', 'content', 'versions'], edges: ['launch-content', 'launch-versions'], owner: 'createSinglePageBaseline()', text: 'The writer calls LaunchTrackingService to version the current Launch page and ensure lifecycle metadata exists.' },
          { nodes: ['launch-service', 'tracking'], edges: ['launch-tracking'], owner: 'Recovery write', text: 'The new synthetic snapshot is committed. Concurrent baseline creation is handled by refresh-and-reread after a persistence conflict.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Suppressed trigger', text: 'The triggering event returns zero changes because it is assumed to be creation noise. A genuine first edit to a late-added page can therefore become baseline state and disappear from review.' },
        ],
      },
    ],
  },
  {
    group: 'API and review',
    items: [
      {
        id: 'change-summary',
        label: 'Build change summary',
        posture: 'DEMONSTRATED',
        summary: 'Turn detailed evidence into a deterministic, explainable risk-oriented summary.',
        steps: [
          { nodes: ['operator', 'api-request', 'request-processors'], edges: ['operator-api', 'api-processors'], owner: 'GET /changes/summary', text: 'The request follows the same path validation and caller read-permission gate as the detailed changes endpoint.' },
          { nodes: ['request-processors', 'audit-service', 'tracking'], edges: ['processors-audit', 'audit-tracking'], owner: 'Full audit input', text: 'ContentAuditService is invoked with references enabled so the summary sees page, component, and relevant referenced-content changes.' },
          { nodes: ['audit-service', 'summary-response'], edges: ['audit-summary'], owner: 'ChangeSummaryService', text: 'Explicit thresholds evaluate volume, deletions, contributors, and reference breadth. The result is deterministic heuristic logic, not semantic or AI judgment.' },
          { nodes: ['summary-response', 'review-mfe'], edges: ['summary-mfe'], owner: 'Consumer', text: 'Summary text, highlights, risk level, ETag, and 304 support provide a cheap review entry point before loading detailed evidence.' },
        ],
      },
      {
        id: 'version-render',
        label: 'Render before and current',
        posture: 'NEEDS LIVE AEM',
        summary: 'Drive one Sling rendering surface with either frozen version context or current author resources.',
        steps: [
          { nodes: ['review-mfe', 'api-request', 'request-processors'], edges: ['mfe-api', 'api-processors'], owner: 'GET /renders', text: 'The MFE uses bearer fetch. renderAt acts as a published-state selector; without it the processor renders the current draft with no-store.' },
          { nodes: ['request-processors', 'render-stack', 'tracking'], edges: ['processors-render', 'render-tracking'], owner: 'VersionMapBuilder', text: 'The page snapshot and each available reference snapshot become a map from jcr:content path to stored version UUID.' },
          { nodes: ['render-stack', 'versions', 'content'], edges: ['render-versions', 'render-content'], owner: 'VersionResourceDecorator', text: 'A request-scoped VersionContext lets the decorator replace matching live resources with frozen nodes while SlingRequestProcessor renders in preview mode.' },
          { nodes: ['render-stack', 'html-response', 'review-mfe'], edges: ['render-html', 'html-mfe'], owner: 'Portable review frame', text: 'The HTML response is fetched with authorization and placed in srcdoc so the MFE can access the document, rewrite authenticated assets, and apply highlights.' },
          { nodes: ['render-stack', 'versions'], edges: ['render-versions'], owner: 'Validation boundary', text: 'The actual 200 rendering path requires real AEM scripts and cannot be proven by sling-mock alone. Purged UUID fallback behavior also needs hardening.' },
        ],
      },
    ],
  },
  {
    group: 'Recovery and limits',
    items: [
      {
        id: 'missing-snapshot',
        label: 'Missing production snapshot',
        posture: 'BOUNDARY',
        summary: 'Surface tracking readiness when a resource has never established a usable review boundary.',
        steps: [
          { nodes: ['resource-change', 'listener', 'jobs'], edges: ['change-listener', 'listener-jobs'], owner: 'Edit still observed', text: 'Repository changes are observed even when the resource has never been published since Diff Engine was enabled.' },
          { nodes: ['jobs', 'change-writer', 'tracking'], edges: ['jobs-writer', 'writer-tracking'], owner: 'Writer guard', text: 'For ordinary production content, no snapshot means no published state to compare. The job returns zero without inventing an old value.' },
          { nodes: ['api-request', 'request-processors', 'audit-service'], edges: ['api-processors', 'processors-audit'], owner: 'Readiness response', text: 'An existing in-scope resource reports NOT_YET_TRACKED; an excluded or out-of-scope resource reports NO_TRACKING.' },
          { nodes: ['operator', 'api-request', 'request-processors', 'snapshot-service', 'snapshot-response'], edges: ['operator-api', 'api-processors', 'processors-snapshot', 'snapshot-result'], owner: 'Operator recovery', text: 'An authorized manual snapshot can establish the current state as a pseudo-publish baseline, optionally cascading to references.' },
        ],
      },
      {
        id: 'purged-version',
        label: 'Published version unavailable',
        posture: 'OPEN',
        summary: 'Degrade explicitly in the ledger when Version Purge removes the stored UUID; harden rendering separately.',
        steps: [
          { nodes: ['change-writer', 'versions'], edges: ['writer-versions'], owner: 'Version lookup', text: 'Direct identifier lookup and version-history fallback cannot resolve the snapshot’s publishVersion, usually after Version Purge.' },
          { nodes: ['change-writer', 'content'], edges: ['writer-content'], owner: 'Fallback diff', text: 'Existing current properties are recorded as MODIFIED with the explicit [published-baseline-unavailable] old-value marker rather than being mislabeled ADDED.' },
          { nodes: ['change-writer', 'tracking', 'audit-service', 'changes-response'], edges: ['writer-tracking', 'audit-tracking', 'audit-changes'], owner: 'Ledger result', text: 'Subsequent edits can continue from the per-component _baseline, but exact published values are no longer reconstructable from the ledger.' },
          { nodes: ['render-stack', 'versions', 'html-response'], edges: ['render-versions', 'render-html'], owner: 'Render gap', text: 'A snapshot node can survive after its UUID is purged. The current decorator path may fall back to live content instead of reliably returning 410, risking a misleading before frame.' },
        ],
      },
      {
        id: 'publish-writer-race',
        label: 'Publish / writer race',
        posture: 'OPEN',
        summary: 'A long-running writer can hold an old snapshot while a new publication resets the ledger.',
        steps: [
          { nodes: ['jobs', 'change-writer', 'tracking'], edges: ['jobs-writer', 'writer-tracking'], owner: 'Writer begins', text: 'A multi-path job reads the existing snapshot and starts comparing many changed resources against the old review boundary.' },
          { nodes: ['activate', 'preprocessor', 'snapshot-service', 'tracking'], edges: ['activate-preprocessor', 'preprocessor-snapshot', 'snapshot-tracking'], owner: 'Publish wins mid-job', text: 'A new activation replaces the snapshot and deletes the old changes subtree while the writer still holds the previous PublishSnapshot object.' },
          { nodes: ['change-writer', 'tracking'], edges: ['writer-tracking'], owner: 'Stale commit', text: 'The writer can recreate records after the reset. Those records describe edits already absorbed by the new publication and become phantom pending changes.' },
          { nodes: ['audit-service', 'tracking', 'changes-response'], edges: ['audit-tracking', 'audit-changes'], owner: 'Consumer consequence', text: 'The audit can present already-published content as unreviewed. Re-read/compare before commit or a correctness-keyed per-root transaction is needed.' },
        ],
      },
      {
        id: 'debounce-publish-boundary',
        label: 'Debounce / publish boundary',
        posture: 'OPEN',
        summary: 'An edit held only in memory can be absorbed by publication before it ever enters the review ledger.',
        steps: [
          { nodes: ['resource-change', 'listener'], edges: ['change-listener'], owner: 'Debounced edit', text: 'With debounce enabled, the listener retains changed paths in its in-memory pendingChanges map and delays Sling Job creation.' },
          { nodes: ['activate', 'preprocessor', 'snapshot-service', 'content', 'tracking'], edges: ['activate-preprocessor', 'preprocessor-snapshot', 'snapshot-content', 'snapshot-tracking'], owner: 'Immediate publication', text: 'A publish during the debounce window versions the edited current state and clears the prior ledger. The preprocessor does not flush listener state.' },
          { nodes: ['listener', 'jobs', 'change-writer'], edges: ['listener-jobs', 'jobs-writer'], owner: 'Delayed job', text: 'When the pending edit eventually becomes a job, its queue timestamp may be at or before the new publishDate and the writer suppresses it.' },
          { nodes: ['audit-service', 'tracking', 'changes-response'], edges: ['audit-tracking', 'audit-changes'], owner: 'Review consequence', text: 'The edit can reach the published baseline without ever appearing as pending review evidence. This is a structural coordination gap when debounce is enabled.' },
        ],
      },
    ],
  },
];

export const JOURNEYS = [
  { label: 'Publish', workflow: 'publish-baseline' },
  { label: 'Edit', workflow: 'author-edit' },
  { label: 'Review', workflow: 'audit-query' },
  { label: 'References', workflow: 'reference-audit' },
  { label: 'Launches', workflow: 'launch-create' },
  { label: 'Render', workflow: 'version-render' },
  { label: 'Open limits', workflow: 'publish-writer-race' },
];
