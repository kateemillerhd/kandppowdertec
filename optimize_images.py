from pathlib import Path
from PIL import Image, ImageOps

BASE_DIR = Path(__file__).resolve().parent
SOURCE_DIR = BASE_DIR / "images" / "gallery" / "originals"
THUMB_DIR = BASE_DIR / "images" / "gallery" / "thumbnails"
FULL_DIR = BASE_DIR / "images" / "gallery" / "full"

THUMB_DIR.mkdir(parents=True, exist_ok=True)
FULL_DIR.mkdir(parents=True, exist_ok=True)

SUPPORTED_FORMATS = {".jpg", ".jpeg", ".png", ".webp"}

def optimize_image(source, destination, max_width, quality):
    with Image.open(source) as img:
        img = ImageOps.exif_transpose(img)

        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

        if img.width > max_width:
            new_height = int(img.height * max_width / img.width)
            img = img.resize(
                (max_width, new_height),
                Image.Resampling.LANCZOS
            )

        img.save(
            destination,
            "WEBP",
            quality=quality,
            method=6
        )

def process_images():
    for image_path in SOURCE_DIR.iterdir():
        if image_path.suffix.lower() not in SUPPORTED_FORMATS:
            continue

        filename = image_path.stem + ".webp"

        thumb_path = THUMB_DIR / filename
        full_path = FULL_DIR / filename

        if thumb_path.exists() and full_path.exists():
            print(f"Skipping {image_path.name} - already optimized")
            continue

        optimize_image(image_path, thumb_path, 600, 75)
        optimize_image(image_path, full_path, 1800, 85)
        print(f"Thumbnail: {thumb_path} | Exists: {thumb_path.exists()}")
        print(f"Full: {full_path} | Exists: {full_path.exists()}")
        


        print(f"Processed: {image_path.name}")
    print("All images optimized!")

if __name__ == "__main__":
    process_images()