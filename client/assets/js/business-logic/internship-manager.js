let internships = [];

const form = document.getElementById('internshipForm');
const listContainer = document.getElementById('internshipList');

// Fetch internships from the server
async function loadInternships() {
  try {
    const response = await fetch('/api/internships');
    if (response.ok) {
      internships = await response.json();
      renderInternships();
    } else if (response.status === 401) {
      // User not authenticated
      window.location.href = '/auth';
    } else {
      console.error('Failed to load internships');
      showError('Failed to load internships');
    }
  } catch (error) {
    console.error('Error loading internships:', error);
    showError('Error loading internships');
  }
}

function renderInternships() {
  listContainer.innerHTML = '';
  if (internships.length === 0) {
    listContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No internships posted yet. Click "Create New Internship" to get started.</p>';
    return;
  }

  internships.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'padding: 2rem; background-color: #f9fafb; border-radius: 0.75rem; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); position: relative;';
    card.innerHTML = `
      <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.5rem; color: #1f2937;">${item.title}</h3>
        <button class="btn-primary" onclick="editInternship(${index})" style="margin-left: auto; padding: 0.5rem 1rem;">Edit</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 1.1rem; margin-bottom: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Location:</strong>
          <span>${item.location}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Stipend:</strong>
          <span>AED ${item.salary}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Type:</strong>
          <span>${item.type}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Duration:</strong>
          <span>${item.duration} weeks</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Deadline:</strong>
          <span>${formatDate(item.deadline)}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.5rem; align-items: center;">
          <strong>Skills:</strong>
          <span>${item.skills}</span>
        </div>
      </div>
      
      <!-- Description at the bottom -->
      <div style="margin-bottom: 1rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 4fr; gap: 0.5rem; align-items: start;">
          <strong>Description:</strong>
          <div>
            <div id="desc-preview-${index}" style="color: #666; line-height: 1.4; word-break: break-word; white-space: pre-wrap; overflow-wrap: break-word;">
              ${item.description ? (item.description.length > 150 ? item.description.substring(0, 150) + '...' : item.description) : 'No description available'}
            </div>
            <div id="desc-full-${index}" style="display: none; color: #666; line-height: 1.4; margin-top: 0.5rem; word-break: break-word; white-space: pre-wrap; overflow-wrap: break-word;">
              ${item.description || 'No description available'}
            </div>
            ${item.description && item.description.length > 150 ? 
              `<button onclick="toggleDescription(${index})" id="desc-btn-${index}" style="
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.4rem 0.8rem;
                margin-top: 0.1rem;
                border-radius: 0.375rem;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.3)'; this.style.background='linear-gradient(135deg, #374151 0%, #4b5563 100%)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.2)'; this.style.background='linear-gradient(135deg, #1f2937 0%, #374151 100%)'">Show More</button>` 
              : ''}
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn-secondary" onclick="deleteInternship(${index})" style="padding: 0.5rem 1rem;">Delete</button>
      </div>
    `;
    listContainer.appendChild(card);
  });
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'background-color: #fee; color: #c33; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; border: 1px solid #fcc;';
  errorDiv.textContent = message;
  listContainer.insertBefore(errorDiv, listContainer.firstChild);
  
  // Remove error after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

// Show success message
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = 'background-color: #efe; color: #3c3; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; border: 1px solid #cfc;';
  successDiv.textContent = message;
  listContainer.insertBefore(successDiv, listContainer.firstChild);
  
  // Remove success after 3 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 3000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const internshipData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    location: document.getElementById('location').value,
    salary: parseFloat(document.getElementById('salary').value),
    type: document.getElementById('type').value,
    skills: document.getElementById('skills').value,
    duration: parseInt(document.getElementById('duration').value),
    deadline: document.getElementById('deadline').value
  };

  const editIndex = document.getElementById('editIndex').value;
  
  try {
    let response;
    if (editIndex !== '') {
      // Update existing internship
      const internshipId = internships[editIndex].id;
      response = await fetch(`/api/internships/${internshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(internshipData)
      });
    } else {
      // Create new internship
      response = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(internshipData)
      });
    }

    if (response.ok) {
      const result = await response.json();
      showSuccess(editIndex !== '' ? 'Internship updated successfully!' : 'Internship created successfully!');
      form.reset();
      document.getElementById('internshipForm').style.display = 'none';
      document.getElementById('editIndex').value = '';
      await loadInternships(); // Reload the list
    } else {
      const error = await response.json();
      showError(error.error || 'Failed to save internship');
    }
  } catch (error) {
    console.error('Error saving internship:', error);
    showError('Error saving internship');
  }
});

function editInternship(index) {
  const item = internships[index];
  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description || '';
  document.getElementById('location').value = item.location;
  document.getElementById('salary').value = item.salary;
  document.getElementById('type').value = item.type;
  document.getElementById('skills').value = item.skills;
  document.getElementById('duration').value = item.duration;
  // Format date for input field (YYYY-MM-DD)
  document.getElementById('deadline').value = new Date(item.deadline).toISOString().split('T')[0];
  document.getElementById('editIndex').value = index;
  
  // Show form and scroll to it
  document.getElementById('internshipForm').style.display = 'flex';
  document.getElementById('internshipForm').scrollIntoView({ behavior: 'smooth' });
}

function showCreateForm() {
  document.getElementById('internshipForm').style.display = 'flex';
  document.getElementById('internshipForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelForm() {
  document.getElementById('internshipForm').style.display = 'none';
  document.getElementById('internshipForm').reset();
  document.getElementById('editIndex').value = '';
}

async function deleteInternship(index) {
  if (confirm('Are you sure you want to delete this internship?')) {
    try {
      const internshipId = internships[index].id;
      const response = await fetch(`/api/internships/${internshipId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showSuccess('Internship deleted successfully!');
        await loadInternships(); // Reload the list
      } else {
        const error = await response.json();
        showError(error.error || 'Failed to delete internship');
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      showError('Error deleting internship');
    }
  }
}

// Toggle description display
function toggleDescription(index) {
  const preview = document.getElementById(`desc-preview-${index}`);
  const full = document.getElementById(`desc-full-${index}`);
  const btn = document.getElementById(`desc-btn-${index}`);
  
  if (full.style.display === 'none') {
    preview.style.display = 'none';
    full.style.display = 'block';
    btn.textContent = 'Show Less';
  } else {
    preview.style.display = 'block';
    full.style.display = 'none';
    btn.textContent = 'Show More';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadInternships();
});