# Patel's Home Kitchen - Food Delivery Web App

A beautiful, responsive food delivery web application built with pure HTML, CSS, and JavaScript. Features Chef K's authentic homemade Asian cuisine with an easy-to-use ordering system.

## Features

- **Beautiful UI/UX**: Modern gradient design with smooth animations
- **Menu Display**: 4 delicious Asian-inspired dishes with descriptions and pricing
- **Shopping Cart**: Add items with customizable quantities
- **Order Form**: Complete customer information and delivery details
- **Responsive Design**: Works perfectly on mobile and desktop devices
- **No Dependencies**: Pure HTML/CSS/JavaScript - no frameworks needed

## Menu Items

1. **Sesame Teriyaki Chicken** - $14.99
   - Tender glazed chicken with vegetables over fried rice

2. **Orange Sesame Chicken** - $15.99
   - Crispy chicken in sweet and tangy orange sauce

3. **Crispy Sweet & Sour Tofu** - $12.99
   - Golden fried tofu with homemade sauce (Vegetarian)

4. **Spicy Wok-Fried Chicken** - $16.99
   - Stir-fried chicken with peppers in savory-spicy sauce

## Getting Started

Simply open `index.html` in any modern web browser to start using the app.

```bash
# Clone the repository
git clone https://github.com/nirav2000/food-delivery-app.git

# Navigate to the directory
cd food-delivery-app

# Open in browser
open index.html  # macOS
# or
start index.html # Windows
# or
xdg-open index.html # Linux
```

## Usage

1. Browse the menu and select your desired dishes
2. Adjust quantities using the +/- buttons
3. Click "Add to Cart" for each item
4. Scroll down to review your order
5. Fill in delivery information
6. Click "Place Order" to submit

## Customization

### Adding Real Food Images

The app currently uses emoji placeholders. To add real images:

1. Save your food photos to the `assets/images/` directory
2. Update the image sources in `index.html`:

```html
<!-- Replace this -->
<div class="menu-item-image">🍗</div>

<!-- With this -->
<img src="assets/images/dish-name.jpg" alt="Dish Name" class="menu-item-image">
```

### Modifying Menu Items

Edit the menu items in the HTML within the `.menu-grid` section. Each item includes:
- `data-id`: Unique identifier
- `data-name`: Dish name
- `data-price`: Price value

### Styling

All styles are contained in the `<style>` section within the HTML file. Main color scheme:
- Primary: `#f5576c` (Pink/Red)
- Secondary: `#667eea` (Purple)
- Accent: `#764ba2` (Deep Purple)

## Technical Details

- **Framework**: None - Pure HTML5, CSS3, JavaScript ES6
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile**: Fully responsive with breakpoints at 768px
- **Storage**: Client-side cart management (can be extended with backend)

## Future Enhancements

- Backend integration for order processing
- Email/SMS notifications
- Payment gateway integration
- Order tracking system
- Admin dashboard for Chef K
- Customer accounts and order history
- Real-time inventory management

## License

© 2026 Patel's Home Kitchen. All rights reserved.

## Contact

For questions or support, please contact Chef K.

---

**Made with ❤️ by Chef K**
