# Design Guidelines: Group Savings Management Platform

## Design Approach
**Utility-Focused Design System**: This is a data-intensive financial management tool requiring efficiency, clarity, and trustworthiness. Using a clean, structured approach with emphasis on data hierarchy and actionable interfaces.

## Typography
- **Primary Font**: Inter or system-ui
- **Hierarchy**:
  - H1: 20px
  - Body: 16px
  - Use clear weight differentiation for emphasis

## Spacing System
- **Base Unit**: 4px
- Use multiples (8px, 12px, 16px, 24px, 32px) for consistent rhythm
- Apply generous spacing around data-dense sections for breathing room

## Color Palette
- **Primary**: #0b5fff (trust, actions)
- **Success**: #1f8a3d (positive states, deposits)
- **Warning**: #ff9a00 (alerts, near-threshold)
- **Danger**: #ef3b2d (destructive actions, overdue)
- **Neutral**: #f7f8fa, #e6e9ee (backgrounds, dividers)
- Ensure AA contrast compliance for all text/background combinations

## Layout Architecture

### Dashboard (Home)
- **Top Bar**: Login/Logout button (top-right)
- **Metrics Row**: 4-card horizontal layout showing: Active members, Total savings, Pending total, Target progress %
- **Pending Section**: Full-width table with columns: Member name, Missed date(s), Amount missed, Quick action button
- **Charts Row**: 
  - Left: Pie chart (member contribution %)
  - Right: 7-day line/bar chart with Y-axis labels
- **Sidebar Widget**: Top contributor card (avatar, name, amount, rank badge)
- **Activity Feed**: Scrollable list (last 10 actions) with timestamps

### Members Page
- **Add Member Form**: Inline card layout with fields: Full name, phone, email, profile image upload, join date picker, reason dropdown/text, initial contribution
- **Member List**: Grid/table view with search bar, pagination controls
  - Columns: Avatar, Name, Phone, Total saved, Outstanding, Action buttons (Edit, Delete, View)
- **Validation**: Inline error messages below fields

### Funds Page
- **Member Selection**: Searchable dropdown at top
- **Transaction Controls**: Two-column layout (Deposit | Withdraw) with amount input, note field, date picker
- **Transaction History**: Chronological list below controls (date, amount, type badge, note)
- **Success Toasts**: Top-right corner notifications

### Personal Plan Page
- **Income Section**: Single large input field
- **Spending Categories**: Card grid (2-3 columns) with:
  - Category name
  - Planned amount input
  - Actual spent input
  - Color-coded indicator bar (red >120%, orange 100-120%, green <100%)
- **Summary Card**: Bottom section showing top 3 categories with percentage breakdown

### Loan Page
- **Approval Flow**: Member selector + amount input + Approve button → Modal confirmation
- **Loan Records**: Table with columns: Member, Principal, Interest rate, Outstanding, Status badge, Repay button
- **Repay Modal**: Amount input, computed interest display, total payable preview

### Reports/Invoices/Notes/FAQs
- **Reports**: Export CSV button + printable preview section
- **Invoices**: List view with "Generate" action per transaction
- **Notes**: Full-width textarea with autosave indicator
- **FAQs**: Editable accordion list

### Settings (Admin)
- **Tabs/Sections**: Admin management, Financial rules, Security, Import/Export
- **Financial Rules**: Form inputs for target amount, period, daily minimum, interest rate
- **Admin Management**: Table with add/edit/delete capabilities
- **Import/Export**: JSON file upload/download with "Reset to defaults" button

## Component Patterns

### Modals
- Centered overlay with backdrop blur
- Clear primary (confirm) and secondary (cancel) buttons
- Esc to close, Enter to confirm

### Forms
- Floating labels or top-aligned labels
- Inline validation with color-coded messages
- Required field indicators

### Tables
- Striped rows for readability
- Hover state on rows
- Fixed header for scrollable tables
- Action buttons right-aligned

### Charts
- Use Chart.js or similar lightweight library
- Interactive tooltips on hover
- Clickable elements where applicable (pie slices)
- Muted grid lines, clear axis labels

### Cards
- Subtle shadow for elevation
- Consistent padding (16-24px)
- Header/body/footer structure where applicable

## Accessibility Requirements
- Semantic HTML5 elements (nav, main, section, article)
- ARIA attributes for dynamic content (aria-live for toasts)
- Skip-to-content link
- Keyboard navigation for all interactive elements
- Alt text for images, initials fallback for avatars
- Color-blind friendly status indicators (use icons + color)

## Responsive Behavior
- Mobile-first approach
- Breakpoints: 640px (tablet), 1024px (desktop)
- Stack multi-column layouts on mobile
- Hamburger menu for navigation on small screens
- Touch-friendly button sizes (min 44x44px)

## Micro-Interactions
- Loading skeletons for data-fetching sections
- Smooth transitions (200-300ms)
- Button active states
- Toast notifications (3-5s duration)
- Optimistic UI updates with rollback on error
- Focus indicators for keyboard navigation

## Images
No hero images required for this utility-focused application. Use:
- Member/admin profile avatars (circular, 40-48px diameter)
- Placeholder initials when no image uploaded
- Icon library (Heroicons or Font Awesome) for action buttons and status indicators