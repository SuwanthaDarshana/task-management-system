# Task Management System

A full-stack to-do task management application built with React, Spring Boot, and MySQL.

![React](https://img.shields.io/badge/React-18-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Tests](https://img.shields.io/badge/Tests-44%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-91%25-brightgreen)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA |
| Database | MySQL 8.0 |
| Containerization | Docker, Docker Compose |
| Testing (Backend) | JUnit 5, Mockito, MockMvc, H2 |
| Testing (Frontend) | Vitest, React Testing Library |

---

## Architecture

```
Browser
  │
  ▼
Frontend (React — nginx :80)
  │
  ├── /          → serves React SPA
  └── /api/      → proxies to Backend
                        │
                        ▼
                  Backend (Spring Boot :8080)
                        │
                        ▼
                  Database (MySQL :3306)
```

---

## Prerequisites

Only **Docker** is required to run this project.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
```

### 2. Build and Run

```bash
docker compose up --build
```

This will:
- Pull all required Docker images
- Build the Spring Boot backend (Maven)
- Build the React frontend (Node.js)
- Start all 3 containers (DB, Backend, Frontend)

> First build takes ~3-5 minutes. Subsequent builds are much faster due to Docker layer caching.

### 3. Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| API Docs | http://localhost:8080/api-docs |

### 4. Stop the Application

```bash
# Stop all containers
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

---

## API Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/v1/tasks` | Create a new task | `{ "title": "", "description": "" }` |
| `GET` | `/api/v1/tasks/recent` | Get latest 5 incomplete tasks | — |
| `PATCH` | `/api/v1/tasks/{id}/complete` | Mark task as completed | — |

### Response Format

All endpoints return a standard response:

```json
{
  "data": { },
  "message": "Task Created Successfully",
  "statusCode": 201
}
```

---

## Project Structure

```
task-management-system/
├── task-service/                   ← Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/mbtech/task_service/
│   │   │   ├── controller/         ← REST Controllers
│   │   │   ├── service/            ← Business Logic
│   │   │   │   └── impl/
│   │   │   ├── repository/         ← Data Access Layer
│   │   │   ├── entity/             ← JPA Entities
│   │   │   ├── dto/                ← Data Transfer Objects
│   │   │   ├── exception/          ← Exception Handling
│   │   │   └── config/             ← Swagger Config
│   │   └── test/                   ← Unit & Integration Tests
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml
│
├── frontend/                       ← React Frontend
│   ├── src/
│   │   ├── components/             ← UI Components
│   │   │   ├── AddTaskForm/
│   │   │   ├── TaskCard/
│   │   │   └── TaskList/
│   │   ├── hooks/                  ← Custom React Hooks
│   │   │   └── useTask.ts
│   │   ├── services/               ← API Service Layer
│   │   │   └── taskService.ts
│   │   └── types/                  ← TypeScript Interfaces
│   │       └── task.types.ts
│   ├── nginx.conf
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Running Tests

### Backend Tests

```bash
cd task-service

# Run all tests
./mvnw test

# Run with coverage report
./mvnw test jacoco:report
```

View coverage report at:
```
task-service/target/site/jacoco/index.html
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npx vitest run

# Run in watch mode
npx vitest
```

---

## Test Coverage

| Layer | Class | Tests |
|---|---|---|
| Backend | TaskServiceTest | 6 tests |
| Backend | TaskControllerTest | 8 tests |
| Backend | TaskRepositoryTest | 4 tests |
| Frontend | TaskCard | 6 tests |
| Frontend | TaskList | 8 tests |
| Frontend | AddTaskForm | 12 tests |
| **Total** | | **44 tests** |

Backend coverage: **91%+** (Jacoco)

---

## Database Schema

The schema is automatically created by Spring Boot on first run.

### `task` Table

| Column | Type | Description |
|---|---|---|
| `id` | BIGINT (PK, AUTO_INCREMENT) | Primary key |
| `title` | VARCHAR(255) NOT NULL | Task title |
| `description` | TEXT NOT NULL | Task description |
| `completed` | BOOLEAN NOT NULL DEFAULT FALSE | Completion status |
| `created_at` | DATETIME NOT NULL | Creation timestamp |

---

## Design Decisions

- **StandardResponseDTO\<T\>** — Generic wrapper ensures all API responses have a consistent structure with `data`, `message`, and `statusCode`
- **Pageable over JPQL LIMIT** — Uses Spring Data `Pageable` for fetching top 5 tasks, which is more portable across databases
- **Custom Hook (useTask)** — Separates all business logic from UI components following the Single Responsibility Principle
- **Multi-stage Docker builds** — Keeps final images lean by separating build and runtime stages
- **Interface + Impl pattern** — `TaskService` interface with `TaskServiceImpl` follows SOLID principles
- **GlobalExceptionHandler** — Centralized error handling with consistent error response format

---

## Environment Variables

The following environment variables are configured in `docker-compose.yml`:

| Variable | Description | Default |
|---|---|---|
| `SPRING_DATASOURCE_URL` | MySQL connection URL | `jdbc:mysql://db:3306/task_db` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `root` |
| `VITE_API_URL` | Frontend API base URL | `/api/v1/tasks` |
