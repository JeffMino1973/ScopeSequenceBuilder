import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, '../server/curriculum-data.json');
const targetDir = path.join(__dirname, '../dist');
const targetFile = path.join(targetDir, 'curriculum-data.json');

// Ensure dist directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy curriculum-data.json to dist
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('✅ Successfully copied curriculum-data.json to dist/');
} catch (error) {
  console.error('❌ Failed to copy curriculum-data.json:', error);
  process.exit(1);
}
