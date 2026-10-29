// Lint ratchet: fail when ESLint errors or warnings exceed the recorded
// baseline, so legacy problems can stay but new ones cannot be added.
// Usage: node scripts/lint-baseline.mjs          -> check
//        node scripts/lint-baseline.mjs --update -> rewrite baseline after cleanup
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const BASELINE_FILE = '.eslint-baseline.json';
const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));

const run = spawnSync('npx', ['eslint', ...baseline.targets, '-f', 'json'], {
  encoding: 'utf8',
  maxBuffer: 256 * 1024 * 1024,
});
if (!run.stdout) {
  process.stderr.write(run.stderr);
  process.exit(2);
}
const results = JSON.parse(run.stdout);
const errors = results.reduce((n, r) => n + r.errorCount, 0);
const warnings = results.reduce((n, r) => n + r.warningCount, 0);

if (process.argv.includes('--update')) {
  writeFileSync(BASELINE_FILE, `${JSON.stringify({ ...baseline, errors, warnings }, null, 2)}\n`);
  process.stdout.write(`Baseline updated: ${errors} errors, ${warnings} warnings\n`);
  process.exit(0);
}

process.stdout.write(
  `ESLint: ${errors} errors (baseline ${baseline.errors}), ${warnings} warnings (baseline ${baseline.warnings})\n`,
);
if (errors > baseline.errors || warnings > baseline.warnings) {
  process.stdout.write('New lint problems introduced. Run `npx eslint <changed files>` and fix them.\n');
  process.exit(1);
}
if (errors < baseline.errors || warnings < baseline.warnings) {
  process.stdout.write('Fewer problems than baseline — run with --update and commit the new baseline.\n');
}
