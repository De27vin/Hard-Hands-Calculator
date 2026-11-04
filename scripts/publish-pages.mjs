import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
if (!existsSync(join(output, 'index.html'))) {
  throw new Error('Build the application before publishing. Use npm run deploy:pages.');
}
const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const remote = git(['remote', 'get-url', '--push', 'origin']);
const source = git(['rev-parse', '--short', 'HEAD']);
const userName = git(['config', 'user.name']);
const userEmail = git(['config', 'user.email']);
const staging = mkdtempSync(join(tmpdir(), 'hard-hands-pages-'));

try {
  git(['init', '-b', 'gh-pages'], staging);
  git(['config', 'user.name', userName], staging);
  git(['config', 'user.email', userEmail], staging);
  git(['remote', 'add', 'origin', remote], staging);
  const published = git(['ls-remote', 'origin', 'refs/heads/gh-pages'], staging);
  if (published) {
    git(['fetch', '--depth=1', 'origin', 'gh-pages'], staging);
    git(['checkout', '-B', 'gh-pages', 'FETCH_HEAD'], staging);
  }
  // Only clear the temporary deployment checkout. Source files stay in main.
  for (const entry of readdirSync(staging)) {
    if (entry !== '.git') rmSync(join(staging, entry), { recursive: true, force: true });
  }
  cpSync(output, staging, { recursive: true });
  writeFileSync(join(staging, '.nojekyll'), '');
  git(['add', '--all'], staging);
  if (git(['status', '--porcelain'], staging)) {
    git(['commit', '-m', `deploy: publish static build from ${source}`], staging);
    execFileSync('git', ['push', 'origin', 'gh-pages'], { cwd: staging, stdio: 'inherit' });
    console.log('Published static assets to gh-pages. GitHub Pages will deploy the branch.');
  } else {
    console.log('The gh-pages branch already contains this build.');
  }
} finally {
  rmSync(staging, { recursive: true, force: true });
}
