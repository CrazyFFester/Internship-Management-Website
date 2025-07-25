// UI interaction handlers for view & manage applications page

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for search input focus/blur effects
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.classList.add('search-focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.classList.remove('search-focused');
        });
    }
    
    // Add event listeners for clear filters button hover effects
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        clearFiltersBtn.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    }
    
    // Add event listeners for filter option labels hover effects
    const filterOptionLabels = document.querySelectorAll('.filter-option-label');
    filterOptionLabels.forEach(label => {
        label.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        label.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
});