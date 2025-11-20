# Department Management - Frontend

A Next.js frontend application for managing departments and sub-departments with a modern, responsive UI.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React Query (TanStack Query)** - Data fetching and caching
- **Axios** - HTTP client
- **Formik** - Form management
- **Yup** - Schema validation
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env.local
```

3. Update the `.env.local` file with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Development
```bash
npm run dev
```

The application will be available at: http://localhost:3000

### Production
```bash
npm run build
npm start
```

## Features

### Authentication
- User registration
- User login
- JWT token-based authentication
- Protected routes
- Automatic token refresh

### Department Management
- View all departments in a hierarchical structure
- Create departments with optional sub-departments
- Update department names and sub-departments
- Delete departments (cascades to sub-departments)
- Real-time data updates

### Sub-Department Management
- View all sub-departments in a table format
- Create new sub-departments linked to departments
- Update sub-department names
- Delete individual sub-departments
- Filter by department
- Real-time data updates

### User Interface
- Modern, responsive design
- Form validation
- Loading states
- Error handling
- Intuitive navigation

## Project Structure

```
app/
├── login/              # Login page
│   └── page.tsx
├── register/           # Registration page
│   └── page.tsx
├── departments/        # Department management page
│   └── page.tsx
├── sub-departments/    # Sub-department management page
│   └── page.tsx
├── layout.tsx          # Root layout
└── page.tsx            # Home/redirect page

components/
├── DepartmentForm.tsx      # Department create/edit form
├── SubDepartmentForm.tsx   # Sub-department create/edit form
└── ProtectedRoute.tsx      # Route protection wrapper

lib/
├── api-client.ts       # Axios configuration
└── api/
    ├── auth.ts              # Authentication API calls
    ├── departments.ts       # Department API calls
    └── sub-departments.ts   # Sub-department API calls

contexts/
└── AuthContext.tsx     # Authentication context provider
```

## Pages

### Login (`/login`)
- Username and password form
- Form validation
- Error handling
- Redirects to departments on success

### Register (`/register`)
- Username, password, and confirm password form
- Password matching validation
- Error handling
- Redirects to departments on success

### Departments (`/departments`)
- Protected route (requires authentication)
- Displays all departments in a card layout
- Shows sub-departments hierarchically
- Create, edit, and delete functionality
- Navigation link to sub-departments page
- Logout button

### Sub-Departments (`/sub-departments`)
- Protected route (requires authentication)
- Displays all sub-departments in a table format
- Shows department name for each sub-department
- Create, edit, and delete functionality
- Department selection dropdown when creating
- Navigation link back to departments page
- Logout button

## API Integration

The frontend communicates with the backend GraphQL API using Axios. All requests include the JWT token in the Authorization header when authenticated.

### Authentication Flow

1. User registers or logs in
2. JWT token is received and stored in cookies
3. Token is automatically included in subsequent API requests
4. Protected routes check authentication status

### Data Fetching

- Uses React Query for efficient data fetching
- Automatic cache management
- Optimistic updates
- Error retry logic

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend GraphQL API URL (default: http://localhost:3001)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Form Validation

Forms use Formik with Yup validation schemas:

- **Login**: Username (min 3 chars), Password (min 6 chars)
- **Register**: Username (min 3 chars), Password (min 6 chars), Confirm Password (must match)
- **Department**: Name (min 2 chars), Sub-departments (optional, min 2 chars each)
- **Sub-Department**: Name (min 2 chars), Department (required when creating)

## Styling

The application uses Tailwind CSS for styling with:
- Responsive design (mobile-first)
- Modern UI components
- Consistent color scheme
- Accessible form elements

## State Management

- **React Query**: Server state (API data)
- **Context API**: Authentication state
- **Formik**: Form state
- **Cookies**: Token persistence

## Error Handling

- Network errors are displayed to users
- Form validation errors shown inline
- Authentication errors redirect to login
- Loading states for better UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


