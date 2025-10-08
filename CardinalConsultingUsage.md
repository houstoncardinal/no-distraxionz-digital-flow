# Cardinal Consulting Credit Component

## 🎯 **Incredible Circuit Animation Component**

This is a reusable React component with stunning circuit animations that showcase Cardinal Consulting's attention to detail and technical excellence.

## 📦 **Installation Requirements**

```bash
npm install framer-motion
# or
yarn add framer-motion
```

## 🚀 **Basic Usage**

```tsx
import CardinalConsultingCredit from './CardinalConsultingCredit';

// Basic usage
<CardinalConsultingCredit />

// With custom styling
<CardinalConsultingCredit 
  className="my-4"
  showDecorativeLines={true}
  textColor="text-gray-600"
  linkColor="text-gray-800"
  hoverColor="hover:text-blue-600"
/>
```

## 🎨 **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `""` | Additional CSS classes |
| `showDecorativeLines` | boolean | `true` | Show horizontal decorative lines |
| `textColor` | string | `"text-gray-500"` | Color for "Created by" text |
| `linkColor` | string | `"text-gray-700"` | Color for link text |
| `hoverColor` | string | `"hover:text-green-600"` | Hover color for link |

## 🎭 **Animation Features**

### ⚡ **Circuit Animations:**
- **Flowing Lines**: Circuit lines flow across top and bottom
- **Circuit Nodes**: Pulsing green dots at start and end
- **Continuous Loop**: Infinite 2.5-second cycles

### ✨ **Text Effects:**
- **"Cardinal"**: Animated gradient text with 4-second flow
- **"Consulting"**: Pulsing glow effect with 3-second cycles
- **Staggered Timing**: Complex overlapping patterns

### 🎯 **Interactive Features:**
- **Hover Scale**: 1.1x scale on hover
- **Glow Effect**: Green text shadow on hover
- **Tap Feedback**: Scale down on click
- **Smooth Transitions**: All animations use easing

## 📱 **Usage Examples**

### **Footer Usage:**
```tsx
<footer>
  {/* Your footer content */}
  <CardinalConsultingCredit />
</footer>
```

### **Custom Styling:**
```tsx
<CardinalConsultingCredit 
  className="bg-black text-white"
  textColor="text-gray-300"
  linkColor="text-white"
  hoverColor="hover:text-green-400"
/>
```

### **Minimal Version:**
```tsx
<CardinalConsultingCredit 
  showDecorativeLines={false}
  className="py-2"
/>
```

## 🎨 **Customization Options**

### **Color Themes:**
```tsx
// Green theme (default)
<CardinalConsultingCredit />

// Blue theme
<CardinalConsultingCredit 
  linkColor="text-blue-700"
  hoverColor="hover:text-blue-600"
/>

// Purple theme
<CardinalConsultingCredit 
  linkColor="text-purple-700"
  hoverColor="hover:text-purple-600"
/>
```

### **Size Variations:**
```tsx
// Compact
<CardinalConsultingCredit className="py-1 text-xs" />

// Standard
<CardinalConsultingCredit className="py-1.5 text-xs" />

// Large
<CardinalConsultingCredit className="py-2 text-sm" />
```

## 🔧 **Technical Details**

### **Dependencies:**
- React 16.8+ (hooks)
- Framer Motion 6.0+
- Tailwind CSS (for styling)

### **Performance:**
- Optimized animations with `transform` and `opacity`
- Hardware acceleration enabled
- Minimal re-renders with proper memoization

### **Accessibility:**
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus indicators

## 🎯 **Perfect For:**
- Portfolio websites
- Agency websites
- Professional services
- Tech companies
- Any site wanting to showcase attention to detail

## 💡 **Pro Tips:**
1. **Use sparingly**: This is a premium effect - don't overuse
2. **Test performance**: Monitor on lower-end devices
3. **Customize colors**: Match your brand colors
4. **Mobile friendly**: Test on mobile devices
5. **Accessibility**: Ensure proper contrast ratios

## 🚀 **Deployment Ready:**
This component is production-ready and can be used immediately on any React website. The animations are optimized for performance and will showcase Cardinal Consulting's technical excellence!
