// Student management functions

let editingStudentId = null;

// Load and display all students
function loadStudents() {
    const students = getData('students');
    const container = document.getElementById('students-container');
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const sportFilter = document.getElementById('student-sport-filter').value;
    
    // Filter students
    let filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                             student.email.toLowerCase().includes(searchTerm);
        const matchesSport = sportFilter === 'all' || student.sport === sportFilter;
        return matchesSearch && matchesSport;
    });
    
    if (filteredStudents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>No students found</h3>
                <p>Add your first student to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredStudents.map(student => `
        <div class="card">
            <div class="card-header">
                <img src="${getSportImage(student.sport)}" alt="${student.sport}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'">
                <div>
                    <div class="card-title">${escapeHtml(student.name)}</div>
                    <div class="card-subtitle">
                        <span class="sport-badge ${student.sport.toLowerCase().replace(' ', '-')}">${escapeHtml(student.sport)}</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <strong>Age:</strong>
                        <span>${student.age} years</span>
                    </div>
                    <div class="info-item">
                        <strong>Email:</strong>
                        <span>${escapeHtml(student.email)}</span>
                    </div>
                    <div class="info-item">
                        <strong>Phone:</strong>
                        <span>${escapeHtml(student.phone)}</span>
                    </div>
                    <div class="info-item">
                        <strong>Enrolled:</strong>
                        <span>${formatDate(student.enrollmentDate)}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editStudent('${student.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Open student modal for adding
function openStudentModal() {
    editingStudentId = null;
    document.getElementById('student-modal-title').textContent = 'Add Student';
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal').classList.add('active');
}

// Close student modal
function closeStudentModal() {
    document.getElementById('student-modal').classList.remove('active');
    editingStudentId = null;
}

// Edit student
function editStudent(id) {
    const students = getData('students');
    const student = students.find(s => s.id === id);
    
    if (student) {
        editingStudentId = id;
        document.getElementById('student-modal-title').textContent = 'Edit Student';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-age').value = student.age;
        document.getElementById('student-sport').value = student.sport;
        document.getElementById('student-email').value = student.email;
        document.getElementById('student-phone').value = student.phone;
        document.getElementById('student-enrollment-date').value = student.enrollmentDate;
        document.getElementById('student-modal').classList.add('active');
    }
}

// Save student (add or update)
function saveStudent(event) {
    event.preventDefault();
    
    const students = getData('students');
    const formData = {
        id: document.getElementById('student-id').value || generateId(),
        name: document.getElementById('student-name').value.trim(),
        age: parseInt(document.getElementById('student-age').value),
        sport: document.getElementById('student-sport').value,
        email: document.getElementById('student-email').value.trim(),
        phone: document.getElementById('student-phone').value.trim(),
        enrollmentDate: document.getElementById('student-enrollment-date').value
    };
    
    if (editingStudentId) {
        // Update existing student
        const index = students.findIndex(s => s.id === editingStudentId);
        if (index !== -1) {
            students[index] = formData;
        }
    } else {
        // Add new student
        students.push(formData);
    }
    
    saveData('students', students);
    closeStudentModal();
    loadStudents();
}

// Delete student
function deleteStudent(id) {
    const students = getData('students');
    const student = students.find(s => s.id === id);
    
    if (student) {
        openDeleteModal(
            `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
            () => {
                const updatedStudents = students.filter(s => s.id !== id);
                saveData('students', updatedStudents);
                
                // Also remove student from classes
                const classes = getData('classes');
                classes.forEach(cls => {
                    if (cls.enrolledStudents && cls.enrolledStudents.includes(id)) {
                        cls.enrolledStudents = cls.enrolledStudents.filter(sId => sId !== id);
                    }
                });
                saveData('classes', classes);
                
                loadStudents();
            }
        );
    }
}

// Setup search and filter listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('student-search');
    const filterSelect = document.getElementById('student-sport-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', loadStudents);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', loadStudents);
    }
});

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

