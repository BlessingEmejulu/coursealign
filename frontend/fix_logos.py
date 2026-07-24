import os
import glob

pages_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"
html_files = glob.glob(os.path.join(pages_dir, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "../../assets/images/logo.png" in content:
        new_content = content.replace("../../assets/images/logo.png", "../assets/images/logo.png")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed logo path in {os.path.basename(file_path)}")

