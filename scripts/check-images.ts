import fs from 'fs';
import path from 'path';

// Simple check-images script as required by M05
const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
const itemsFile = path.join(process.cwd(), 'src', 'data', 'items.json');

function main() {
  let items = [];
  try {
    items = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));
  } catch (e) {
    console.log("No items.json found yet.");
    return;
  }

  let files = [];
  try {
    files = fs.readdirSync(imagesDir).map(f => path.basename(f, path.extname(f)));
  } catch (e) {
    console.log("Images directory not found.");
    return;
  }

  const publishedItems = items.filter(i => i.status === 'published');
  const requiredImages = new Set(publishedItems.map(i => i.image_id).filter(Boolean));
  const availableImages = new Set(files);

  const missing = [...requiredImages].filter(x => !availableImages.has(x));
  const orphans = [...availableImages].filter(x => !requiredImages.has(x));

  console.log('--- Image Check Report ---');
  if (missing.length === 0 && orphans.length === 0) {
    console.log('All good. No missing or orphan images.');
  } else {
    if (missing.length > 0) {
      console.warn(`WARNING: Missing images for items: ${missing.join(', ')}`);
    }
    if (orphans.length > 0) {
      console.warn(`WARNING: Orphan images (no item referencing them): ${orphans.join(', ')}`);
    }
  }
}

main();
