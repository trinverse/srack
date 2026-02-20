/**
 * Generate a static JSON manifest of menu image files.
 * This is run before build so that the image-matcher can work
 * on Vercel serverless (where fs.readdirSync doesn't have access to public/).
 */
const fs = require('fs');
const path = require('path');

const menuImagesDir = path.join(__dirname, '..', 'public', 'menu-images');
const outputFile = path.join(__dirname, '..', 'src', 'lib', 'menu-image-files.json');

if (!fs.existsSync(menuImagesDir)) {
    console.warn('⚠️  public/menu-images directory not found, creating empty manifest.');
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    process.exit(0);
}

const files = fs.readdirSync(menuImagesDir).filter(f =>
    /\.(jpg|jpeg|png|webp|avif)$/i.test(f)
);

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
console.log(`✅ Generated image manifest with ${files.length} files → ${outputFile}`);
