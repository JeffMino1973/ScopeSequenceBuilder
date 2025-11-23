# Design Guidelines: NSW Life Skills Scope and Sequence Portal

## Design Approach
**System:** Material Design principles adapted for educational content density, prioritizing clarity, scannability, and professional functionality for teachers and curriculum planners.

## Typography
**Font Stack:** Inter (via Google Fonts CDN)
- **Headings:** 700 weight, sizes: 2xl (page titles), xl (section headers), lg (subsection headers)
- **Body Text:** 400-500 weight, base and sm sizes for content
- **Data/Tables:** 500-600 weight, sm and xs sizes for dense information display
- **Hierarchy:** Clear distinction between navigation (600), content headings (700), body (400), and metadata (500)

## Layout System
**Spacing Units:** Tailwind standard - consistently use p-4, p-6, p-8 for containers; gap-4, gap-6 for grids; mb-4, mb-6, mb-8 for vertical rhythm

**Container Strategy:**
- Max-width: 1200px for scope tables, 1400px for wizard interface
- Central alignment with generous horizontal padding (px-4 sm:px-8)
- Card-based sections with rounded-xl corners and subtle shadows

## Component Library

### Navigation & Hub
- **Subject Hub Grid:** 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- **Subject Cards:** White background, emoji icon (3xl size), subject name (lg semibold), hover state transitions to light blue (#CBDEFD) with subtle lift
- **Back Navigation:** Simple text link with arrow, navy background button

### Scope and Sequence Tables
- **Header Row:** Navy background (#002664), white text, sm font, medium weight, consistent py-4 padding
- **Week Columns:** 11-column grid (1 for term label, 10 for weeks)
- **Unit Cells:** White background, minimum height 80px, p-4 padding, left-aligned content, border-bottom separator (#e2e8f0)
- **Hover State:** Light blue background (#CBDEFD), smooth 0.2s transition, pointer cursor
- **Selected State (Wizard):** Navy background (#002664), white text throughout

### Stage/Component Filters
- **Button Group:** Horizontal flex layout with gap-2 (sm:gap-4)
- **Buttons:** Rounded-full (pill shape), medium blue (#146CFD) default, navy (#002664) active state, px-6 py-3, 500 weight
- **Active Indicator:** Darker navy with subtle inset shadow

### Unit Detail Panels
- **Container:** White rounded-xl card, shadow-lg, p-8, mt-8 spacing from table
- **Title/Subtitle:** 2xl/lg sizes, medium blue (#146CFD) color
- **Accordion Sections:** Border-top/bottom separators, py-4 spacing
- **Accordion Headers:** Flex justify-between, cursor pointer, lg semibold text, medium blue, chevron SVG (rotate on expand)
- **Content Areas:** mt-4 hidden by default, smooth expansion

### Wizard Interface
- **Selection Cards:** Border (1px #e2e8f0), rounded-lg, p-4, transition on hover/select
- **Card Metadata:** Source badge (sm, gray-600), description (sm, gray-500), outcomes (xs, red accent #D7153A)
- **Term Selector:** Dropdown within selected cards, white background on navy when selected
- **Build Button:** Large rounded-full, medium blue (#146CFD), px-8 py-3, bold weight, shadow-lg, centered placement

## Interaction Patterns
- **Click-to-Expand:** Accordion sections for outcomes and resources
- **Click-to-Select:** Unit cards toggle selection state in wizard
- **Filter Switching:** Stage/component buttons instantly update table display
- **Smooth Transitions:** 0.2-0.3s ease for all hover and state changes
- **No Animations:** Avoid distracting motion - focus on instant feedback

## Visual Hierarchy
1. **Primary:** Page title (3xl/4xl extrabold navy) centered with generous margin
2. **Secondary:** Section headings (2xl bold gray-800), filter buttons (medium blue pills)
3. **Tertiary:** Table headers (sm medium white on navy), card titles (lg semibold)
4. **Data:** Unit names (600 weight), descriptions (sm regular gray), outcomes (xs red accent)

## Color Application
- **Navy (#002664):** Table headers, active states, selected cards, primary headings
- **Medium Blue (#146CFD):** Primary action buttons, links, section headers, hover on navy
- **Red (#D7153A):** Outcomes labels, accent badges (minimal use)
- **Light Blue (#CBDEFD):** Hover states, focus indicators
- **Grays:** Backgrounds (#f7fafc body, #e2e8f0 borders), text (#718096 secondary, #4a5568 tertiary)

## Accessibility
- **Contrast:** All text meets WCAG AA standards (navy/white, blue/white, gray/white combinations)
- **Focus States:** Visible ring-2 focus indicators on interactive elements
- **Semantic HTML:** Proper heading hierarchy, button/link distinction
- **Keyboard Navigation:** Tab order follows visual layout, Enter/Space activates

## Print Optimization
- **Media Query:** @media print removes navigation, wizard UI, hover states
- **Table Formatting:** Maintains structure with simplified borders, reduced padding
- **Font Sizing:** Adjusted for print readability (unit-title 1.1rem, outcomes 0.7rem)
- **Background Removal:** White backgrounds only, preserve essential borders

## Images
**No Images Required:** This is a data-dense utility application. Use emoji icons (🎨🖌️💻🎭📘🌍 etc.) for subject identification in the hub grid. All visual interest comes from color, typography, and layout structure rather than photography or illustrations.