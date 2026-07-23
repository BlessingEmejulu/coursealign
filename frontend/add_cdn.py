import os
import glob
import re

cdn_block = """
    <!-- Tailwind CSS (Play CDN for Vanilla HTML/JS setup) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#49B6E5', secondary: '#263D5B', success: '#16A34A', warning: '#D97706', danger: '#DC2626', surface: '#FFFFFF', text: '#111827' },
                    fontFamily: { sans: ['"Delius Swash Caps"', 'cursive'], mono: ['"JetBrains Mono"', 'monospace'] },
                    animation: { 'bounce-slow': 'bounce 3s infinite', 'wiggle': 'wiggle 1s ease-in-out infinite' },
                    keyframes: { wiggle: { '0%, 100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } } }
                }
            }
        }
    </script>
"""

pages_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"
html_files = glob.glob(os.path.join(pages_dir, "*.html"))
root_index = r"c:\Users\USER\Desktop\coursealign\frontend\index.html"
if os.path.exists(root_index):
    html_files.append(root_index)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Only add if not already present
    if "cdn.tailwindcss.com" not in content:
        # Insert right before </head>
        content = content.replace("</head>", cdn_block + "</head>")

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Tailwind CDN restored successfully to all HTML files.")
