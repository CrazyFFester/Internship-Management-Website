document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('authButton').addEventListener('click', function() {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                window.location.href = '/auth';
            });
        } else {
            // Fallback for browsers which doesn't support View Transitions
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease-in-out';
            setTimeout(() => {
                window.location.href = '/auth';
            }, 300);
        }
    });
});