// Coach management functions

let editingCoachId = null;

// Load and display all coaches
function loadCoaches() {
    const coaches = getData('coaches');
    const container = document.getElementById('coaches-container');
    const searchTerm = document.getElementById('coach-search').value.toLowerCase();
    const specializationFilter = document.getElementById('coach-specialization-filter').value;
    
    // Filter coaches
    let filteredCoaches = coaches.filter(coach => {
        const matchesSearch = coach.name.toLowerCase().includes(searchTerm) ||
                             coach.email.toLowerCase().includes(searchTerm);
        const matchesSpecialization = specializationFilter === 'all' || coach.specialization === specializationFilter;
        return matchesSearch && matchesSpecialization;
    });
    
    if (filteredCoaches.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👨‍🏫</div>
                <h3>No coaches found</h3>
                <p>Add your first coach to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredCoaches.map(coach => `
        <div class="card">
            <div class="card-header">
                <img src="${getSportImage(coach.specialization)}" alt="${coach.specialization}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'">
                <div>
                    <div class="card-title">${escapeHtml(coach.name)}</div>
                    <div class="card-subtitle">
                        <span class="sport-badge ${coach.specialization.toLowerCase().replace(' ', '-')}">${escapeHtml(coach.specialization)}</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <div class="info-item">
                        <strong>Experience:</strong>
                        <span>${coach.experience} years</span>
                    </div>
                    <div class="info-item">
                        <strong>Email:</strong>
                        <span>${escapeHtml(coach.email)}</span>
                    </div>
                    <div class="info-item">
                        <strong>Phone:</strong>
                        <span>${escapeHtml(coach.phone)}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit" onclick="editCoach('${coach.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteCoach('${coach.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Open coach modal for adding
function openCoachModal() {
    editingCoachId = null;
    document.getElementById('coach-modal-title').textContent = 'Add Coach';
    document.getElementById('coach-form').reset();
    document.getElementById('coach-id').value = '';
    document.getElementById('coach-modal').classList.add('active');
}

// Close coach modal
function closeCoachModal() {
    document.getElementById('coach-modal').classList.remove('active');
    editingCoachId = null;
}

// Edit coach
function editCoach(id) {
    const coaches = getData('coaches');
    const coach = coaches.find(c => c.id === id);
    
    if (coach) {
        editingCoachId = id;
        document.getElementById('coach-modal-title').textContent = 'Edit Coach';
        document.getElementById('coach-id').value = coach.id;
        document.getElementById('coach-name').value = coach.name;
        document.getElementById('coach-specialization').value = coach.specialization;
        document.getElementById('coach-experience').value = coach.experience;
        document.getElementById('coach-email').value = coach.email;
        document.getElementById('coach-phone').value = coach.phone;
        document.getElementById('coach-modal').classList.add('active');
    }
}

// Save coach (add or update)
function saveCoach(event) {
    event.preventDefault();
    
    const coaches = getData('coaches');
    const formData = {
        id: document.getElementById('coach-id').value || generateId(),
        name: document.getElementById('coach-name').value.trim(),
        specialization: document.getElementById('coach-specialization').value,
        experience: parseInt(document.getElementById('coach-experience').value),
        email: document.getElementById('coach-email').value.trim(),
        phone: document.getElementById('coach-phone').value.trim()
    };
    
    if (editingCoachId) {
        // Update existing coach
        const index = coaches.findIndex(c => c.id === editingCoachId);
        if (index !== -1) {
            coaches[index] = formData;
        }
    } else {
        // Add new coach
        coaches.push(formData);
    }
    
    saveData('coaches', coaches);
    closeCoachModal();
    loadCoaches();
    
    // Reload classes to update coach dropdown
    if (document.getElementById('classes-section').classList.contains('active')) {
        loadClasses();
    }
}

// Delete coach
function deleteCoach(id) {
    const coaches = getData('coaches');
    const coach = coaches.find(c => c.id === id);
    
    if (coach) {
        // Check if coach is assigned to any classes
        const classes = getData('classes');
        const assignedClasses = classes.filter(cls => cls.coachId === id);
        
        if (assignedClasses.length > 0) {
            alert(`Cannot delete ${coach.name}. This coach is assigned to ${assignedClasses.length} class(es). Please reassign or delete those classes first.`);
            return;
        }
        
        openDeleteModal(
            `Are you sure you want to delete ${coach.name}? This action cannot be undone.`,
            () => {
                const updatedCoaches = coaches.filter(c => c.id !== id);
                saveData('coaches', updatedCoaches);
                loadCoaches();
            }
        );
    }
}

// Setup search and filter listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('coach-search');
    const filterSelect = document.getElementById('coach-specialization-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', loadCoaches);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', loadCoaches);
    }
});

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

