# Project Management Application

A modern, full-stack project management application built with React, TypeScript, and Node.js. This application provides a clean, intuitive interface for managing projects with real-time search, filtering, and comprehensive CRUD operations.

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm package manager

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` with the API running on `http://localhost:5000`.

**Note**: The frontend uses Vite's default port (5173) and the backend runs on port 5000. Make sure both servers are running simultaneously for the application to work properly.

### Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
ADD_DELAY=false
DELAY_MS=1000
```

### Development Delay

The backend includes an artificial delay feature for testing loading states and user experience:

- **ADD_DELAY**: Set to `true` to enable artificial delays (default: `false`)
- **DELAY_MS**: Duration of the delay in milliseconds (default: `1000`)

**Note**: This feature is purely for demo purposes and should not be included in production applications. Disable delays in production by setting `ADD_DELAY=false`.

## Features

### Core Functionality

- **Project Management**: Create, read, update, and delete projects
- **Real-time Search**: Instant search with debounced input
- **Status Filtering**: Filter projects by status (Backlog, Planning, In Progress, On Hold, Under Review, Completed, Cancelled)
- **Pagination**: Efficient pagination for large project lists
- **Form Validation**: Comprehensive client-side validation with Zod schemas

### User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS that adapts seamlessly across all devices
- **Loading States**: Visual feedback for all async operations with skeleton screens and spinners
- **Error Handling**: User-friendly error messages with toast notifications and recovery options
- **Accessibility**: ARIA labels, screen reader support, keyboard navigation, and focus management
- **Modal Management**: Advanced modal system with focus trapping and backdrop handling

## Technology Stack

### Frontend

- **React** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server with auto-restart

## Architecture

### Frontend Architecture

```
src/
├── components/          # React components
│   ├── buttons/        # Reusable button components (Action, Create, Delete, Save, etc.)
│   ├── modals/         # Modal dialogs (Create, Edit, Delete project modals)
│   ├── project/        # Project-specific components (ProjectCard, ProjectList, etc.)
│   ├── search/         # Search functionality (SearchBar, SearchResults, etc.)
│   └── shared/         # Shared UI components (Modal, Button, LoadingSpinner, etc.)
├── hooks/              # Custom React hooks
│   ├── useAppState.ts  # Centralized state management
│   ├── useProjectApi.ts # API integration with error handling
│   ├── useSearch.ts    # Search functionality with debouncing
│   ├── useToast.ts     # Toast notification system
│   └── ...            # Other custom hooks
├── services/           # API services and data fetching
├── utils/              # Utility functions and validation schemas
└── constants/          # Application constants and configuration
```

### Backend Architecture

```
src/
├── config/             # Configuration management
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/            # Data models
├── routes/            # API routes
├── services/          # Business logic
└── utils/             # Utility functions
```

## API Endpoints

### Health & Info

- `GET /api/health` - Health check endpoint
- `GET /api/` - API information and available endpoints

### Projects

- `GET /api/projects` - Get all projects (with pagination and filtering)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `PATCH /api/projects/:id/status` - Update project status
- `DELETE /api/projects/:id` - Delete project

### Statuses

- `GET /api/statuses` - Get all available project statuses

## Key Implementation Decisions

### 1. Modern React Patterns

- **Custom Hooks**: Extracted business logic into reusable hooks
- **useReducer**: Centralized state management for complex state
- **React.memo**: Performance optimization for expensive components

### 2. Form Handling

- **React Hook Form**: Chosen for performance and flexibility
- **Zod Validation**: Type-safe schema validation with custom error messages
- **Real-time Validation**: Immediate feedback for better UX
- **Accessible Forms**: Proper ARIA labels, error handling, and screen reader support

### 3. API Design

- **RESTful Endpoints**: Clean, predictable API structure
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Server-side validation with Joi

### 4. User Experience

- **Debounced Search**: Performance optimization for search input
- **Responsive Design**: Mobile approach with breakpoints for tablet and desktop

### 5. Code Quality

- **ESLint Configuration**: Strict linting rules for code quality
- **Prettier**: Consistent code formatting
- **Component Composition**: Reusable, composable components

### Available Scripts

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

#### Backend

- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
