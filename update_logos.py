import os
import shutil

source_image = r"c:\Users\USER\.gemini\antigravity-ide\brain\a5b2b5d5-75d3-43cb-9d09-7da1e58dbe2c\coursealign_african_girl_laptop_logo_1784808539675.png"
dest_image = r"c:\Users\USER\Desktop\coursealign\frontend\images\logo.png"

# We deleted frontend/images/ earlier, let's use frontend/assets/images/ or just assets/images/ since the path is frontend/assets/images
dest_dir = r"c:\Users\USER\Desktop\coursealign\assets\images"
os.makedirs(dest_dir, exist_ok=True)
dest_image = os.path.join(dest_dir, "logo.png")

shutil.copyfile(source_image, dest_image)
print(f"Copied image to {dest_image}")

# Now replace text logo with image in HTML files
html_dir = r"c:\Users\USER\Desktop\coursealign\frontend\pages"

for root, dirs, files in os.walk(html_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            # Replace the logo text with an img tag. 
            # In index.html it's:
            # <span class="text-2xl font-bold text-secondary tracking-wide">CourseAlign</span>
            # In other dashboards:
            # <div class="text-2xl font-bold text-secondary mb-10 text-center doodle-border p-2">CourseAlign</div>
            
            content = content.replace(
                '<span class="text-2xl font-bold text-secondary tracking-wide">CourseAlign</span>',
                '<img src="../../assets/images/logo.png" alt="CourseAlign" class="h-10">'
            )
            
            content = content.replace(
                '<div class="text-2xl font-bold text-secondary mb-10 text-center doodle-border p-2">CourseAlign</div>',
                '<img src="../../assets/images/logo.png" alt="CourseAlign" class="h-20 mx-auto mb-10">'
            )

            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {file}")

