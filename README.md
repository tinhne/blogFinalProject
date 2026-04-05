# 🚀 Blog Management System - Advanced Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A high-performance, production-ready Blog Management System built with **Fastify**, **Prisma**, and **TypeScript**. This project follows "Big Tech" industry standards, featuring a modular architecture, robust security, and horizontally scalable storage.

---

## ✨ Key Features

- **🛡️ Secure Authentication**: JWT-based auth with Refresh Tokens, Password Hashing (Bcrypt), and Email Verification.
- **📝 Content Management**: Full CRUD for Posts, Categories, and Comments with Draft/Published states.
- **🖼️ Media Handling**: High-performance image processing with **Sharp** and cloud storage integration via **AWS S3**.
- **🔍 Advanced Search**: Optimized filtering and search capabilities for blog posts.
- **📈 Efficiency & Security**: Rate limiting, Graceful Shutdown, and detailed logging with **Pino**.
- **📖 API Documentation**: Auto-generated interactive documentation via **Swagger (OpenAPI 3.0)**.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core** | [Fastify](https://www.fastify.io/), [TypeScript](https://www.typescriptlang.org/) |
| **ORM & Database** | [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) |
| **Authentication**| [JWT](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Media** | [AWS S3](https://aws.amazon.com/s3/), [Sharp](https://sharp.pixelplumbing.com/) |
| **Validation** | [Zod](https://zod.dev/) |
| **DevOps** | [Docker](https://www.docker.com/), [pnpm](https://pnpm.io/) |
| **Quality** | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://github.com/typicode/husky) |

---

## 🏛️ System Architecture

The project follows a **Module-based Controller-Service** architecture, ensuring high maintainability and testability.

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
  USER {
    STRING id PK
    STRING email UNIQUE
    STRING name
    STRING passwordHash
    STRING avatarUrl
    DATETIME createdAt
  }
  POST {
    STRING id PK
    STRING title
    STRING content
    BOOLEAN isPublic
    STRING authorId FK
    DATETIME createdAt
  }
  COMMENT {
    STRING id PK
    STRING content
    STRING postId FK
    STRING authorId FK
  }
  USER ||--o{ POST : "author"
  USER ||--o{ COMMENT : "writes"
  POST ||--o{ COMMENT : "has"
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Environment Setup
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Launching the Project
The easiest way to get started is using Docker:
```bash
# Start all services (PostgreSQL + Backend)
docker-compose up -d --build
```
Alternatively, for local development:
```bash
pnpm install
npx prisma generate
pnpm run dev
```

---

## 📖 API Documentation

Once the server is running, you can explore the API documentation at:
- **Swagger UI**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **JSON Spec**: [http://localhost:3000/docs/json](http://localhost:3000/docs/json)

---

## 🛡️ "Big Tech" Production Standards

- **Graceful Shutdown**: Properly handles `SIGTERM/SIGINT` to ensure no data loss during redeployments.
- **Security Hardening**: Integrated security headers and strict CORS policies.
- **Observability**: Structured JSON logging for production monitoring.
- **Stability**: Integrated connection pooling and automated database migrations.

---

## 📂 Project Structure

```text
.
├── prisma/                # Database schema and migrations
├── src/
│   ├── config/            # Centralized configurations (AWS, Env, Logger)
│   ├── modules/           # Feature-based business logic (Auth, Post, User)
│   ├── plugins/           # Fastify plugins (JWT, DB, Swagger)
│   ├── schema/            # Zod validation schemas
│   ├── utils/             # Utility functions (Email, Token, File)
│   └── server.ts          # Application entry point
├── docker-compose.yml     # Infrastructure orchestration
└── package.json           # Dependencies and scripts
```


