# SDEV_255_Final_Project_Group5

## University Course Manager - Group 5

A full-stack web application for managing university courses, built with React, Express.js, and MongoDB.

## 🎯 Project Status

- ✅ **Stage 1**: Course CRUD operations complete
- 🚀 **Stage 2**: Student/Teacher authentication (upcoming)

## 🏗️ Project Structure

```
SDEV_255_Final_Project_Group5/
├── backend/                  # Express.js API server
│   ├── config/              # Database configuration
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── server.js            # Main server file
│   └── .env                 # Environment variables
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   └── App.jsx          # Main app component
│   └── index.html           # Entry point
└── README.md
```

## ⚡ Quick Start

### Prerequisites

- Node.js 16+
- npm
- MongoDB Atlas account

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# 4. Test database connection
node test-connection.js

# 5. Start development server
npm run dev
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory (in new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/courses`     | Get all courses   |
| GET    | `/api/courses/:id` | Get single course |
| POST   | `/api/courses`     | Create new course |
| PUT    | `/api/courses/:id` | Update course     |
| DELETE | `/api/courses/:id` | Delete course     |

## 🧪 Testing

### Test Backend API

```bash
# Test server health
curl http://localhost:3000

# Test course endpoints
curl http://localhost:3000/api/courses

# Create a test course
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"cname":"Test Course","code":"TEST101","description":"Test","subject_area":"CS","credits":3}'
```

### Test Frontend

1. Visit http://localhost:5173
2. Navigate between Home, Courses, and Add Course pages
3. Test creating and deleting courses

## 🚀 Deployment

### Frontend (GitHub Pages)

```bash
cd frontend
npm run build
npm run deploy
```

### Backend (Render)

1. Connect your GitHub repo to Render
2. Set environment variables in Render dashboard
3. Deploy from `backend/` folder

## 👥 Team Members

- **Project Lead & Backend**: [Terry Lovegrove]
- **Frontend Lead**: [Samantha Jeannette Lopez]

## 📋 Stage 1 Requirements ✅

- [x] Course creation, viewing, editing, and deletion
- [x] MongoDB database integration
- [x] REST API endpoints
- [x] React frontend with navigation
- [x] Professional project structure

## 🔮 Stage 2 Roadmap

- [ ] User authentication (login/register)
- [ ] Student enrollment system
- [ ] Teacher course management
- [ ] Role-based access control

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Tools**: Git, npm, Render, GitHub Pages

## 📞 Support

If you encounter issues:

1. Check that both backend (port 3000) and frontend (port 5173) are running
2. Verify MongoDB connection in backend
3. Check browser console for errors
4. Review API endpoint responses
