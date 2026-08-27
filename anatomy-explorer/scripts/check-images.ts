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
    console.error('ERROR: src/data/items.json is missing or invalid.');
    process.exit(1);
  }

  let files = [];
  try {
    files = fs.readdirSync(imagesDir).map(f => path.basename(f, path.extname(f)));
  } catch (e) {
    console.error('ERROR: src/assets/images does not exist or is missing required directories.');
    process.exit(1);
  }

  const publishedItems = items.filter(i => i.status === 'published');
  
  const unapproved = publishedItems.filter(i => i.image_status !== 'approved');
  if (unapproved.length > 0) {
    console.error(`ERROR: Published items with unapproved media (image_status must be 'approved'): ${unapproved.map(i => i.id).join(', ')}`);
    process.exit(1);
  }

  const requiredImages = new Set(publishedItems.map(i => i.image_id).filter(Boolean));
  const availableImages = new Set(files);

  const missing = [...requiredImages].filter(x => !availableImages.has(x));
  const orphans = [...availableImages].filter(x => !requiredImages.has(x));

  console.log('--- Image Check Report ---');
  if (missing.length === 0 && orphans.length === 0) {
    console.log('All good. No missing or orphan images.');
  } else {
    if (missing.length > 0) {
      console.error(`ERROR: Missing image files for published items: ${missing.join(', ')}`);
      process.exit(1);
    }
    if (orphans.length > 0) {
      console.warn(`WARNING: Orphan images (no item referencing them): ${orphans.join(', ')}`);
    }
  }
}

main();
