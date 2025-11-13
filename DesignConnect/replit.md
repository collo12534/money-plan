# Group Savings Management Platform

A comprehensive financial management tool for group savings, designed to help designers and admins communicate data insights with their teams and clients.

## Overview

This is a full-stack web application built with React, TypeScript, Express, and Chart.js that provides complete group savings management capabilities including member tracking, fund management, loan administration, personal budgeting, and comprehensive reporting.

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for state management
- Shadcn UI + Tailwind CSS for components
- Chart.js for data visualizations
- Lucide React for icons

**Backend:**
- Express.js
- In-memory storage with automatic activity tracking
- Zod for validation
- RESTful API architecture

## Features

### 1. Dashboard
- Real-time metrics: active members count, total savings, pending deposits, target progress
- Interactive pie chart showing member contribution percentages
- 7-day bar chart showing daily contributions
- Top contributor card with avatar and rank
- Live activity feed (auto-refreshes every 5 seconds)
- Pending deposits table with reminder functionality

### 2. Members Management
- Add/edit/delete members with full validation
- Searchable and filterable member list
- Avatar support with initials fallback
- Track total saved and outstanding amounts per member
- Join date and savings reason tracking
- Real-time updates across all features

### 3. Funds Management
- Member-specific deposit and withdrawal operations
- Transaction history per member
- Success toasts and error handling
- Automatic dashboard synchronization
- Date and note tracking for all transactions

### 4. Personal Plan
- Weekly income tracking
- Spending categories (Food, Transport, Internet, Electricity, Others)
- Planned vs Actual spending with color-coded indicators:
  - Green: <100% (under budget)
  - Orange: 100-120% (near budget)
  - Red: >120% (over budget)
- Top 3 spending insights with percentages
- Personal savings tracking separate from group savings

### 5. Loan Management
- Loan approval workflow with interest calculation
- Automatic interest computation based on global rate
- Repayment tracking with outstanding balance updates
- Loan status management (active/paid/overdue)
- Member outstanding balance updates
- Activity logging for all loan operations

### 6. Reports & Exports
- Transaction summary with filtering
- CSV export functionality
- Printable reports
- Real-time statistics: total deposits, withdrawals, net savings, transaction count

### 7. Settings
- Admin account management
- Financial rules configuration:
  - Target amount and period
  - Daily minimum savings
  - Global interest rate for loans
- Security settings for sensitive actions
- Import/Export configuration as JSON
- Reset to defaults functionality

### 8. Additional Features
- Invoices generation from transactions
- Auto-saving notes system (localStorage backed)
- Editable FAQs with accordion UI
- Dark mode support with theme toggle
- Fully responsive mobile-first design
- Comprehensive accessibility (ARIA, keyboard navigation, AA contrast)

## Data Model

### Member
- id, name, phone, email, avatarUrl
- joinedAt, reason
- totalSaved, outstanding

### Transaction
- id, memberId, type (deposit/withdraw/loan_disbursement/loan_repayment)
- amount, date, note, createdBy

### Loan
- id, memberId, principal, interestRate
- outstanding, status (active/paid/overdue), createdAt

### Settings
- targetAmount, targetPeriodMonths
- dailyMinimum, globalInterestRate
- requirePasswordForSensitiveActions

### Admin, PersonalPlan, FAQ, Note, Activity
- See shared/schema.ts for complete definitions

## API Endpoints

### Members
- GET /api/members - List all members
- GET /api/members/:id - Get member details
- POST /api/members - Create member
- PATCH /api/members/:id - Update member
- DELETE /api/members/:id - Delete member

### Transactions
- GET /api/transactions - List all transactions (optional ?memberId filter)
- POST /api/transactions - Create transaction

### Loans
- GET /api/loans - List all loans (optional ?memberId filter)
- POST /api/loans - Create loan
- PATCH /api/loans/:id - Update loan (for repayments)

### Dashboard
- GET /api/dashboard/stats - Get dashboard statistics

### Settings, Admins, FAQs, Notes, Activities
- Full CRUD operations available
- See server/routes.ts for complete list

### Reports
- GET /api/reports/export - Export transactions as CSV

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn components
│   │   ├── app-sidebar.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/            # All application pages
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and query client
│   ├── App.tsx           # Main app with routing
│   └── index.css         # Global styles and theme
server/
├── storage.ts            # In-memory storage implementation
├── routes.ts             # API routes
└── index.ts              # Express server setup
shared/
└── schema.ts             # Zod schemas and TypeScript types
```

## Design System

**Colors:**
- Primary: #0b5fff (trust, actions)
- Success: #1f8a3d (deposits, positive states)
- Warning: #ff9a00 (alerts, near-threshold)
- Danger: #ef3b2d (destructive actions, overdue)

**Typography:**
- Font: Inter
- H1: 20px
- Body: 16px

**Spacing:** 4px base unit with multiples (8px, 12px, 16px, 24px, 32px)

## Recent Changes

### November 12, 2025
- Initial MVP implementation complete
- All core features implemented and integrated
- Full backend API with validation
- Comprehensive frontend with Chart.js visualizations
- Real-time updates and activity tracking
- CSV export functionality
- Dark mode support
- Mobile-first responsive design
- Accessibility features (ARIA, keyboard navigation)

## User Preferences

None specified yet.

## Technical Integration

The platform provides several integration points for technical teams:

1. **CSV Export**: Transaction data can be exported as CSV for external analysis
2. **JSON Import/Export**: Settings and configuration can be exported/imported as JSON
3. **RESTful API**: All features accessible via standard HTTP methods
4. **Activity Feed**: Real-time event tracking for monitoring and auditing
5. **Extensible Schema**: Well-defined Zod schemas for easy integration

## Running the Application

1. The application runs on port 5000
2. Frontend and backend served from same Express server
3. No database setup required - uses in-memory storage
4. All dependencies pre-installed
5. Auto-restart on file changes

The "Start application" workflow runs `npm run dev` which starts both frontend and backend servers.

## Future Enhancements

Potential features for next phase:
- Real PostgreSQL database persistence
- SMS/email notification system for reminders
- Multi-currency support
- Advanced reporting with custom date ranges
- REST API documentation (Swagger/OpenAPI)
- Rate limiting and authentication tokens
- Mobile app using React Native
- Webhook system for external integrations
