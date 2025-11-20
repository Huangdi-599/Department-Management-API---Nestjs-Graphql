# Department Management API - Backend

A NestJS GraphQL API for managing departments and sub-departments with JWT authentication.

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language for APIs
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **JWT** - Authentication
- **TypeScript** - Type safety

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=department_management

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

PORT=3001
NODE_ENV=development
```

4. Create the PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE department_management;
\q
```

## Running the Application

### Development
```bash
npm run start:dev
```

The API will be available at:
- **GraphQL Playground**: http://localhost:3001/graphql
- **API**: http://localhost:3001

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

The API provides both **REST** and **GraphQL** endpoints. Choose the one that best fits your needs.

### REST API Endpoints

Base URL: `http://localhost:3001`

### Authentication (REST)

#### Register User
Creates a new user account.

**Endpoint:** `POST /auth/register`

**Request:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

**Status Codes:**
- `201` - User successfully created
- `409` - Username already exists
- `400` - Validation error

#### Login
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `400` - Validation error

**Note:** Include the `accessToken` in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <accessToken>
```

### GraphQL Endpoint

All GraphQL requests are made to: `http://localhost:3001/graphql`

### Authentication (GraphQL)

#### Register User
Creates a new user account.

**Mutation:**
```graphql
mutation {
  register(input: {
    username: "john_doe"
    password: "password123"
  }) {
    accessToken
    username
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "username": "john_doe"
    }
  }
}
```

#### Login
Authenticates a user and returns a JWT token.

**Mutation:**
```graphql
mutation {
  login(input: {
    username: "john_doe"
    password: "password123"
  }) {
    accessToken
    username
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "username": "john_doe"
    }
  }
}
```

### Department Management

All department operations require authentication (JWT token in Authorization header).

#### Create Department

Creates a new department with optional sub-departments.

**Mutation:**
```graphql
mutation {
  createDepartment(input: {
    name: "Finance"
    subDepartments: [
      { name: "Accounts" }
      { name: "Audit" }
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Create Department Without Sub-Departments:**
```graphql
mutation {
  createDepartment(input: {
    name: "Finance"
    subDepartments: null
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "createDepartment": {
      "id": 1,
      "name": "Finance",
      "subDepartments": [
        {
          "id": 2,
          "name": "Accounts"
        },
        {
          "id": 3,
          "name": "Audit"
        }
      ]
    }
  }
}
```

#### Get All Departments

Retrieves all departments with their sub-departments.

**Query:**
```graphql
query {
  getDepartments {
    id
    name
    subDepartments {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "getDepartments": [
      {
        "id": 1,
        "name": "Finance",
        "subDepartments": [
          {
            "id": 2,
            "name": "Accounts"
          }
        ],
        "createdAt": "2025-11-19T12:00:00.000Z",
        "updatedAt": "2025-11-19T12:00:00.000Z"
      }
    ]
  }
}
```

#### Get Department by ID

Retrieves a specific department by its ID.

**Query:**
```graphql
query {
  getDepartment(id: 1) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

#### Update Department

Updates a department's name and manages its sub-departments. You can add new sub-departments, update existing ones, or remove them.

**Update Department Name Only:**
```graphql
mutation {
  updateDepartment(input: {
    id: 1
    name: "Finance Updated"
    subDepartments: []
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Update Department with Sub-Departments:**
```graphql
mutation {
  updateDepartment(input: {
    id: 1
    name: "Finance Updated"
    subDepartments: [
      { id: 2, name: "Accounts Updated" }  # Update existing sub-department
      { name: "New Sub-Department" }      # Create new sub-department (no id)
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Sub-Department Management Rules:**

The `updateDepartment` mutation uses a **"replace all"** strategy for sub-departments. The `subDepartments` array you provide becomes the complete list of sub-departments for that department.
**Important Notes:**
- The operation is **atomic** - all sub-department changes happen in a single transaction
- If you provide an `id` that doesn't belong to this department, it will be treated as a new sub-department (the ID is ignored)
- The final result will always match exactly what you send in the `subDepartments` array

**Response:**
```json
{
  "data": {
    "updateDepartment": {
      "id": 1,
      "name": "Finance Updated",
      "subDepartments": [
        {
          "id": 2,
          "name": "Accounts Updated"
        },
        {
          "id": 4,
          "name": "New Sub-Department"
        }
      ]
    }
  }
}
```

#### Delete Department

Deletes a department and all its sub-departments (cascade delete).

**Mutation:**
```graphql
mutation {
  deleteDepartment(id: 1)
}
```

**Response:**
```json
{
  "data": {
    "deleteDepartment": true
  }
}
```

### Sub-Department Management

All sub-department operations require authentication.

#### Create Sub-Department

Creates a new sub-department for an existing department.

**Mutation:**
```graphql
mutation {
  createSubDepartment(input: {
    name: "Accounts"
    departmentId: 1
  }) {
    id
    name
    departmentId
    department {
      id
      name
    }
  }
}
```

#### Get All Sub-Departments

Retrieves all sub-departments.

**Query:**
```graphql
query {
  getSubDepartments {
    id
    name
    departmentId
    department {
      id
      name
    }
  }
}
```

#### Get Sub-Department by ID

Retrieves a specific sub-department by its ID.

**Query:**
```graphql
query {
  getSubDepartment(id: 1) {
    id
    name
    departmentId
    department {
      id
      name
    }
  }
}
```

#### Update Sub-Department

Updates a sub-department's name.

**Mutation:**
```graphql
mutation {
  updateSubDepartment(input: {
    id: 1
    name: "Accounts Updated"
  }) {
    id
    name
  }
}
```

#### Delete Sub-Department

Deletes a sub-department.

**Mutation:**
```graphql
mutation {
  deleteSubDepartment(id: 1)
}
```

## Validation Rules

- **Department Name**: Minimum 2 characters
- **Sub-Department Name**: Minimum 2 characters
- **Username**: Minimum 3 characters
- **Password**: Minimum 6 characters

## Error Handling

### REST API Errors

REST endpoints return standard HTTP status codes with error messages:

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

### GraphQL Errors

GraphQL returns error responses in the following format:

```json
{
  "errors": [
    {
      "message": "Error message here",
      "extensions": {
        "code": "ERROR_CODE",
        "statusCode": 400
      }
    }
  ]
}
```

### Common Error Codes

- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., username already exists)
- `400` - Bad Request (validation errors)

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data Transfer Objects
│   ├── auth.service.ts
│   ├── auth.controller.ts  # REST endpoints
│   ├── auth.resolver.ts    # GraphQL resolvers
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── department/        # Department module
│   ├── dto/
│   ├── entities/
│   ├── department.service.ts
│   └── department.resolver.ts
├── sub-department/    # Sub-department module
│   ├── dto/
│   ├── entities/
│   ├── sub-department.service.ts
│   └── sub-department.resolver.ts
├── user/             # User entity
│   └── entities/
├── database/         # Database configuration
│   └── database.module.ts
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected GraphQL and REST endpoints
- Input validation with class-validator
- CORS enabled for frontend communication

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed)
- `createdAt`
- `updatedAt`

### Departments Table
- `id` (Primary Key)
- `name`
- `createdAt`
- `updatedAt`

### Sub_Departments Table
- `id` (Primary Key)
- `name`
- `department_id` (Foreign Key → Departments)
- `createdAt`
- `updatedAt`


