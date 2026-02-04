# Usage Examples

This guide shows you how to use the UI Design System Generator in real-world scenarios.

## Scenario 1: Creating a SaaS Dashboard Design System

### Step 1: Open the application
```bash
npm run dev
```

### Step 2: Customize your colors
Navigate to the **Colors** tab and set:
- **Primary 400**: `#3B85FF` (Professional blue)
- **Primary 600**: `#0066BB` (Darker blue)
- **Accent 400**: `#8533FF` (Vibrant purple)
- **Accent 600**: `#6600CC` (Deep purple)

### Step 3: Set typography
Go to the **Typography** tab:
- Base Font Family: **Sans-serif**
- Keep weights light for modern appearance

### Step 4: Configure UI elements
In the **UI** tab:
- Border Radius: **md** (0.5rem) for balanced look
- Shadow Intensity: **medium** for subtle depth
- Spacing: **1rem** for comfortable spacing

### Step 5: Brand settings
Update in the **Settings** tab:
- Brand Name: "Dashboard Pro"
- Description: "A professional SaaS dashboard with modern aesthetics"
- Theme: **Dark**

### Step 6: Export
Click **"Export for Claude"** and use the specification to build your dashboard.

## Scenario 2: Building a Marketing Website

### Configuration
```
Colors:
- Primary: Bright, energetic colors (#FF6B6B, #4ECDC4)
- Accent: Complementary bold colors
- Surface: Light background for better readability

Typography:
- Base Font Family: Sans-serif
- Weights: Medium to Bold for impact

UI:
- Border Radius: xl (1rem) for friendly, rounded look
- Shadow: large for dramatic effect
- Spacing: 1.5rem for breathing room

Theme: Light mode
```

## Scenario 3: Fintech Application

### Configuration
```
Colors:
- Primary: Trust-building blues (#0052CC, #0747A6)
- Accent: Professional greens for success states
- Surface: Clean, minimal backgrounds

Typography:
- Base Font Family: Sans-serif
- Weights: Regular to Semibold for readability

UI:
- Border Radius: sm (0.25rem) for sharp, precise look
- Shadow: small for subtle refinement
- Spacing: 0.75rem for information density

Theme: Light with dark mode option
```

## Scenario 4: Creative Portfolio

### Configuration
```
Colors:
- Primary: Artistic purples and magentas
- Accent: Contrasting yellows or oranges
- Surface: Dark dramatic backgrounds

Typography:
- Base Font Family: Serif for elegance
- Weights: Thin to Light for sophistication

UI:
- Border Radius: none or full for distinctive style
- Shadow: large for depth and dimension
- Spacing: 1.5rem for gallery-like presentation

Theme: Dark mode
```

## Exporting and Using with Claude

Once you've customized your design system:

1. Click the **"Export for Claude"** button
2. The Markdown specification is copied to your clipboard
3. Start a new chat with Claude:

```
I need you to build a [Your App Type] using this design system:

[Paste your exported Markdown here]

Please create:
- A landing page with hero section
- User dashboard
- Settings page
- Authentication flow

Follow the design system exactly for colors, typography, and components.
```

## Tips for Best Results

### Color Selection
- Use online tools like [Coolors.co](https://coolors.co) to generate harmonious palettes
- Ensure sufficient contrast between text and backgrounds (WCAG AA standard)
- Test both light and dark modes if your app will support theme switching

### Typography
- **Thin/ExtraLight (100-200)**: Modern, elegant, best for large headings
- **Light (300)**: Readable body text in dark themes
- **Regular (400)**: Standard body text
- **Medium/Semibold (500-600)**: Emphasis and UI elements
- **Bold (700)**: Strong headings and calls-to-action

### Border Radius
- **none/sm**: Sharp, modern, technical feel (fintech, dev tools)
- **md/lg**: Balanced, professional (business apps, dashboards)
- **xl/full**: Friendly, approachable (consumer apps, social)

### Shadows
- **none/small**: Flat, minimal design
- **medium**: Standard depth and hierarchy
- **large**: Dramatic, attention-grabbing

### Spacing
- **0.5-0.75rem**: Dense, information-heavy layouts
- **1rem**: Standard, balanced spacing
- **1.5-2rem**: Spacious, relaxed layouts

## Advanced Usage

### Customizing Font Families

Edit the font families in the Typography tab or directly in the code:

```javascript
fontFamily: {
  sans: 'Inter, system-ui, sans-serif',
  serif: 'Georgia, serif',
  mono: 'Monaco, monospace'
}
```

To use custom fonts:
1. Add font link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
```
2. Update the font family string in the editor

### Creating Multiple Design Systems

The app uses localStorage, so each browser/device maintains one design system. To manage multiple:

1. Export your current design system
2. Save the Markdown file
3. Create a new design system
4. Export and save separately

### Resetting to Defaults

Click **"Reset to Default"** in the Settings tab to return to the original configuration.

## Troubleshooting

### Colors not updating
- Try refreshing the page
- Check browser console for errors
- Clear localStorage: `localStorage.clear()` in browser console

### Export button not working
- Ensure clipboard permissions are granted
- Try using HTTPS instead of HTTP
- Use a modern browser (Chrome, Firefox, Safari)

### Preview not matching exported code
- The preview is a simulation; actual implementation may vary
- Use the exported Tailwind/CSS configuration for exact matches
- Test in your target framework

## Workflow Integration

### With Claude Code
```bash
# Start the generator
cd ui-template && npm run dev

# Customize your design
# Export the specification

# Start new project with Claude
claude code

# Paste the specification and request your app
```

### With Version Control
```bash
# Save your design system
git add .
git commit -m "Add design system for Project X"

# Export Markdown to project repo
# Use as design documentation
```

---

**Questions or Issues?** Refer to the main README.md or open an issue in the repository.
