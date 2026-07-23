import os
import glob
import re

pages_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"
js_dir = r"c:\Users\USER\Desktop\coursealign\frontend\js"
html_files = glob.glob(os.path.join(pages_dir, "*.html"))
root_index = r"c:\Users\USER\Desktop\coursealign\frontend\index.html"
if os.path.exists(root_index):
    html_files.append(root_index)

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
    scripts = pattern.finditer(content)
    
    js_content_list = []
    blocks_to_replace = []
    
    for match in scripts:
        script_body = match.group(1).strip()
        
        # Skip tailwind configs
        if "tailwind.config" in script_body:
            continue
            
        js_content_list.append(script_body)
        blocks_to_replace.append(match.group(0))

    if js_content_list:
        filename = os.path.basename(filepath)
        js_filename = filename.replace('.html', '.js')
        js_path = os.path.join(js_dir, js_filename)
        
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write("\n\n".join(js_content_list))
            
        if "pages" in filepath:
            src_path = f"../js/{js_filename}"
        else:
            src_path = f"js/{js_filename}"
            
        new_tag = f'<script src="{src_path}"></script>'
        
        content = content.replace(blocks_to_replace[0], new_tag)
        for block in blocks_to_replace[1:]:
            content = content.replace(block, '')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Extraction completed.")
