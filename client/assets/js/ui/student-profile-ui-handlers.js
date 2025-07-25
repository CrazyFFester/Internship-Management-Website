// UI interaction handlers for student profile page

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for description toggle button hover effects
    const descToggleBtn = document.getElementById('desc-btn');
    if (descToggleBtn) {
        descToggleBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            this.style.background = 'linear-gradient(135deg, #374151 0%, #4b5563 100%)';
        });
        
        descToggleBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            this.style.background = 'linear-gradient(135deg, #1f2937 0%, #374151 100%)';
        });
    }
});