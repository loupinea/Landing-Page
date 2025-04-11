/**
 * Enhanced dark mode functionality for Kouvr website
 * This file handles all dark mode toggle functionality
 */

// Main dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        html.classList.add('dark');
        updateDarkModeUI(true);
    } else {
        // Check for system preference only if user hasn't set a preference
        if (localStorage.getItem('darkMode') === null && 
            window.matchMedia && 
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            updateDarkModeUI(true);
        }
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (localStorage.getItem('darkMode') === null) {
            // Only apply if user hasn't set a preference
            if (event.matches) {
                html.classList.add('dark');
                updateDarkModeUI(true);
            } else {
                html.classList.remove('dark');
                updateDarkModeUI(false);
            }
        }
    });
    
    // Add click event listener
    darkModeToggle.addEventListener('click', function() {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
            updateDarkModeUI(false);
            showToast('Light mode activated');
        } else {
            html.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            updateDarkModeUI(true);
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

// Update UI elements for dark mode
function updateDarkModeUI(isDark) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Update icon in toggle button
    const darkIcon = darkModeToggle.querySelector('.dark\\:hidden');
    const lightIcon = darkModeToggle.querySelector('.hidden.dark\\:inline');
    
    if (isDark) {
        if (darkIcon) darkIcon.classList.add('hidden');
        if (lightIcon) lightIcon.classList.remove('hidden');
        
        // Add dark mode specific classes to elements
        document.querySelectorAll('[data-dark-class]').forEach(el => {
            el.classList.add(el.dataset.darkClass);
        });
    } else {
        if (darkIcon) darkIcon.classList.remove('hidden');
        if (lightIcon) lightIcon.classList.add('hidden');
        
        // Remove dark mode specific classes from elements
        document.querySelectorAll('[data-dark-class]').forEach(el => {
            el.classList.remove(el.dataset.darkClass);
        });
    }
}

// Toast notification function (duplicated from script.js to avoid dependencies)
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
