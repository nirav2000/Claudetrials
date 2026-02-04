import React, { useState, useEffect } from 'react';
import {
  Download, Sun, Moon, Palette, Type, Layout, Settings,
  Copy, Check, ChevronDown, Menu, X
} from 'lucide-react';

const DEFAULT_CONFIG = {
  colors: {
    primary: { 400: '#3B85FF', 600: '#0066BB' },
    accent: { 400: '#8533FF', 600: '#6600CC' },
    surface: { bg: '#0A0A0A', main: '#141414' },
    text: { primary: '#FFFFFF', secondary: '#A0A0A0', muted: '#666666' }
  },
  typography: {
    fontFamily: { sans: 'Inter, system-ui, sans-serif', serif: 'Georgia, serif', mono: 'Monaco, monospace' },
    baseFontFamily: 'sans',
    weights: { thin: 100, extraLight: 200, light: 300, normal: 400, medium: 500, semibold: 600, bold: 700 }
  },
  ui: {
    borderRadius: { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
    activeBorderRadius: 'md',
    spacing: 1,
    shadowIntensity: 'medium'
  },
  theme: 'dark',
  brandName: 'Claude UI',
  brandDescription: 'A professional dark design system with blue and purple accents'
};

function App() {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('ui-design-system');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    localStorage.setItem('ui-design-system', JSON.stringify(config));

    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-400', config.colors.primary[400]);
    root.style.setProperty('--primary-600', config.colors.primary[600]);
    root.style.setProperty('--accent-400', config.colors.accent[400]);
    root.style.setProperty('--accent-600', config.colors.accent[600]);
    root.style.setProperty('--surface-bg', config.colors.surface.bg);
    root.style.setProperty('--surface', config.colors.surface.main);
    root.style.setProperty('--text-primary', config.colors.text.primary);
    root.style.setProperty('--text-secondary', config.colors.text.secondary);
    root.style.setProperty('--text-muted', config.colors.text.muted);
  }, [config]);

  const updateConfig = (path, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const getShadow = () => {
    const shadows = {
      none: 'none',
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
    };
    return shadows[config.ui.shadowIntensity] || shadows.medium;
  };

  const exportToMarkdown = () => {
    const md = `# ${config.brandName} Design System

${config.brandDescription}

## Color Palette

### Primary Colors
- **Primary 400**: \`${config.colors.primary[400]}\` - Main brand color, used for primary actions
- **Primary 600**: \`${config.colors.primary[600]}\` - Darker shade for hover states

### Accent Colors
- **Accent 400**: \`${config.colors.accent[400]}\` - Secondary accent, used for highlights
- **Accent 600**: \`${config.colors.accent[600]}\` - Darker accent for emphasis

### Surface Colors
- **Background**: \`${config.colors.surface.bg}\` - Main background color
- **Surface**: \`${config.colors.surface.main}\` - Card and component backgrounds

### Text Colors
- **Primary Text**: \`${config.colors.text.primary}\` - Main text color
- **Secondary Text**: \`${config.colors.text.secondary}\` - Subdued text
- **Muted Text**: \`${config.colors.text.muted}\` - Placeholder and disabled text

## Typography

### Font Families
- **Sans-serif**: ${config.typography.fontFamily.sans}
- **Serif**: ${config.typography.fontFamily.serif}
- **Monospace**: ${config.typography.fontFamily.mono}

### Active Font Family
${config.typography.baseFontFamily}

### Font Weights
${Object.entries(config.typography.weights).map(([name, weight]) => `- **${name}**: ${weight}`).join('\n')}

## UI Configuration

### Border Radius
Active style: **${config.ui.activeBorderRadius}** (${config.ui.borderRadius[config.ui.activeBorderRadius]})

Available radii:
${Object.entries(config.ui.borderRadius).map(([name, value]) => `- ${name}: ${value}`).join('\n')}

### Spacing Scale
Base spacing: **${config.ui.spacing}rem**

### Shadow Intensity
**${config.ui.shadowIntensity}**

## Component Guidelines

### Buttons
- **Primary**: Use primary-400 background with white text
- **Secondary**: Use surface background with border
- **Outline**: Transparent background with colored border
- **Ghost**: Transparent with hover state

### Form Elements
- Input fields: surface background with border on focus
- Dropdowns: Match input styling with chevron icon
- Checkboxes/Radio: Use accent color for active state
- Toggles: accent-400 for active, gray for inactive

### Cards
- Background: surface color
- Border: Subtle border using muted text color at 20% opacity
- Shadow: Based on shadow intensity setting
- Padding: Based on spacing scale

### Tables
- Header: Slightly lighter surface background
- Rows: Hover state with subtle background change
- Borders: Minimal, using muted colors
- Text: Primary for main content, secondary for metadata

## CSS Variables

\`\`\`css
:root {
  --primary-400: ${config.colors.primary[400]};
  --primary-600: ${config.colors.primary[600]};
  --accent-400: ${config.colors.accent[400]};
  --accent-600: ${config.colors.accent[600]};
  --surface-bg: ${config.colors.surface.bg};
  --surface: ${config.colors.surface.main};
  --text-primary: ${config.colors.text.primary};
  --text-secondary: ${config.colors.text.secondary};
  --text-muted: ${config.colors.text.muted};
  --border-radius: ${config.ui.borderRadius[config.ui.activeBorderRadius]};
  --spacing: ${config.ui.spacing}rem;
}
\`\`\`

## Tailwind Configuration

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          400: '${config.colors.primary[400]}',
          600: '${config.colors.primary[600]}',
        },
        accent: {
          400: '${config.colors.accent[400]}',
          600: '${config.colors.accent[600]}',
        },
        surface: {
          bg: '${config.colors.surface.bg}',
          main: '${config.colors.surface.main}',
        },
        text: {
          primary: '${config.colors.text.primary}',
          secondary: '${config.colors.text.secondary}',
          muted: '${config.colors.text.muted}',
        }
      },
      fontFamily: {
        sans: [${config.typography.fontFamily.sans.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        serif: [${config.typography.fontFamily.serif.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        mono: [${config.typography.fontFamily.mono.split(',').map(f => `'${f.trim()}'`).join(', ')}],
      },
      borderRadius: {
        'design': '${config.ui.borderRadius[config.ui.activeBorderRadius]}',
      },
      spacing: {
        'design': '${config.ui.spacing}rem',
      }
    }
  }
}
\`\`\`

## Design Vibe

${config.brandDescription}

**Theme**: ${config.theme === 'dark' ? 'Dark mode optimized' : 'Light mode optimized'}
**Visual Style**: ${config.ui.activeBorderRadius === 'none' || config.ui.activeBorderRadius === 'sm' ? 'Sharp, modern' : 'Rounded, friendly'}
**Typography Weight**: ${config.typography.weights.normal <= 300 ? 'Thin and elegant' : 'Bold and impactful'}

---

*Generated by UI Design System Generator*
*Session: ${new Date().toISOString()}*
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
      <label className="text-sm" style={{ color: config.colors.text.secondary }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
          style={{ borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius] }}
        />
        <span className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
          {value}
        </span>
      </div>
    </div>
  );

  const fontFamilies = [
    { value: 'sans', label: 'Sans-serif', family: config.typography.fontFamily.sans },
    { value: 'serif', label: 'Serif', family: config.typography.fontFamily.serif },
    { value: 'mono', label: 'Monospace', family: config.typography.fontFamily.mono }
  ];

  const borderRadiusOptions = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
  const shadowOptions = ['none', 'small', 'medium', 'large'];

  return (
    <div
      className={`min-h-screen ${config.theme === 'dark' ? 'dark' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${config.colors.primary[600]}22 0%, ${config.colors.accent[600]}22 100%)`,
        backgroundColor: config.colors.surface.bg,
        color: config.colors.text.primary,
        fontFamily: fontFamilies.find(f => f.value === config.typography.baseFontFamily)?.family || config.typography.fontFamily.sans
      }}
    >
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4" style={{ backgroundColor: config.colors.surface.main }}>
        <h1 className="text-xl font-bold">{config.brandName}</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
          style={{ color: config.colors.text.primary }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed lg:sticky top-0 left-0 h-screen w-80 overflow-y-auto z-50
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            backgroundColor: config.colors.surface.main,
            borderRight: `1px solid ${config.colors.text.muted}33`
          }}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{config.brandName}</h2>
              <p className="text-sm" style={{ color: config.colors.text.secondary }}>
                Design System Editor
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { id: 'colors', icon: Palette, label: 'Colors' },
                { id: 'typography', icon: Type, label: 'Typography' },
                { id: 'ui', icon: Layout, label: 'UI' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeTab === tab.id ? config.colors.primary[400] : 'transparent',
                    color: activeTab === tab.id ? '#fff' : config.colors.text.secondary,
                    borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Primary Blues
                  </h3>
                  <ColorPicker
                    label="Blue 400"
                    value={config.colors.primary[400]}
                    onChange={(v) => updateConfig('colors.primary.400', v)}
                  />
                  <ColorPicker
                    label="Blue 600"
                    value={config.colors.primary[600]}
                    onChange={(v) => updateConfig('colors.primary.600', v)}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Accent Purples
                  </h3>
                  <ColorPicker
                    label="Purple 400"
                    value={config.colors.accent[400]}
                    onChange={(v) => updateConfig('colors.accent.400', v)}
                  />
                  <ColorPicker
                    label="Purple 600"
                    value={config.colors.accent[600]}
                    onChange={(v) => updateConfig('colors.accent.600', v)}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Surface Colors
                  </h3>
                  <ColorPicker
                    label="Background"
                    value={config.colors.surface.bg}
                    onChange={(v) => updateConfig('colors.surface.bg', v)}
                  />
                  <ColorPicker
                    label="Surface"
                    value={config.colors.surface.main}
                    onChange={(v) => updateConfig('colors.surface.main', v)}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Text Colors
                  </h3>
                  <ColorPicker
                    label="Primary"
                    value={config.colors.text.primary}
                    onChange={(v) => updateConfig('colors.text.primary', v)}
                  />
                  <ColorPicker
                    label="Secondary"
                    value={config.colors.text.secondary}
                    onChange={(v) => updateConfig('colors.text.secondary', v)}
                  />
                  <ColorPicker
                    label="Muted"
                    value={config.colors.text.muted}
                    onChange={(v) => updateConfig('colors.text.muted', v)}
                  />
                </div>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Base Font Family
                  </h3>
                  <select
                    value={config.typography.baseFontFamily}
                    onChange={(e) => updateConfig('typography.baseFontFamily', e.target.value)}
                    className="w-full p-2 rounded"
                    style={{
                      backgroundColor: config.colors.surface.bg,
                      color: config.colors.text.primary,
                      border: `1px solid ${config.colors.text.muted}33`,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                    }}
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Font Weights
                  </h3>
                  {Object.entries(config.typography.weights).map(([name, weight]) => (
                    <div key={name} className="flex items-center justify-between p-2">
                      <label className="text-sm capitalize" style={{ color: config.colors.text.secondary }}>
                        {name}
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="900"
                        step="100"
                        value={weight}
                        onChange={(e) => updateConfig(`typography.weights.${name}`, parseInt(e.target.value))}
                        className="w-20 p-1 text-center rounded"
                        style={{
                          backgroundColor: config.colors.surface.bg,
                          color: config.colors.text.primary,
                          border: `1px solid ${config.colors.text.muted}33`,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UI Tab */}
            {activeTab === 'ui' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Border Radius
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {borderRadiusOptions.map(radius => (
                      <button
                        key={radius}
                        onClick={() => updateConfig('ui.activeBorderRadius', radius)}
                        className="p-3 text-xs font-medium transition-all"
                        style={{
                          backgroundColor: config.ui.activeBorderRadius === radius ? config.colors.primary[400] : config.colors.surface.bg,
                          color: config.ui.activeBorderRadius === radius ? '#fff' : config.colors.text.secondary,
                          borderRadius: config.ui.borderRadius[radius],
                          border: `1px solid ${config.colors.text.muted}33`
                        }}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Spacing Scale
                  </h3>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={config.ui.spacing}
                    onChange={(e) => updateConfig('ui.spacing', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: config.colors.text.muted }}>
                    <span>0.5rem</span>
                    <span>{config.ui.spacing}rem</span>
                    <span>2rem</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Shadow Intensity
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shadowOptions.map(shadow => (
                      <button
                        key={shadow}
                        onClick={() => updateConfig('ui.shadowIntensity', shadow)}
                        className="p-3 text-xs font-medium capitalize transition-all"
                        style={{
                          backgroundColor: config.ui.shadowIntensity === shadow ? config.colors.primary[400] : config.colors.surface.bg,
                          color: config.ui.shadowIntensity === shadow ? '#fff' : config.colors.text.secondary,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                          border: `1px solid ${config.colors.text.muted}33`,
                          boxShadow: shadow !== 'none' ? getShadow() : 'none'
                        }}
                      >
                        {shadow}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Brand Settings
                  </h3>
                  <input
                    type="text"
                    placeholder="Brand Name"
                    value={config.brandName}
                    onChange={(e) => updateConfig('brandName', e.target.value)}
                    className="w-full p-2 mb-3 rounded"
                    style={{
                      backgroundColor: config.colors.surface.bg,
                      color: config.colors.text.primary,
                      border: `1px solid ${config.colors.text.muted}33`,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                    }}
                  />
                  <textarea
                    placeholder="Brand Description"
                    value={config.brandDescription}
                    onChange={(e) => updateConfig('brandDescription', e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded resize-none"
                    style={{
                      backgroundColor: config.colors.surface.bg,
                      color: config.colors.text.primary,
                      border: `1px solid ${config.colors.text.muted}33`,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: config.colors.text.primary }}>
                    Theme
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateConfig('theme', 'dark')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded transition-all"
                      style={{
                        backgroundColor: config.theme === 'dark' ? config.colors.primary[400] : config.colors.surface.bg,
                        color: config.theme === 'dark' ? '#fff' : config.colors.text.secondary,
                        borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                      }}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                    <button
                      onClick={() => updateConfig('theme', 'light')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 rounded transition-all"
                      style={{
                        backgroundColor: config.theme === 'light' ? config.colors.primary[400] : config.colors.surface.bg,
                        color: config.theme === 'light' ? '#fff' : config.colors.text.secondary,
                        borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                      }}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      if (confirm('Reset to default configuration?')) {
                        setConfig(DEFAULT_CONFIG);
                      }
                    }}
                    className="w-full p-3 rounded text-sm font-medium transition-all"
                    style={{
                      backgroundColor: config.colors.surface.bg,
                      color: config.colors.text.secondary,
                      border: `1px solid ${config.colors.text.muted}33`,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                    }}
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${config.colors.text.muted}33` }}>
              <button
                onClick={exportToMarkdown}
                className="w-full flex items-center justify-center gap-2 p-3 rounded font-medium transition-all"
                style={{
                  backgroundColor: config.colors.accent[400],
                  color: '#fff',
                  borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                  boxShadow: getShadow()
                }}
              >
                {copied ? <Check size={20} /> : <Download size={20} />}
                {copied ? 'Copied to Clipboard!' : 'Export for Claude'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="mb-12">
              <h1
                className="text-5xl mb-3"
                style={{ fontWeight: config.typography.weights.thin }}
              >
                {config.brandName}
              </h1>
              <p style={{ color: config.colors.text.secondary, fontWeight: config.typography.weights.light }}>
                {config.brandDescription}
              </p>
            </div>

            {/* Colors Section */}
            <section className="mb-12">
              <h2
                className="text-2xl mb-6"
                style={{ fontWeight: config.typography.weights.extraLight }}
              >
                Colors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-sm mb-4" style={{ color: config.colors.text.secondary }}>
                    Primary Blues
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.primary[400],
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Blue 400</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.primary[400]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.primary[600],
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Blue 600</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.primary[600]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm mb-4" style={{ color: config.colors.text.secondary }}>
                    Accent Purples
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.accent[400],
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Purple 400</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.accent[400]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.accent[600],
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Purple 600</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.accent[600]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm mb-4" style={{ color: config.colors.text.secondary }}>
                    Surface Colors
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.surface.bg,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                          border: `1px solid ${config.colors.text.muted}33`
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Background</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.surface.bg}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-16 h-16"
                        style={{
                          backgroundColor: config.colors.surface.main,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium">Surface</div>
                        <div className="text-xs font-mono" style={{ color: config.colors.text.muted }}>
                          {config.colors.surface.main}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Typography Section */}
            <section className="mb-12">
              <h2
                className="text-2xl mb-6"
                style={{ fontWeight: config.typography.weights.extraLight }}
              >
                Typography
              </h2>
              <div className="space-y-6">
                <div>
                  <div
                    className="text-6xl mb-2"
                    style={{ fontWeight: config.typography.weights.thin }}
                  >
                    Thin Display Text
                  </div>
                  <div className="text-xs" style={{ color: config.colors.text.muted }}>
                    6xl / Thin ({config.typography.weights.thin})
                  </div>
                </div>
                <div>
                  <div
                    className="text-4xl mb-2"
                    style={{ fontWeight: config.typography.weights.extraLight }}
                  >
                    Extra Light Heading
                  </div>
                  <div className="text-xs" style={{ color: config.colors.text.muted }}>
                    4xl / Extra Light ({config.typography.weights.extraLight})
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl mb-2"
                    style={{ fontWeight: config.typography.weights.light }}
                  >
                    Light Title
                  </div>
                  <div className="text-xs" style={{ color: config.colors.text.muted }}>
                    2xl / Light ({config.typography.weights.light})
                  </div>
                </div>
                <div>
                  <div
                    className="text-base mb-2"
                    style={{ fontWeight: config.typography.weights.light }}
                  >
                    Body text in light weight for readability
                  </div>
                  <div className="text-xs" style={{ color: config.colors.text.muted }}>
                    lg / Light ({config.typography.weights.light})
                  </div>
                </div>
              </div>
            </section>

            {/* Components Section */}
            <section className="mb-12">
              <h2
                className="text-2xl mb-6"
                style={{ fontWeight: config.typography.weights.extraLight }}
              >
                Components
              </h2>

              {/* Buttons */}
              <div className="mb-8">
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-6 py-3 font-medium transition-all"
                    style={{
                      backgroundColor: config.colors.primary[400],
                      color: '#fff',
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                      fontWeight: config.typography.weights.medium
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-6 py-3 font-medium transition-all"
                    style={{
                      backgroundColor: config.colors.surface.main,
                      color: config.colors.text.primary,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                      fontWeight: config.typography.weights.medium
                    }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="px-6 py-3 font-medium transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: config.colors.text.primary,
                      border: `1px solid ${config.colors.text.muted}66`,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                      fontWeight: config.typography.weights.medium
                    }}
                  >
                    Outline Button
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="mb-8">
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Cards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    className="p-6"
                    style={{
                      backgroundColor: config.colors.surface.main,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                      border: `1px solid ${config.colors.text.muted}33`
                    }}
                  >
                    <h4 className="text-lg font-semibold mb-2">Standard Card</h4>
                    <p className="text-sm" style={{ color: config.colors.text.secondary }}>
                      This is a standard card component with subtle borders and surface coloring.
                    </p>
                  </div>
                  <div
                    className="p-6"
                    style={{
                      backgroundColor: config.colors.surface.main,
                      borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                      boxShadow: getShadow()
                    }}
                  >
                    <h4 className="text-lg font-semibold mb-2">Elevated Card</h4>
                    <p className="text-sm" style={{ color: config.colors.text.secondary }}>
                      This card has elevation with shadow for more visual hierarchy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Elements */}
              <div className="mb-8">
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Form Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm mb-3" style={{ color: config.colors.text.secondary }}>
                      Text Inputs
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-4 py-2"
                        style={{
                          backgroundColor: config.colors.surface.bg,
                          color: config.colors.text.primary,
                          border: `1px solid ${config.colors.text.muted}33`,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2"
                        style={{
                          backgroundColor: config.colors.surface.bg,
                          color: config.colors.text.primary,
                          border: `1px solid ${config.colors.text.muted}33`,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full px-4 py-2"
                        style={{
                          backgroundColor: config.colors.surface.bg,
                          color: config.colors.text.primary,
                          border: `1px solid ${config.colors.text.muted}33`,
                          borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm mb-3" style={{ color: config.colors.text.secondary }}>
                      Dropdowns
                    </h4>
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 appearance-none"
                          style={{
                            backgroundColor: config.colors.surface.bg,
                            color: config.colors.text.primary,
                            border: `1px solid ${config.colors.text.muted}33`,
                            borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                          }}
                        >
                          <option>Select an option</option>
                          <option>Option 1</option>
                          <option>Option 2</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          size={16}
                          style={{ color: config.colors.text.muted }}
                        />
                      </div>
                      <div className="relative">
                        <select
                          disabled
                          className="w-full px-4 py-2 appearance-none opacity-50"
                          style={{
                            backgroundColor: config.colors.surface.bg,
                            color: config.colors.text.primary,
                            border: `1px solid ${config.colors.text.muted}33`,
                            borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius]
                          }}
                        >
                          <option>Disabled dropdown</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50"
                          size={16}
                          style={{ color: config.colors.text.muted }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm mb-3" style={{ color: config.colors.text.secondary }}>
                      Checkboxes & Radio Buttons
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">Option 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <span className="text-sm">Option 2</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="radio" className="w-4 h-4" />
                        <span className="text-sm">Radio 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="radio" className="w-4 h-4" defaultChecked />
                        <span className="text-sm">Radio 2</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm mb-3" style={{ color: config.colors.text.secondary }}>
                      Toggle Switches
                    </h4>
                    <div className="space-y-3">
                      {[true, false].map((checked, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer">
                          <div
                            className="relative w-12 h-6 transition-colors"
                            style={{
                              backgroundColor: checked ? config.colors.accent[400] : config.colors.text.muted + '66',
                              borderRadius: config.ui.borderRadius.full
                            }}
                          >
                            <div
                              className="absolute top-1 w-4 h-4 bg-white transition-transform"
                              style={{
                                left: checked ? '26px' : '4px',
                                borderRadius: config.ui.borderRadius.full
                              }}
                            />
                          </div>
                          <span className="text-sm">Toggle {i + 1}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Utility Classes Section */}
            <section className="mb-12">
              <h2
                className="text-2xl mb-6"
                style={{ fontWeight: config.typography.weights.extraLight }}
              >
                Utility Classes
              </h2>

              <div className="mb-8">
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Border Radius
                </h3>
                <div className="flex flex-wrap gap-4">
                  {borderRadiusOptions.map(radius => (
                    <div
                      key={radius}
                      className="w-16 h-16"
                      style={{
                        backgroundColor: config.colors.primary[400],
                        borderRadius: config.ui.borderRadius[radius]
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Text Colors
                </h3>
                <div className="space-y-2">
                  <div style={{ color: config.colors.text.primary }}>Primary Text</div>
                  <div style={{ color: config.colors.text.secondary }}>Secondary Text</div>
                  <div style={{ color: config.colors.text.muted }}>Muted Text</div>
                  <div style={{ color: config.colors.primary[400] }}>Blue Accent</div>
                  <div style={{ color: config.colors.accent[400] }}>Purple Accent</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-4" style={{ fontWeight: config.typography.weights.light }}>
                  Shadows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['small', 'medium', 'large'].map(shadow => (
                    <div
                      key={shadow}
                      className="p-6 capitalize"
                      style={{
                        backgroundColor: config.colors.surface.main,
                        borderRadius: config.ui.borderRadius[config.ui.activeBorderRadius],
                        boxShadow: shadow === 'small'
                          ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
                          : shadow === 'medium'
                          ? '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
                          : '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      {shadow}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tables Section */}
            <section className="mb-12">
              <h2
                className="text-2xl mb-6"
                style={{ fontWeight: config.typography.weights.extraLight }}
              >
                Tables
              </h2>

              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: config.colors.surface.main,
                  border: `1px solid ${config.colors.text.muted}33`
                }}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-sm mb-4" style={{ color: config.colors.text.secondary }}>
                    Manage your team members and their permissions
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: config.colors.surface.bg }}>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: config.colors.text.muted }}>
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: config.colors.text.muted }}>
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: config.colors.text.muted }}>
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: config.colors.text.muted }}>
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase" style={{ color: config.colors.text.muted }}>
                          Last Active
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Administrator', status: 'Active', lastActive: '2 hours ago' },
                        { name: 'Michael Chen', email: 'm.chen@company.com', role: 'Developer', status: 'Active', lastActive: '5 minutes ago' },
                        { name: 'Emily Davis', email: 'emily.d@company.com', role: 'Designer', status: 'Inactive', lastActive: '3 days ago' },
                        { name: 'James Wilson', email: 'j.wilson@company.com', role: 'Developer', status: 'Active', lastActive: '1 hour ago' }
                      ].map((user, i) => (
                        <tr
                          key={i}
                          style={{
                            borderTop: `1px solid ${config.colors.text.muted}22`
                          }}
                        >
                          <td className="px-6 py-4">
                            <div style={{ color: config.colors.text.primary }}>{user.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div style={{ color: config.colors.text.secondary }}>{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: config.colors.accent[400],
                                color: '#fff',
                                borderRadius: config.ui.borderRadius.full
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: user.status === 'Active' ? config.colors.primary[400] : config.colors.text.muted + '66',
                                color: '#fff',
                                borderRadius: config.ui.borderRadius.full
                              }}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div style={{ color: config.colors.text.secondary }}>{user.lastActive}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
