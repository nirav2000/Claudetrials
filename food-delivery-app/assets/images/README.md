# Food Images Directory

This directory should contain the food images for K's Home Kitchen menu.

## Required Images

Please upload the following images to this directory:

1. **chef-k.jpg** - Chef K's professional photo (the headshot with glasses and suit)
2. **sesame-teriyaki-chicken.jpg** - The glazed chicken with vegetables on fried rice
3. **orange-sesame-chicken.jpg** - The crispy chicken with orange sauce plated dish
4. **crispy-tofu.jpg** - The fried tofu with sweet and sour sauce
5. **wok-fried-chicken.jpg** - The stir-fried chicken with peppers in the wok

## How to Upload Images on GitHub

### Option 1: Via Web Interface
1. Go to https://github.com/nirav2000/food-delivery-app
2. Navigate to `assets/images/`
3. Click "Add file" → "Upload files"
4. Drag and drop your images
5. Commit the changes

### Option 2: Via Git Command Line
```bash
cd food-delivery-app/assets/images/
# Copy your images here
git add *.jpg
git commit -m "Add food images for menu"
git push
```

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: Recommended 800x600px or larger
- **Aspect Ratio**: Images will be displayed at 300x250px, so use landscape orientation
- **File Size**: Keep under 500KB each for fast loading

## Fallback

If images are not uploaded, the app will display emoji placeholders (🍗, 🍊, 🥢, 🌶️, 👨‍🍳) automatically using the `onerror` attribute.
