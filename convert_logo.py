import os
from PIL import Image
import sys
import subprocess

def install_pillow():
    try:
        import PIL
    except ImportError:
        print("Installing Pillow...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])

install_pillow()
from PIL import Image

logo_path = r"c:\Users\USER\Desktop\coursealign\assets\images\logo.png"
icons_dir = r"c:\Users\USER\Desktop\coursealign\assets\icons"
favicon_path = r"c:\Users\USER\Desktop\coursealign\favicon.ico"

os.makedirs(icons_dir, exist_ok=True)

if not os.path.exists(logo_path):
    print(f"Error: {logo_path} not found.")
    sys.exit(1)

with Image.open(logo_path) as img:
    # Convert to RGBA just in case
    img = img.convert("RGBA")
    
    # Generate 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(icons_dir, "icon-192x192.png"))
    print("Created icon-192x192.png")
    
    # Generate 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(icons_dir, "icon-512x512.png"))
    print("Created icon-512x512.png")
    
    # Generate favicon.ico (multi-size)
    img.save(favicon_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print("Created favicon.ico")

print("Logo successfully converted to icons!")
