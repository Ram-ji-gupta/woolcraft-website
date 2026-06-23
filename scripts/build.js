const fs = require('fs');
const path = require('path');

// Define source and destination
const srcDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, '..', 'build');

// Clean build directory
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Define what to copy (directories and file patterns)
const directoriesToCopy = ['css', 'js', 'images', 'components', 'admin'];
const filesToCopy = ['index.html', 'about.html', 'cart.html', 'checkout.html', 'contact.html', 'faq.html', 'products.html', 'product.html', 'robots.txt', 'sitemap.xml'];

// Copy single files
filesToCopy.forEach(file => {
  const src = path.join(srcDir, file);
  if (fs.existsSync(src)) {
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file}`);
  }
});

// Copy directories recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${path.relative(srcDir, srcPath)}`);
    }
  });
}

directoriesToCopy.forEach(dir => {
  const src = path.join(srcDir, dir);
  if (fs.existsSync(src)) {
    copyDirectory(src, path.join(destDir, dir));
  }
});

console.log('\n✅ Build complete!');
