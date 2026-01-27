# Educational Content Templates

This directory contains modular HTML templates for educational learning guides. These templates are designed to be easily adapted for different math topics (fractions, addition, multiplication, division, etc.).

## Directory Structure

```
templates/educational-content/
├── README.md                           # This file
├── topic-introduction.html            # Introduction to the concept
├── history-carousel.html              # Historical context carousel
├── strategies-carousel.html           # Learning strategies carousel
├── misconceptions-carousel.html       # Common mistakes carousel
├── step-by-step-guide.html           # Step-by-step instructions
├── real-world-examples.html          # Practical applications
├── why-it-matters.html               # Importance and relevance
└── full-learning-guide-template.html # Complete guide template
```

## Usage

### For Fractions (Current Topic)
The main application uses these templates to generate the learning guide content dynamically.

### For Other Topics (e.g., Addition, Multiplication)
1. Copy the template files
2. Replace topic-specific content (e.g., "fractions" → "addition")
3. Update the visual aids (charts, illustrations) to match the topic
4. Customize the examples and strategies
5. Include the templates in your HTML file

## Template Variables

Templates use placeholder syntax that can be replaced:
- `{{TOPIC_NAME}}` - Name of the math topic (e.g., "Fractions", "Addition")
- `{{TOPIC_LOWERCASE}}` - Lowercase version (e.g., "fractions", "addition")
- `{{VISUAL_AIDS_ID}}` - ID for dynamic visual generation
- `{{EXAMPLES}}` - Topic-specific examples

## Generic Components

The following components are topic-agnostic and can be reused as-is:
- Carousel navigation (buttons, progress bar)
- Collapsible sections
- Strategy boxes
- Example boxes
- Visual charts framework

## Customization Points

When adapting for a new topic, focus on:
1. **Content**: Replace explanations and definitions
2. **Examples**: Use topic-appropriate examples
3. **Visuals**: Generate relevant diagrams/charts
4. **Strategies**: Adapt learning strategies
5. **Misconceptions**: Address topic-specific errors

## Integration

To integrate into a worksheet application:
1. Include the CSS files (carousel.css, educational-content.css)
2. Include the JS modules (carousel.js, educationalContent.js, educationalVisuals.js)
3. Insert the HTML templates in the appropriate section
4. Initialize the carousels and visual aids with topic-specific data
