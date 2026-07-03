const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, 'assets');
const PRIMARY = '#0D9488';
const PRIMARY_DARK = '#0F766E';
const WHITE = '#FFFFFF';

// Heart SVG generator
function heartSVG(size, color, bg) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${bg}"/>
    <path d="M ${size*0.5} ${size*0.72} C ${size*0.5} ${size*0.72} ${size*0.25} ${size*0.55} ${size*0.25} ${size*0.38} C ${size*0.25} ${size*0.28} ${size*0.33} ${size*0.22} ${size*0.4} ${size*0.22} C ${size*0.45} ${size*0.22} ${size*0.48} ${size*0.25} ${size*0.5} ${size*0.3} C ${size*0.52} ${size*0.25} ${size*0.55} ${size*0.22} ${size*0.6} ${size*0.22} C ${size*0.67} ${size*0.22} ${size*0.75} ${size*0.28} ${size*0.75} ${size*0.38} C ${size*0.75} ${size*0.55} ${size*0.5} ${size*0.72} ${size*0.5} ${size*0.72} Z" fill="${color}"/>
  </svg>`;
}

// Simple heart icon for foreground (transparent bg)
function heartForegroundSVG(size, color) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <path d="M ${size*0.5} ${size*0.75} C ${size*0.5} ${size*0.75} ${size*0.2} ${size*0.55} ${size*0.2} ${size*0.35} C ${size*0.2} ${size*0.22} ${size*0.3} ${size*0.15} ${size*0.38} ${size*0.15} C ${size*0.44} ${size*0.15} ${size*0.48} ${size*0.18} ${size*0.5} ${size*0.25} C ${size*0.52} ${size*0.18} ${size*0.56} ${size*0.15} ${size*0.62} ${size*0.15} C ${size*0.7} ${size*0.15} ${size*0.8} ${size*0.22} ${size*0.8} ${size*0.35} C ${size*0.8} ${size*0.55} ${size*0.5} ${size*0.75} ${size*0.5} ${size*0.75} Z" fill="${color}"/>
  </svg>`;
}

async function generate() {
  // Main icon (1024x1024) - teal bg with white heart
  await sharp(Buffer.from(heartSVG(1024, WHITE, PRIMARY)))
    .png()
    .toFile(path.join(ASSETS, 'icon.png'));

  // Favicon (48x48)
  await sharp(Buffer.from(heartSVG(48, WHITE, PRIMARY)))
    .png()
    .toFile(path.join(ASSETS, 'favicon.png'));

  // Splash icon (1024x1024) - transparent bg, white heart
  await sharp(Buffer.from(heartForegroundSVG(1024, WHITE)))
    .png()
    .toFile(path.join(ASSETS, 'splash-icon.png'));

  // Android adaptive icon background (512x512) - solid teal
  await sharp(Buffer.from(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="${PRIMARY}"/></svg>`))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-background.png'));

  // Android adaptive icon foreground (512x512) - transparent bg, white heart
  await sharp(Buffer.from(heartForegroundSVG(512, WHITE)))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-foreground.png'));

  // Android monochrome (432x432) - white heart on transparent
  await sharp(Buffer.from(heartForegroundSVG(432, WHITE)))
    .png()
    .toFile(path.join(ASSETS, 'android-icon-monochrome.png'));

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
