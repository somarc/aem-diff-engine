#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const contract = JSON.parse(await readFile(resolve(root, 'dogfood', 'site-shell-contract.json'), 'utf8'));
const explorer = await readFile(resolve(root, 'tools', 'workflow-explorer.html'), 'utf8');
const errors = [];

function fail(message) {
  errors.push(message);
}

function normalizeLabel(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractLinks(content, containerPattern = null) {
  const source = containerPattern ? (content.match(containerPattern)?.[1] || '') : content;
  return [...source.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: match[1], label: normalizeLabel(match[2]).replace(/^∆\s*/, '') }));
}

function assertNavigation(actual, label) {
  const expected = contract.navigation;
  if (actual.length !== expected.length) {
    fail(`${label} has ${actual.length} links; expected ${expected.length}.`);
    return;
  }
  expected.forEach((row, index) => {
    const found = actual[index];
    if (found.href !== row.href || found.label !== row.label) {
      fail(`${label} link ${index + 1} is ${found.label} → ${found.href}; expected ${row.label} → ${row.href}.`);
    }
  });
}

if (contract.schemaVersion !== 'aem-diff-engine.site-shell.v1') fail('Unsupported site-shell contract schemaVersion.');

const explorerLinks = extractLinks(explorer, /<div class="static-nav-links"[^>]*>([\s\S]*?)<\/div>/i);
assertNavigation(explorerLinks, 'Static explorer navigation');

const footerTokens = [
  contract.attribution.builder,
  `Operator: ${contract.attribution.operator}`,
  contract.attribution.daCertification,
  contract.attribution.daReportedPackageVersion,
  contract.attribution.productTeam,
  contract.attribution.publicationBoundary,
];
footerTokens.forEach((token) => {
  if (!explorer.includes(token)) fail(`Static explorer footer is missing attribution token: ${token}`);
});

const daNavPath = resolve(root, '.da', 'workspace', 'nav.html');
const daFooterPath = resolve(root, '.da', 'workspace', 'footer.html');
let localDaValidated = false;
try {
  await access(daNavPath, constants.R_OK);
  await access(daFooterPath, constants.R_OK);
  const [daNav, daFooter] = await Promise.all([readFile(daNavPath, 'utf8'), readFile(daFooterPath, 'utf8')]);
  const daLinks = extractLinks(daNav).filter((link) => link.href !== contract.brand.href);
  assertNavigation(daLinks, 'DA-authored navigation');
  footerTokens.forEach((token) => {
    if (!normalizeLabel(daFooter).includes(normalizeLabel(token))) fail(`DA-authored footer is missing attribution token: ${token}`);
  });
  localDaValidated = true;
} catch {
  // DA is the source of truth and is intentionally not mirrored in Git. CI can
  // validate the static shell contract; certification validates fetched DA source.
}

const forbiddenAttribution = ['Michael Hess', 'Chris Borland', 'OpenAI GPT-5.6 Sol'];
forbiddenAttribution.forEach((name) => {
  if (explorer.includes(name)) fail(`Static shell contains removed individual attribution: ${name}`);
});

if (errors.length) {
  errors.forEach((error) => console.error(`FAIL ${error}`));
  console.error(`\n${errors.length} site-shell validation error(s).`);
  process.exit(1);
}

console.log(`Validated unified ${contract.navigation.length}-link navigation and AEM Co-Innovation Engineering attribution in the static explorer.`);
console.log(localDaValidated
  ? 'Validated matching navigation and attribution in the local DA content workspace.'
  : 'Local DA workspace not present; DA source validation is deferred to the certification pipeline.');
