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
        supportsPrefersDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all',
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
    
    // Test 2: Check if dark mode class can be applied
    const html = document.documentElement;
    const isDarkMode = html.classList.contains('dark');
    
    // Toggle dark mode
    if (isDarkMode) {
        html.classList.remove('dark');
        setTimeout(() => {
            if (!html.classList.contains('dark')) {
                console.log('Test passed: Dark mode class can be removed');
            } else {
                console.error('Test failed: Could not remove dark mode class');
            }
            // Restore original state
            html.classList.add('dark');
        }, 100);
    } else {
        html.classList.add('dark');
        setTimeout(() => {
            if (html.classList.contains('dark')) {
                console.log('Test passed: Dark mode class can be added');
            } else {
                console.error('Test failed: Could not add dark mode class');
            }
            // Restore original state
            html.classList.remove('dark');
        }, 100);
    }
    
    // Test 3: Check if localStorage works for dark mode
    try {
        const originalSetting = localStorage.getItem('darkMode');
        localStorage.setItem('darkMode', 'test-value');
        const testValue = localStorage.getItem('darkMode');
        
        if (testValue === 'test-value') {
            console.log('Test passed: localStorage works for dark mode settings');
        } else {
            console.error('Test failed: localStorage not working correctly');
        }
        
        // Restore original value
        if (originalSetting) {
            localStorage.setItem('darkMode', originalSetting);
        } else {
            localStorage.removeItem('darkMode');
        }
    } catch (e) {
        console.error('Test failed: localStorage error -', e.message);
    }
    
    // Test 4: Check if dark mode styles are applied correctly
    const darkModeElements = [
        { selector: 'body', property: 'backgroundColor' },
        { selector: 'header', property: 'backgroundColor' },
        { selector: '.text-kouvr-dark', property: 'color' }
    ];
    
    const originalState = html.classList.contains('dark');
    
    // Force dark mode on
    html.classList.add('dark');
    setTimeout(() => {
        const darkStyles = {};
        darkModeElements.forEach(el => {
            const element = document.querySelector(el.selector);
            if (element) {
                darkStyles[el.selector] = window.getComputedStyle(element)[el.property];
            }
        });
        
        // Force dark mode off
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
            
            // Restore original state
            if (originalState) {
                html.classList.add('dark');
            }
        }, 100);
    }, 100);
    
    // Add a visual indicator for testing
    const testIndicator = document.createElement('div');
    testIndicator.className = 'fixed top-0 left-0 bg-green-500 dark:bg-blue-500 text-white px-3 py-1 text-xs z-50';
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
