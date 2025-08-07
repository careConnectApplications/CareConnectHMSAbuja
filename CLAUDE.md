# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` - Starts the React development server on localhost:3000
- **Build for production**: `npm run build` - Creates optimized production build (uses CI=false to ignore warnings)
- **Run tests**: `npm test` - Runs the test suite using React Testing Library
- **Eject from Create React App**: `npm run eject` (use with caution)

## Architecture Overview

This is a comprehensive Healthcare Management System (HMS) built with React 17 and Chakra UI. The application follows a modular, feature-based architecture designed for managing hospital operations across multiple facilities.

### Core Technology Stack
- **Frontend**: React 17.0.2 with functional components and hooks
- **UI Framework**: Chakra UI with custom theming
- **State Management**: Redux with Redux Persist for data persistence
- **Routing**: React Router DOM v6 with nested route structure
- **API Client**: Axios for HTTP requests
- **Charts**: Chart.js with react-chartjs-2 and Recharts
- **Date Handling**: Moment.js and date-fns
- **Authentication**: JWT tokens stored in localStorage

### Project Structure

```
src/
├── Assets/           # Images, logos, audio files (beep sounds, backgrounds)
├── AuthLayout/       # Authentication page layouts
├── Authentication/   # Auth-related components
├── Components/       # 100+ reusable UI components (modals, forms, cards)
├── Layouts/         # Main app layout components (NavBar, SideBar, Footer)
├── Pages/           # 90+ page components organized by medical departments
├── Routes/          # Route definitions and access control
├── Redux/           # State management (counter, authentication, todos)
└── Utils/           # API calls, configuration, helpers, theme
```

### Route Architecture

The application uses a sophisticated nested routing system with role-based access control:

- **PrivateRoutes**: Wraps all authenticated routes
- **Module-specific Routes**: OutPatientRoutes, InPatientRoutes, LabRoutes, RadiologyRoutes, PharmacyRoutes, etc.
- **Feature Routes**: Separate routing for billing, user management, clinical reports

### Key Features by Department

**Clinical Modules**:
- Outpatient (ANC, Clinical Encounters, Doctor Scheduling)
- Inpatient (Admissions, Nursing Care, Ward Management)
- Laboratory (Hematology, Chemical Pathology, Histopathology)
- Radiology (Imaging requests and results)
- Pharmacy (Prescription management, inventory)
- Theatre/Surgery (Pre-operative, operative, post-operative care)
- Eye Clinic (Examinations, lens prescriptions)
- Dental (Specialized dental encounters)

**Administrative Modules**:
- Patient Management and Registration
- User Management with role-based permissions
- Billing and Payment Processing
- Insurance/HMO Management
- Reporting and Analytics
- Inventory Management

### API Configuration

- **Base URL**: Configurable based on deployment environment (ApiConfig.js:6)
- **Multi-tenancy**: Supports multiple hospital facilities based on hostname
- **Authentication**: JWT tokens with axios interceptors
- **Error Handling**: Centralized API error management

### State Management Pattern

Uses Redux with the following key reducers:
- `isLogged`: Authentication state management
- `counter`: General purpose counter (likely for notifications)
- `myTodo`: Task management functionality

### Code Conventions

- **Components**: PascalCase naming (e.g., CreatePatientModal.js)
- **Pages**: Descriptive names matching their clinical function
- **API calls**: Centralized in Utils/ApiCalls.js with consistent error handling
- **Modals**: Extensive use of modal components for data entry and editing
- **Forms**: Complex medical forms with validation and conditional rendering

### Multi-facility Support

The system supports multiple healthcare facilities through hostname-based configuration:
- General Hospital, Katsina
- General Hospital, Funtua
- Turai Yar'Adua Children and Maternity Specialist Hospital
- Various Primary Healthcare Centres

### Important Files

- `src/App.js`: Main application component with Chakra UI provider
- `src/Routes/Index.js`: Central routing configuration
- `src/Utils/ApiConfig.js`: API endpoints and facility configuration
- `src/Utils/ApiCalls.js`: All API interaction logic
- `src/Utils/Theme.js`: Chakra UI custom theme configuration

## Development Notes

- The application uses Create React App as the build system
- No TypeScript - pure JavaScript implementation
- Extensive modal-based user interfaces for clinical data entry
- Real-time features likely supported (beep audio files suggest notifications)
- Print functionality for reports and receipts
- Multi-step form workflows for complex clinical processes

When working with this codebase, always consider the medical context and ensure data integrity, especially for patient information and clinical records.