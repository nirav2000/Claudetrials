# UI Design System Generator

A visual tool to create, customize, and export comprehensive design systems for consistent application development. Inspired by the "Style Guide" methodology, this generator allows you to design a complete UI template and export it as a specification for building apps with AI assistants like Claude.

![UI Design System Generator](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC) ![Vite](https://img.shields.io/badge/Vite-5.0.7-646CFF)

## Features

### 🎨 Visual Editor
- **Live Color Customization**: Adjust primary, accent, surface, and text colors with real-time preview
- **Typography Controls**: Choose font families, weights, and sizes
- **UI Presets**: Customize border radius, spacing scale, and shadow intensity
- **Theme Toggle**: Switch between dark and light modes

### 📋 Comprehensive Component Preview
- **Typography Samples**: H1-H6, body text, and captions with various weights
- **Buttons**: Primary, Secondary, Outline, and Ghost variants
- **Form Elements**: Text inputs, dropdowns, checkboxes, radio buttons, and toggle switches
- **Cards**: Standard and elevated card components
- **Tables**: Complex data table with status badges
- **Utility Classes**: Border radius, text colors, and shadow examples

### 📤 Export to Markdown
Generate a complete design specification including:
- Full color palette with hex codes
- Typography system documentation
- UI configuration details
- Tailwind CSS configuration
- CSS custom properties
- Component implementation guidelines
- Design vibe description

### 💾 Persistent Storage
All your design settings are automatically saved to localStorage, so your work is preserved across sessions.

## Getting Started

### Installation

```bash
# Navigate to the ui-template directory
cd ui-template

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### 1. Customize Your Design System

Use the sidebar editor to customize every aspect of your design system:

**Colors Tab:**
- Adjust Primary Blues (400, 600)
- Modify Accent Purples (400, 600)
- Set Surface colors (Background, Main surface)
- Define Text colors (Primary, Secondary, Muted)

**Typography Tab:**
- Select base font family (Sans, Serif, Mono)
- Customize font weights (Thin to Bold)

**UI Tab:**
- Choose border radius style (None to Full rounded)
- Adjust spacing scale (0.5rem to 2rem)
- Set shadow intensity (None to Large)

**Settings Tab:**
- Update brand name and description
- Toggle between Dark and Light themes
- Reset to default configuration

### 2. Preview Components

The main stage displays a live preview of all components using your current design settings. As you make changes in the sidebar, you'll see them reflected immediately across:
- Color swatches
- Typography samples
- All UI components
- Form elements
- Data tables

### 3. Export Your Design System

Click the "Export for Claude" button to copy a comprehensive Markdown specification to your clipboard. This specification includes:
- Complete color palette documentation
- Typography system details
- UI configuration
- Tailwind and CSS variable configurations
- Component implementation guidelines

### 4. Use With Claude (or other AI assistants)

Start a new conversation with Claude and say:

```
Use this Design System to build a [Your App Name]:

[Paste your exported Markdown here]
```

Claude will then build your application following your exact design specifications.

## Project Structure

```
ui-template/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main application component
│   └── index.css           # Global styles and Tailwind directives
└── README.md               # This file
```

## Default Configuration

The application starts with a professional dark design system featuring:
- **Primary Colors**: Blue (#3B85FF, #0066BB)
- **Accent Colors**: Purple (#8533FF, #6600CC)
- **Surface Colors**: Near-black backgrounds (#0A0A0A, #141414)
- **Typography**: Thin, elegant weights for modern aesthetic
- **UI Style**: Medium border radius with medium shadows

## Technologies Used

- **React 18.2**: Modern React with hooks for state management
- **Tailwind CSS 3.3**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vite 5**: Fast build tool and dev server
- **LocalStorage API**: Client-side persistence

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

This is a single-file React application designed for simplicity and ease of use. Feel free to extend it with additional features like:
- More component types (modals, tooltips, navigation bars)
- Animation presets
- Additional export formats (JSON, CSS files)
- Team collaboration features
- Preset design system templates

## License

MIT License - Feel free to use this tool for personal or commercial projects.

## Credits

Created as part of the UI Template Repository project.
Inspired by the "Developers Digest Style Guide" methodology.

---

**Need Help?** Open an issue in the repository or refer to the inline documentation in the code.
