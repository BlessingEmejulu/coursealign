import os
import glob

# 1. Create config.js
js_dir = r"c:\Users\USER\Desktop\coursealign\frontend\js"
os.makedirs(js_dir, exist_ok=True)

config_content = """// Global Configuration
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : `${window.location.protocol}//${window.location.hostname}:8000`
};
"""
with open(os.path.join(js_dir, "config.js"), "w", encoding="utf-8") as f:
    f.write(config_content)

# 2. Update HTML files
pages_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"
html_files = glob.glob(os.path.join(pages_dir, "*.html"))
root_index = r"c:\Users\USER\Desktop\coursealign\frontend\index.html"
if os.path.exists(root_index):
    html_files.append(root_index)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine relative path to config.js
    if "pages" in filepath:
        script_tag = '<script src="../js/config.js"></script>'
    else:
        script_tag = '<script src="js/config.js"></script>'

    # Inject script tag if not present
    if "config.js" not in content:
        # Insert right before </head>
        content = content.replace("</head>", f"    {script_tag}\n</head>")

    # Replace hardcoded URLs
    content = content.replace("'http://localhost:8000", "CONFIG.API_BASE_URL + '")
    content = content.replace('"http://localhost:8000', 'CONFIG.API_BASE_URL + "')
    content = content.replace("`http://localhost:8000", "CONFIG.API_BASE_URL + `")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied config.js and replaced hardcoded URLs successfully.")
