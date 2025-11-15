// Class management functions

let editingClassId = null;

// Load and display all classes
function loadClasses() {
    const classes = getData('classes');
    const coaches = getData('coaches');
    const students = getData('students');
    const container = document.getElementById('classes-container');
    const searchTerm = document.getElementById('class-search').value.toLowerCase();
    const sportFilter = document.getElementById('class-sport-filter').value;

    // Filter classes
    let filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm);
        const matchesSport = sportFilter === 'all' || cls.sport === sportFilter;
        return matchesSearch && matchesSport;
    });

    if (filteredClasses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3>No classes found</h3>
                <p>Add your first class to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredClasses.map(cls => {
        const coach = coaches.find(c => c.id === cls.coachId);
        const enrolledCount = cls.enrolledStudents ? cls.enrolledStudents.length : 0;
        const coachName = coach ? coach.name : 'Unassigned';

        return `
        <div class="card">
            <div class="card-header">
                <img src="${getSportImage(cls.sport)}" alt="${cls.sport}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'">
                <div>
                    <div class="card-title">${escapeHtml(cls.name)}</div>
                    <div class="card-subtitle">
                        <span class="sport-badge ${cls.sport.toLowerCase().replace(' ', '-')}">${escapeHtml(cls.sport)}</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <strong>Coach:</strong>
                        <span>${escapeHtml(coachName)}</span>
                    </div>
                    <div class="info-item">
                        <strong>Schedule:</strong>
                        <span>${escapeHtml(cls.schedule)}</span>
                    </div>
                    <div class="info-item">
                        <strong>Capacity:</strong>
                        <span>${enrolledCount} / ${cls.capacity} students</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editClass('${cls.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteClass('${cls.id}')">Delete</button>
            </div>
        </div>
        `;
    }).join('');
}

// Open class modal for adding
function openClassModal() {
    editingClassId = null;
    document.getElementById('class-modal-title').textContent = 'Add Class';
    document.getElementById('class-form').reset();
    document.getElementById('class-id').value = '';
    populateCoachDropdown();
    document.getElementById('class-modal').classList.add('active');
}

// Close class modal
function closeClassModal() {
    document.getElementById('class-modal').classList.remove('active');
    editingClassId = null;
}

// Populate coach dropdown
function populateCoachDropdown() {
    const coaches = getData('coaches');
    const select = document.getElementById('class-coach');
    select.innerHTML = '<option value="">Select Coach</option>';

    coaches.forEach(coach => {
        const option = document.createElement('option');
        option.value = coach.id;
        option.textContent = `${coach.name} (${coach.specialization})`;
        select.appendChild(option);
    });
}

// Edit class
function editClass(id) {
    const classes = getData('classes');
    const classItem = classes.find(c => c.id === id);

    if (classItem) {
        editingClassId = id;
        document.getElementById('class-modal-title').textContent = 'Edit Class';
        document.getElementById('class-id').value = classItem.id;
        document.getElementById('class-name').value = classItem.name;
        document.getElementById('class-sport').value = classItem.sport;
        document.getElementById('class-schedule').value = classItem.schedule;
        document.getElementById('class-capacity').value = classItem.capacity;

        populateCoachDropdown();
        document.getElementById('class-coach').value = classItem.coachId || '';
        document.getElementById('class-modal').classList.add('active');
    }
}

// Save class (add or update)
function saveClass(event) {
    event.preventDefault();

    const classes = getData('classes');
    const classData = {
        id: document.getElementById('class-id').value || generateId(),
        name: document.getElementById('class-name').value.trim(),
        sport: document.getElementById('class-sport').value,
        coachId: document.getElementById('class-coach').value,
        schedule: document.getElementById('class-schedule').value.trim(),
        capacity: parseInt(document.getElementById('class-capacity').value),
        enrolledStudents: editingClassId ?
            (classes.find(c => c.id === editingClassId)?.enrolledStudents || []) :
            []
    };

    if (editingClassId) {
        // Update existing class
        const index = classes.findIndex(c => c.id === editingClassId);
        if (index !== -1) {
            classes[index] = classData;
        }
    } else {
        // Add new class
        classes.push(classData);
    }

    saveData('classes', classes);
    closeClassModal();
    loadClasses();
}

// Delete class
function deleteClass(id) {
    const classes = getData('classes');
    const classItem = classes.find(c => c.id === id);

    if (classItem) {
        openDeleteModal(
            `Are you sure you want to delete ${classItem.name}? This action cannot be undone.`,
            () => {
                const updatedClasses = classes.filter(c => c.id !== id);
                saveData('classes', updatedClasses);
                loadClasses();
            }
        );
    }
}

// Setup search and filter listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('class-search');
    const filterSelect = document.getElementById('class-sport-filter');

    if (searchInput) {
        searchInput.addEventListener('input', loadClasses);
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', loadClasses);
    }
});

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

