# SDEV_255_Final_Project_Group5

## University Course Manager - Group 5

A full-stack web application for managing university courses, built with React, Express.js, and MongoDB. Features professional hash-based routing, course management, and a modern user interface.

## 🎯 Project Status

- ✅ **Stage 1**: **COMPLETE** - Enhanced with hash routing and professional UX
- 🚀 **Stage 2**: Student/Teacher authentication (upcoming)

## 🏗️ Project Structure

```
SDEV_255_Final_Project_Group5/
├── backend/                  # Express.js API server
│   ├── config/              # Database configuration
│   ├── models/              # MongoDB schemas (Course, Student, Teacher)
│   ├── routes/              # API endpoints
│   ├── server.js            # Main server file
│   └── .env                 # Environment variables
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── CourseList.jsx      # Course listing (simplified)
│   │   │   ├── CourseDetail.jsx    # Individual course view/edit
│   │   │   └── AddCourse.jsx       # Course creation form
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── useHash.js         # Hash routing management
│   │   ├── App.jsx         # Main app with hash routing
│   │   └── main.jsx        # React entry point
│   └── index.html          # HTML template
└── README.md
```

## ✨ Key Features

### **Hash-Based Routing**

- **Bookmarkable URLs**: `yoursite.com#/courses/123`
- **Browser Navigation**: Back/forward buttons work
- **Direct Access**: Share links to specific courses
- **Professional UX**: No page refreshes, smooth navigation

### **Course Management**

- **Course List**: Simple table with course codes/names as clickable links
- **Course Details**: Individual pages for each course with full information
- **Inline Editing**: Edit courses directly on their detail pages
- **Smart Navigation**: Logical flow between list → details → edit/delete

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
npm run test:db

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

## 🌐 Application URLs

### **Hash Routes**

| URL             | Page          | Description                 |
| --------------- | ------------- | --------------------------- |
| `#/`            | Home          | Welcome page                |
| `#/courses`     | Course List   | Table of all courses        |
| `#/courses/123` | Course Detail | Individual course view/edit |
| `#/add-course`  | Add Course    | Course creation form        |

### **User Flow**

1. **Course List** → Simple table showing course codes and names
2. **Click Course** → Navigate to detailed course page
3. **Edit Course** → Inline editing on detail page
4. **Delete Course** → Confirmation → Return to course list

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

### Test Frontend Features

1. **Visit**: http://localhost:5173
2. **Test Hash Routing**:
   - Try direct URLs: `localhost:5173#/courses`
   - Use browser back/forward buttons
   - Bookmark a course detail page
3. **Test Course Management**:
   - Navigate from course list to course details
   - Edit a course inline
   - Delete a course with confirmation

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

## 🛠️ Tech Stack

- **Frontend**: React, Vite, CSS, Custom Hooks
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas with Mongoose
- **Routing**: Hash-based client-side routing
- **Tools**: Git, npm, Render, GitHub Pages

## 👥 Team Members

- **Project Lead & Backend**: Terry Lovegrove
- **Frontend Lead**: Samantha Jeannette Lopez

## 📋 Stage 1 Requirements ✅

- [x] **Course Creation**: Professional form with validation
- [x] **Course Viewing**: Simplified list + detailed individual views
- [x] **Course Editing**: Inline editing on detail pages
- [x] **Course Deletion**: Confirmation dialogs + smart navigation
- [x] **Course Information**: Name, description, subject area, credits, code
- [x] **Active Website Links**: Hash-based routing with bookmarkable URLs
- [x] **Enhanced UX**: Professional navigation flow and user experience

## 🔮 Stage 2 Roadmap

- [ ] **User Authentication**: JWT-based login/register system
- [ ] **Role-Based Access**: Different interfaces for students vs teachers
- [ ] **Course Enrollment**: Students can add/drop courses from schedules
- [ ] **User Dashboards**: Personalized views for enrolled courses
- [ ] **Protected Routes**: Authentication-based access control

## 🏗️ Architecture Highlights

### **Custom Hooks**

- `useHash`: Manages hash-based routing state and navigation
- Reusable logic for URL state management
- Clean separation of routing concerns

### **Component Structure**

- **Single Responsibility**: Each component has a clear purpose
- **Reusable Patterns**: Consistent API integration patterns
- **Professional UX**: Loading states, error handling, confirmations

### **Modern Development Practices**

- **Feature Branches**: Clean git workflow with pull requests
- **Component-Based Architecture**: Maintainable and scalable
- **Professional Documentation**: Comprehensive setup instructions

## 📞 Support

If you encounter issues:

1. **Backend Issues**:

   - Ensure MongoDB connection is working (`npm run test:db`)
   - Check that backend is running on port 3000
   - Verify environment variables in `.env` file

2. **Frontend Issues**:

   - Check that frontend is running on port 5173
   - Verify API_BASE_URL in components matches your backend
   - Check browser console for JavaScript errors

3. **Routing Issues**:
   - Hash URLs should include `#` (e.g., `#/courses/123`)
   - Test direct URL access and browser navigation
   - Verify hash routing hook is properly imported

## 🎉 What's New in This Version

- ✨ **Hash-Based Routing**: Professional URL management
- ✨ **CourseDetail Component**: Individual course pages with edit/delete
- ✨ **Simplified CourseList**: Clean table view with navigation links
- ✨ **Custom useHash Hook**: Reusable routing logic
- ✨ **Enhanced User Experience**: Logical navigation flows
- ✨ **Professional Architecture**: Scalable component structure

---

_Last Updated: 2025-07-20 - Stage 1 Enhanced & Complete_ 🚀
