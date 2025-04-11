/**
 * Dark mode toggle functionality for Kouvr website
 * This file handles the dark mode toggle button
 */

// Main dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Always start in light mode by default
    html.classList.remove('dark');
    localStorage.removeItem('darkMode');
    
    // Add click event listener
    darkModeToggle.addEventListener('click', function() {
        if (html.classList.contains('dark')) {
            // Switch to light mode
            html.classList.remove('dark');
            showToast('Light mode activated');
        } else {
            // Switch to dark mode
            html.classList.add('dark');
            showToast('Dark mode activated');
        }
    });
    
    // Add keyboard shortcut for dark mode toggle (Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key === 'D') {
            darkModeToggle.click();
        }
    });
    
    // Add tooltip
    darkModeToggle.setAttribute('title', 'Toggle Dark Mode (Shift+D)');
}

// Toast notification function
function showToast(message, duration = 3000) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
