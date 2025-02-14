document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    // Check for saved theme preference, otherwise use dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    }

    // Update icon based on theme
    function updateIcon(theme) {
        themeToggleIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Log for debugging
    console.log('Theme system initialized');
    console.log('Current theme:', savedTheme);
}); 