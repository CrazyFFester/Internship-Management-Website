// UI interaction handlers for search internships page

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for search input focus/blur effects
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.classList.add('search-input-focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.classList.remove('search-input-focused');
        });
    }
    
    // Add event listeners for clear filters button hover effects
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('mouseenter', function() {
            this.classList.add('clear-filters-btn-hover');
        });
        
        clearFiltersBtn.addEventListener('mouseleave', function() {
            this.classList.remove('clear-filters-btn-hover');
        });
    }
});

// Function to add hover effects to filter labels
function addFilterLabelHoverEffects(label) {
    label.addEventListener('mouseenter', function() {
        this.classList.add('filter-label-hover');
    });
    
    label.addEventListener('mouseleave', function() {
        this.classList.remove('filter-label-hover');
    });
}

// Function to add hover effects to "show more" buttons
function addShowMoreButtonHoverEffects(button) {
    button.addEventListener('mouseenter', function() {
        this.classList.add('show-more-btn-hover');
    });
    
    button.addEventListener('mouseleave', function() {
        this.classList.remove('show-more-btn-hover');
    });
}