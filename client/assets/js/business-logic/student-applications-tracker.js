// Track Applications - Student Application Management
// This file handles displaying and managing student applications

// Global variables for storing applications data
let applications = [];
const applicationListContainer = document.getElementById('applicationList');

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
});

// Load applications from the server
async function loadApplications() {
    try {
        console.log('Loading applications...');
        
        // Fetch applications from the API
        const response = await fetch('/api/applications/student');
        console.log('Response status:', response.status);
        
        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch applications');
        }
        
        // Parse the response data
        applications = await response.json();
        console.log('Applications loaded:', applications);
        
        // Display the applications
        displayApplications();
        
    } catch (error) {
        console.error('Error loading applications:', error);
        showErrorMessage('Error loading applications: ' + error.message);
    }
}

// Display all applications on the page
function displayApplications() {
    // Clear the container
    applicationListContainer.innerHTML = '';
    
    // Check if there are any applications
    if (applications.length === 0) {
        showNoApplicationsMessage();
        return;
    }

    // Create a card for each application
    applications.forEach(application => {
        const applicationCard = createApplicationCard(application);
        applicationListContainer.appendChild(applicationCard);
    });
}

// Create a single application card
function createApplicationCard(app) {
    const card = document.createElement('div');
    card.className = 'application-card';
    
    // Format the dates for display
    const appliedDate = formatDate(app.applied_at);
    const deadline = app.deadline ? formatDate(app.deadline) : 'Not specified';
    
    // Format the salary for display
    const salary = app.salary ? `AED ${app.salary}` : 'Not specified';
    
    // Create the card content
    card.innerHTML = createCardHTML(app, appliedDate, deadline, salary);
    
    return card;
}

// Create the HTML content for an application card
function createCardHTML(app, appliedDate, deadline, salary) {
    return `
        <div class="application-header">
            <div>
                <h3 class="application-title">${app.internship_title}</h3>
                <p class="application-company">${app.company_name}</p>
            </div>
            <span class="application-status status-${app.status}">
                ${app.status}
            </span>
        </div>
        
        <div class="application-details">
            <div>
                <p class="application-detail-item">
                    <strong>Location:</strong> <span>${app.location}</span>
                </p>
                <p class="application-detail-item">
                    <strong>Type:</strong> <span>${app.internship_type || 'Not specified'}</span>
                </p>
            </div>
            <div>
                <p class="application-detail-item">
                    <strong>Salary:</strong> <span>${salary}</span>
                </p>
                <p class="application-detail-item">
                    <strong>Deadline:</strong> <span>${deadline}</span>
                </p>
            </div>
        </div>
        
        <div class="application-footer">
            <p class="application-date">
                <strong>Applied on:</strong> ${appliedDate}
            </p>
            
            ${app.cover_letter ? createCoverLetterButton(app.id) : ''}
        </div>
    `;
}

// Create the cover letter button HTML
function createCoverLetterButton(applicationId) {
    return `
        <button onclick="showCoverLetter('${applicationId}')" class="cover-letter-btn">
            View Cover Letter
        </button>
    `;
}

// Format a date string for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show error message when applications fail to load
function showErrorMessage(message) {
    applicationListContainer.innerHTML = `
        <p class="error-message">${message}</p>
    `;
}

// Show message when no applications exist
function showNoApplicationsMessage() {
    applicationListContainer.innerHTML = `
        <div class="no-applications">
            <div class="no-applications-icon">📝</div>
            <h3>No Applications Yet</h3>
            <p>You haven't applied to any internships yet. 
               <a href="/search-internship">Browse available internships</a> to get started!
            </p>
        </div>
    `;
}

// Show cover letter in a modal popup
function showCoverLetter(applicationId) {
    // Find the application with the given ID
    const app = applications.find(application => application.id == applicationId);
    
    // Check if application exists and has a cover letter
    if (!app || !app.cover_letter) {
        console.error('Application or cover letter not found');
        return;
    }
    
    // Create and show the modal
    const modal = createCoverLetterModal(app);
    document.body.appendChild(modal);
    
    // Set up modal close functionality
    setupModalCloseHandlers(modal);
}

// Create the cover letter modal
function createCoverLetterModal(app) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div>
                <h3 class="modal-title">Cover Letter</h3>
                <p class="modal-subtitle">${app.internship_title} at ${app.company_name}</p>
            </div>
            <button class="modal-close-btn" id="closeCoverLetter">×</button>
        </div>
        
        <div class="modal-body">${app.cover_letter}</div>
    `;
    
    modal.appendChild(modalContent);
    return modal;
}

// Set up event handlers for closing the modal
function setupModalCloseHandlers(modal) {
    // Close button click handler
    const closeButton = modal.querySelector('#closeCoverLetter');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Click outside modal to close
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}