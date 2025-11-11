# CourseAlign PWA Icons

## Required Icon Sizes

To complete the PWA setup, you'll need to create app icons in the following sizes and place them in this directory:

### Required Icons:
- `icon-16x16.png` - Browser favicon
- `icon-32x32.png` - Browser favicon
- `icon-72x72.png` - Android small icon
- `icon-96x96.png` - Android medium icon
- `icon-128x128.png` - Android large icon
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iOS home screen
- `icon-192x192.png` - Android home screen (minimum required)
- `icon-384x384.png` - Android splash screen
- `icon-512x512.png` - Android home screen (recommended)

### Design Guidelines:

#### Icon Content:
- Use your CourseAlign logo/brand
- Ensure it's readable at small sizes
- Use your brand colors (#0097DC blue)
- Consider a simple "CA" monogram for small sizes

#### Technical Requirements:
- PNG format
- Square aspect ratio
- Solid background (no transparency for some platforms)
- High contrast for visibility

### Quick Generation Options:

#### Option 1: Online Icon Generators
1. Use tools like:
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/
   - https://favicon.io/

#### Option 2: Design Tools
1. Create a 512x512px design in:
   - Figma, Sketch, or Adobe Illustrator
   - Use CourseAlign branding
2. Export all required sizes

#### Option 3: Simple Text Icon
For a quick start, create a simple text-based icon:
- Blue background (#0097DC)
- White text "CA" or "CourseAlign"
- Modern sans-serif font

### Maskable Icons
Some platforms support "maskable" icons that can be cropped into different shapes. Consider creating versions that work well when cropped to circles or squares.

## Current Status
🔄 Icons needed - PWA will work but install prompts may show placeholder icons until real icons are added.

## Next Steps
1. Create or generate the required icon sizes
2. Place them in this `/assets/icons/` directory
3. Test the PWA installation on various devices
4. Verify icons appear correctly in:
   - Browser tabs (favicon)
   - Home screen shortcuts
   - App switcher
   - Installation prompts