# LocalOps

LocalOps is a full-stack service-business management application. It helps small service providers manage customers, schedule appointments, and view business activity from one dashboard.

## Live Demo

 https://localops-nine.vercel.app/

## Repository

https://github.com/gilda256/localops

## Purpose

LocalOps gives small service businesses, freelancers, and local service providers a simple way to keep customer records and appointments organized in one place.

## Features

- User registration and credential-based authentication
- Secure login and logout
- Protected dashboard, customer, and appointment routes
- Customer management: create, view, update, and delete customer records
- Appointment management: create, view, update, delete, and update appointment status
- Dashboard summaries based on stored MongoDB data
- Form validation and error handling
- Responsive layout for desktop and mobile screens
- Persistent data storage with MongoDB Atlas
- Production deployment with Vercel

## Product Demo Summary

1. A new user can create an account from the registration page.
2. The user logs in with their email and password.
3. After login, the user can access the protected dashboard.
4. The user can create and manage customer records.
5. The user can create appointments for customers, update appointment details or status, and delete appointments when needed.
6. The dashboard displays summary information derived from the application's stored data.
7. The user can sign out; protected routes are no longer accessible without logging in.

## Tech Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- MongoDB Node.js Driver
- Auth.js / NextAuth
- bcryptjs
- Vercel

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | Protected dashboard with data summaries |
| `/customers` | Protected customer management |
| `/appointments` | Protected appointment management |
| `/appointments/new` | Create a new appointment |

## Local Development

### Prerequisites

- Node.js 18 or later
- npm
- A MongoDB Atlas database and connection string

### Installation

Clone the repository:

```bash
git clone [https://github.com/gilda256/localops.git](https://github.com/gilda256/localops.git)
cd localops
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
AUTH_SECRET=your_long_random_auth_secret
```

### Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Create a production build locally:

```bash
npm run build
npm start
```

## Deployment

The application is deployed on Vercel and connected to the GitHub repository. Pushes to the production branch trigger a new production deployment.

For deployment, configure the following Vercel environment variables:

```text
MONGODB_URI
AUTH_SECRET
```

Both variables are configured as protected secrets for the Production and Preview environments.

## Team

- Gilda — Full-stack developer

## Future Improvements

- Appointment reminders and notifications
- Calendar-based appointment view
- Business reports and analytics
- Customer search and filtering
- Role-based access control