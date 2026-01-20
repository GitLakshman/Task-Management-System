<div align="center">

# 📋 Task Management System

A modern, full-stack task management application with authentication, real-time updates, and a beautiful responsive UI.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

<br/>

![Node.js](https://img.shields.io/badge/node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

</div>

---

## 🎯 Overview

Task Management System is a robust, production-ready application that helps users organize and track their tasks efficiently. Built with modern technologies and best practices, it features secure authentication, intuitive UI, and comprehensive testing.

---

## ✨ Features

<table>
<tr>
<td>

### 🔐 Authentication

- User registration & login
- JWT access & refresh tokens
- Secure password hashing
- Protected routes

</td>
<td>

### 📝 Task Management

- Create, read, update, delete tasks
- Status toggling (Pending → In Progress → Completed)
- Search tasks by title
- Filter by status

</td>
</tr>
<tr>
<td>

### 🎨 Modern UI/UX

- Responsive design
- Toast notifications
- Clean, intuitive interface
- Mobile-friendly

</td>
<td>

### ⚡ Performance & Security

- Pagination support
- Rate limiting
- Input validation (Zod)
- SQL injection protection

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Backend

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,typescript,postgresql,prisma" alt="Backend Skills" />
</p>

|   Technology   | Purpose          |
| :------------: | :--------------- |
| **Express.js** | Web Framework    |
|   **Prisma**   | ORM              |
| **PostgreSQL** | Database         |
| **TypeScript** | Type Safety      |
|    **JWT**     | Authentication   |
|    **Zod**     | Validation       |
|    **Jest**    | Testing          |
|   **Helmet**   | Security Headers |

</td>
<td align="center" width="50%">

### Frontend

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind" alt="Frontend Skills" />
</p>

|     Technology      | Purpose             |
| :-----------------: | :------------------ |
|   **Next.js 14**    | React Framework     |
|    **React 18**     | UI Library          |
|   **TypeScript**    | Type Safety         |
|  **Tailwind CSS**   | Styling             |
| **React Hook Form** | Form Handling       |
|      **Axios**      | HTTP Client         |
|     **Sonner**      | Toast Notifications |
|     **Vitest**      | Testing             |

</td>
</tr>
</table>

---

## 📁 Project Structure

<details>
<summary>Click to expand project structure</summary>

```
TaskManagementSystem/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 __tests__/           # Unit & integration tests
│   │   │   ├── auth.middleware.test.ts
│   │   │   ├── auth.service.test.ts
│   │   │   ├── jwt.test.ts
│   │   │   ├── task.service.test.ts
│   │   │   ├── validation.test.ts
│   │   │   └── setup.ts
│   │   ├── 📂 config/
│   │   │   └── database.ts
│   │   ├── 📂 controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── 📂 middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── 📂 routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── 📂 services/
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── 📂 types/
│   │   │   └── index.ts
│   │   ├── 📂 utils/
│   │   │   ├── jwt.ts
│   │   │   └── validation.ts
│   │   └── index.ts
│   ├── 📂 prisma/
│   │   ├── 📂 migrations/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
│
└── 📂 frontend/
    ├── 📂 src/
    │   ├── 📂 __tests__/           # Component & unit tests
    │   │   ├── TaskFilters.test.tsx
    │   │   ├── TaskList.test.tsx
    │   │   ├── TaskModal.test.tsx
    │   │   ├── auth.test.ts
    │   │   ├── types.test.ts
    │   │   └── setup.ts
    │   ├── 📂 app/
    │   │   ├── 📂 (auth)/
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── 📂 (dashboard)/
    │   │   │   └── tasks/
    │   │   ├── globals.css
    │   │   ├── icon.png
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── 📂 components/
    │   │   └── 📂 tasks/
    │   │       ├── TaskFilters.tsx
    │   │       ├── TaskList.tsx
    │   │       └── TaskModal.tsx
    │   ├── 📂 lib/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   └── 📂 types/
    │       └── index.ts
    ├── .env.example
    ├── next.config.js
    ├── tailwind.config.ts
    ├── vitest.config.ts
    ├── package.json
    └── tsconfig.json
```

</details>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

|                                                   Requirement                                                   | Version |
| :-------------------------------------------------------------------------------------------------------------: | :-----: |
|    ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)     | v18.0+  |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) | v14.0+  |
|           ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)            |  v9.0+  |

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/TaskManagementSystem.git
cd TaskManagementSystem
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Configure your .env file with:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskdb"
# JWT_ACCESS_SECRET="your_super_secret_access_key_here_minimum_32_chars"
# JWT_REFRESH_SECRET="your_super_secret_refresh_key_here_minimum_32_chars"
# PORT=3001
# FRONTEND_URL="http://localhost:3000"

# Run database migrations
npx prisma migrate dev --name init
npx prisma generate

# Start development server
npm run dev
```

> 🌐 Backend runs on `http://localhost:3001`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Configure your .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

> 🌐 Frontend runs on `http://localhost:3000`

---

## 🧪 Testing

<table>
<tr>
<td width="50%">

### Backend Tests (Jest)

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

</td>
<td width="50%">

### Frontend Tests (Vitest)

```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

</td>
</tr>
</table>

---

## 📡 API Reference

### 🔐 Authentication Endpoints

| Method | Endpoint             | Description          | Auth |
| :----: | :------------------- | :------------------- | :--: |
| `POST` | `/api/auth/register` | Register new user    |  ❌  |
| `POST` | `/api/auth/login`    | Login user           |  ❌  |
| `POST` | `/api/auth/refresh`  | Refresh access token |  ❌  |
| `POST` | `/api/auth/logout`   | Logout user          |  ✅  |

### 📝 Task Endpoints

|  Method  | Endpoint                | Description               | Auth |
| :------: | :---------------------- | :------------------------ | :--: |
|  `GET`   | `/api/tasks`            | Get all tasks (paginated) |  ✅  |
|  `POST`  | `/api/tasks`            | Create new task           |  ✅  |
|  `GET`   | `/api/tasks/:id`        | Get task by ID            |  ✅  |
| `PATCH`  | `/api/tasks/:id`        | Update task               |  ✅  |
| `DELETE` | `/api/tasks/:id`        | Delete task               |  ✅  |
|  `POST`  | `/api/tasks/:id/toggle` | Toggle task status        |  ✅  |

### 🔍 Query Parameters

| Parameter |  Type  | Description                                   | Default |
| :-------: | :----: | :-------------------------------------------- | :-----: |
|  `page`   | number | Page number                                   |   `1`   |
|  `limit`  | number | Items per page (max: 100)                     |  `10`   |
| `status`  | string | Filter: `PENDING`, `IN_PROGRESS`, `COMPLETED` |    -    |
| `search`  | string | Search by title                               |    -    |

---

## 🗄️ Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  refreshToken  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  tasks         Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

---

## 🔐 Security Features

| Feature                  | Implementation                   |
| :----------------------- | :------------------------------- |
| 🔑 **Authentication**    | JWT with access & refresh tokens |
| 🔒 **Password Security** | bcrypt hashing                   |
| 🛡️ **Protected Routes**  | Authentication middleware        |
| ✅ **Input Validation**  | Zod schema validation            |
| 🚫 **SQL Injection**     | Prisma ORM protection            |
| 🌐 **CORS**              | Configured allowed origins       |
| 📋 **Security Headers**  | Helmet middleware                |
| ⏱️ **Rate Limiting**     | express-rate-limit               |
| 📦 **Compression**       | Response compression             |

---

## 📜 Available Scripts

<table>
<tr>
<td width="50%">

### Backend

| Script                  | Description             |
| :---------------------- | :---------------------- |
| `npm run dev`           | Start dev server        |
| `npm run build`         | Build for production    |
| `npm start`             | Start production server |
| `npm run migrate`       | Run Prisma migrations   |
| `npm test`              | Run tests               |
| `npm run test:watch`    | Tests in watch mode     |
| `npm run test:coverage` | Test coverage report    |

</td>
<td width="50%">

### Frontend

| Script                  | Description             |
| :---------------------- | :---------------------- |
| `npm run dev`           | Start dev server        |
| `npm run build`         | Build for production    |
| `npm start`             | Start production server |
| `npm test`              | Run tests               |
| `npm run test:watch`    | Tests in watch mode     |
| `npm run test:coverage` | Test coverage report    |

</td>
</tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ using modern web technologies

</div>
