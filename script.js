// API base URL
const API_BASE_URL = '/api/students';

// DOM Elements
const studentForm = document.getElementById('student-form');
const studentIdInput = document.getElementById('student-id');
const nameInput = document.getElementById('name');
const usnInput = document.getElementById('usn');
const semInput = document.getElementById('sem');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const studentsList = document.getElementById('students-list');
const noStudentsMessage = document.getElementById('no-students-message');
const connectionStatus = document.getElementById('connection-status');

// Load students on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we're connected to MongoDB or using in-memory storage
    try {
        const response = await fetch('/api/connection-status');
        const status = await response.json();
        if (connectionStatus) {
            if (status.connected) {
                connectionStatus.textContent = 'Connected to MongoDB (persistent storage)';
                connectionStatus.style.color = 'green';
            } else {
                connectionStatus.textContent = 'Currently using in-memory storage (temporary data only)';
                connectionStatus.style.color = 'orange';
            }
        }
    } catch (error) {
        console.error('Error checking connection status:', error);
    }
    
    loadStudents();
});

// Form submission handler
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentData = {
        name: nameInput.value.trim(),
        usn: usnInput.value.trim(),
        sem: semInput.value.trim()
    };
    
    const studentId = studentIdInput.value;
    
    if (studentId) {
        // Update existing student
        await updateStudent(studentId, studentData);
    } else {
        // Create new student
        await createStudent(studentData);
    }
});

// Cancel edit button handler
cancelBtn.addEventListener('click', resetForm);

// Load students from API
async function loadStudents(url = API_BASE_URL) {
    try {
        const response = await fetch(url);
        const students = await response.json();
        
        if (students.length > 0) {
            displayStudents(students);
            noStudentsMessage.style.display = 'none';
        } else {
            studentsList.innerHTML = '';
            noStudentsMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading students:', error);
        studentsList.innerHTML = '<p>Error loading students. Please try again.</p>';
    }
}

// Display students in the UI
function displayStudents(students) {
    studentsList.innerHTML = '';
    
    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';
        studentCard.innerHTML = `
            <div class="student-info">
                <div>
                    <strong>Name:</strong>
                    <span>${student.name}</span>
                </div>
                <div>
                    <strong>USN:</strong>
                    <span>${student.usn}</span>
                </div>
                <div>
                    <strong>Sem:</strong>
                    <span>${student.sem || student.class || ''}</span>
                </div>
                <div>
                    <strong>Created:</strong>
                    <span>${student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="edit-btn" onclick="editStudent('${student._id || student.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteStudent('${student._id || student.id}')">Delete</button>
            </div>
        `;
        studentsList.appendChild(studentCard);
    });
}

// Create a new student
async function createStudent(studentData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Student created:', result);
            resetForm();
            loadStudents();
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Error creating student. Please try again.');
    }
}

// Edit a student
async function editStudent(studentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${studentId}`);
        if (response.ok) {
            const student = await response.json();
            
            // Populate form with student data
            studentIdInput.value = student._id || student.id;
            nameInput.value = student.name;
            usnInput.value = student.usn;
            if (semInput) semInput.value = student.sem || student.class || '';
            
            // Update form UI for editing
            formTitle.textContent = 'Edit Student';
            submitBtn.textContent = 'Update Student';
            cancelBtn.style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Error loading student data.');
        }
    } catch (error) {
        console.error('Error loading student:', error);
        alert('Error loading student data. Please try again.');
    }
}

// Update a student
async function updateStudent(studentId, studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Student updated:', result);
            resetForm();
            loadStudents();
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error updating student:', error);
        alert('Error updating student. Please try again.');
    }
}

// Delete a student
async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${studentId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Student deleted:', result);
                loadStudents();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Error deleting student. Please try again.');
        }
    }
}

// Reset form to initial state
function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Add Student';
    cancelBtn.style.display = 'none';
}