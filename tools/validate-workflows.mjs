#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = await readFile(resolve(here, 'workflow-data.js'), 'utf8');
const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const {
  EDGES,
  JOURNEYS,
  MAP_META,
  NODES,
  WORKFLOW_GROUPS,
} = await import(dataUrl);

const html = await readFile(resolve(here, 'workflow-explorer.html'), 'utf8');
const css = await readFile(resolve(here, 'workflow-explorer.css'), 'utf8');
const script = await readFile(resolve(here, 'workflow-explorer.js'), 'utf8');
const contract = JSON.parse(await readFile(resolve(here, '..', 'dogfood', 'diff-engine-runtime-contract.json'), 'utf8'));
const errors = [];

function fail(message) {
  errors.push(message);
}

function uniqueIds(rows, label) {
  const ids = rows.map((row) => row.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${label} contains duplicate id(s): ${[...new Set(duplicates)].join(', ')}`);
  return new Set(ids);
}

const nodeIds = uniqueIds(NODES, 'NODES');
const edgeIds = uniqueIds(EDGES, 'EDGES');
const workflows = WORKFLOW_GROUPS.flatMap((group) => group.items);
const workflowIds = uniqueIds(workflows, 'WORKFLOWS');
const postures = new Set(['DEMONSTRATED', 'DESIGNED', 'OPEN', 'BOUNDARY', 'NEEDS LIVE AEM']);
const edgeKinds = new Set(['sync', 'async', 'read', 'write', 'response', 'fallback']);

EDGES.forEach((edge) => {
  if (!nodeIds.has(edge.from)) fail(`Edge ${edge.id} has unknown source ${edge.from}.`);
  if (!nodeIds.has(edge.to)) fail(`Edge ${edge.id} has unknown target ${edge.to}.`);
  if (!edgeKinds.has(edge.kind)) fail(`Edge ${edge.id} has unsupported kind ${edge.kind}.`);
});

workflows.forEach((workflow) => {
  if (!postures.has(workflow.posture)) fail(`Workflow ${workflow.id} has unsupported posture ${workflow.posture}.`);
  if (!workflow.summary?.trim()) fail(`Workflow ${workflow.id} has no summary.`);
  if (!Array.isArray(workflow.steps) || workflow.steps.length < 3) fail(`Workflow ${workflow.id} needs at least three steps.`);
  workflow.steps?.forEach((step, index) => {
    const prefix = `${workflow.id} step ${index + 1}`;
    if (!step.owner?.trim() || !step.text?.trim()) fail(`${prefix} is missing owner or text.`);
    const visibleNodes = new Set(step.nodes || []);
    (step.nodes || []).forEach((nodeId) => {
      if (!nodeIds.has(nodeId)) fail(`${prefix} references unknown node ${nodeId}.`);
    });
    (step.edges || []).forEach((edgeId) => {
      if (!edgeIds.has(edgeId)) {
        fail(`${prefix} references unknown edge ${edgeId}.`);
        return;
      }
      const edge = EDGES.find((candidate) => candidate.id === edgeId);
      if (!visibleNodes.has(edge.from) || !visibleNodes.has(edge.to)) {
        fail(`${prefix} activates ${edgeId} without both endpoint nodes (${edge.from}, ${edge.to}).`);
      }
    });
  });
});

JOURNEYS.forEach((journey) => {
  if (!workflowIds.has(journey.workflow)) fail(`Journey ${journey.label} references unknown workflow ${journey.workflow}.`);
});

if (!MAP_META.title || !MAP_META.version || !MAP_META.source) fail('MAP_META is incomplete.');
if (contract.schemaVersion !== 'aem-diff-engine.runtime-contract.v1') fail('Runtime contract schemaVersion is unsupported.');
if (contract.source.commit !== MAP_META.runtimeCommit) fail('Explorer runtime commit does not match the checked runtime contract.');
if (contract.source.runtimeVersion !== MAP_META.runtimeVersion) fail('Explorer runtime version does not match the checked runtime contract.');
if (contract.source.apiVersion !== MAP_META.apiVersion) fail('Explorer API version does not match the checked runtime contract.');
if (contract.endpoints.length !== 4) fail('Runtime contract must retain the four public endpoint contracts.');
if (contract.testEvidence.tests !== 351 || contract.testEvidence.failures !== 0 || contract.testEvidence.errors !== 0) {
  fail('Runtime contract test evidence is stale or not green.');
}
if (!html.includes('/tools/workflow-explorer.css') || !html.includes('/tools/workflow-explorer.js')) {
  fail('Static HTML does not load the expected explorer assets.');
}
if (!html.includes(`${workflows.length} workflows`)) fail(`Static scope count is stale; expected ${workflows.length} workflows.`);
if (!html.includes(MAP_META.runtimeVersion) || !html.includes(MAP_META.apiVersion) || !html.includes(MAP_META.runtimeCommit.slice(0, 7))) {
  fail('Static scope markers do not match the runtime/API/source contract.');
}
if (!css.includes('@media (width <= 900px)')) fail('Explorer CSS is missing the compact layout contract.');
if (!script.includes("window.addEventListener('hashchange'")) fail('Explorer script is missing deep-link synchronization.');
if (!script.includes('navigator.clipboard.writeText')) fail('Explorer script is missing share-link behavior.');
if (!script.includes("setAttribute('aria-current'") || !script.includes("setAttribute('aria-pressed'")) {
  fail('Explorer script is missing selected workflow/step ARIA state.');
}
if (!html.includes('id="copy-status" role="status"')) fail('Explorer is missing an announced copy-link status region.');

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  console.error(`\n${errors.length} workflow explorer validation error(s).`);
  process.exit(1);
}

console.log(`Validated ${workflows.length} workflows, ${NODES.length} nodes, ${EDGES.length} edges, and ${JOURNEYS.length} journey shortcuts.`);
console.log(`Validated postures, edge kinds, graph integrity, deep-link/share hooks, and compact-layout markers for ${MAP_META.title}.`);
console.log(`Validated runtime ${MAP_META.runtimeVersion}, API ${MAP_META.apiVersion}, source ${MAP_META.runtimeCommit.slice(0, 7)}, and 351-test evidence against the checked contract.`);
