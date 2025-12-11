# Student Management System

A full-stack CRUD (Create, Read, Update, Delete) application for managing student records with a clean, user-friendly interface.

## Features

- ✅ **Add Students** - Create new student records with Name, USN, and Semester
- ✅ **View Students** - Display all students in a structured list with creation dates
- ✅ **Edit Students** - Update student information inline
- ✅ **Delete Students** - Remove student records with confirmation
- ✅ **Search & Filter** - Find students by name, USN, or semester
- ✅ **Dual Storage** - Works with MongoDB (persistent) or in-memory storage (fallback)
- ✅ **Responsive UI** - Clean, modern interface built with HTML, CSS, and JavaScript

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with fallback to in-memory storage)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Package Manager:** npm

## Project Structure

```
CRUD/
├── server.js                 # Express server setup and routes
├── models/
│   └── Student.js           # MongoDB Student schema
├── roots/
│   └── studentrouts.js      # CRUD API endpoints
├── public/
│   ├── index.html           # Main HTML page
│   ├── script.js            # Frontend JavaScript logic
│   └── styles.css           # Styling
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (optional - app falls back to in-memory storage)

### Steps

1. **Clone or navigate to the project folder:**
   ```powershell
   cd c:\Users\User\Downloads\CRUD
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **(Optional) Set up MongoDB:**
   - **Option 1:** Install MongoDB locally
   - **Option 2:** Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

4. **(Optional) Configure MongoDB URI:**
   Create a `.env` file or set an environment variable:
   ```powershell
   $env:MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/studentdb"
   ```

## Running the Application

### Start the Server

```powershell
node server.js
```

**Expected Output:**
```
Server is running on port 3000 with [MongoDB storage / in-memory storage]
Visit http://localhost:3000 in your browser
```

### Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## API Endpoints

All endpoints are prefixed with `/api/students`

### Create a Student
- **POST** `/api/students`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "usn": "4HG22CS001",
    "sem": "4"
  }
  ```

### Get All Students
- **GET** `/api/students`
- **Query Parameters (optional):**
  - `name=John` - Filter by name
  - `usn=4HG22CS001` - Filter by USN
  - `sem=4` - Filter by semester

### Get a Single Student
- **GET** `/api/students/:id`
- **Response:** Student object with ID, name, USN, and semester

### Update a Student
- **PUT** `/api/students/:id`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "usn": "4HG22CS001",
    "sem": "5"
  }
  ```

### Delete a Student
- **DELETE** `/api/students/:id`
- **Response:** Confirmation message with deleted student details

## Usage Guide

### Adding a Student
1. Fill in the form with Name, USN, and Semester
2. Click "Add Student"
3. Student appears in the list below

### Editing a Student
1. Click the "Edit" button on any student card
2. Form is populated with current data
3. Make changes and click "Update Student"
4. Click "Cancel" to discard changes

### Deleting a Student
1. Click the "Delete" button on any student card
2. Confirm deletion in the popup
3. Student is removed from the list

### Searching Students
- Use the query parameters in the API or modify `script.js` to add a search UI

## Storage Options

### In-Memory Storage (Default)
- Used when MongoDB connection fails
- Data is lost when server restarts
- Perfect for development and testing

### MongoDB (Persistent)
- Data persists across server restarts
- Set `MONGODB_URI` environment variable to enable
- Requires MongoDB setup

## Troubleshooting

### "Student validation failed: class is required"
- This error occurs if the schema still expects `class` field
- **Solution:** Restart the server to reload the updated schema
- ```powershell
  # Kill the server process
  taskkill /IM node.exe /F
  
  # Restart
  node server.js
  ```

### MongoDB Connection Fails
- Server automatically falls back to in-memory storage
- Check your `MONGODB_URI` connection string
- Ensure MongoDB is running (local) or cluster is accessible (Atlas)

### Port 3000 Already in Use
- Set a different port:
  ```powershell
  $env:PORT = 3001
  node server.js
  ```

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Student photo upload
- [ ] Grade tracking and reports
- [ ] Batch import/export (CSV/Excel)
- [ ] Email notifications
- [ ] Advanced filtering and sorting UI

## License

This project is open source and available for educational use.

## Support

For issues or questions, check the following:
1. Ensure Node.js and npm are installed
2. Verify MongoDB connection string if using Atlas
3. Check browser console for frontend errors (F12)
4. Check server terminal for backend errors

---

**Happy coding!** 🚀
