# Interactive Fraction Comparison Worksheet

A modern, production-ready web application for practicing fraction comparison with multiple interactive input methods. Built with Material Design principles and optimized for both digital and print use.

![Material Design](https://img.shields.io/badge/Design-Material%20Design-6200EA)
![Responsive](https://img.shields.io/badge/Layout-Responsive-03DAC6)
![Print Ready](https://img.shields.io/badge/Print-A4%20Optimized-4CAF50)

## 🌟 Features

### Multiple Input Methods
- **Keyboard Input**: Type operators directly with keyboard shortcuts
  - `<`, `,`, or `l` for less than
  - `>`, `.`, or `g` for greater than
  - `=` or `-` for equal
- **Button Selection**: Click visual buttons to select operators
- **Drawing Recognition**: Draw symbols with mouse or touch
  - Advanced multi-stroke recognition algorithm
  - Supports various drawing styles
  - Real-time feedback
- **Voice Recognition**: Speak your answers using Web Speech API
  - Say "less than", "greater than", or "equal"
  - Works in Chrome and Edge browsers
  - Visual listening indicator

### Interactive Features
- ✅ Instant answer checking with color-coded feedback
- 📊 Live score display (correct/incorrect/unanswered)
- 👁️ Show answers functionality
- 🔄 Clear all answers to retry
- 🎲 Generate new random worksheets

### Customization Options
- **Problem Count**: 10, 20, 30, or 40 problems
- **Denominator Sets**:
  - 12 and 20 (default)
  - 10, 12, and 20
  - 6, 8, 10, and 12
  - All (2-12)

### Print & Export
- 🖨️ **Print Optimized**: Perfect A4 layout with 20 problems per page
- 📄 **PDF Export**: One-click PDF generation
- 📐 **Smart Layout**: No awkward page breaks mid-problem
- 🎯 **Clean Output**: Auto-hides interactive elements for printing

### Design
- 🎨 **Material Design**: Modern, professional interface
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🌈 **Color Coded**: Green for correct, red for incorrect answers
- ✨ **Smooth Animations**: Material motion principles

## 🚀 Quick Start

### Installation
No installation required! Simply open the HTML file in any modern web browser.

```bash
# Clone the repository
git clone https://github.com/nirav2000/Claudetrials.git

# Navigate to the directory
cd Claudetrials

# Open in browser
open fraction-worksheet.html
```

### Online Use
Open `fraction-worksheet.html` directly in your browser:
- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

### Offline Use
The application works completely offline after the initial load, except for:
- PDF generation (requires html2pdf.js from CDN)
- Material Design fonts (Google Fonts)

## 📖 Usage Guide

### For Students

1. **Select Input Method**: Choose how you want to answer (keyboard, buttons, drawing, or voice)
2. **Choose Settings**: Select number of problems and denominator options
3. **Generate Worksheet**: Click "Generate New Worksheet"
4. **Answer Problems**: Compare the fractions using your chosen input method
5. **Check Your Work**: Click "Check Answers" to see results
6. **Review**: Green = correct, Red = incorrect

### For Teachers

1. **Generate Worksheets**: Create custom worksheets with different difficulty levels
2. **Print/PDF**: Export clean worksheets for classroom use
3. **Digital Learning**: Students can practice interactively online
4. **Instant Feedback**: Students get immediate results

### Input Method Details

#### Keyboard
- Fast and efficient for quick answers
- Supports multiple key combinations
- Perfect for desktop users

#### Buttons
- Visual and intuitive
- Great for all age groups
- Touch-friendly on tablets

#### Drawing
- Engaging and interactive
- Supports multi-stroke symbols
- Works with mouse or touch
- Click "Done" to recognize the drawing

#### Voice
- Hands-free operation
- Accessibility feature
- Requires microphone permission
- Chrome/Edge only

## 🎨 Design System

### Material Design Components
- **Cards**: Elevated surfaces for content
- **Buttons**: Raised buttons with ripple effects
- **Text Fields**: Material text inputs with focus states
- **FAB**: Floating Action Button for voice input
- **Snackbar**: Toast notifications for voice status
- **Elevation**: Layered shadows (0-5 levels)

### Color Palette
```css
Primary:    #6200EA (Deep Purple)
Secondary:  #03DAC6 (Teal)
Success:    #4CAF50 (Green)
Error:      #B00020 (Red)
Warning:    #FF9800 (Orange)
Surface:    #FFFFFF (White)
Background: #FAFAFA (Light Gray)
```

### Typography
- **Font**: Roboto (Material Design standard)
- **Weights**: 300, 400, 500, 700
- **Scale**: Material Design type scale
  - Headline 4: 2.125rem (h1)
  - Headline 6: 1.25rem (h3)
  - Body 2: 0.875rem (paragraphs)

## 🖨️ Print Specifications

### A4 Optimization
- **Page Size**: 210mm × 297mm (A4 portrait)
- **Margins**: 10mm all around
- **Usable Area**: 190mm × 277mm
- **Layout**: 2 columns × 10 rows = 20 problems per page

### Print Styling
- Compact spacing (2mm padding, 3mm gaps)
- Optimized font sizes (10-11pt)
- Black borders for input areas
- No interactive elements
- Page break avoidance on problems

### PDF Export Settings
- Format: A4 portrait
- Quality: 98% JPEG
- Scale: 2x for sharp rendering
- Compression: Enabled
- Page breaks: Smart avoidance

## 🧮 Drawing Recognition Algorithm

### Technical Details
The drawing recognition system uses advanced pattern analysis:

1. **Multi-stroke Support**: Handles symbols drawn in multiple strokes
2. **Regional Analysis**: Divides canvas into left/center/right regions
3. **Horizontal Line Detection**: Identifies parallel lines for equals sign
4. **Directional Analysis**: Determines convergence for < and >
5. **Bounding Box Calculation**: Uses stroke dimensions for accuracy

### Recognition Process
```javascript
// Equals sign: Two horizontal strokes or wide single stroke
if (horizontalStrokes >= 2 || width > height * 1.5) {
    return '=';
}

// Less than: Points denser on right, spreading left
if (rightDensity > leftDensity * 1.3) {
    return '<';
}

// Greater than: Points denser on left, spreading right
if (leftDensity > rightDensity * 1.3) {
    return '>';
}
```

## 🗣️ Voice Recognition

### Browser Support
- ✅ Chrome (recommended)
- ✅ Edge
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

### Supported Phrases
- "less than" → <
- "greater than" → >
- "equal" / "equals" → =

### Error Handling
- No speech detected
- Microphone not found
- Permission denied
- Network errors
- Recognition failures

## 🔧 Technical Stack

### Core Technologies
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Material Design
- **JavaScript (ES6+)**: Interactive functionality
- **Canvas API**: Drawing recognition
- **Web Speech API**: Voice recognition

### External Dependencies
- **html2pdf.js**: PDF generation
- **Google Fonts**: Roboto font family
- **Material Icons**: Icon font (optional)

### Browser Requirements
- Modern browser with ES6 support
- Canvas API support
- Optional: SpeechRecognition API for voice input

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px (2-column grid)
- **Tablet**: ≤ 768px (1-column grid)
- **Mobile**: < 480px (optimized touch targets)

### Mobile Features
- Touch-enabled drawing canvas
- Large touch targets (48px minimum)
- Responsive grid layout
- Optimized button sizes
- Scrollable content areas

## 🧪 Testing

### Manual Testing Checklist
- [ ] All input methods work correctly
- [ ] Answer checking is accurate
- [ ] Print layout fits on A4 page
- [ ] PDF export generates correctly
- [ ] Voice recognition works (Chrome/Edge)
- [ ] Drawing recognition is accurate
- [ ] Responsive design works on mobile
- [ ] All buttons function properly
- [ ] Score calculation is correct
- [ ] Clear/Show answers work

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

## 🎓 Educational Use

### Grade Levels
- Elementary: Grades 3-5
- Middle School: Grades 6-8
- Special Education: All levels

### Learning Objectives
- Compare fractions with like denominators
- Compare fractions with unlike denominators
- Understand fraction equivalence
- Develop fraction sense

### Teaching Tips
- Start with same denominators (12 and 20)
- Progress to mixed denominators
- Use drawing mode for kinesthetic learners
- Use voice mode for accessibility
- Print blank worksheets for homework

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use Material Design principles
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure A4 print compatibility

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Nirav Patel**
- GitHub: [@nirav2000](https://github.com/nirav2000)

## 🙏 Acknowledgments

- Material Design by Google
- Web Speech API
- html2pdf.js library
- Canvas API for drawing recognition

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the author

## 🔮 Future Enhancements

- [ ] More fraction operations (addition, subtraction)
- [ ] Mixed numbers support
- [ ] Improper fractions
- [ ] Difficulty levels (easy, medium, hard)
- [ ] Progress tracking
- [ ] User accounts
- [ ] Worksheet history
- [ ] More drawing recognition improvements
- [ ] Offline PWA support
- [ ] Dark mode theme
- [ ] Multi-language support

## 📊 Version History

### v1.1.0 (Current)
- ✨ Material Design implementation
- 🖨️ Optimized print layout (20 problems on A4)
- 📄 Enhanced PDF export
- 🎨 Improved color scheme
- 📐 Compact spacing for print

### v1.0.0
- 🎉 Initial release
- ⌨️ Keyboard input
- 🖱️ Button selection
- ✏️ Drawing recognition
- 🗣️ Voice recognition
- 📊 Score tracking
- 🖨️ Print functionality

---

Made with ❤️ for educators and students everywhere.
