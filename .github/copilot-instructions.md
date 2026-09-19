# LocalOps Copilot Instructions

## Project Overview

LocalOps is a full-stack web application for small service businesses. It helps small service providers organize customer information and appointment schedules through a simple dashboard.

## Target Users

- Small service businesses
- Freelancers
- Local service providers

## Technology Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Auth.js or Clerk
- Vercel

## MVP Routes

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/customers`
- `/appointments`
- `/appointments/new`
- `/appointments/[id]`

## Core Data Entities

### Business

Represents a service business using LocalOps.

### User

Represents a person who can access a business workspace.

### Customer

Represents a customer who receives services from the business.

### Appointment

Represents a scheduled service appointment.

## Data and Security Rules

- Every authenticated user belongs to a business.
- Every customer belongs to one business.
- Every appointment belongs to one business.
- Always filter business data by the authenticated user's `businessId`.
- Never expose data belonging to another business.
- Keep database access on the server.
- Never commit secrets or credentials.
- Use environment variables for sensitive configuration.
- Never store plaintext passwords.

## Naming Conventions

- Use PascalCase for React component names.
- Use camelCase for variables and functions.
- Use descriptive names for files and functions.
- Use TypeScript types for shared data structures.
- Use clear and consistent route names.

## Component Architecture

- Keep shared UI components separate from feature-specific components.
- Use typed props for component data.
- Prefer reusable components over duplicated markup.
- Keep loading, empty, error, and success states consistent.
- Keep interactive components accessible with keyboard navigation and visible focus states.
- Support responsive layouts using mobile-first design.

## Component Folders

```text
src/
├── app/
├── components/
│   ├── layout/
│   ├── ui/
│   └── features/
│       ├── dashboard/
│       ├── customers/
│       └── appointments/
├── lib/
├── types/
└── styles/
```

## UI and Design

- Use the approved LocalOps color palette.
- Use Tailwind CSS utility classes.
- Use consistent spacing based on the Tailwind spacing scale.
- Use cards for grouped information and dashboard summaries.
- Maintain readable typography and accessible color contrast.
- Use responsive layouts for mobile, tablet, and desktop.

## Development Practices

- Validate form input on the client and server when appropriate.
- Handle loading, empty, success, and error states.
- Keep business logic out of presentational components.
- Prefer small, focused functions.
- Avoid duplicating logic.
- Run linting and type checks before opening a pull request.
- Use feature branches and pull requests for changes.
- Write clear commit messages.

## Authentication

- Protect authenticated pages and API routes.
- Identify the current user on the server.
- Verify the user's business before accessing customer or appointment data.
- Do not expose sensitive authentication information in error messages.

## Before Making Changes

Before implementing a feature, check:

1. Which route owns the feature?
2. Which entity or entities does it use?
3. Which reusable components can be used?
4. What loading, empty, success, and error states are needed?
5. What authentication and authorization rules apply?
6. Does the change follow the approved design system?