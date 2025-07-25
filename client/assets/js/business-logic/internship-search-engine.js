let allInternships = [];
let filteredInternships = [];
let userApplications = []; // Track user's applications
let selectedTypes = [];
let selectedLocations = [];
let selectedSalaryRanges = [];
let selectedDeadlines = [];

const listContainer = document.getElementById('internshipList');
const searchInput = document.getElementById('search');
const resultsCount = document.getElementById('resultsCount');

// Filter containers
const typeOptions = document.getElementById('typeOptions');
const locationOptions = document.getElementById('locationOptions');
const salaryOptions = document.getElementById('salaryOptions');
const deadlineOptions = document.getElementById('deadlineOptions');

const clearFiltersBtn = document.getElementById('clearFilters');

// Load user's applications
async function loadUserApplications() {
    try {
        console.log('🔍 Loading user applications...');
        const response = await fetch('/api/applications/student');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            userApplications = await response.json();
            console.log('✅ Loaded user applications:', userApplications.length);
            console.log('📋 Applications data:', userApplications);
        } else {
            console.log('⚠️ Response not OK:', response.status, response.statusText);
            userApplications = [];
        }
    } catch (error) {
        console.error('❌ Error loading user applications:', error);
        userApplications = [];
    }
}

// Load internships from API
async function loadInternships() {
    try {
        // Load both internships and user applications
        await Promise.all([
            loadUserApplications(),
            fetch('/api/internships/search').then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch internships: ${response.status} ${response.statusText}`);
                }
                return response.json();
            }).then(data => {
                allInternships = data;
            })
        ]);
        
        console.log('Loaded internships:', allInternships.length);
        filteredInternships = [...allInternships];
        
        // Populate filter options dynamically
        populateFilterOptions();
        renderInternships(filteredInternships);
        
    } catch (error) {
        console.error('Error loading internships:', error);
        listContainer.innerHTML = '<p class="error-message">Error loading internships: ' + error.message + '</p>';
        resultsCount.textContent = 'Error loading internships';
    }
}

// Populate filter dropdown options based on available data
function populateFilterOptions() {
    // Get unique values for filters
    const types = [...new Set(allInternships.map(intern => intern.internship_type).filter(Boolean))];
    
    // Count location frequency and get top 5
    const locationCounts = {};
    allInternships.forEach(intern => {
        if (intern.location) {
            locationCounts[intern.location] = (locationCounts[intern.location] || 0) + 1;
        }
    });
    
    const sortedLocations = Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([location]) => location);
    
    const popularLocations = sortedLocations.slice(0, 5);
    const otherLocations = sortedLocations.slice(5);
    
    // Populate type filter
    typeOptions.innerHTML = '';
    types.forEach(type => {
        const label = createFilterOption(type, type.charAt(0).toUpperCase() + type.slice(1), updateTypeFilter);
        typeOptions.appendChild(label);
    });
    
    // Populate location filter
    locationOptions.innerHTML = '';
    
    // Popular locations
    popularLocations.forEach(location => {
        const label = createLocationOption(location, locationCounts[location]);
        locationOptions.appendChild(label);
    });
    
    // Show more button if there are other locations
    if (otherLocations.length > 0) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = `Show ${otherLocations.length} more locations`;
        showMoreBtn.type = 'button';
        showMoreBtn.className = 'show-more-btn';
        
        // Add hover effects
        if (typeof addShowMoreButtonHoverEffects === 'function') {
            addShowMoreButtonHoverEffects(showMoreBtn);
        }
        
        showMoreBtn.addEventListener('click', () => {
            showMoreBtn.style.display = 'none';
            otherLocations.forEach(location => {
                const label = createLocationOption(location, locationCounts[location]);
                locationOptions.appendChild(label);
            });
        });
        
        locationOptions.appendChild(showMoreBtn);
    }
}

function createFilterOption(value, text, changeHandler) {
    const label = document.createElement('label');
    label.className = 'filter-label';
    
    // Add hover effects
    if (typeof addFilterLabelHoverEffects === 'function') {
        addFilterLabelHoverEffects(label);
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value;
    checkbox.addEventListener('change', changeHandler);
    
    const span = document.createElement('span');
    span.textContent = text;
    
    label.appendChild(checkbox);
    label.appendChild(span);
    
    return label;
}

function createLocationOption(location, count) {
    const label = document.createElement('label');
    label.className = 'location-filter-label';
    
    const leftDiv = document.createElement('div');
    leftDiv.className = 'location-filter-left';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = location;
    checkbox.addEventListener('change', updateLocationFilter);
    
    const span = document.createElement('span');
    span.textContent = location;
    
    const countSpan = document.createElement('span');
    countSpan.textContent = count;
    countSpan.className = 'location-count';
    
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);
    label.appendChild(leftDiv);
    label.appendChild(countSpan);
    
    return label;
}

function renderInternships(data) {
    console.log('Rendering internships:', data.length);
    listContainer.innerHTML = '';
    
    // Update results count
    resultsCount.textContent = `${data.length} internship${data.length !== 1 ? 's' : ''} found`;
    console.log('Updated results count to:', resultsCount.textContent);
    
    if (data.length === 0) {
        listContainer.innerHTML = '<p class="no-results">No internships found matching your criteria.</p>';
        return;
    }

    data.forEach(intern => {
        const card = document.createElement('div');
        card.className = 'internship-card';
        
        // Format deadline
        const deadline = intern.deadline ? new Date(intern.deadline).toLocaleDateString() : 'Not specified';
        
        // Format salary
        const salary = intern.salary ? `AED ${intern.salary}` : 'Not specified';
        
        card.innerHTML = `
            <div class="internship-header">
                <h3 class="internship-title">${intern.title}</h3>
                <span class="internship-type-badge">
                    ${intern.internship_type || 'Not specified'}
                </span>
            </div>
            
            <div class="internship-details">
                <p class="internship-detail"><strong>Company:</strong> <span>${intern.company_name}</span></p>
                <p class="internship-detail"><strong>Location:</strong> <span>${intern.location}</span></p>
                <p class="internship-detail"><strong>Salary:</strong> <span>${salary}</span></p>
                <p class="internship-detail"><strong>Duration:</strong> <span>${intern.duration ? intern.duration + ' weeks' : 'Not specified'}</span></p>
                <p class="internship-detail"><strong>Skills:</strong> <span>${intern.skills || 'Not specified'}</span></p>
                <p class="internship-detail"><strong>Deadline:</strong> <span>${deadline}</span></p>
            </div>
            
            ${intern.description ? `
                <div class="internship-description">
                    <strong>Description:</strong>
                    <div class="description-content">
                        <div id="desc-preview-${intern.id}" class="description-preview">
                            ${intern.description.length > 150 ? intern.description.substring(0, 150) + '...' : intern.description}
                        </div>
                        <div id="desc-full-${intern.id}" class="description-full">
                            ${intern.description}
                        </div>
                        ${intern.description.length > 150 ? `
                            <button onclick="toggleDescription(${intern.id})" id="desc-btn-${intern.id}" class="description-toggle-btn">Show More</button>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="internship-actions">
                ${getApplyButtonHTML(intern.id)}
            </div>
        `;
        
        listContainer.appendChild(card);
    });
}

// Check if user has already applied to this internship
function hasUserApplied(internshipId) {
    const hasApplied = userApplications.some(app => {
        // Convert both to strings for comparison to handle type differences
        return String(app.internship_id) === String(internshipId);
    });
    console.log(`🔍 Check internship ${internshipId}: hasApplied = ${hasApplied}`);
    if (userApplications.length > 0) {
        console.log(`📋 Application IDs: ${userApplications.map(app => app.internship_id).join(', ')}`);
    }
    return hasApplied;
}

// Get appropriate Apply button HTML based on application status
function getApplyButtonHTML(internshipId) {
    if (hasUserApplied(internshipId)) {
        return `<button class="apply-btn applied" disabled>Applied</button>`;
    } else {
        return `<button onclick="applyToInternship(${internshipId})" class="apply-btn">Apply Now</button>`;
    }
}

// Toggle description display
function toggleDescription(internshipId) {
    const descPreview = document.getElementById(`desc-preview-${internshipId}`);
    const descFull = document.getElementById(`desc-full-${internshipId}`);
    const descBtn = document.getElementById(`desc-btn-${internshipId}`);
    
    if (descPreview && descFull && descBtn) {
        if (descFull.style.display === 'none') {
            // Show full description
            descPreview.style.display = 'none';
            descFull.style.display = 'block';
            descBtn.textContent = 'Show Less';
        } else {
            // Show preview description
            descPreview.style.display = 'block';
            descFull.style.display = 'none';
            descBtn.textContent = 'Show More';
        }
    }
}

// Apply to internship function
async function applyToInternship(internshipId) {
    // Create modal for cover letter
    const modal = document.createElement('div');
    modal.className = 'application-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    modalContent.innerHTML = `
        <h3 class="modal-title">Apply for Internship</h3>
        <p class="modal-description">Write a brief cover letter explaining why you're interested in this position (optional):</p>
        
        <textarea id="coverLetter" placeholder="Dear Hiring Manager,

I am writing to express my interest in this internship position..." 
            class="cover-letter-textarea"></textarea>
        
        <div class="modal-actions">
            <button id="submitApplication" class="modal-submit-btn">Submit Application</button>
            <button id="cancelApplication" class="modal-cancel-btn">Cancel</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Focus on textarea
    setTimeout(() => {
        document.getElementById('coverLetter').focus();
    }, 100);
    
    // Handle submit
    document.getElementById('submitApplication').addEventListener('click', async () => {
        const coverLetter = document.getElementById('coverLetter').value.trim();
        const submitBtn = document.getElementById('submitApplication');
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';
        
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    internship_id: internshipId,
                    cover_letter: coverLetter
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Success
                document.body.removeChild(modal);
                
                // Add to userApplications array to maintain state
                userApplications.push({
                    internship_id: parseInt(internshipId), // Ensure consistent type
                    application_id: result.application_id,
                    status: 'pending'
                });
                console.log('✅ Added application to local cache:', internshipId);
                
                // Show success message
                showSuccessMessage('Application submitted successfully! You can track your applications in the "Track Applications" page.');
                
                // Update the apply button for this internship
                const applyButton = document.querySelector(`button[onclick="applyToInternship(${internshipId})"]`);
                if (applyButton) {
                    applyButton.textContent = 'Applied';
                    applyButton.disabled = true;
                    applyButton.className = 'apply-btn applied';
                    applyButton.onclick = null;
                }
            } else {
                // Error
                alert(result.error || 'Failed to submit application. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
                submitBtn.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
            submitBtn.style.opacity = '1';
        }
    });
    
    // Handle cancel
    document.getElementById('cancelApplication').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Handle click outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }
    }, 5000);
}

// Filter update functions
function updateTypeFilter() {
    selectedTypes = Array.from(typeOptions.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    filterInternships();
}

function updateLocationFilter() {
    selectedLocations = Array.from(locationOptions.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    filterInternships();
}

function updateSalaryFilter() {
    selectedSalaryRanges = Array.from(salaryOptions.querySelectorAll('input[type="checkbox"]:checked')).map(cb => parseInt(cb.value));
    filterInternships();
}

function updateDeadlineFilter() {
    selectedDeadlines = Array.from(deadlineOptions.querySelectorAll('input[type="checkbox"]:checked')).map(cb => parseInt(cb.value));
    filterInternships();
}

function filterInternships() {
    const search = searchInput.value.toLowerCase();

    filteredInternships = allInternships.filter(intern => {
        const matchesSearch = !search || 
            intern.title.toLowerCase().includes(search) || 
            intern.company_name.toLowerCase().includes(search) ||
            (intern.description && intern.description.toLowerCase().includes(search)) ||
            (intern.skills && intern.skills.toLowerCase().includes(search));
            
        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(intern.location);
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(intern.internship_type);
        
        const matchesSalary = selectedSalaryRanges.length === 0 || selectedSalaryRanges.some(range => {
            if (range === 0) return intern.salary === 0 || intern.salary === null;
            if (range === 1) return intern.salary > 0 && intern.salary < 44;
            if (range === 1000) return intern.salary >= 44 && intern.salary < 220;
            if (range === 5000) return intern.salary >= 220 && intern.salary < 440;
            if (range === 10000) return intern.salary >= 440 && intern.salary < 1100;
            if (range === 25000) return intern.salary >= 1100 && intern.salary < 2000;
            if (range === 50000) return intern.salary >= 2000;
            return false;
        });
        
        const matchesDeadline = selectedDeadlines.length === 0 || selectedDeadlines.some(days => {
            if (!intern.deadline) return days === 999; // No deadline
            const deadlineDate = new Date(intern.deadline);
            const today = new Date();
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (days === 7) return diffDays <= 7 && diffDays > 0;
            if (days === 30) return diffDays <= 30 && diffDays > 0;
            if (days === 90) return diffDays <= 90 && diffDays > 0;
            if (days === 999) return diffDays > 90 || diffDays <= 0;
            return false;
        });

        return matchesSearch && matchesLocation && matchesSalary && matchesType && matchesDeadline;
    });
    
    renderInternships(filteredInternships);
}


// Clear all filters
function clearAllFilters() {
    selectedTypes = [];
    selectedLocations = [];
    selectedSalaryRanges = [];
    selectedDeadlines = [];
    searchInput.value = '';
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Filter internships
    filterInternships();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadInternships();
    
    // Search input
    searchInput.addEventListener('input', filterInternships);
    
    // Filter checkboxes event listeners
    salaryOptions.addEventListener('change', updateSalaryFilter);
    deadlineOptions.addEventListener('change', updateDeadlineFilter);
    
    // Clear filters button
    clearFiltersBtn.addEventListener('click', clearAllFilters);
});