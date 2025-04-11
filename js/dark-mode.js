/**
 * Enhanced dark mode functionality for Kouvr website
 * This file extends the dark mode toggle with additional features
 */

// Enhanced dark mode functionality
function enhanceDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for system preference on initial load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (localStorage.getItem('darkMode') === null) {
            // Only apply if user hasn't set a preference
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        }
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (localStorage.getItem('darkMode') === null) {
            // Only apply if user hasn't set a preference
            if (event.matches) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    });
    
    // Apply dark mode to all elements that need special handling
    function applyDarkMode(isDark) {
        // Update icon in toggle button
        const darkIcon = darkModeToggle.querySelector('.dark\\:hidden');
        const lightIcon = darkModeToggle.querySelector('.hidden.dark\\:inline');
        
        if (isDark) {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            
            // Add dark mode specific classes to elements
            document.querySelectorAll('[data-dark-class]').forEach(el => {
                el.classList.add(el.dataset.darkClass);
            });
        } else {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            
            // Remove dark mode specific classes from elements
            document.querySelectorAll('[data-dark-class]').forEach(el => {
                el.classList.remove(el.dataset.darkClass);
            });
        }
    }
    
    // Initialize dark mode state
    applyDarkMode(html.classList.contains('dark'));
    
    // Override the existing click handler
    darkModeToggle.addEventListener('click', function() {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
            applyDarkMode(false);
            showToast('Light mode activated');
        } else {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            applyDarkMode(true);
            showToast('Dark mode activated');
        }
    });
    
    // Add keyboard shortcut for dark mode toggle (Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key === 'D') {
            darkModeToggle.click();
        }
    });
}

// Call this function after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called after the main script.js is loaded
    enhanceDarkMode();
    
    // Add a note about keyboard shortcut
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.setAttribute('title', 'Toggle Dark Mode (Shift+D)');
});
