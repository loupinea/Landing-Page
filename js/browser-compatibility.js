/**
 * Browser compatibility testing for dark mode
 * This file provides tools to test dark mode across different browsers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add browser detection
    const browserInfo = detectBrowser();
    console.log('Browser detected:', browserInfo);
    
    // Test dark mode functionality
    testDarkMode();
});

/**
 * Detect browser type and version
 */
function detectBrowser() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    
    // Detect Chrome
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
        const chromeVersion = userAgent.match(/(?:chrome|chromium|crios)\/(\d+)/i);
        if (chromeVersion && chromeVersion[1]) browserVersion = chromeVersion[1];
    } 
    // Detect Firefox
    else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
        const firefoxVersion = userAgent.match(/(?:firefox|fxios)\/(\d+)/i);
        if (firefoxVersion && firefoxVersion[1]) browserVersion = firefoxVersion[1];
    } 
    // Detect Safari
    else if (userAgent.match(/safari/i) && !userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Safari";
        const safariVersion = userAgent.match(/version\/(\d+)/i);
        if (safariVersion && safariVersion[1]) browserVersion = safariVersion[1];
    } 
    // Detect Edge
    else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
        const edgeVersion = userAgent.match(/edg\/(\d+)/i);
        if (edgeVersion && edgeVersion[1]) browserVersion = edgeVersion[1];
    } 
    // Detect IE
    else if (userAgent.match(/trident/i)) {
        browserName = "Internet Explorer";
        const ieVersion = userAgent.match(/(?:msie |rv:)(\d+)/i);
        if (ieVersion && ieVersion[1]) browserVersion = ieVersion[1];
    }
    
    return {
        name: browserName,
        version: browserVersion,
        userAgent: userAgent,
        supportsLocalStorage: testLocalStorage()
    };
}

/**
 * Test if localStorage is available
 */
function testLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Test dark mode functionality
 */
function testDarkMode() {
    // Only run tests in development mode
    if (!window.location.search.includes('testing=true')) {
        return;
    }
    
    console.log('Running dark mode compatibility tests...');
    
    // Test 1: Check if dark mode toggle exists
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
        console.error('Test failed: Dark mode toggle button not found');
        return;
    }
    console.log('Test passed: Dark mode toggle button found');
    
    // Test 2: Verify site starts in light mode
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        console.error('Test failed: Site should start in light mode by default');
    } else {
        console.log('Test passed: Site starts in light mode by default');
    }
    
    // Test 3: Check if dark mode toggle works
    console.log('Testing dark mode toggle...');
    darkModeToggle.click();
    
    setTimeout(() => {
        if (html.classList.contains('dark')) {
            console.log('Test passed: Dark mode toggle adds dark class');
            
            // Test switching back to light mode
            darkModeToggle.click();
            
            setTimeout(() => {
                if (!html.classList.contains('dark')) {
                    console.log('Test passed: Dark mode toggle removes dark class');
                } else {
                    console.error('Test failed: Dark mode toggle did not remove dark class');
                }
            }, 100);
        } else {
            console.error('Test failed: Dark mode toggle did not add dark class');
        }
    }, 100);
    
    // Test 4: Check if dark mode styles are applied correctly
    const darkModeElements = [
        { selector: 'body', property: 'backgroundColor' },
        { selector: '.header', property: 'backgroundColor' },
        { selector: '.category-card', property: 'color' }
    ];
    
    // Force dark mode on for testing
    html.classList.add('dark');
    setTimeout(() => {
        const darkStyles = {};
        darkModeElements.forEach(el => {
            const element = document.querySelector(el.selector);
            if (element) {
                darkStyles[el.selector] = window.getComputedStyle(element)[el.property];
            }
        });
        
        // Force dark mode off for testing
        html.classList.remove('dark');
        setTimeout(() => {
            const lightStyles = {};
            let allDifferent = true;
            
            darkModeElements.forEach(el => {
                const element = document.querySelector(el.selector);
                if (element) {
                    lightStyles[el.selector] = window.getComputedStyle(element)[el.property];
                    if (darkStyles[el.selector] === lightStyles[el.selector]) {
                        console.error(`Test failed: ${el.selector} styles do not change between dark/light mode`);
                        allDifferent = false;
                    }
                }
            });
            
            if (allDifferent) {
                console.log('Test passed: Dark mode styles are applied correctly');
            }
        }, 100);
    }, 100);
    
    // Add a visual indicator for testing
    const testIndicator = document.createElement('div');
    testIndicator.className = 'fixed top-0 left-0 bg-green-500 text-white px-3 py-1 text-xs z-50';
    testIndicator.textContent = 'Dark Mode Testing Active';
    document.body.appendChild(testIndicator);
    
    // Create a test button to manually toggle dark mode
    const testButton = document.createElement('button');
    testButton.className = 'fixed top-8 left-0 bg-gray-800 text-white px-3 py-1 text-xs z-50';
    testButton.textContent = 'Test Dark Mode Toggle';
    testButton.addEventListener('click', () => {
        darkModeToggle.click();
        console.log('Dark mode manually toggled for testing');
    });
    document.body.appendChild(testButton);
}
