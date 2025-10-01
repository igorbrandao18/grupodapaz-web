# Overview

This is a full-stack web application for "Grupo da Paz," a funeral services company with over 30 years of experience. The application serves as a comprehensive landing page showcasing the company's services, testimonials, and contact information. Built as a modern single-page application (SPA), it provides a compassionate and professional digital presence for families seeking funeral services.

The tech stack consists of:
- **Frontend**: React with TypeScript, Vite as the build tool, Wouter for routing
- **UI Framework**: Tailwind CSS with shadcn/ui component library (New York style)
- **Backend**: Express.js server with TypeScript
- **Database**: Supabase PostgreSQL for dynamic plan management (with fallback data)
- **State Management**: TanStack Query (React Query) for server state

## Recent Updates (October 2025)

- **Dynamic Plans System**: Plans now load from Supabase database with fallback mechanism
- **Enhanced Plan Schema**: Added description, dependents count, active status, and updated_at fields
- **Admin Interface**: Full CRUD management at `/admin/plans` for creating, editing, deleting, and toggling plan status
- **Improved UI**: Plans display with descriptions and dependent counts in modern badge format

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Single-Page Application (SPA) Pattern**
- The application uses Wouter for client-side routing with multiple routes:
  - `/` - Home page with all landing sections
  - `/admin/plans` - Admin interface for plan management
  - `404` - Not found fallback
- All UI components are modular and organized in a component-based architecture
- The main home page aggregates multiple section components (Navigation, Hero, About, Services, Plans, etc.)

**UI Component System**
- Built on shadcn/ui (New York variant), providing a comprehensive set of pre-styled, accessible React components
- Uses Radix UI primitives for complex interactive components (dialogs, dropdowns, accordions, etc.)
- Tailwind CSS for styling with CSS variables for theming
- Component library includes 40+ UI components ranging from basic (Button, Input) to complex (Command, Chart, Sidebar)

**State Management Strategy**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI interactions
- Toast notifications for user feedback using a custom toast hook

**Development Tools**
- TypeScript for type safety across the codebase
- Vite for fast development and optimized production builds
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports

## Backend Architecture

**Express Server Setup**
- RESTful API structure with all routes prefixed with `/api`
- Middleware stack includes JSON parsing, URL encoding, and request logging
- Custom request logging middleware that captures method, path, status, duration, and JSON responses

**Development vs Production**
- In development: Vite dev server runs in middleware mode with HMR support
- In production: Serves pre-built static assets from `dist/public`
- Environment-aware configuration through NODE_ENV

**Storage Abstraction Layer**
- `IStorage` interface defines CRUD operations (currently user-focused)
- `MemStorage` class provides an in-memory implementation using Map data structures
- Designed for easy swapping to database-backed storage (Drizzle ORM integration pending)
- Random UUID generation for entity IDs

**Vite Integration**
- Custom Vite setup for SSR-style rendering in development
- Serves HTML template with transformed module imports
- Error handling that exits process on Vite errors

## Data Layer

**Database Schema (Drizzle ORM)**
- PostgreSQL configured as the target database (using Neon serverless driver)
- User table defined with id (UUID), username (unique), and password fields
- Drizzle-Zod integration for schema validation
- Migration support configured to `./migrations` directory

**Data Validation**
- Zod schemas generated from Drizzle table definitions
- Type-safe insertions and selections with TypeScript inference
- Validation happens at the schema definition level

**Current Implementation Gap**
- Database schema is defined but not actively used
- In-memory storage serves as a placeholder
- No active database connection in the codebase (storage interface exists but isn't wired to Drizzle)

## External Dependencies

**UI and Styling**
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Headless UI components for accessibility (20+ component primitives)
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets (specifically using Font Awesome for brand icons)
- **class-variance-authority (CVA)**: For component variant management
- **clsx + tailwind-merge**: Class name utilities

**Frontend Libraries**
- **React 18**: UI library
- **Wouter**: Lightweight routing library
- **TanStack Query**: Server state management
- **React Hook Form + Zod**: Form handling and validation
- **date-fns**: Date manipulation utilities
- **Embla Carousel**: Carousel component library
- **cmdk**: Command palette component
- **vaul**: Drawer component

**Backend Libraries**
- **Express**: Web server framework
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store (included but not actively used)
- **nanoid**: Unique ID generation

**Development Tools**
- **Vite**: Build tool and dev server
- **TypeScript**: Type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Backend bundling for production
- **@replit/vite-plugin-***: Replit-specific development plugins (cartographer, dev banner, runtime error modal)

**Google Fonts**
- Architects Daughter, DM Sans, Fira Code, Geist Mono (configured in HTML but may not be fully utilized)

**Notable Architectural Decisions**

1. **Separation of Concerns**: Clear division between client, server, and shared code with dedicated directories
2. **API-First Design**: Backend routes namespaced under `/api` for clear client-server boundaries
3. **Storage Interface Pattern**: Abstract storage layer allows for swapping implementations without changing business logic
4. **Component-First UI**: Heavy reliance on reusable, accessible UI components from shadcn/ui
5. **Type Safety**: End-to-end TypeScript with shared types between client and server
6. **Database-Ready**: Infrastructure for PostgreSQL/Drizzle is in place but not actively connected (likely intentional for scaffolding)