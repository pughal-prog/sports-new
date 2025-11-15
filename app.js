// App initialization and utility functions
let currentDeleteCallback = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupNavigation();
    initializeData();
});

// Initialize the application
function initializeApp() {
    // Show academy section by default
    showSection('academy');
}

// Setup navigation between sections
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            showSection(section);
            
            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load data for the section
    if (sectionName === 'academy') {
        // Academy section doesn't need data loading
        return;
    } else if (sectionName === 'students') {
        loadStudents();
    } else if (sectionName === 'coaches') {
        loadCoaches();
    } else if (sectionName === 'classes') {
        loadClasses();
    }
}

// Initialize data storage
function initializeData() {
    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([]));
    }
    if (!localStorage.getItem('coaches')) {
        localStorage.setItem('coaches', JSON.stringify([]));
    }
    if (!localStorage.getItem('classes')) {
        localStorage.setItem('classes', JSON.stringify([]));
    }
}

// Utility function to get data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Utility function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Utility function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Delete confirmation modal
function openDeleteModal(message, callback) {
    currentDeleteCallback = callback;
    const modal = document.getElementById('delete-modal');
    const messageEl = document.getElementById('delete-message');
    messageEl.textContent = message;
    modal.classList.add('active');
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('active');
    currentDeleteCallback = null;
}

function confirmDelete() {
    if (currentDeleteCallback) {
        currentDeleteCallback();
        closeDeleteModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Get sport image path
function getSportImage(sport) {
    if (sport === 'Fencing') {
        return 'https://images.unsplash.com/photo-1551524164-6cf77f7e7b8f?w=400&h=400&fit=crop';
    } else if (sport === 'Table Tennis') {
        return 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop';
}

