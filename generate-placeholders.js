/**
 * Generate 20 beautiful gradient placeholder images for the bubbles.
 * Run once with Node.js:  node generate-placeholders.js
 *
 * If you don't have Node canvas, this script creates tiny SVGs instead,
 * which work perfectly as photo stand-ins.
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'images', 'bubbles');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const gradients = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#f5576c', '#ff6a00'],
  ['#c471f5', '#fa71cd'],
  ['#48c6ef', '#6f86d6'],
  ['#feada6', '#f5efef'],
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#84fab0', '#8fd3f4'],
  ['#fbc2eb', '#a6c1ee'],
  ['#fdcbf1', '#e6dee9'],
  ['#a6c0fe', '#f68084'],
  ['#ffecd2', '#fcb69f'],
  ['#e8dff5', '#fce2ce'],
];

const shapes = ['circle', 'diamond', 'star', 'heart', 'wave'];

function makeShape(type, cx, cy) {
  switch (type) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="40" fill="rgba(255,255,255,0.18)"/>`;
    case 'diamond':
      return `<polygon points="${cx},${cy-45} ${cx+35},${cy} ${cx},${cy+45} ${cx-35},${cy}" fill="rgba(255,255,255,0.15)"/>`;
    case 'star':
      return `<polygon points="${cx},${cy-40} ${cx+12},${cy-12} ${cx+40},${cy-8} ${cx+18},${cy+14} ${cx+25},${cy+40} ${cx},${cy+24} ${cx-25},${cy+40} ${cx-18},${cy+14} ${cx-40},${cy-8} ${cx-12},${cy-12}" fill="rgba(255,255,255,0.13)"/>`;
    case 'heart':
      return `<path d="M${cx},${cy+20} C${cx-40},${cy-20} ${cx-40},${cy-50} ${cx},${cy-15} C${cx+40},${cy-50} ${cx+40},${cy-20} ${cx},${cy+20}Z" fill="rgba(255,255,255,0.16)"/>`;
    case 'wave':
      return `<path d="M0,${cy+10} Q${cx/2},${cy-30} ${cx},${cy+10} T200,${cy+10} V200 H0Z" fill="rgba(255,255,255,0.08)"/>`;
  }
}

for (let i = 0; i < 20; i++) {
  const [c1, c2] = gradients[i];
  const shape = shapes[i % shapes.length];
  const angle = Math.round(100 + i * 13) % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"
      gradientTransform="rotate(${angle}, 0.5, 0.5)">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  ${makeShape(shape, 100, 100)}
  <circle cx="70" cy="60" r="28" fill="rgba(255,255,255,0.07)"/>
</svg>`;

  // Save as SVG but with .jpg name so the main script picks it up
  // Actually, let's save as SVG properly and update config
  fs.writeFileSync(path.join(outDir, `${i + 1}.svg`), svg);
  console.log(`Created ${i + 1}.svg`);
}

console.log('\nDone! 20 placeholder images created in images/bubbles/');
console.log('Note: These are SVG placeholders. Replace them with your real .jpg photos.');
console.log('If using SVGs, update IMAGE_EXT in bubbles.js to ".svg"');
