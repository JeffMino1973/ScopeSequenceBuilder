# NSW Life Skills Scope and Sequence Portal

## Overview

The NSW Life Skills Scope and Sequence Portal is an interactive curriculum management platform designed for teachers and curriculum planners in New South Wales. The application enables educators to browse, view, and plan Life Skills curriculum across 14 subjects (CAPA, Computing Technology, Design & Technology, Dance, Drama, English, HSIE, LOTE, Maths, Music, PDHPE, Science, TAS, Visual Arts) organized by 6 components/stages (A-F corresponding to Years 7-12).

The platform provides two main workflows:
1. **Subject-specific viewing**: Browse pre-defined scope and sequence tables for individual subjects with detailed unit information
2. **Custom curriculum wizard**: Create personalized scope and sequence plans by selecting units from multiple subjects and assigning them to specific terms

## Project Status

**Completion Date**: November 22, 2025  
**Status**: Production-ready, fully tested, ready for deployment  

**Recent Completion (Final Phase + Print Functionality)**:
- ✅ Fixed ScopeTable per-week matrix rendering with 10-slot normalization and colspan collapse
- ✅ Enhanced Wizard data validation guards to prevent crashes on partial data
- ✅ Updated StageFilter to use proper shadcn variants with accessible focus states
- ✅ Added close button (X icon) to UnitDetailPanel for improved UX
- ✅ Implemented comprehensive print functionality for both scope tables and unit of work documents
  - Print Scope and Sequence: Clean printout of curriculum matrix with static unit cells
  - Print Unit of Work: Complete unit plan with all sections auto-expanded (8-week teaching plan, outcomes, resources)
  - Intelligent print mode detection using data-print-mode attribute
  - Print-specific CSS with targeted selectors to preserve essential content
- ✅ Passed comprehensive E2E testing covering all user journeys including print controls
- ✅ Architect review approved: "Both scoped print modes now render the intended content without hiding critical information"

**Testing Results**:
- ✅ Home page: Subject card grid with NSW branding verified
- ✅ Subject viewer: Stage filtering, scope table alignment, unit details working correctly
- ✅ Wizard: Unit selection, term assignment, custom plan generation functional
- ✅ Navigation: All routing and back buttons working properly
- ✅ Design system: NSW color palette and Inter font confirmed throughout
- ✅ Print functionality: Both scope table and unit of work print modes validated

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS for utility-first styling with custom design tokens

**Component Structure**
- Follows a page-based routing pattern with dedicated pages for Home, Subject Viewer, Wizard, and Not Found
- Reusable UI components built on Radix UI primitives (shadcn/ui component library)
- Custom domain components for curriculum-specific UI (ScopeTable, StageFilter, UnitDetailPanel)
- Centralized component library using shadcn/ui's "new-york" style preset

**State Management Strategy**
- Server state managed through React Query with infinite stale time (data treated as static curriculum content)
- Local UI state managed with React hooks (useState for selections, filters, and UI toggles)
- No global state management library needed due to simple data flow patterns

**Design System**
- Material Design principles adapted for educational content density
- Custom color palette: Navy (#002664), Medium Blue (#146CFD), Red accent (#D7153A), Light Blue (#CBDEFD)
- Inter font family for all typography
- Responsive grid layouts (1/2/3 columns based on viewport)
- Consistent spacing using Tailwind's standard scale (p-4, p-6, p-8, gap-4, gap-6)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- Node.js HTTP server
- Development mode uses Vite middleware for HMR and SSR
- Production mode serves pre-built static assets

**API Design**
- RESTful endpoints returning JSON
- Two primary routes:
  - `GET /api/subjects/all` - Returns all subjects with full curriculum data
  - `GET /api/subjects/:subjectId` - Returns single subject with scope and sequence details
- Error handling with appropriate HTTP status codes (404, 500)
- Request/response logging middleware for debugging

**Data Storage Strategy**
- In-memory storage implementation (MemStorage class)
- Curriculum data loaded from static JSON file at server startup
- No database required - curriculum data is read-only reference content
- Data structure defined in shared schema types for consistency between client/server

**Build and Deployment**
- Development: tsx for TypeScript execution, Vite dev server for client
- Production: esbuild bundles server code, Vite builds optimized client bundle
- All client assets served from dist/public directory
- Single-page application with client-side routing (fallback to index.html)

### Data Model

**Core Entities**
- **Subject**: Top-level curriculum area (id, name, emoji, scopeAndSequence, unitDetails)
- **Stage**: Educational stage grouping (e.g., Stage 4, Stage 5) containing terms
- **Term**: 10-week period containing curriculum units
- **Unit**: Individual curriculum component with name, duration, subtitle, outcomes, description, lessons
- **CustomScopeSelection**: User-created curriculum plan entry with subject, unit, and term assignment

**Schema Validation**
- Zod schemas for runtime type validation on custom scope selections
- TypeScript interfaces for compile-time type safety
- Shared schema definitions between client and server (shared/schema.ts)

**Data Source**
- Pre-processed curriculum data from HTML templates extracted into JSON format
- 14 subjects with complete scope and sequence data
- Static reference data loaded at application startup

## External Dependencies

**UI Component Library**
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, select, toast, etc.)
- shadcn/ui design system configuration and component implementations
- Lucide React for consistent iconography

**Styling and CSS**
- Tailwind CSS v3 for utility-first styling
- PostCSS with autoprefixer for browser compatibility
- Custom CSS variables for theme tokens (colors, spacing, shadows)
- Google Fonts CDN for Inter font family

**Client-Side Libraries**
- TanStack React Query for data fetching and caching
- Wouter for routing (lightweight alternative to React Router)
- React Hook Form with Zod resolvers for form validation
- class-variance-authority (cva) for component variant management
- clsx and tailwind-merge for className composition

**Development Tools**
- TypeScript compiler for type checking
- Vite plugins: React, runtime error overlay, Replit-specific development tools
- tsx for running TypeScript in Node.js
- esbuild for production server bundling
- Drizzle Kit for database schema management (configured but not actively used)

**Data Processing**
- Custom extraction script (scripts/extract-curriculum-data.js) for parsing HTML templates into JSON
- Static HTML templates in attached_assets directory contain original curriculum data

**Database Configuration**
- Drizzle ORM configured with PostgreSQL dialect
- Neon serverless driver for PostgreSQL connections
- Currently configured but not actively used (data served from static JSON)
- Migration system in place for future database integration
- connect-pg-simple for session storage (if sessions are added later)