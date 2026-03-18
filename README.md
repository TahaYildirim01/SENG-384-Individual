# Person Management System with Docker

## 📌 Description
This project is a full-stack web application built using React, Express.js, PostgreSQL, and Docker.

The application allows users to:
- Add a person
- View all people
- Update a person
- Delete a person

---

## 🛠 Technologies Used
- Frontend: React (Vite)
- Backend: Node.js / Express
- Database: PostgreSQL
- Containerization: Docker & Docker Compose

---

## 🚀 How to Run the Project

Make sure Docker is installed, then run:

```bash
docker compose up --build

🌐 Application URLs
Frontend: http://localhost:5173
People List Page: http://localhost:5173/people
Backend: http://localhost:5001
API Endpoint: http://localhost:5001/api/people

📡 API Endpoints
GET /api/people → Get all people
GET /api/people/:id → Get a person by ID
POST /api/people → Create a new person
PUT /api/people/:id → Update a person
DELETE /api/people/:id → Delete a person

🗄 Database
PostgreSQL is used as the database
The init.sql file automatically creates the people table
Initial sample data is inserted when the container starts

Project Structure
project-root/
  docker-compose.yml
  .env.example
  backend/
    Dockerfile
    src/
    package.json
  frontend/
    Dockerfile
    src/
    package.json
  db/
    init.sql
  screenshots/

  📸 Screenshots
Screenshots of the application are available in the screenshots/ folder.
✅ Features
Full CRUD operations
Frontend validation (required fields, email format)
Backend validation
Unique email constraint
Proper HTTP status codes
Fully Dockerized application
