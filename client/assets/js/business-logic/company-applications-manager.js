let allApplications = [];
let filteredApplications = [];
let internshipTitles = [];
let selectedInternships = [];
let selectedStatuses = [];

// DOM elements
const applicationsContainer = document.getElementById('applicationSections');
const searchInput = document.getElementById('searchInput');
const internshipFilterBtn = document.getElementById('internshipFilterBtn');
const internshipFilterDropdown = document.getElementById('internshipFilterDropdown');
const statusFilterBtn = document.getElementById('statusFilterBtn');
const statusFilterDropdown = document.getElementById('statusFilterDropdown');
const clearFiltersBtn = document.getElementById('clearFilters');
const totalApplicationsSpan = document.getElementById('totalApplications');

// Load applications from API
async function loadApplications() {
    try {
        console.log('Loading company applications...');
        const response = await fetch('/api/applications/company');
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch applications');
        }
        
        allApplications = await response.json();
        console.log('Applications loaded:', allApplications);
        
        // Get unique internship titles
        internshipTitles = [...new Set(allApplications.map(app => app.internship_title))];
        
        populateFilters();
        filteredApplications = [...allApplications];
        renderApplications();
        updateStats();
        
    } catch (error) {
        console.error('Error loading applications:', error);
        applicationsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #ef4444;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <p>Error loading applications: ${error.message}</p>
                <button onclick="loadApplications()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Populate filter dropdowns
function populateFilters() {
    // Populate internship filter
    const internshipOptions = document.getElementById('internshipOptions');
    internshipOptions.innerHTML = '';
    
    internshipTitles.forEach(title => {
        const label = document.createElement('label');
        label.style.cssText = `
            display: flex;
            align-items: center;
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 0.25rem;
            transition: background 0.15s;
        `;
        label.onmouseover = function() { this.style.background = '#f3f4f6'; };
        label.onmouseout = function() { this.style.background = 'transparent'; };
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = title;
        checkbox.style.marginRight = '0.5rem';
        checkbox.addEventListener('change', handleInternshipFilterChange);
        
        const span = document.createElement('span');
        span.style.fontSize = '0.9rem';
        span.textContent = title;
        
        label.appendChild(checkbox);
        label.appendChild(span);
        internshipOptions.appendChild(label);
    });
}

// Render applications
function renderApplications() {
    applicationsContainer.innerHTML = '';
    
    if (filteredApplications.length === 0) {
        applicationsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                <h3 style="margin: 0 0 0.5rem 0; color: #374151;">No Applications Found</h3>
                <p style="margin: 0;">No applications match your current filters.</p>
            </div>
        `;
        return;
    }

    // Group applications by internship
    const groupedApplications = {};
    filteredApplications.forEach(app => {
        if (!groupedApplications[app.internship_title]) {
            groupedApplications[app.internship_title] = [];
        }
        groupedApplications[app.internship_title].push(app);
    });

    // Render each internship group
    Object.keys(groupedApplications).forEach(internshipTitle => {
        const applications = groupedApplications[internshipTitle];
        const section = document.createElement('div');
        section.className = 'card';
        section.style.cssText = `
            margin-bottom: 2rem;
            padding: 1.5rem;
            border-radius: 0.75rem;
            background: white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        `;

        header.innerHTML = `
            <h3 style="margin: 0; color: #1f2937; font-size: 1.3rem;">${internshipTitle}</h3>
            <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">
                ${applications.length} application${applications.length !== 1 ? 's' : ''}
            </span>
        `;

        section.appendChild(header);

        // Render applications for this internship
        applications.forEach(app => {
            const appElement = createApplicationElement(app);
            section.appendChild(appElement);
        });

        applicationsContainer.appendChild(section);
    });
}

// Create individual application element
function createApplicationElement(app) {
    const appDiv = document.createElement('div');
    appDiv.style.cssText = `
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: all 0.2s ease;
    `;

    // Add hover effect
    appDiv.addEventListener('mouseenter', function() {
        this.style.background = '#f3f4f6';
        this.style.borderColor = '#d1d5db';
    });
    
    appDiv.addEventListener('mouseleave', function() {
        this.style.background = '#f9fafb';
        this.style.borderColor = '#e5e7eb';
    });

    // Format applied date
    const appliedDate = new Date(app.applied_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Status styling
    const statusColors = {
        'pending': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
        'shortlisted': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
        'accepted': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
        'rejected': { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' }
    };

    const statusStyle = statusColors[app.status] || statusColors['pending'];

    appDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1rem;">
            <div>
                <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1.1rem;">${app.student_name}</h4>
                <p style="margin: 0 0 0.25rem 0; color: #6b7280;"><strong>Email:</strong> ${app.student_email}</p>
                <p style="margin: 0 0 0.25rem 0; color: #6b7280;"><strong>University:</strong> ${app.university || 'Not specified'}</p>
                <p style="margin: 0; color: #6b7280;"><strong>Major:</strong> ${app.major || 'Not specified'}</p>
            </div>
            <div>
                <p style="margin: 0 0 0.25rem 0; color: #6b7280;"><strong>Graduation Year:</strong> ${app.graduation_year || 'Not specified'}</p>
                <p style="margin: 0 0 0.25rem 0; color: #6b7280;"><strong>Applied on:</strong> ${appliedDate}</p>
                <div style="margin-top: 0.5rem;">
                    <span style="
                        background: ${statusStyle.bg}; 
                        color: ${statusStyle.text}; 
                        border: 1px solid ${statusStyle.border};
                        padding: 0.25rem 0.75rem; 
                        border-radius: 9999px; 
                        font-size: 0.75rem; 
                        font-weight: 600;
                        text-transform: uppercase;
                    ">
                        ${app.status}
                    </span>
                </div>
            </div>
        </div>

        ${app.skills ? `
            <div style="margin-bottom: 1rem;">
                <strong style="color: #374151;">Skills:</strong>
                <div style="margin-top: 0.5rem;">
                    ${app.skills.split(',').map(skill => 
                        `<span style="background: #e0e7ff; color: #3730a3; padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; margin-right: 0.5rem; margin-bottom: 0.25rem; display: inline-block;">${skill.trim()}</span>`
                    ).join('')}
                </div>
            </div>
        ` : ''}

        ${app.cover_letter ? `
            <div style="margin-bottom: 1.5rem;">
                <button onclick="showCoverLetter('${app.id}')" style="
                    background: transparent;
                    color: #3b82f6;
                    border: 1px solid #3b82f6;
                    padding: 0.375rem 0.75rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#3b82f6'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#3b82f6'">
                    View Cover Letter
                </button>
            </div>
        ` : ''}

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button onclick="updateApplicationStatus(${app.id}, 'shortlisted')" ${app.status === 'shortlisted' ? 'disabled' : ''} style="
                background: ${app.status === 'shortlisted' ? '#6b7280' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: ${app.status === 'shortlisted' ? 'not-allowed' : 'pointer'};
                transition: all 0.2s;
            ">Shortlist</button>
            
            <button onclick="updateApplicationStatus(${app.id}, 'accepted')" ${app.status === 'accepted' ? 'disabled' : ''} style="
                background: ${app.status === 'accepted' ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: ${app.status === 'accepted' ? 'not-allowed' : 'pointer'};
                transition: all 0.2s;
            ">Accept</button>
            
            <button onclick="updateApplicationStatus(${app.id}, 'rejected')" ${app.status === 'rejected' ? 'disabled' : ''} style="
                background: ${app.status === 'rejected' ? '#6b7280' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: ${app.status === 'rejected' ? 'not-allowed' : 'pointer'};
                transition: all 0.2s;
            ">Reject</button>
        </div>
    `;

    return appDiv;
}

// Update application status
async function updateApplicationStatus(applicationId, newStatus) {
    try {
        const response = await fetch(`/api/applications/${applicationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (response.ok) {
            // Update local data
            const appIndex = allApplications.findIndex(app => app.id === applicationId);
            if (appIndex !== -1) {
                allApplications[appIndex].status = newStatus;
            }

            // Re-filter and render
            filterApplications();
            showSuccessMessage(`Application status updated to ${newStatus}!`);
        } else {
            alert(result.error || 'Failed to update application status');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        alert('An error occurred while updating the application status');
    }
}

// Show cover letter modal
function showCoverLetter(applicationId) {
    const app = allApplications.find(a => a.id == applicationId);
    if (!app || !app.cover_letter) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 1rem;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 0.75rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div>
                <h3 style="margin: 0 0 0.5rem 0; color: #1f2937;">Cover Letter</h3>
                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">${app.student_name} - ${app.internship_title}</p>
            </div>
            <button id="closeCoverLetter" style="
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        </div>
        
        <div style="
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1.5rem;
            white-space: pre-wrap;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #374151;
        ">${app.cover_letter}</div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Handle close
    document.getElementById('closeCoverLetter').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Handle click outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Filter applications
function filterApplications() {
    const searchTerm = searchInput.value.toLowerCase();

    filteredApplications = allApplications.filter(app => {
        const matchesSearch = !searchTerm || 
            app.student_name.toLowerCase().includes(searchTerm) ||
            app.student_email.toLowerCase().includes(searchTerm) ||
            (app.university && app.university.toLowerCase().includes(searchTerm)) ||
            (app.major && app.major.toLowerCase().includes(searchTerm));

        const matchesInternship = selectedInternships.length === 0 || selectedInternships.includes(app.internship_title);
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(app.status);

        return matchesSearch && matchesInternship && matchesStatus;
    });

    renderApplications();
    updateStats();
}

// Update statistics
function updateStats() {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter(app => app.status === 'pending').length;
    const shortlisted = filteredApplications.filter(app => app.status === 'shortlisted').length;
    const accepted = filteredApplications.filter(app => app.status === 'accepted').length;
    const rejected = filteredApplications.filter(app => app.status === 'rejected').length;

    totalApplicationsSpan.innerHTML = `
        <strong>Total:</strong> ${total} applications | 
        <span style="color: #f59e0b;">Pending: ${pending}</span> | 
        <span style="color: #3b82f6;">Shortlisted: ${shortlisted}</span> | 
        <span style="color: #10b981;">Accepted: ${accepted}</span> | 
        <span style="color: #ef4444;">Rejected: ${rejected}</span>
    `;
}

// Handle internship filter changes
function handleInternshipFilterChange(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        selectedInternships.push(value);
    } else {
        selectedInternships = selectedInternships.filter(item => item !== value);
    }
    
    updateInternshipFilterButtonText();
    filterApplications();
}

// Handle status filter changes
function handleStatusFilterChange(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
        selectedStatuses.push(value);
    } else {
        selectedStatuses = selectedStatuses.filter(item => item !== value);
    }
    
    updateStatusFilterButtonText();
    filterApplications();
}

// Update internship filter button text
function updateInternshipFilterButtonText() {
    const buttonText = internshipFilterBtn.querySelector('span');
    if (selectedInternships.length === 0) {
        buttonText.textContent = 'All Internships';
    } else if (selectedInternships.length === 1) {
        buttonText.textContent = selectedInternships[0];
    } else {
        buttonText.textContent = `${selectedInternships.length} Internships Selected`;
    }
}

// Update status filter button text
function updateStatusFilterButtonText() {
    const buttonText = statusFilterBtn.querySelector('span');
    if (selectedStatuses.length === 0) {
        buttonText.textContent = 'All Statuses';
    } else if (selectedStatuses.length === 1) {
        buttonText.textContent = selectedStatuses[0].charAt(0).toUpperCase() + selectedStatuses[0].slice(1);
    } else {
        buttonText.textContent = `${selectedStatuses.length} Statuses Selected`;
    }
}

// Toggle dropdown visibility
function toggleDropdown(dropdownId, buttonId) {
    const dropdown = document.getElementById(dropdownId);
    const button = document.getElementById(buttonId);
    const arrow = button.querySelector('span:last-child');
    
    const isVisible = dropdown.style.display === 'block';
    
    // Close all dropdowns first
    internshipFilterDropdown.style.display = 'none';
    statusFilterDropdown.style.display = 'none';
    document.querySelectorAll('#internshipFilterBtn span:last-child, #statusFilterBtn span:last-child').forEach(arr => {
        arr.style.transform = 'rotate(0deg)';
    });
    
    if (!isVisible) {
        dropdown.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    }
}

// Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    selectedInternships = [];
    selectedStatuses = [];
    
    // Uncheck all checkboxes
    document.querySelectorAll('#internshipOptions input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#statusOptions input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    updateInternshipFilterButtonText();
    updateStatusFilterButtonText();
    filterApplications();
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        z-index: 10001;
        max-width: 400px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
    
    searchInput.addEventListener('input', filterApplications);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Dropdown toggle handlers
    internshipFilterBtn.addEventListener('click', () => toggleDropdown('internshipFilterDropdown', 'internshipFilterBtn'));
    statusFilterBtn.addEventListener('click', () => toggleDropdown('statusFilterDropdown', 'statusFilterBtn'));
    
    // Status filter checkboxes
    document.querySelectorAll('#statusOptions input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleStatusFilterChange);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#internshipFilterBtn') && !event.target.closest('#internshipFilterDropdown')) {
            internshipFilterDropdown.style.display = 'none';
            internshipFilterBtn.querySelector('span:last-child').style.transform = 'rotate(0deg)';
        }
        if (!event.target.closest('#statusFilterBtn') && !event.target.closest('#statusFilterDropdown')) {
            statusFilterDropdown.style.display = 'none';
            statusFilterBtn.querySelector('span:last-child').style.transform = 'rotate(0deg)';
        }
    });
});