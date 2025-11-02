# TTK Game - UI Documentation

## Overview
This document describes the complete user interface implementation for the Tinh Không Đạo Lộ (TTK) post-apocalyptic evolution game.

## Design System

### Color Palette
- **Primary**: Cyan (#22d3ee) - Main accents, buttons, highlights
- **Secondary**: Green (#10b981) - Success states, positive actions
- **Accent**: Purple (#a855f7) - Evolution system, special features
- **Warning**: Yellow (#eab308) - Important actions, warnings
- **Danger**: Red (#ef4444) - Combat, errors, critical states
- **Background**: Black/Gray-900 - Main backgrounds
- **Text**: Gray-100 to Gray-500 - Various text levels

### Typography
- **Headings**: Bold, uppercase, tracking-wider
- **Body**: Standard weight, readable sizes (sm to base)
- **Monospace**: For stats, numbers, and code-like elements

### Component Patterns

#### Cards
- Gradient backgrounds: `from-gray-900/70 via-black/50 to-gray-900/70`
- Border: 1-2px with opacity (usually cyan or gray)
- Rounded corners: `rounded-lg` or `rounded-xl`
- Backdrop blur: `backdrop-blur-sm`
- Shadow: `shadow-lg` for elevation

#### Buttons
- Gradient backgrounds for primary actions
- Border with color matching
- Hover effects: scale and brightness changes
- Disabled states: reduced opacity
- Icons on the left, text on the right

#### Progress Bars
- Outer container: Gray background with border
- Inner fill: Gradient from primary to accent color
- Text overlay: Absolute positioned for stats
- Smooth transitions: `transition-all duration-300`

## Page Structure

### 1. Login/Register Page (`/`)
**Layout**: Centered modal on dark background with animated effects

**Features**:
- Email and password inputs with icons
- Toggle between login/register modes
- Loading states
- Error message display
- Animated gradient title

**Components Used**:
- `layouts/default.vue`
- `pages/index.vue`

### 2. Character Creation Page (`/create-character`)
**Layout**: Centered form with character preview

**Features**:
- Character name input (3-20 characters)
- Starting stats display
- Game feature preview
- Form validation
- Back and submit buttons

**Components Used**:
- `pages/create-character.vue`

### 3. Game Page (`/play`)
**Layout**: 3-panel layout with top navigation

**Structure**:
```
┌─────────────────────────────────────────┐
│  Top Navigation Bar (Quick Stats)       │
├──────────┬─────────────────┬────────────┤
│  Left    │     Center      │   Right    │
│  Panel   │     Panel       │   Panel    │
│ (Player) │   (Main View)   │   (Log)    │
└──────────┴─────────────────┴────────────┘
```

**Components Used**:
- `layouts/game.vue`
- `components/game/HeaderStatus.vue`
- `components/game/MainPanel.vue`
- `components/game/GameLog.vue`

## Component Library

### Navigation Components

#### Top Navigation Bar
- **Location**: `layouts/game.vue`
- **Features**: Logo, quick stats (HP/Energy/Crystals), settings, logout
- **Responsive**: Hides some stats on mobile

### Game Components

#### 1. HeaderStatus
- **Purpose**: Display character info and stats
- **Features**:
  - Avatar with upload functionality
  - Character name and level
  - HP, Energy, and Cultivation progress bars
  - Wounded status indicator
  - Current location

#### 2. MainPanel (Tabbed Interface)
- **Tabs**: 
  - Zone (Khu Vực)
  - Character (Nhân Vật)
  - Quests (Nhiệm Vụ)
- **Features**: Icon-enhanced tabs, smooth transitions

#### 3. ZoneTab Components

##### ZoneInfo
- Zone description
- Recommended level
- Monster density
- Resource rarity
- Weather effects
- Monster list with HP bars
- Attack buttons

##### NpcPanel
- NPC avatars
- Quest status badges (new/completable)
- Talk buttons
- Empty state when no NPCs

##### ActionMenu
- Movement buttons (to other zones)
- Resource gathering buttons
- Cultivation actions (when available)

#### 4. CharacterTab Components

##### Cultivation Section
- Current realm/stage
- Experience progress bar
- Comprehension and state of mind
- Breakthrough button (when ready)

##### Stat Allocation
- Available stat points
- Allocate buttons for each stat
- Icons for each stat type

##### Stats Display
- Attack, Defense, Speed
- Critical chance, Resistance, Dodge
- Reputation and Karma

##### Effects Display
- Active buffs/debuffs
- Duration remaining
- Effect icons

##### EvolutionPanel (NEW)
- Gene energy progress
- Gene integrity status
- Energy crystal count
- Absorption interface
- Module slots (3 types)
- Breakthrough button

##### InventoryPanel
- Grid layout of items
- Item icons with color coding
- Quantity display
- Resource summary
- Empty state

#### 5. QuestsTab
- Active quest list
- Quest type badges (Main/Side/Daily)
- Quest description
- Objective progress
- Turn-in buttons (when complete)
- Completion animations

#### 6. CombatPanel
- Player and monster stats
- HP bars with overlays
- Action buttons:
  - Attack (primary action)
  - Skills (disabled/coming soon)
  - Flee (escape option)
- Animated background

#### 7. GameLog
- Timestamped log entries
- Color-coded by type (error, success, info, etc.)
- Auto-scroll to bottom (with user override)
- Command input with autocomplete

### UI Utility Components

#### 1. LoadingScreen
- Full-screen overlay
- Animated logo
- Loading message
- Optional progress bar

#### 2. Toast
- Notification system
- 4 types: success, error, warning, info
- Auto-dismiss or manual close
- Positioned top-right

#### 3. Tooltip
- Hover tooltips
- 4 positions: top, bottom, left, right
- Animated appearance
- Arrow indicator

#### 4. Modal
- Base modal component
- Backdrop overlay
- Close on outside click
- Animated entrance/exit

#### 5. StatusBar
- Reusable progress bar
- Label and value display
- Icon support
- Color customization

#### 6. LoadingSpinner
- Animated spinner
- Size customizable
- Used in buttons and overlays

### Game Feature Components

#### 1. SettingsModal
- **Sections**:
  - Game settings (auto-gather, combat log, confirmations)
  - Display settings (dark mode, animations, FPS)
  - Audio settings (sound toggle, volume sliders)
  - Keyboard shortcuts reference

#### 2. SettingToggle
- Toggle switch component
- Label and description
- On/off states with animation

#### 3. ModuleSlot
- Equipment slot display
- 3 types: Cultivation, Combat, Survival
- Shows equipped module or empty state
- Click to equip/unequip

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Behaviors
- Navigation bar adapts (hides some elements on mobile)
- 3-panel layout stacks vertically on mobile
- Combat buttons stack on mobile
- Grid layouts adjust column count
- Text sizes scale appropriately

## Animations & Transitions

### Used Throughout
- `transition-all duration-200/300` - Smooth property changes
- `hover:scale-105` - Button hover effect
- `animate-pulse` - Important indicators
- `animate-spin` - Loading states
- Fade in/out for modals and toasts
- Slide in/out for panels

### Custom Animations
- Soft pulse for titles
- Gradient animations for backgrounds
- HP bar fill animations
- Quest completion celebrations (TODO)

## Accessibility

### Current Implementation
- Semantic HTML elements
- Button states (disabled, loading)
- Form labels and placeholders
- Keyboard navigation support
- Color contrast ratios

### TODO
- ARIA labels for complex components
- Screen reader announcements
- Keyboard shortcuts documentation
- Focus indicators enhancement

## Color Coding System

### Item Types
- **Modules**: Purple
- **Gene Solutions**: Green
- **Skill Books**: Yellow
- **Resources**: Cyan
- **Common Items**: Gray

### Quest Types
- **Main Quest**: Yellow
- **Side Quest**: Blue
- **Daily Quest**: Green

### NPC Status
- **Quest Available**: Yellow badge
- **Quest Completable**: Green badge (pulsing)
- **No Quest**: Gray text

### Monster Tiers
- **Beast Soldier**: Red-orange
- **Beast General**: Red-orange (higher)
- **Beast King**: Red (boss)

## Performance Considerations

### Optimizations
- Lazy loading for tabs
- Virtual scrolling for long lists (TODO)
- Debounced command input
- Memoized computed properties
- CSS transforms for animations (GPU accelerated)

### Best Practices
- Minimal DOM manipulation
- Use of v-show vs v-if appropriately
- Event delegation where possible
- Image optimization
- Code splitting by route

## Browser Support

### Tested On
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

### Known Issues
- Icon loading blocked by some ad blockers
- WebP images may need fallbacks
- CSS Grid support required

## Future Enhancements

### Planned Features
1. Particle effects for combat
2. Sound effect integration
3. Achievement notifications
4. Leaderboard UI
5. Guild/clan interface
6. Trading/marketplace UI
7. Tutorial overlays
8. Mini-map display
9. Character customization
10. Item preview tooltips

### UI Improvements
1. Mobile app-like experience
2. Gesture support on touch devices
3. Dark/light theme toggle
4. Customizable UI layouts
5. More animation polish
6. Accessibility audit
7. Performance profiling
8. Cross-browser testing

## Contributing

When adding new UI components:
1. Follow the established design patterns
2. Use the color palette consistently
3. Include responsive breakpoints
4. Add loading and error states
5. Implement hover and focus states
6. Test on multiple screen sizes
7. Document in this file

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Nuxt UI**: https://ui.nuxt.com/
- **Lucide Icons**: https://lucide.dev/
- **Vue 3**: https://vuejs.org/

---

Last Updated: 2025-01-15
Version: 1.0.0
