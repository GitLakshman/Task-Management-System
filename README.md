# Task Management System

A full-stack task management application built with **Express.js**, **Prisma**, **PostgreSQL** for the backend and **Next.js** with **Tailwind CSS** for the frontend.

## Features

✅ User registration and login  
✅ JWT-based authentication with access & refresh tokens  
✅ Task CRUD operations  
✅ Pagination  
✅ Filtering by status  
✅ Search by title  
✅ Task status toggling  
✅ Responsive design  
✅ Toast notifications  
✅ Error handling  
✅ TypeScript throughout  
✅ Clean architecture (services, controllers, routes)

## Project Structure

```
task-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── (dashboard)/
    │   │   │   └── tasks/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   └── tasks/
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   └── types/
    │       └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_ACCESS_SECRET="your_access_secret_key_here"
JWT_REFRESH_SECRET="your_refresh_secret_key_here"
FRONTEND_URL="http://localhost:3000"
PORT=3001
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

## API Endpoints Reference

### Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register new user       |
| POST   | `/api/auth/login`    | Login user              |
| POST   | `/api/auth/refresh`  | Refresh access token    |
| POST   | `/api/auth/logout`   | Logout user (protected) |

### Tasks (All Protected)

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/api/tasks`            | Get all tasks (with pagination, filtering, search) |
| POST   | `/api/tasks`            | Create new task                                    |
| GET    | `/api/tasks/:id`        | Get task by ID                                     |
| PATCH  | `/api/tasks/:id`        | Update task                                        |
| DELETE | `/api/tasks/:id`        | Delete task                                        |
| POST   | `/api/tasks/:id/toggle` | Toggle task status                                 |

### Query Parameters for GET /api/tasks

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (PENDING, IN_PROGRESS, COMPLETED)
- `search` - Search by title

## Security Features

- ✅ JWT-based authentication with access & refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Token refresh mechanism
- ✅ Input validation with Zod
- ✅ SQL injection protection with Prisma
- ✅ CORS configuration
- ✅ Secure HTTP headers

## Tech Stack

### Backend

- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript
- JSON Web Tokens (JWT)
- bcrypt
- Zod validation

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Sonner (toast notifications)

## License

MIT
