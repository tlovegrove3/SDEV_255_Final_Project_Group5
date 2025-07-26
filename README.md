# SDEV_255_Final_Project_Group5

## University Course Manager - Group 5

A full-stack web application for managing university courses, built with React, Express.js, and MongoDB. Features professional hash-based routing, course management, and a modern user interface.

## 🎯 Project Status

- ✅ **Stage 1**: **COMPLETE** - Enhanced with hash routing and professional UX
- ✅ **Stage 2**: **COMPLETE** - Full authentication system with role-based access

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
│   │   │   ├── CourseList.jsx      # Course listing
│   │   │   ├── CourseDetail.jsx    # Individual course view/edit
│   │   │   ├── AddCourse.jsx       # Course creation form
│   │   │   ├── Login.jsx           # Authentication form
│   │   │   ├── Register.jsx        # User registration
│   │   │   ├── MyCourses.jsx       # Student course dashboard
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── contexts/        # State management
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.js          # Authentication utilities
│   │   │   └── useHash.js          # Hash routing management
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # React entry point
│   └── index.html          # HTML template
└── README.md
```

## ✨ Key Features

### **Authentication System**

- **User Registration**: Student/teacher role-based registration
- **Secure Login**: JWT token-based authentication
- **Role-Based Access**: Protected routes for students vs teachers
- **Password Security**: bcrypt hashing with salt rounds

### **Course Management**

- **Student Features**: Browse and enroll in courses
- **Teacher Features**: Create, edit, and delete courses
- **My Courses**: Personal dashboard for enrolled students
- **Protected Operations**: Authentication-required actions

### **Hash-Based Routing**

- **Bookmarkable URLs**: Direct links to specific pages
- **Browser Navigation**: Full back/forward button support
- **Protected Routes**: Authentication-based access control
- **Professional UX**: Smooth SPA navigation

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

| URL                    | Page             | Description                    | Access      |
| ---------------------- | ---------------- | ------------------------------ | ----------- |
| `#/`                   | Home             | Welcome page                   | Public      |
| `#/login`              | Login            | User authentication            | Public      |
| `#/register`           | Register         | User registration              | Public      |
| `#/courses`            | Course List      | Browse all courses             | Public      |
| `#/courses/123`        | Course Detail    | Individual course view/edit    | Public      |
| `#/my-courses`         | My Courses       | Student enrollment dashboard   | Student     |
| `#/add-course`         | Add Course       | Course creation form           | Teacher     |
| `#/student-dashboard`  | Student View     | Student-specific interface     | Student     |
| `#/teacher-dashboard`  | Teacher View     | Teacher-specific interface     | Teacher     |

### **User Flow**

**For Students:**
1. **Register/Login** → Authentication required
2. **Browse Courses** → View available courses
3. **Enroll in Courses** → Add to personal schedule
4. **My Courses** → Manage enrolled courses

**For Teachers:**
1. **Register/Login** → Authentication required
2. **Manage Courses** → Create, edit, delete courses
3. **View Enrollments** → See student participation
4. **Course Administration** → Full CRUD operations

## 🔗 API Endpoints

### **Authentication**
| Method | Endpoint             | Description            | Access |
| ------ | -------------------- | ---------------------- | ------ |
| POST   | `/api/auth/register` | Register student/teacher | Public |
| POST   | `/api/auth/login`    | User authentication     | Public |

### **Courses**
| Method | Endpoint           | Description       | Access  |
| ------ | ------------------ | ----------------- | ------- |
| GET    | `/api/courses`     | Get all courses   | Public  |
| GET    | `/api/courses/:id` | Get single course | Public  |
| POST   | `/api/courses`     | Create new course | Teacher |
| PUT    | `/api/courses/:id` | Update course     | Teacher |
| DELETE | `/api/courses/:id` | Delete course     | Teacher |

### **Student Enrollment**
| Method | Endpoint                    | Description           | Access  |
| ------ | --------------------------- | --------------------- | ------- |
| POST   | `/api/students/enroll`      | Enroll in course      | Student |
| DELETE | `/api/students/enroll/:id`  | Drop course           | Student |
| GET    | `/api/students/my-courses`  | Get enrolled courses  | Student |

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

- **Frontend**: React, Vite, CSS, Custom Hooks, Context API
- **Backend**: Express.js, Node.js, JWT, bcrypt
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT tokens, password hashing
- **Routing**: Hash-based client-side routing with protection
- **Tools**: Git, npm, Render, GitHub Pages

## 👥 Team Members

- **Project Lead & Backend**: Terry Lovegrove
- **Frontend Lead**: Samantha Jeannette Lopez

## 📋 Requirements Complete ✅

### **Stage 1 Requirements**
- [x] **Course Creation**: Professional form with validation
- [x] **Course Viewing**: Simplified list + detailed individual views
- [x] **Course Editing**: Inline editing on detail pages
- [x] **Course Deletion**: Confirmation dialogs + smart navigation
- [x] **Course Information**: Name, description, subject area, credits, code
- [x] **Active Website Links**: Hash-based routing with bookmarkable URLs
- [x] **Enhanced UX**: Professional navigation flow and user experience

### **Stage 2 Requirements**
- [x] **User Authentication**: JWT-based login/register system
- [x] **Role-Based Access**: Different interfaces for students vs teachers
- [x] **Course Enrollment**: Students can add/drop courses from schedules
- [x] **User Dashboards**: Personalized views for enrolled courses
- [x] **Protected Routes**: Authentication-based access control
- [x] **Password Security**: bcrypt hashing with salt rounds
- [x] **Session Management**: JWT token-based authentication

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

## 🎉 Latest Updates

### **Stage 2 Complete - Full Authentication System**
- ✨ **JWT Authentication**: Secure login/logout with token management
- ✨ **Role-Based Access Control**: Student and teacher specific features
- ✨ **Course Enrollment**: Students can enroll/drop courses
- ✨ **Protected Routes**: Authentication-required navigation
- ✨ **Password Security**: bcrypt hashing implementation
- ✨ **User Registration**: Role-based account creation
- ✨ **Professional UI**: Context-based state management

### **Previous Updates**
- ✅ **Hash-Based Routing**: Professional URL management
- ✅ **CourseDetail Component**: Individual course pages with edit/delete
- ✅ **Simplified CourseList**: Clean table view with navigation links
- ✅ **Custom useHash Hook**: Reusable routing logic
- ✅ **Enhanced User Experience**: Logical navigation flows
- ✅ **Professional Architecture**: Scalable component structure

---

_Last Updated: 2025-07-26 - Stage 2 Complete - Full Authentication System_ 🚀
