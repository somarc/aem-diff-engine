/* eslint-disable no-use-before-define */

import {
  EDGES,
  JOURNEYS,
  MAP_META,
  NODES,
  WORKFLOW_GROUPS,
} from './workflow-data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const nodeMap = new Map(NODES.map((node) => [node.id, node]));
const workflows = WORKFLOW_GROUPS.flatMap((group) => group.items);
const workflowMap = new Map(workflows.map((workflow) => [workflow.id, workflow]));
const groupByWorkflow = new Map(WORKFLOW_GROUPS.flatMap((group) => (
  group.items.map((workflow) => [workflow.id, group.group])
)));

const breadcrumb = document.getElementById('breadcrumb');
const activeLabel = document.getElementById('active-label');
const workflowTree = document.getElementById('workflow-tree');
const journeyNav = document.getElementById('journeys');
const edgeLayer = document.getElementById('edge-layer');
const nodeLayer = document.getElementById('node-layer');
const laneLayer = document.getElementById('lane-layer');
const emptyState = document.getElementById('empty-state');
const stepsContainer = document.getElementById('steps');
const shareButton = document.getElementById('share-link');
const copyStatus = document.getElementById('copy-status');
const diagramTitle = document.getElementById('diagram-title');
const diagramDescription = document.getElementById('diagram-description');
const staticNavToggle = document.getElementById('static-nav-toggle');
const staticNavLinks = document.getElementById('static-nav-links');

let currentWorkflow = null;
let activeStep = -1;
let suppressHash = false;

function setStaticNav(open) {
  staticNavToggle.setAttribute('aria-expanded', String(open));
  staticNavToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  staticNavLinks.classList.toggle('is-open', open);
}

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function centerX(node) {
  return node.x + (node.w / 2);
}

function edgePath(edge, source, target) {
  const sourceX = centerX(source) + (edge.srcDx || 0);
  const targetX = centerX(target) + (edge.dstDx || 0);
  const sourceBottom = source.y + source.h;
  const targetBottom = target.y + target.h;

  if (Math.abs(source.y - target.y) < 8) {
    const sourceRight = source.x + source.w;
    const targetRight = target.x + target.w;
    const midY = source.y + (source.h / 2);
    if (source.x < target.x) {
      return `M${sourceRight},${midY} C${sourceRight + 24},${midY} ${target.x - 24},${midY} ${target.x},${midY}`;
    }
    const arcY = Math.max(8, source.y - 30);
    return `M${source.x},${midY} C${source.x - 36},${arcY} ${targetRight + 36},${arcY} ${targetRight},${midY}`;
  }

  if (source.y > target.y) {
    const control = Math.min(Math.abs(source.y - targetBottom) * 0.46, 88);
    return `M${sourceX},${source.y} C${sourceX},${source.y - control} ${targetX},${targetBottom + control} ${targetX},${targetBottom}`;
  }

  const control = Math.min(Math.max((target.y - sourceBottom) * 0.48, 24), 88);
  return `M${sourceX},${sourceBottom} C${sourceX},${sourceBottom + control} ${targetX},${target.y - control} ${targetX},${target.y}`;
}

function renderLanes() {
  [
    { y: 18, label: 'TRIGGERS + CALLERS' },
    { y: 133, label: 'ENTRY POINTS' },
    { y: 266, label: 'SERVICES + JOB CONSUMERS' },
    { y: 418, label: 'REPOSITORY + RUNTIME STATE' },
    { y: 546, label: 'CONSUMER CONTRACTS' },
  ].forEach((lane) => {
    const line = svgElement('line', {
      x1: 18,
      x2: 1022,
      y1: lane.y,
      y2: lane.y,
      class: 'lane-line',
    });
    const label = svgElement('text', {
      x: 20,
      y: lane.y - 5,
      class: 'lane-label',
    });
    label.textContent = lane.label;
    laneLayer.append(line, label);
  });
}

function renderNodes() {
  NODES.forEach((node) => {
    const group = svgElement('g', {
      id: `node-${node.id}`,
      class: `graph-node node-${node.type}`,
    });
    const title = svgElement('title');
    title.textContent = `${node.label}: ${node.sub}`;
    const rect = svgElement('rect', {
      x: node.x,
      y: node.y,
      width: node.w,
      height: node.h,
      rx: 9,
      ry: 9,
    });
    const label = svgElement('text', {
      x: centerX(node),
      y: node.y + 22,
      'text-anchor': 'middle',
      class: 'node-label',
    });
    label.textContent = node.label;
    const sub = svgElement('text', {
      x: centerX(node),
      y: node.y + 39,
      'text-anchor': 'middle',
      class: 'node-sub',
    });
    sub.textContent = node.sub.length > 34 ? `${node.sub.slice(0, 32)}…` : node.sub;
    group.append(title, rect, label, sub);
    nodeLayer.append(group);
  });
}

function renderEdges() {
  EDGES.forEach((edge) => {
    const source = nodeMap.get(edge.from);
    const target = nodeMap.get(edge.to);
    if (!source || !target) return;

    const group = svgElement('g', { id: `edge-${edge.id}` });
    const path = svgElement('path', {
      d: edgePath(edge, source, target),
      class: `graph-edge edge-${edge.color} edge-${edge.kind}`,
      'marker-end': 'url(#arrow)',
    });
    const label = svgElement('text', {
      x: (centerX(source) + centerX(target) + (edge.srcDx || 0) + (edge.dstDx || 0)) / 2,
      y: (source.y + source.h + target.y) / 2,
      class: 'graph-edge-label',
    });
    label.textContent = edge.label;
    group.append(path, label);
    edgeLayer.append(group);
  });
}

function postureClass(posture) {
  return posture.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function createPostureChip(posture) {
  const chip = document.createElement('span');
  chip.className = `posture-chip ${postureClass(posture)}`;
  chip.textContent = posture;
  return chip;
}

function renderJourneys() {
  JOURNEYS.forEach((journey) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'journey';
    button.dataset.workflow = journey.workflow;
    button.textContent = journey.label;
    button.addEventListener('click', () => selectWorkflow(journey.workflow));
    journeyNav.append(button);
  });
}

function renderWorkflowTree() {
  const compact = window.matchMedia('(max-width: 900px)').matches;
  WORKFLOW_GROUPS.forEach((workflowGroup, groupIndex) => {
    const group = document.createElement('section');
    group.className = 'workflow-group';
    if (compact && groupIndex > 0) group.classList.add('is-closed');

    const panelId = `workflow-group-${groupIndex}`;
    const heading = document.createElement('button');
    heading.type = 'button';
    heading.className = 'group-heading';
    heading.setAttribute('aria-controls', panelId);
    heading.setAttribute('aria-expanded', String(!group.classList.contains('is-closed')));
    heading.innerHTML = `<span>${workflowGroup.group}</span><span aria-hidden="true">▾</span>`;

    const items = document.createElement('div');
    items.id = panelId;
    items.className = 'group-items';

    workflowGroup.items.forEach((workflow) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'workflow-button';
      button.dataset.workflow = workflow.id;
      button.dataset.posture = workflow.posture;

      const label = document.createElement('span');
      label.className = 'workflow-label';
      label.textContent = workflow.label;
      const posture = document.createElement('span');
      posture.className = 'workflow-posture';
      posture.textContent = workflow.posture;
      button.append(label, posture);
      button.addEventListener('click', () => selectWorkflow(workflow.id));
      items.append(button);
    });

    heading.addEventListener('click', () => {
      group.classList.toggle('is-closed');
      heading.setAttribute('aria-expanded', String(!group.classList.contains('is-closed')));
    });

    group.append(heading, items);
    workflowTree.append(group);
  });
}

function resetGraph() {
  NODES.forEach((node) => {
    document.getElementById(`node-${node.id}`)?.classList.remove('is-active');
  });
  EDGES.forEach((edge) => {
    document.querySelector(`#edge-${edge.id} .graph-edge`)?.classList.remove('is-active');
  });
}

function highlight(nodes, edges) {
  resetGraph();
  nodes.forEach((nodeId) => document.getElementById(`node-${nodeId}`)?.classList.add('is-active'));
  edges.forEach((edgeId) => document.querySelector(`#edge-${edgeId} .graph-edge`)?.classList.add('is-active'));
}

function highlightWorkflow(workflow) {
  const nodes = new Set();
  const edges = new Set();
  workflow.steps.forEach((step) => {
    step.nodes.forEach((node) => nodes.add(node));
    step.edges.forEach((edge) => edges.add(edge));
  });
  highlight(nodes, edges);
}

function highlightStep(workflow, index) {
  const step = workflow.steps[index];
  if (!step) {
    highlightWorkflow(workflow);
    return;
  }
  highlight(new Set(step.nodes), new Set(step.edges));
}

function workflowUrl(workflow = currentWorkflow, step = activeStep) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams();
  if (workflow) params.set('workflow', workflow.id);
  if (Number.isInteger(step) && step >= 0) params.set('step', String(step + 1));
  url.hash = params.toString();
  return url.toString();
}

function updateHash() {
  if (!currentWorkflow || suppressHash) return;
  window.history.replaceState(null, '', workflowUrl());
}

function updateBreadcrumb() {
  if (!currentWorkflow) {
    breadcrumb.textContent = `${MAP_META.version} · runtime map`;
    return;
  }
  const group = groupByWorkflow.get(currentWorkflow.id);
  const parts = [`runtime ${MAP_META.runtimeVersion}`, `API ${MAP_META.apiVersion}`, MAP_META.runtimeCommit.slice(0, 7), group, currentWorkflow.label];
  if (activeStep >= 0) parts.push(`step ${activeStep + 1}`);
  breadcrumb.textContent = parts.join(' / ');
}

function renderSteps(workflow) {
  emptyState.hidden = true;
  stepsContainer.hidden = false;
  stepsContainer.textContent = '';

  const header = document.createElement('div');
  header.className = 'steps-header';
  const title = document.createElement('div');
  title.className = 'steps-title';
  title.append(document.createTextNode(`${workflow.label} — execution steps`), createPostureChip(workflow.posture));
  const summary = document.createElement('div');
  summary.className = 'steps-summary';
  summary.textContent = workflow.summary;
  header.append(title, summary);
  stepsContainer.append(header);

  workflow.steps.forEach((step, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'step-button';
    button.dataset.step = String(index);
    button.classList.toggle('is-active', activeStep === index);
    button.setAttribute('aria-pressed', String(activeStep === index));

    const number = document.createElement('span');
    number.className = 'step-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const owner = document.createElement('span');
    owner.className = 'step-owner';
    owner.textContent = step.owner;
    const text = document.createElement('span');
    text.className = 'step-text';
    text.textContent = step.text;
    button.append(number, owner, text);

    button.addEventListener('mouseenter', () => {
      if (activeStep < 0) highlightStep(workflow, index);
    });
    button.addEventListener('mouseleave', () => {
      if (activeStep < 0) highlightWorkflow(workflow);
    });
    button.addEventListener('focus', () => {
      if (activeStep < 0) highlightStep(workflow, index);
    });
    button.addEventListener('blur', () => {
      if (activeStep < 0) highlightWorkflow(workflow);
    });
    button.addEventListener('click', () => {
      activeStep = activeStep === index ? -1 : index;
      renderSteps(workflow);
      highlightStep(workflow, activeStep);
      updateBreadcrumb();
      updateHash();
    });

    stepsContainer.append(button);
  });
}

function selectWorkflow(workflowId, options = {}) {
  const workflow = workflowMap.get(workflowId);
  if (!workflow) return;
  currentWorkflow = workflow;
  activeStep = Number.isInteger(options.step) ? options.step : -1;

  document.querySelectorAll('.workflow-button').forEach((button) => {
    const selected = button.dataset.workflow === workflow.id;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-current', selected ? 'true' : 'false');
  });
  document.querySelectorAll('.journey').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.workflow === workflow.id);
  });

  const selectedButton = document.querySelector(`.workflow-button[data-workflow="${workflow.id}"]`);
  const selectedGroup = selectedButton?.closest('.workflow-group');
  if (selectedGroup?.classList.contains('is-closed')) {
    selectedGroup.classList.remove('is-closed');
    selectedGroup.querySelector('.group-heading')?.setAttribute('aria-expanded', 'true');
  }
  selectedButton?.scrollIntoView({ block: 'nearest' });

  activeLabel.textContent = '';
  const label = document.createElement('strong');
  label.textContent = workflow.label;
  activeLabel.append(label, createPostureChip(workflow.posture));
  diagramTitle.textContent = `${workflow.label} — AEM Diff Engine workflow`;
  diagramDescription.textContent = workflow.summary;

  renderSteps(workflow);
  highlightStep(workflow, activeStep);
  updateBreadcrumb();
  updateHash();
}

function readHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const workflowId = params.get('workflow');
  const stepNumber = Number.parseInt(params.get('step') || '', 10);
  return {
    workflowId: workflowMap.has(workflowId) ? workflowId : workflows[0]?.id,
    step: Number.isInteger(stepNumber) && stepNumber > 0 ? stepNumber - 1 : -1,
  };
}

function selectFromHash() {
  const hashState = readHash();
  const workflow = workflowMap.get(hashState.workflowId);
  const step = hashState.step < workflow.steps.length ? hashState.step : -1;
  suppressHash = true;
  selectWorkflow(workflow.id, { step });
  suppressHash = false;
}

shareButton.addEventListener('click', async () => {
  const url = workflowUrl();
  try {
    await navigator.clipboard.writeText(url);
    shareButton.textContent = 'Copied';
    copyStatus.textContent = 'Workflow link copied to clipboard.';
  } catch (error) {
    shareButton.title = url;
    shareButton.textContent = 'URL in title';
    copyStatus.textContent = 'Clipboard access failed. The workflow URL is available in the button title.';
  }
  window.setTimeout(() => { shareButton.textContent = 'Copy link'; }, 1400);
});

staticNavToggle.addEventListener('click', () => {
  setStaticNav(staticNavToggle.getAttribute('aria-expanded') !== 'true');
});
staticNavLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setStaticNav(false));
});

window.addEventListener('hashchange', selectFromHash);
window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (staticNavToggle.getAttribute('aria-expanded') === 'true') {
    setStaticNav(false);
    staticNavToggle.focus();
    return;
  }
  if (activeStep < 0 || !currentWorkflow) return;
  activeStep = -1;
  renderSteps(currentWorkflow);
  highlightWorkflow(currentWorkflow);
  updateBreadcrumb();
  updateHash();
});

renderLanes();
renderEdges();
renderNodes();
renderJourneys();
renderWorkflowTree();
selectFromHash();
