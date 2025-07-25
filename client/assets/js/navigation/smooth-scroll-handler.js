// Smooth Scroll Navigation
// This file adds smooth scrolling to anchor links on the page

// Initialize smooth scrolling when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScrolling();
});

// Set up smooth scrolling for all anchor links
function setupSmoothScrolling() {
    // Find all links that start with # (anchor links)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add smooth scroll behavior to each link
    anchorLinks.forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
}

// Handle clicking on an anchor link
function handleAnchorClick(event) {
    // Prevent default link behavior
    event.preventDefault();
    
    // Get the target element from the link's href (use currentTarget to get the actual link element)
    const href = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(href);
    
    // Scroll to the target element if it exists
    if (targetElement) {
        scrollToElement(targetElement);
        
        // Remove focus from the clicked link
        event.currentTarget.blur();
    }
}

// Smoothly scroll to a specific element
function scrollToElement(element) {
    element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}