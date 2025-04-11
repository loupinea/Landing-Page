/**
 * Device testing utilities for Kouvr website
 * This file provides tools to test the website on different screen sizes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create device testing toolbar
    createDeviceTestingToolbar();
    
    // Initialize responsive testing
    initResponsiveTesting();
});

/**
 * Creates a toolbar for testing different device sizes
 */
function createDeviceTestingToolbar() {
    // Only create in development mode or when testing parameter is present
    if (!window.location.search.includes('testing=true')) {
        return;
    }
    
    const toolbar = document.createElement('div');
    toolbar.className = 'fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 flex justify-center gap-4 z-50';
    toolbar.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.2)';
    
    // Device options
    const devices = [
        { name: 'Mobile S', width: 320 },
        { name: 'Mobile M', width: 375 },
        { name: 'Mobile L', width: 425 },
        { name: 'Tablet', width: 768 },
        { name: 'Laptop', width: 1024 },
        { name: 'Desktop', width: 1440 }
    ];
    
    // Create buttons for each device
    devices.forEach(device => {
        const button = document.createElement('button');
        button.className = 'px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm';
        button.textContent = `${device.name} (${device.width}px)`;
        button.addEventListener('click', () => {
            resizeViewport(device.width);
        });
        toolbar.appendChild(button);
    });
    
    // Add orientation toggle
    const orientationBtn = document.createElement('button');
    orientationBtn.className = 'px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm ml-4';
    orientationBtn.textContent = 'Toggle Orientation';
    orientationBtn.addEventListener('click', toggleOrientation);
    toolbar.appendChild(orientationBtn);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-sm ml-4';
    closeBtn.textContent = 'Close Toolbar';
    closeBtn.addEventListener('click', () => {
        toolbar.remove();
        // Reset any testing modifications
        document.body.style.width = '';
        document.body.style.margin = '';
        document.body.style.transform = '';
        document.body.style.transformOrigin = '';
    });
    toolbar.appendChild(closeBtn);
    
    document.body.appendChild(toolbar);
}

/**
 * Resizes the viewport for testing
 */
function resizeViewport(width) {
    document.body.style.width = `${width}px`;
    document.body.style.margin = '0 auto';
    document.body.style.transform = '';
    document.body.style.transformOrigin = '';
    
    // Log for testing
    console.log(`Viewport resized to ${width}px`);
    
    // Check for responsive issues
    checkResponsiveIssues(width);
}

/**
 * Toggles between portrait and landscape orientation
 */
function toggleOrientation() {
    const currentWidth = document.body.style.width;
    if (!currentWidth) return;
    
    const width = parseInt(currentWidth);
    
    if (document.body.style.transform.includes('rotate(90deg)')) {
        // Switch back to portrait
        document.body.style.transform = '';
        document.body.style.width = `${width}px`;
        console.log('Switched to portrait orientation');
    } else {
        // Switch to landscape
        document.body.style.transform = 'rotate(90deg)';
        document.body.style.transformOrigin = 'top left';
        document.body.style.width = `${window.innerHeight}px`;
        console.log('Switched to landscape orientation');
    }
    
    // Check for responsive issues
    checkResponsiveIssues(width);
}

/**
 * Checks for common responsive design issues
 */
function checkResponsiveIssues(width) {
    console.log('Running responsive design checks...');
    
    // Check for horizontal overflow
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = width || window.innerWidth;
    if (bodyWidth > windowWidth) {
        console.warn('Horizontal overflow detected:', bodyWidth - windowWidth, 'pixels');
    }
    
    // Check for tiny touch targets
    const touchTargets = document.querySelectorAll('button, a, input, select, .category-card, .collection-card');
    touchTargets.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
            console.warn('Small touch target detected:', el, `${rect.width}x${rect.height}px`);
        }
    });
    
    // Check for font size issues on mobile
    if (width < 768) {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button');
        textElements.forEach(el => {
            const fontSize = window.getComputedStyle(el).fontSize;
            if (parseFloat(fontSize) < 12) {
                console.warn('Small font size detected on mobile:', el, fontSize);
            }
        });
    }
    
    console.log('Responsive design check complete');
}

/**
 * Initializes responsive testing features
 */
function initResponsiveTesting() {
    // Add keyboard shortcut to toggle testing toolbar (Ctrl+Shift+T)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            
            // Check if toolbar already exists
            const existingToolbar = document.querySelector('.fixed.bottom-0.left-0.right-0.bg-gray-800');
            if (existingToolbar) {
                existingToolbar.remove();
            } else {
                createDeviceTestingToolbar();
            }
        }
    });
    
    // Add viewport size indicator in development mode
    if (window.location.search.includes('testing=true')) {
        const sizeIndicator = document.createElement('div');
        sizeIndicator.className = 'fixed top-0 right-0 bg-gray-800 text-white px-2 py-1 text-xs z-50';
        sizeIndicator.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
        
        // Update on resize
        window.addEventListener('resize', () => {
            sizeIndicator.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
        });
        
        document.body.appendChild(sizeIndicator);
    }
}
