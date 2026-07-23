import os
import glob
import re

pages_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"
html_files = glob.glob(os.path.join(pages_dir, "*.html"))
root_index = r"c:\Users\USER\Desktop\coursealign\frontend\index.html"
if os.path.exists(root_index):
    html_files.append(root_index)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the CDN
    content = content.replace('<script src="https://cdn.tailwindcss.com"></script>', '')
    
    # Optional: also remove any remaining <script> block that has tailwind.config
    pattern = re.compile(r'<script>\s*tailwind\.config\s*=\s*{.*?}\s*</script>', re.DOTALL)
    content = pattern.sub('', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Tailwind CDN removed successfully.")
