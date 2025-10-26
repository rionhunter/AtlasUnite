# Overview

Atlas Unite is a full-stack community engagement platform built to connect volunteers with environmental conservation and social impact initiatives across Brisbane, Australia. The application enables community members to register as volunteers, participate in forum discussions, and engage with various projects ranging from habitat restoration to charity support. The platform emphasizes local action while building broader community connections through technology.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built as a React Single Page Application using Vite as the build tool and bundler. The application uses TypeScript for type safety and follows a component-based architecture with React Router (wouter) for navigation. UI components are built using shadcn/ui component library with Radix UI primitives, providing accessible and customizable components styled with Tailwind CSS.

The frontend implements form handling with React Hook Form and Zod for validation, TanStack Query for server state management, and a custom toast notification system. The application is responsive and mobile-friendly, using modern CSS Grid and Flexbox layouts.

## Backend Architecture
The server runs on Express.js with TypeScript, following a RESTful API design pattern. The application uses a modular route structure with centralized error handling middleware. Request logging is implemented to track API performance and responses.

The backend currently uses an in-memory storage implementation (MemStorage) that simulates database operations, making it easy to transition to a persistent database later. The storage layer follows an interface-based design pattern, allowing for easy swapping of storage implementations.

## Database Design
The application is configured to use PostgreSQL with Drizzle ORM for database operations. The schema defines four main entities:
- Volunteers: Stores volunteer registration data including personal information, interests, and availability
- Forum Posts: Contains community forum discussions with categorization
- Forum Comments: Enables threaded discussions on forum posts  
- Contact Messages: Captures inquiries and feedback from users

UUID primary keys are used throughout for security and scalability. The schema supports JSON columns for storing arrays of interests and availability preferences.

## Data Validation
Zod schemas are used extensively for runtime type checking and validation across both client and server. This ensures data integrity and provides clear error messages for invalid inputs. The shared schema definitions maintain consistency between frontend and backend validation.

## State Management
Client-side state is managed through TanStack Query for server state, React Hook Form for form state, and React Context for global UI state. This approach minimizes prop drilling while maintaining predictable state updates.

## Build and Development
The application uses a monorepo structure with shared types and schemas. Vite handles client-side bundling with hot module replacement for development. The server uses tsx for TypeScript execution in development and esbuild for production builds. The build process generates static assets served by Express in production.

# External Dependencies

## UI Framework and Styling
- **React 18**: Core frontend framework with modern hooks and concurrent features
- **Radix UI**: Accessible primitive components for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library with consistent SVG icons

## Database and ORM
- **PostgreSQL**: Primary database (configured via Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit with migrations support
- **Drizzle Kit**: CLI tools for schema management and migrations

## Development and Build Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server

## Validation and Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## Server and API
- **Express.js**: Web application framework for Node.js
- **TanStack Query**: Powerful data synchronization for React
- **Wouter**: Minimalist routing library for React

## Development Environment
- **Replit**: Cloud development environment with integrated tooling
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility