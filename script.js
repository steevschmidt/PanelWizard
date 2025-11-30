// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    // Version handling
    const versionInfo = document.getElementById('versionInfo');
    
    // Set initial version
    window.APP_VERSION = window.APP_VERSION || 'v0';
    
    // Ensure versionInfo element exists
    if (!versionInfo) {
        console.warn('Warning: Version info element not found');
    }
    
    async function fetchGitHubVersion() {
        try {
            // Check if we're running locally (file:// protocol) or on a server
            if (window.location.protocol === 'file:') {
                console.log('Running locally - skipping GitHub version fetch');
                return null;
            }
            
            const response = await fetch('https://api.github.com/repos/steevschmidt/PanelWizard/commits');
            if (!response.ok) throw new Error('Failed to fetch version');
            
            const commits = await response.json();
            if (commits && commits.length > 0) {
                const commitDate = new Date(commits[0].commit.author.date);
                // Convert to Pacific Time and format date
                const pacificDate = new Date(commitDate.toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles'
                }));
                const year = pacificDate.getFullYear();
                const month = String(pacificDate.getMonth() + 1).padStart(2, '0');
                const day = String(pacificDate.getDate()).padStart(2, '0');
                return `v${year}-${month}-${day}`;
            }
        } catch (error) {
            console.log('GitHub version fetch failed (this is normal for local development):', error.message);
            return null;
        }
    }
    
    async function updateVersion() {
        try {
            if (window.APP_VERSION.startsWith('v0')) {
                const githubVersion = await fetchGitHubVersion();
                if (githubVersion) {
                    window.APP_VERSION = githubVersion;
                } else {
                    // Fallback to current date in Pacific Time
                    const now = new Date();
                    const pacificDate = new Date(now.toLocaleString('en-US', {
                        timeZone: 'America/Los_Angeles'
                    }));
                    const year = pacificDate.getFullYear();
                    const month = String(pacificDate.getMonth() + 1).padStart(2, '0');
                    const day = String(pacificDate.getDate()).padStart(2, '0');
                    window.APP_VERSION = `v${year}-${month}-${day}`;
                }
            }
            
            if (versionInfo) {
                versionInfo.textContent = window.APP_VERSION;
            }
        } catch (error) {
            console.warn('Warning: Could not update version display:', error.message);
            // Set a fallback version
            window.APP_VERSION = `v${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
            if (versionInfo) {
                versionInfo.textContent = window.APP_VERSION;
            }
        }
    }
    
    // Initialize version display
    try {
        updateVersion();
    } catch (error) {
        console.warn('Warning: Could not update version display:', error.message);
        // Set a fallback version
        try {
            window.APP_VERSION = `v${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
            if (versionInfo) {
                versionInfo.textContent = window.APP_VERSION;
            }
        } catch (fallbackError) {
            console.warn('Warning: Could not set fallback version:', fallbackError.message);
            window.APP_VERSION = 'v1.0.0';
            if (versionInfo) {
                versionInfo.textContent = window.APP_VERSION;
            }
        }
    }

    console.log('Script loading...');

    // ==========================================================================
    // URL Parameter Handling
    // ==========================================================================
    
    // Function to handle referrer-specific logic
    function handleReferrer(referrer) {
        switch(referrer.toLowerCase()) {
            case 'hea':
                // HEA referrer: mark step 5.2 (PG&E HomeIntel Service) as completed
                markStep52Completed();
                break;
            default:
                console.log('Unknown referrer:', referrer);
        }
    }
    
    // Function to mark step 5.2 (PG&E HomeIntel Service) as completed
    function markStep52Completed() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const step52Section = document.getElementById('step5-2');
            if (step52Section) {
                // Add a completed badge/indicator
                const badge = document.createElement('div');
                badge.classList.add('completed-badge');
                badge.innerHTML = '✓ Already completed within the HomeIntel analysis.';
                
                // Insert badge at the beginning of the section
                step52Section.insertBefore(badge, step52Section.firstChild);
                
                // Auto-check the skip checkbox after a delay to allow user to see the badge
                const skipCheckbox = document.querySelector('#gasAnalysis input[name="skipStep5"]');
                if (skipCheckbox) {
                    setTimeout(() => {
                        skipCheckbox.checked = true;
                        // Trigger a change event to update step completion
                        skipCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }, 500);
                }
                
                console.log('Step 5.2 marked as completed for HEA referrer');
            }
        }, 100);
    }
    
    // Function to mark step 3 (Panel Size) as completed with badge
    function markStep3Completed() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const step3Section = document.getElementById('currentEquipment');
            if (step3Section) {
                // Add a completed badge/indicator
                const badge = document.createElement('div');
                badge.classList.add('completed-badge');
                badge.innerHTML = '✓ Already identified! The result was passed into this tool.';
                
                // Insert badge at the beginning of the section's content-box
                const contentBox = step3Section.querySelector('.content-box');
                if (contentBox) {
                    contentBox.insertBefore(badge, contentBox.firstChild);
                    console.log('Step 3 marked as completed with badge');
                }
            }
        }, 100);
    }
    
    // Function to mark step 4.1 (Top-Down Capacity) as completed with badge
    function markStep41Completed() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const step41Section = document.getElementById('step4-1');
            if (step41Section) {
                // Add a completed badge/indicator
                const badge = document.createElement('div');
                badge.classList.add('completed-badge');
                badge.innerHTML = '✓ Already completed! The result was passed into this tool.';
                
                // Insert badge at the beginning of the section
                step41Section.insertBefore(badge, step41Section.firstChild);
                console.log('Step 4.1 marked as completed with badge');
            }
        }, 100);
    }
    
    // Function to mark step 4.2 (Bottom-Up Capacity) as completed with badge
    function markStep42Completed() {
        // Wait for DOM to be ready
        setTimeout(() => {
            const step42Section = document.getElementById('step4-2');
            if (step42Section) {
                // Add a completed badge/indicator
                const badge = document.createElement('div');
                badge.classList.add('completed-badge');
                badge.innerHTML = '✓ Already completed! The result was passed into this tool.';
                
                // Insert badge at the beginning of the section
                step42Section.insertBefore(badge, step42Section.firstChild);
                console.log('Step 4.2 marked as completed with badge');
            }
        }, 100);
    }
    
    // Function to add visual indicator for pre-filled inputs
    function addPrefilledIndicator(inputElement) {
        // Check if indicator already exists
        const existingIndicator = inputElement.nextElementSibling;
        if (existingIndicator && existingIndicator.classList.contains('prefilled-badge')) {
            return; // Already has indicator
        }
        
        // Create the badge element
        const badge = document.createElement('span');
        badge.classList.add('prefilled-badge');
        badge.textContent = 'Pre-filled';
        badge.title = 'This value was already calculated by another tool and transferred here using a URL parameter';
        
        // Insert the badge after the input
        inputElement.parentNode.insertBefore(badge, inputElement.nextSibling);
    }
    
    // Function to parse URL parameters and set form values
    function parseURLParameters() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            
            // Parse panelSize parameter (integer, in amps)
            const panelSize = urlParams.get('panelSize');
            if (panelSize) {
                const panelSizeInt = parseInt(panelSize);
                if (!isNaN(panelSizeInt) && panelSizeInt >= 10 && panelSizeInt <= 1000) {
                    const panelAmpsInput = document.getElementById('panelAmps');
                    if (panelAmpsInput) {
                        panelAmpsInput.value = panelSizeInt;
                        addPrefilledIndicator(panelAmpsInput);
                        markStep3Completed();
                        console.log('URL parameter set panelSize to:', panelSizeInt);
                    }
                } else {
                    console.warn('Invalid panelSize parameter:', panelSize, '- must be integer between 10-1000');
                }
            }
            
            // Parse topDownCapacity parameter (integer, in amps)
            const topDownCapacity = urlParams.get('topDownCapacity');
            if (topDownCapacity) {
                const topDownInt = parseInt(topDownCapacity);
                if (!isNaN(topDownInt) && topDownInt >= 0) {
                    const topDownInput = document.getElementById('topDownCapacity');
                    if (topDownInput) {
                        topDownInput.value = topDownInt;
                        addPrefilledIndicator(topDownInput);
                        markStep41Completed();
                        console.log('URL parameter set topDownCapacity to:', topDownInt);
                    }
                } else {
                    console.warn('Invalid topDownCapacity parameter:', topDownCapacity, '- must be non-negative integer');
                }
            }
            
            // Parse bottomUpCapacity parameter (integer, in amps)
            const bottomUpCapacity = urlParams.get('bottomUpCapacity');
            if (bottomUpCapacity) {
                const bottomUpInt = parseInt(bottomUpCapacity);
                if (!isNaN(bottomUpInt) && bottomUpInt >= 0) {
                    const bottomUpInput = document.getElementById('bottomUpCapacity');
                    if (bottomUpInput) {
                        bottomUpInput.value = bottomUpInt;
                        addPrefilledIndicator(bottomUpInput);
                        markStep42Completed();
                        console.log('URL parameter set bottomUpCapacity to:', bottomUpInt);
                    }
                } else {
                    console.warn('Invalid bottomUpCapacity parameter:', bottomUpCapacity, '- must be non-negative integer');
                }
            }
            
            // Parse htgCap parameter (integer, in BTUs)
            const htgCap = urlParams.get('htgCap');
            if (htgCap) {
                const htgCapInt = parseInt(htgCap);
                if (!isNaN(htgCapInt) && htgCapInt >= 6000 && htgCapInt <= 120000) {
                    // Check the heating checkbox first to ensure the input field is visible
                    const heatingCheckbox = document.querySelector('input[name="electrification"][value="heating"]');
                    if (heatingCheckbox && !heatingCheckbox.checked) {
                        heatingCheckbox.checked = true;
                        // Update quantity field visibility
                        if (typeof handleQuantityFieldVisibility === 'function') {
                            handleQuantityFieldVisibility(heatingCheckbox);
                        }
                    }
                    
                    // Find the first heating capacity input (heating system 1)
                    // Use a small delay to ensure the field is visible after checkbox is checked
                    setTimeout(() => {
                        const heatingInput = document.querySelector('input[name="heating_1_capacity"]');
                        if (heatingInput) {
                            heatingInput.value = htgCapInt;
                            addPrefilledIndicator(heatingInput);
                            console.log('URL parameter set htgCap to:', htgCapInt);
                        } else {
                            console.warn('Heating capacity input not found - heating system may not be initialized yet');
                        }
                    }, 50);
                } else {
                    console.warn('Invalid htgCap parameter:', htgCap, '- must be integer between 6000-120000');
                }
            }
            
            // Parse referrer parameter (string, identifies the source/referrer)
            const referrer = urlParams.get('referrer');
            if (referrer) {
                handleReferrer(referrer);
                console.log('URL parameter set referrer to:', referrer);
            }
            
            // Parse electrification goal checkbox parameters
            const electrificationParams = {
                gasHtr: urlParams.get('gasHtr'),
                gasWH: urlParams.get('gasWH'),
                gasCook: urlParams.get('gasCook'),
                gasDryer: urlParams.get('gasDryer'),
                gasOther: urlParams.get('gasOther'),
                addEV: urlParams.get('addEV'),
                removeMeter: urlParams.get('removeMeter')
            };
            
            // Mapping of URL parameters to checkbox values
            const paramToCheckboxValue = {
                gasHtr: 'heating',
                gasWH: 'waterheater',
                gasCook: 'cooking',
                gasDryer: 'dryer',
                gasOther: 'other',
                addEV: 'ev',
                removeMeter: 'gasmeter'
            };
            
            // Set checkboxes based on URL parameters
            for (const [param, value] of Object.entries(electrificationParams)) {
                if (value !== null) {
                    const checkboxValue = paramToCheckboxValue[param];
                    if (checkboxValue) {
                        const checkbox = document.querySelector(`input[name="electrification"][value="${checkboxValue}"]`);
                        if (checkbox) {
                            // Set checkbox to true for 'yes' or 'true', false for 'no' or 'false'
                            checkbox.checked = (value.toLowerCase() === 'yes' || value.toLowerCase() === 'true');
                            
                            // Update quantity field visibility
                            handleQuantityFieldVisibility(checkbox);
                            
                            console.log(`URL parameter set ${param} to ${checkbox.checked ? 'checked' : 'unchecked'}`);
                        } else {
                            console.warn(`Checkbox not found for parameter ${param} (value: ${checkboxValue})`);
                        }
                    }
                }
            }
            
            // Log all parsed parameters
            const hasElectrificationParams = Object.values(electrificationParams).some(v => v !== null);
            if (panelSize || topDownCapacity || bottomUpCapacity || htgCap || referrer || hasElectrificationParams) {
                console.log('URL parameters parsed:', {
                    panelSize: panelSize ? parseInt(panelSize) : null,
                    topDownCapacity: topDownCapacity ? parseInt(topDownCapacity) : null,
                    bottomUpCapacity: bottomUpCapacity ? parseInt(bottomUpCapacity) : null,
                    htgCap: htgCap ? parseInt(htgCap) : null,
                    referrer: referrer || null,
                    ...electrificationParams
                });
                
                // Update capacity summary after a brief delay to ensure stepManager is initialized
                setTimeout(() => {
                    if (typeof stepManager !== 'undefined' && stepManager && typeof stepManager.updateCapacitySummary === 'function') {
                        stepManager.updateCapacitySummary();
                    }
                }, 100);
                
                // Trigger step completion check if electrification params were set or htgCap was set
                if (hasElectrificationParams || htgCap) {
                    setTimeout(() => {
                        if (typeof stepManager !== 'undefined' && stepManager && typeof stepManager.checkStepCompletion === 'function') {
                            stepManager.checkStepCompletion();
                        }
                        // Save form data to localStorage if URL params were set
                        if (typeof saveFormDataToLocalStorage === 'function') {
                            saveFormDataToLocalStorage();
                        }
                    }, 150);
                }
            }
        } catch (error) {
            console.warn('Warning: Could not parse URL parameters:', error.message);
        }
    }
    
    // Parse URL parameters when the script loads
    parseURLParameters();

    // ==========================================================================
    // Centralized Display Names Configuration
    // ==========================================================================
    
    // Single source of truth for all display name mappings
    const DISPLAY_NAMES = {
        // Category display names (for CSV files and product categories)
        categories: {
            'heat-pumps': 'Heat Pumps',
            'water-heaters': 'Water Heaters',
            'cooking-appliances': 'Cooking Appliances',
            'clothes-dryers': 'Clothes Dryers',
            'ev-chargers': 'EV Chargers',
            'other-appliances': 'Other Appliances'
        },
        
        // Appliance type display names (for form inputs and user interface)
        applianceTypes: {
            'heating': 'Heating System',
            'waterheater': 'Water Heater',
            'cooking': 'Cooking Appliance',
            'dryer': 'Clothes Dryer',
            'other': 'Other Gas Appliance',
            'ev': 'EV Charger',
            'gasmeter': 'Remove Gas Meter'
        }
    };

    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
    
    // Ensure theme elements exist
    if (!themeToggle) {
        console.warn('Warning: Theme toggle element not found');
    }
    if (!themeToggleIcon) {
        console.warn('Warning: Theme toggle icon element not found');
    }
    
    // Check for saved theme preference, otherwise use dark theme
    let savedTheme = 'dark'; // Default theme
    try {
        savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeToggleIcon) {
            themeToggleIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        }
    } catch (error) {
        console.warn('Warning: Could not initialize theme:', error.message);
        // Set default theme
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    console.log('Theme system initialized');
    console.log('Current theme:', savedTheme);

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            try {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                if (themeToggleIcon) {
                    themeToggleIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
                }
            } catch (error) {
                console.warn('Warning: Could not toggle theme:', error.message);
            }
        });
    }

    // Reset button functionality
    const resetButton = document.getElementById('reset-button');
    
    // Ensure reset button exists
    if (!resetButton) {
        console.warn('Warning: Reset button element not found');
    }
    

    
    // Function to update reset button visibility based on form completion
    function updateResetButtonVisibility() {
        try {
            if (!resetButton) {
                console.log('Reset button not found (this is normal if not on step 1)');
                return;
            }
            
            if (typeof stepManager === 'undefined' || !stepManager.steps) {
                console.log('StepManager not yet initialized (this is normal during startup)');
                return;
            }
            
            const step1 = stepManager.steps[1];
            if (step1 && step1.isComplete) {
                resetButton.style.display = 'block';
            } else {
                resetButton.style.display = 'none';
            }
        } catch (error) {
            console.warn('Warning: Error updating reset button visibility:', error.message);
        }
    }
    
    // Initially hide the reset button
    if (resetButton) {
        resetButton.style.display = 'none';
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            try {
                if (confirm('This will clear all saved data and reload the page. Make sure you have saved your project file before proceeding. Clear all?')) {
                    localStorage.clear();
                    // Hide the reset button immediately after clearing data
                    resetButton.style.display = 'none';
                    location.reload();
                }
            } catch (error) {
                console.warn('Warning: Could not reset data:', error.message);
            }
        });
    }





    // Project form handling
    const newProjectForm = document.getElementById('newProjectForm');
    const openProjectBtn = document.getElementById('openProjectBtn');
    const importFile = document.getElementById('importFile');
    
    // Ensure project form elements exist
    if (!newProjectForm) {
        console.warn('Warning: New project form element not found');
    }
    if (!openProjectBtn) {
        console.warn('Warning: Open project button element not found');
    }
    if (!importFile) {
        console.warn('Warning: Import file element not found');
    }

    // Set default project name based on user's system information
    function getDefaultProjectName() {
        // Try to get username from various sources
        let username = '';
        
        // Try to get from localStorage if we've stored it before
        username = localStorage.getItem('panelWizard_username');
        
        // If no stored username, create a simple friendly identifier
        if (!username) {
            // Create a user-friendly date format
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear();
            
            username = `${day}${month}${year}`;
        }
        
        // Clean the username to ensure it's valid for a project name
        username = username.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // Store the username for future use
        localStorage.setItem('panelWizard_username', username);
        
        return `${username}_project`;
    }

    // Set default project name when the page loads
    try {
        const projectNameInput = document.getElementById('projectName');
        if (projectNameInput) {
            projectNameInput.value = getDefaultProjectName();
            console.log('Default project name set:', projectNameInput.value);
        } else {
            console.log('Project name input not found (this is normal if not on step 1)');
        }
    } catch (error) {
        console.warn('Warning: Could not set default project name:', error.message);
    }

    try {
        if (newProjectForm) {
            newProjectForm.addEventListener('submit', handleNewProject);
            console.log('Project form initialized');
        } else {
            console.log('New project form not found (this is normal if not on step 1)');
        }

        if (openProjectBtn) {
            openProjectBtn.addEventListener('click', showProjectsList);
            console.log('Open project button initialized');
        } else {
            console.log('Open project button not found (this is normal if not on step 1)');
        }

        if (importFile) {
            importFile.addEventListener('change', handleFileImport);
            console.log('File import initialized');
        } else {
            console.log('Import file input not found (this is normal if not on step 1)');
        }
    } catch (error) {
        console.warn('Warning: Could not initialize project forms:', error.message);
    }

    // Initialize step 1
    try {
        const step1 = document.getElementById('projectInfo');
        if (step1) {
            step1.classList.add('active');
            step1.style.opacity = '1';
            step1.style.pointerEvents = 'auto';
            console.log('Step 1 activated');
        } else {
            console.warn('Warning: Step 1 element not found');
        }
    } catch (error) {
        console.warn('Warning: Could not initialize step 1:', error.message);
    }



    // Add event listeners for step 2 checkboxes
    try {
        const electrificationForm = document.getElementById('electrificationForm');
        if (!electrificationForm) {
            console.log('Electrification form not found (this is normal if not on step 2)');
            return;
        }
        
        const checkboxes = electrificationForm.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length === 0) {
            console.log('No checkboxes found in electrification form (this is normal if not on step 2)');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                try {
                    if (typeof stepManager !== 'undefined' && stepManager && stepManager.checkStepCompletion) {
                        stepManager.checkStepCompletion();
                    }
                    handleQuantityFieldVisibility(checkbox);
                    saveFormDataToLocalStorage(); // Save form data immediately
                } catch (error) {
                    console.warn('Warning: Error handling checkbox change:', error.message);
                }
            });
        });

        // Initialize quantity field visibility
        checkboxes.forEach(checkbox => {
            try {
                handleQuantityFieldVisibility(checkbox);
            } catch (error) {
                console.warn('Warning: Error initializing quantity field visibility:', error.message);
            }
        });
    } catch (error) {
        console.warn('Warning: Could not initialize checkbox event listeners:', error.message);
    }

    // Add event listeners for quantity fields
    try {
        const quantityFields = document.querySelectorAll('.quantity-field input[type="number"]');
        if (quantityFields.length === 0) {
            console.log('No quantity fields found (this is normal if no appliances are selected)');
            return;
        }
        
        quantityFields.forEach(field => {
            field.addEventListener('input', () => {
                try {
                    saveFormDataToLocalStorage(); // Save form data when quantities change
                } catch (error) {
                    console.warn('Warning: Error saving quantity data:', error.message);
                }
            });
        });
    } catch (error) {
        console.warn('Warning: Could not initialize quantity field event listeners:', error.message);
    }

    // Add event listener for adding heating systems
    try {
        const addHeatingBtn = document.querySelector('#addHeatingSystem');
        if (addHeatingBtn) {
            addHeatingBtn.addEventListener('click', addHeatingSystem);
        } else {
            console.log('Heating system button not found (this is normal if not on step 2)');
        }
    } catch (error) {
        console.warn('Warning: Could not initialize heating system button:', error.message);
    }

    console.log('Initialization complete');
    
    // Add error handling for any remaining potential issues
    window.addEventListener('error', (event) => {
        console.warn('Warning: JavaScript error caught:', event.error?.message || event.message);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.warn('Warning: Unhandled promise rejection:', event.reason);
    });

    // Function to handle quantity field visibility
    function handleQuantityFieldVisibility(checkbox) {
        try {
            if (!checkbox || !checkbox.value) return;
            
            const value = checkbox.value;
            const quantityField = document.querySelector(`.quantity-field[data-for="${value}"]`);
            
            if (quantityField) {
                if (checkbox.checked) {
                    quantityField.classList.add('show');
                } else {
                    quantityField.classList.remove('show');
                }
            }
        } catch (error) {
            console.warn('Warning: Error handling quantity field visibility:', error.message);
        }
    }

    // Function to save form data to localStorage
    function saveFormDataToLocalStorage() {
        try {
            const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
            const formData = {
                selectedAppliances: []
            };
            
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    const appliance = {
                        type: cb.value,
                        name: cb.nextElementSibling.textContent.trim(),
                        quantity: 1 // default quantity
                    };
                    
                    // Special handling for heating systems
                    if (cb.value === 'heating') {
                        const heatingSystems = [];
                        const heatingInputs = document.querySelectorAll('.heating-capacity-input');
                        
                        heatingInputs.forEach((input, index) => {
                            if (input.value) {
                                heatingSystems.push({
                                    id: index + 1,
                                    capacity: parseInt(input.value) || 30000,
                                    description: `Heating System ${index + 1}`
                                });
                            }
                        });
                        
                        appliance.heatingSystems = heatingSystems;
                        appliance.quantity = heatingSystems.length;
                    } else {
                        // Get quantity if available for other appliances
                        const quantityField = document.querySelector(`.quantity-field[data-for="${cb.value}"] input[type="number"]`);
                        if (quantityField) {
                            appliance.quantity = parseInt(quantityField.value) || 1;
                        }
                    }
                    
                    formData.selectedAppliances.push(appliance);
                }
            });
            
            localStorage.setItem('panelWizard_formData', JSON.stringify(formData));
        } catch (error) {
            console.warn('Warning: Could not save form data to localStorage:', error.message);
        }
    }

    // Function to load form data from localStorage
    function loadFormDataFromLocalStorage() {
        try {
            const localStorageData = localStorage.getItem('panelWizard_formData');
            if (localStorageData) {
                try {
                    const formData = JSON.parse(localStorageData);
                    
                    // Restore checkbox states
                    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        const appliance = formData.selectedAppliances.find(a => a.type === cb.value);
                        if (appliance) {
                            cb.checked = true;
                            
                            // Special handling for heating systems
                            if (cb.value === 'heating' && appliance.heatingSystems) {
                                restoreHeatingSystems(appliance.heatingSystems);
                            } else {
                                // Restore quantity value if available for other appliances
                                const quantityField = document.querySelector(`.quantity-field[data-for="${cb.value}"] input[type="number"]`);
                                if (quantityField && appliance.quantity) {
                                    quantityField.value = appliance.quantity;
                                }
                            }
                            
                            // Update quantity field visibility
                            handleQuantityFieldVisibility(cb);
                        } else {
                            cb.checked = false;
                            handleQuantityFieldVisibility(cb);
                        }
                    });
                    
                    // Update step completion status
                    if (typeof stepManager !== 'undefined' && stepManager && stepManager.checkStepCompletion) {
                        stepManager.checkStepCompletion();
                    }
                    
                    // Update calculation results display if we're on step 6
                    if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                        window.applianceDatabase.updateCalculationResultsDisplay();
                    }
                    
                } catch (e) {
                    console.warn('Warning: Error parsing form data from localStorage:', e.message);
                }
            }
        } catch (error) {
            console.warn('Warning: Could not access localStorage:', error.message);
        }
    }

    // Function to add a new heating system
    function addHeatingSystem() {
        try {
            const container = document.querySelector('.heating-systems-container');
            if (!container) {
                console.warn('Warning: Heating systems container not found');
                return;
            }
            
            const existingSystems = container.querySelectorAll('.heating-system-item');
            const newId = existingSystems.length + 1;
            
            if (newId > 5) {
                alert('You can add up to 5 heating systems total.');
                return;
            }
            
            const newSystem = document.createElement('div');
            newSystem.className = 'heating-system-item';
            newSystem.setAttribute('data-heating-id', newId);
            
            newSystem.innerHTML = `
                <button type="button" class="remove-heating-btn" onclick="removeHeatingSystem(this)">×</button>
                <div class="heating-input-group">
                    <label><strong>Heating System ${newId}:</strong> Replace an existing gas heating unit with:</label>
                    <div class="input-row">
                        <input type="number" min="6000" max="120000" value="30000" name="heating_${newId}_capacity" step="6000" placeholder="30000" class="heating-capacity-input">
                        <span class="unit-label">BTU/h capacity</span>
                        <span class="tooltip-container"><span class="tooltip">BTUs per hour (Btu/h) is a measure of heating capacity of natural gas heaters and usually appears on the unit. Step increment for this field is 6,000 BTU/h (½ ton units).</span>ⓘ</span>
                    </div>
                    <div class="description">with a new electric heat pump. 
                        <span class="tooltip-container"><span class="tooltip">A heat pump is a device that transfers heat from one location to another, rather than generating heat directly. It provides both heating and cooling, and is more efficient than a gas heater.</span>ⓘ</span>
                    </div>
                </div>
            `;
            
            // Insert before the add button section
            const addButtonSection = container.querySelector('.add-heating-system');
            if (addButtonSection) {
                container.insertBefore(newSystem, addButtonSection);
            } else {
                container.appendChild(newSystem);
            }
            
            // Add event listener to the new input
            const newInput = newSystem.querySelector('input');
            if (newInput) {
                newInput.addEventListener('input', () => {
                    try {
                        saveFormDataToLocalStorage();
                    } catch (error) {
                        console.warn('Warning: Error saving heating system data:', error.message);
                    }
                });
            }
            
            // Update add button state
            updateAddHeatingButtonState();
            
            // Save form data
            saveFormDataToLocalStorage();
        } catch (error) {
            console.warn('Warning: Error adding heating system:', error.message);
        }
    }

    // Function to remove a heating system
    function removeHeatingSystem(button) {
        try {
            if (!button) return;
            
            const systemItem = button.closest('.heating-system-item');
            if (!systemItem) {
                console.warn('Warning: Heating system item not found');
                return;
            }
            
            const container = systemItem.parentNode;
            if (!container) {
                console.warn('Warning: Heating system container not found');
                return;
            }
            
            // Remove the system
            systemItem.remove();
            
            // Renumber remaining systems
            const remainingSystems = container.querySelectorAll('.heating-system-item');
            remainingSystems.forEach((system, index) => {
                try {
                    const newId = index + 1;
                    system.setAttribute('data-heating-id', newId);
                    
                    // Update label
                    const label = system.querySelector('label strong');
                    if (label) {
                        label.textContent = `Heating System ${newId}:`;
                    }
                    
                    // Update input name
                    const input = system.querySelector('input');
                    if (input) {
                        input.name = `heating_${newId}_capacity`;
                    }
                } catch (error) {
                    console.warn('Warning: Error renumbering heating system:', error.message);
                }
            });
            
            // Update add button state
            updateAddHeatingButtonState();
            
            // Save form data
            saveFormDataToLocalStorage();
        } catch (error) {
            console.warn('Warning: Error removing heating system:', error.message);
        }
    }

    // Function to update add button state
    function updateAddHeatingButtonState() {
        try {
            const container = document.querySelector('.heating-systems-container');
            const addButton = document.querySelector('#addHeatingSystem');
            
            if (!container || !addButton) {
                console.warn('Warning: Heating system container or add button not found');
                return;
            }
            
            const existingSystems = container.querySelectorAll('.heating-system-item');
            
            if (existingSystems.length >= 5) {
                addButton.disabled = true;
                addButton.textContent = 'Maximum 5 heating systems reached';
            } else {
                addButton.disabled = false;
                addButton.innerHTML = '<span class="plus-icon">+</span> I have another gas heating unit';
            }
        } catch (error) {
            console.warn('Warning: Error updating heating button state:', error.message);
        }
    }

    // Function to restore heating systems from saved data
    function restoreHeatingSystems(savedHeatingSystems) {
        try {
            if (!savedHeatingSystems || !Array.isArray(savedHeatingSystems)) {
                console.warn('Warning: Invalid heating systems data provided');
                return;
            }
            
            const container = document.querySelector('.heating-systems-container');
            if (!container) {
                console.warn('Warning: Heating systems container not found');
                return;
            }
            
            // Clear existing heating systems
            container.innerHTML = '';

            // Add new heating systems based on saved data
            savedHeatingSystems.forEach((system, index) => {
                try {
                    if (!system || !system.id || !system.capacity) {
                        console.warn('Warning: Invalid heating system data:', system);
                        return;
                    }
                    
                    const newSystem = document.createElement('div');
                    newSystem.className = 'heating-system-item';
                    newSystem.setAttribute('data-heating-id', system.id);

                    newSystem.innerHTML = `
                        <button type="button" class="remove-heating-btn" onclick="removeHeatingSystem(this)">×</button>
                        <div class="heating-input-group">
                            <label><strong>Heating System ${system.id}:</strong> Replace an existing gas heating unit with:</label>
                            <div class="input-row">
                                <input type="number" min="6000" max="120000" value="${system.capacity}" name="heating_${system.id}_capacity" step="6000" placeholder="30000" class="heating-capacity-input">
                                <span class="unit-label">BTU/h capacity</span>
                                <span class="tooltip-container"><span class="tooltip">BTUs per hour (Btu/h) is a measure of heating capacity of natural gas heaters and usually appears on the unit. Step increment for this field is 6,000 BTU/h (½ ton units).</span>ⓘ</span>
                            </div>
                            <div class="description">with a new electric heat pump. 
                                <span class="tooltip-container"><span class="tooltip">A heat pump is a device that transfers heat from one location to another, rather than generating heat directly. It provides both heating and cooling, and is more efficient than a gas heater.</span>ⓘ</span>
                            </div>
                        </div>
                    `;

                    container.appendChild(newSystem);

                    // Add event listener to the new input
                    const newInput = newSystem.querySelector('input');
                    if (newInput) {
                        newInput.addEventListener('input', () => {
                            try {
                                saveFormDataToLocalStorage();
                            } catch (error) {
                                console.warn('Warning: Error saving heating system data:', error.message);
                            }
                        });
                    }
                } catch (error) {
                    console.warn('Warning: Error restoring heating system:', error.message);
                }
            });

            // Re-add the add button section
            const addButtonSection = document.createElement('div');
            addButtonSection.className = 'add-heating-system';
            addButtonSection.innerHTML = `
                <button type="button" class="add-heating-btn" id="addHeatingSystem">
                    <span class="plus-icon">+</span>
                    I have another gas heating unit
                </button>
                <p class="form-help">You can add up to 5 heating systems total</p>
            `;
            container.appendChild(addButtonSection);

            // Re-attach event listener to add button
            const addButton = document.querySelector('#addHeatingSystem');
            if (addButton) {
                addButton.addEventListener('click', addHeatingSystem);
            }

            // Update add button state
            updateAddHeatingButtonState();
        } catch (error) {
            console.warn('Warning: Error restoring heating systems:', error.message);
        }
    }

    // Project handling functions
    async function handleNewProject(e) {
        e.preventDefault();
        
        const projectNameInput = document.getElementById('projectName');
        const projectName = projectNameInput.value;
        
        const validation = validateProjectName(projectName);
        
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return;
        }
        
        // Create new project and store in memory
        window.currentProject = createProject(validation.sanitizedName);
        
        // Update form to show current project
        updateFormToShowCurrentProject(validation.sanitizedName);
        
        // Add Next button to step 1
        const step1 = document.getElementById('projectInfo');
        if (step1) {
            // Remove existing next button if it exists
            const existingButton = step1.querySelector('.next-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            const nextButton = document.createElement('button');
            nextButton.className = 'next-button active';
            nextButton.textContent = 'Next';
            step1.appendChild(nextButton);

            nextButton.addEventListener('click', () => {
                if (typeof stepManager !== 'undefined' && stepManager && stepManager.completeStep) {
                    stepManager.completeStep('projectInfo');
                }
            });
        }
        
        // Update step completion status
        if (typeof stepManager !== 'undefined' && stepManager && stepManager.steps) {
            stepManager.steps[1].isComplete = true;
            if (stepManager.updateNavigation) {
                stepManager.updateNavigation();
            }
        }
    }

    // Function to validate project name
    function validateProjectName(name) {
        // Remove leading/trailing whitespace
        const trimmedName = name.trim();
        
        // Basic validation rules
        const rules = {
            minLength: 3,
            maxLength: 50,
            // Allows letters, numbers, spaces, hyphens, apostrophes, and underscores
            pattern: /^[a-zA-Z0-9\s\-'_]+$/,
        };
        
        const errors = [];
        
        if (trimmedName.length < rules.minLength) {
            errors.push(`Project name must be at least ${rules.minLength} characters long`);
        }
        
        if (trimmedName.length > rules.maxLength) {
            errors.push(`Project name must be no more than ${rules.maxLength} characters long`);
        }
        
        if (!rules.pattern.test(trimmedName)) {
            errors.push('Project name can only contain letters, numbers, spaces, hyphens, and apostrophes');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedName: trimmedName
        };
    }

    // Function to show projects list
    function showProjectsList() {
        const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
        
        // Create modal for projects list
        const modal = document.createElement('div');
        modal.className = 'projects-modal';
        modal.innerHTML = `
            <div class="projects-modal-content">
                <h3>Your Projects</h3>
                <div class="projects-list">
                    ${projects.length > 0 ? projects.map(project => `
                        <div class="project-item">
                            <span>${project.name}</span>
                            <div class="project-actions">
                                <button class="load-btn" data-project='${JSON.stringify(project)}'>Load</button>
                                <button class="download-btn" data-project='${JSON.stringify(project)}'>Download</button>
                                <button class="delete-btn" data-project-name="${project.name}">Delete</button>
                            </div>
                        </div>
                    `).join('') : '<p>No projects yet. Create a new project to get started!</p>'}
                </div>
                <button class="close-modal-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
        
        // Handle project loading
        modal.querySelectorAll('.load-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const project = JSON.parse(btn.dataset.project);
                loadProject(project);
                modal.remove();
            });
        });
    }
    
    function loadProject(project) {
        // Update the form to show the loaded project
        updateFormToShowCurrentProject(project.name);
        
        // Load saved electrification goals if they exist
        if (project.steps.electrificationGoals && 
            project.steps.electrificationGoals.selectedAppliances) {
            const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const appliance = project.steps.electrificationGoals.selectedAppliances
                    .find(appliance => appliance.type === checkbox.value);
                
                if (appliance) {
                    checkbox.checked = true;
                    
                    // Special handling for heating systems
                    if (checkbox.value === 'heating' && appliance.heatingSystems) {
                        restoreHeatingSystems(appliance.heatingSystems);
                    } else {
                        // Load quantity value if available for other appliances
                        const quantityField = document.querySelector(`.quantity-field[data-for="${checkbox.value}"] input[type="number"]`);
                        if (quantityField && appliance.quantity) {
                            quantityField.value = appliance.quantity;
                        }
                    }
                } else {
                    checkbox.checked = false;
                }
                
                // Update quantity field visibility
                handleQuantityFieldVisibility(checkbox);
            });
        }

        // Load panel size if it exists
        if (project.steps.currentEquipment && project.steps.currentEquipment.panelSize) {
            const panelAmps = document.querySelector('#panelAmps');
            if (panelAmps) {
                panelAmps.value = project.steps.currentEquipment.panelSize;
            }
        }
        
        // Update panel.hea.com URL after loading panel size
        if (stepManager && typeof stepManager.updatePanelHeaUrl === 'function') {
            stepManager.updatePanelHeaUrl();
        }
        
        // Update capacity input states after loading panel size and capacity data
        if (stepManager && typeof stepManager.updateCapacityInputStates === 'function') {
            stepManager.updateCapacityInputStates();
        }

        // Load capacity data from step 4 if it exists
        if (project.steps.loadAnalysis) {
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            
            if (project.steps.loadAnalysis.topDownCapacity && topDownCapacity) {
                topDownCapacity.value = project.steps.loadAnalysis.topDownCapacity;
            }
            
            if (project.steps.loadAnalysis.bottomUpCapacity && bottomUpCapacity) {
                bottomUpCapacity.value = project.steps.loadAnalysis.bottomUpCapacity;
            }
        }
        
        // Update step completion status for all steps
        stepManager.checkStepCompletion();
        
        // Update capacity summary if panel size and capacity data are loaded
        stepManager.updateCapacitySummary();
        
        // Load appliance selections if they exist
        if (project.steps.applianceSelections) {
            // Store the selections in the current project
            if (!window.currentProject) {
                window.currentProject = {};
            }
            if (!window.currentProject.steps) {
                window.currentProject.steps = {};
            }
            window.currentProject.steps.applianceSelections = project.steps.applianceSelections;
            
            // Apply the selections to the CSV appliances table if it exists
            setTimeout(() => {
                if (stepManager && stepManager.steps && stepManager.steps.planNewAppliances) {
                    stepManager.steps.planNewAppliances.applyLoadedApplianceSelections();
                }
            }, 1000); // Small delay to ensure the table is populated
        }
    }
    

    
    // Consolidated file saving function
    async function saveFile(project, options = {}) {
        console.log('saveFile called with project:', project);
        
        try {
            const dataStr = JSON.stringify(project, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const fileName = `${project.name.replace(/\s+/g, '_')}_panelwizard.json`;
            
            // Try different file saving methods based on browser support
            if (window.showSaveFilePicker) {
                // Chrome/Edge File System Access API
                console.log('Using File System Access API');
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: fileName,
                        types: [{
                            description: 'PanelWizard Project File',
                            accept: {
                                'application/json': ['.json']
                            }
                        }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(dataBlob);
                    await writable.close();
                    if (options.showSuccessMessage !== false) {
                        alert('Project saved successfully!');
                    }
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                    console.error('File System Access API error:', err);
                }
            }
            
            if (window.webkitRequestFileSystem) {
                // Safari File System API
                console.log('Using Safari File System API');
                try {
                    const fs = await new Promise((resolve, reject) => {
                        // Use the constant value instead of the deprecated window.TEMPORARY
                        window.webkitRequestFileSystem(0, dataBlob.size, resolve, reject);
                    });
                    const fileEntry = await new Promise((resolve, reject) => {
                        fs.root.getFile(fileName, { create: true }, resolve, reject);
                    });
                    const fileWriter = await new Promise((resolve, reject) => {
                        fileEntry.createWriter(resolve, reject);
                    });
                    await new Promise((resolve, reject) => {
                        fileWriter.onwriteend = resolve;
                        fileWriter.onerror = reject;
                        fileWriter.write(dataBlob);
                    });
                    if (options.showSuccessMessage !== false) {
                        alert('Project saved successfully!');
                    }
                    return;
                } catch (err) {
                    console.error('Safari File System API error:', err);
                }
            }
            
            // Fallback method for Firefox and other browsers
            console.log('Using fallback download method');
            const url = URL.createObjectURL(dataBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            
            if (options.showSuccessMessage !== false) {
                const message = `The file has been downloaded as: ${fileName}\n\n` +
                               `You can move it to your preferred location.`;
                alert(message);
            }
            
        } catch (err) {
            console.error('Error in saveFile:', err);
            alert('Error saving project: ' + err.message);
            throw err;
        }
    }

    // Update downloadProject to use the consolidated function
    async function downloadProject(project) {
        await saveFile(project, { showSuccessMessage: false });
    }

    // Update saveProjectFile to handle project data properly
    async function saveProjectFile() {
        if (!window.currentProject) {
            showError('No project to save');
            return;
        }

        // Create a steps object in the project if it doesn't exist
        if (!window.currentProject.steps) {
            window.currentProject.steps = {};
        }

        // Create a new steps object to ensure correct order
        const orderedSteps = {
            projectInfo: {},
            electrificationGoals: {},
            currentEquipment: {},
            loadAnalysis: {},
            gasAnalysis: {},
            planNewAppliances: {},
            actionPlan: {}
        };

        // Update project data with results from each step
        Object.values(stepManager.steps).forEach(step => {
            const results = step.getResults();
            if (results) {
                // Merge the results into the ordered steps object
                Object.assign(orderedSteps, results);
            }
        });

        // Add appliance selections to the project data
        // Include both existing selections and current default selections
        let allApplianceSelections = {};
        if (stepManager && stepManager.steps && stepManager.steps.planNewAppliances) {
            allApplianceSelections = stepManager.steps.planNewAppliances.getAllCurrentApplianceSelections();
        } else {
            // Fallback: try to get selections directly from currentProject
            if (window.currentProject?.steps?.applianceSelections) {
                allApplianceSelections = window.currentProject.steps.applianceSelections;
            }
            
            // Additional fallback: try to get selections from the table directly
            const tableBody = document.getElementById('csvAppliancesTableBody');
            if (tableBody) {
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach((row, index) => {
                    const productSelector = row.querySelector('.product-selector');
                    if (productSelector) {
                        const applianceKey = productSelector.getAttribute('data-appliance-key');
                        const category = productSelector.getAttribute('data-category');
                        const selectedProductId = productSelector.value;
                        
                        if (applianceKey && category && selectedProductId) {
                            allApplianceSelections[applianceKey] = {
                                productId: selectedProductId,
                                category: category
                            };
                        }
                    }
                });
            }
        }
        
        if (Object.keys(allApplianceSelections).length > 0) {
            orderedSteps.applianceSelections = allApplianceSelections;
        }

        // Update the project's steps with the ordered data
        window.currentProject.steps = orderedSteps;

        // Remove any duplicate panel size data
        if (window.currentProject.panelSize) {
            delete window.currentProject.panelSize;
        }

        // Update version number
        window.currentProject.version = window.APP_VERSION;

        // Add completion timestamp
        window.currentProject.completedAt = new Date().toISOString();
        
        try {
            await saveFile(window.currentProject);
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project: ' + error.message);
        }
    }

    function deleteProject(projectName) {
        // Show confirmation dialog
        const confirmDelete = confirm(`Are you sure you want to delete the project "${projectName}"? Make sure you have downloaded a copy if you want to save it.`);
        
        if (confirmDelete) {
            let projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
            projects = projects.filter(p => p.name !== projectName);
            localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
            
            // Show success message
            const projectsModal = document.querySelector('.projects-modal');
            const successMessage = document.createElement('div');
            successMessage.className = 'delete-success-message';
            successMessage.textContent = `Project "${projectName}" has been deleted`;
            
            // Insert message at the top of the modal content
            const modalContent = projectsModal.querySelector('.projects-modal-content');
            modalContent.insertBefore(successMessage, modalContent.firstChild);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
            
            // If this was the current project, reset the form
            const currentProjectElement = document.querySelector('.current-project .project-name');
            if (currentProjectElement && currentProjectElement.textContent === projectName) {
                resetProjectForm();
            }
            
            // Refresh projects list
            showProjectsList();
        }
    }
    
    function handleFileImport(e) {
        const file = e.target.files[0];
        if (file) {
            importProject(file);
        }
    }

    // ==========================================================================
    // Simple CSV Loader
    // ==========================================================================

    const applianceDatabase = {
        database: {},
        isInitialized: false,

        async initialize() {
            if (this.isInitialized) return;
            
            console.log('Loading appliance database...');
            console.log(`Protocol: ${window.location.protocol}, Hostname: ${window.location.hostname}`);
            
            try {
                // Load all appliance categories
                const categories = ['heat-pumps', 'water-heaters', 'cooking-appliances', 'clothes-dryers', 'ev-chargers', 'other-appliances'];
                
                for (const category of categories) {
                    this.database[category] = await this.loadCSV(category);
                    console.log(`Loaded ${category}: ${this.database[category].length} products`);
                }
                
                this.isInitialized = true;
                console.log('Appliance database loaded successfully');
            } catch (error) {
                console.error('Error loading appliance database:', error);
            }
        },

        async refresh() {
            console.log('Refreshing appliance database...');
            this.isInitialized = false;
            this.database = {};
            await this.initialize();
        },

        async loadCSV(categoryName) {
            try {
                // Use local CSV files for development, production URLs for deployment
                const isLocal = window.location.protocol === 'file:' || 
                               window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1';
                
                const csvPath = isLocal
                    ? `data/appliances/${categoryName}.csv?t=${Date.now()}`
                    : `https://wizard.hea.com/data/appliances/${categoryName}.csv`;
                
                console.log(`Loading CSV from: ${csvPath} (${isLocal ? 'local' : 'production'})`);
                
                const response = await fetch(csvPath);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const csvText = await response.text();
                return this.parseCSV(csvText);
            } catch (error) {
                console.warn(`Could not load ${categoryName}.csv:`, error.message);
                
                // Provide helpful guidance for local development
                if (window.location.protocol === 'file:') {
                    console.log('Tip: To use local CSV files, serve this application from a local web server:');
                    console.log('  python -m http.server 8000');
                    console.log('  npx serve .');
                }
                
                return [];
            }
        },

        parseCSV(csvText) {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) return [];
            
            const headers = lines[0].split(',').map(h => h.trim());
            
            const result = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const product = {};
                
                headers.forEach((header, index) => {
                    let value = values[index] || '';
                    
                    // Convert numeric values
                    if (header.includes('cost_') || header.includes('amps') || 
                        header.includes('voltage') || header.includes('btu') ||
                        header.includes('gal') || header.includes('kw') ||
                        header.includes('cu_ft') || header.includes('seer') ||
                        header.includes('hspf') || header.includes('uef') ||
                        header.includes('cef') || header.includes('load_calc_cf')) {
                        value = parseFloat(value) || 0;
                    }
                    
                    // Convert boolean values
                    if (header.includes('tankless') || header.includes('induction') ||
                        header.includes('heat_pump') || header.includes('smart_features')) {
                        value = value.toLowerCase() === 'true';
                    }
                    
                    product[header] = value;
                });
                
                return product;
            });
            
            return result;
        },

        getCategory(categoryName) {
            return this.database[categoryName] || [];
        },

        getProductsByCategory(categoryName) {
            // Debug: Log the first product to see available columns
            if (this.database[categoryName] && this.database[categoryName].length > 0) {
                const firstProduct = this.database[categoryName][0];
                console.log(`First product in ${categoryName}:`, firstProduct);
                console.log(`Available columns in ${categoryName}:`, Object.keys(firstProduct));
                console.log(`Headers found for ${categoryName}:`, Object.keys(firstProduct));
            }
            
            return this.database[categoryName] || [];
        },

        getProductById(id, category = null) {
            if (category) {
                return this.database[category]?.find(p => p.id === id);
            }
            
            for (const cat of Object.keys(this.database)) {
                const product = this.database[cat]?.find(p => p.id === id);
                if (product) return product;
            }
            return null;
        },

        updateCalculationResultsDisplay() {
            // Get the calculation result display elements
            const topDownDisplay = document.getElementById('topDownCapacityDisplay');
            const bottomUpDisplay = document.getElementById('bottomUpCapacityDisplay');
            const topDownResult = document.getElementById('topDownResult');
            const bottomUpResult = document.getElementById('bottomUpResult');
            
            if (!topDownDisplay || !bottomUpDisplay || !topDownResult || !bottomUpResult) {
                return;
            }
            
            // Get the capacity values from the input fields on the page
            const topDownInput = document.getElementById('topDownCapacity');
            const bottomUpInput = document.getElementById('bottomUpCapacity');
            
            if (!topDownInput || !bottomUpInput) {
                return;
            }
            
            const topDownCapacity = topDownInput.value ? parseInt(topDownInput.value) : null;
            const bottomUpCapacity = bottomUpInput.value ? parseInt(bottomUpInput.value) : null;
            
            // Update Top-Down display
            if (topDownCapacity && topDownCapacity > 0) {
                topDownDisplay.textContent = Math.round(topDownCapacity * 10) / 10;
                topDownResult.style.display = 'block';
            } else {
                topDownResult.style.display = 'none';
            }
            
            // Update Bottom-Up display
            if (bottomUpCapacity && bottomUpCapacity > 0) {
                bottomUpDisplay.textContent = Math.round(bottomUpCapacity * 10) / 10;
                bottomUpResult.style.display = 'block';
            } else {
                bottomUpResult.style.display = 'none';
            }
            
            // Always show at least one calculation method if we have any data
            const calculationResults = document.querySelector('.calculation-results');
            if (calculationResults) {
                if ((!topDownCapacity || topDownCapacity <= 0) && (!bottomUpCapacity || bottomUpCapacity <= 0)) {
                    calculationResults.style.display = 'none';
                } else {
                    calculationResults.style.display = 'block';
                }
            }
        },

        calculateBottomUpLoad(selectedAppliances) {
            let totalLoad = 0;
            
            if (!selectedAppliances || selectedAppliances.length === 0) {
                return 0;
            }
            
            // Map appliance types to CSV categories
            const applianceMap = {
                'heating': 'heat-pumps',
                'waterheater': 'water-heaters',
                'cooking': 'cooking-appliances',
                'dryer': 'clothes-dryers',
                'ev': 'ev-chargers',
                'other': 'other-appliances'
            };
            
            // Process each selected appliance type
            for (const appliance of selectedAppliances) {
                const category = applianceMap[appliance.type];
                if (!category) {
                    continue;
                }
                
                const products = this.getProductsByCategory(category);
                
                if (products.length === 0) {
                    continue;
                }
                
                // For heating systems, handle multiple systems
                if (appliance.type === 'heating' && appliance.heatingSystems) {
                    for (let i = 0; i < appliance.quantity; i++) {
                        const heatingSystem = appliance.heatingSystems[i];
                        if (!heatingSystem) continue;
                        
                        // Find the lowest amperage product that meets capacity requirements
                        const requiredCapacity = heatingSystem.capacity;
                        const suitableProducts = products.filter(product => 
                            (product.capacity_btu || 0) >= requiredCapacity
                        );
                        
                        if (suitableProducts.length === 0) continue;
                        
                        // Sort by panel amps and get the lowest-amperage suitable product
                        const sortedSuitableProducts = suitableProducts.sort((a, b) => (a.panel_amps_240v || 0) - (b.panel_amps_240v || 0));
                        const selectedProduct = sortedSuitableProducts[0];
                        
                        // Apply CF to the panel amps for Bottom-Up calculation
                        const rawAmps = selectedProduct.panel_amps_240v || 0;
                        const cf = selectedProduct.load_calc_cf || 1.0; // Default to 1.0 if no CF
                        const adjustedAmps = rawAmps * cf;
                        
                        totalLoad += adjustedAmps;
                    }
                } else {
                    // For non-heating appliances
                    const sortedProducts = products.sort((a, b) => (a.panel_amps_240v || 0) - (b.panel_amps_240v || 0));
                    const lowestAmpProduct = sortedProducts[0];
                    
                    if (lowestAmpProduct) {
                        // Apply CF to the panel amps for Bottom-Up calculation
                        const rawAmps = lowestAmpProduct.panel_amps_240v || 0;
                        const cf = lowestAmpProduct.load_calc_cf || 1.0; // Default to 1.0 if no CF
                        const adjustedAmps = rawAmps * cf;
                        
                        // Apply quantity
                        totalLoad += adjustedAmps * appliance.quantity;
                    }
                }
            }
            
            return totalLoad;
        }
    };

    // Make it globally available
    window.applianceDatabase = applianceDatabase;

    // ==========================================================================
    // Load Calculator for Panel Capacity
    // ==========================================================================

    class LoadCalculator {
        constructor(database) {
            this.database = database;
        }

        calculateTotalLoad(selectedProducts) {
            let totalLoad = 0;
            let loadBreakdown = [];

            selectedProducts.forEach(product => {
                const panelAmps = product.panel_amps_240v || 0;
                totalLoad += panelAmps;
                
                loadBreakdown.push({
                    product: product,
                    panelAmps: panelAmps,
                    runningTotal: totalLoad
                });
            });

            return {
                totalLoad: totalLoad,
                breakdown: loadBreakdown
            };
        }

        checkCapacityFit(selectedProducts, availableCapacity) {
            const loadInfo = this.calculateTotalLoad(selectedProducts);
            const fits = loadInfo.totalLoad <= availableCapacity;
            const remainingCapacity = availableCapacity - loadInfo.totalLoad;

            return {
                fits: fits,
                totalLoad: loadInfo.totalLoad,
                remainingCapacity: remainingCapacity,
                breakdown: loadInfo.breakdown
            };
        }

        getRecommendations(goals, availableCapacity, preferences = {}) {
            const recommendations = [];
            
            // Get user's electrification goals from Step 2
            const selectedAppliances = goals.selectedAppliances || [];
            
            selectedAppliances.forEach(goal => {
                const category = this.mapGoalToCategory(goal.type);
                if (category) {
                    const products = this.database.getProductsByCategory(category);
                    const filteredProducts = this.filterProductsByCapacity(products, availableCapacity, preferences);
                    
                    if (filteredProducts.length > 0) {
                        recommendations.push({
                            goal: goal,
                            category: category,
                            products: filteredProducts.slice(0, 5), // Top 5 recommendations
                            estimatedLoad: this.estimateLoadForGoal(goal, category)
                        });
                    }
                }
            });
            
            return recommendations;
        }

        mapGoalToCategory(goalType) {
            const categoryMap = {
                'heating': 'heat-pumps',
                'waterheater': 'water-heaters',
                'cooking': 'cooking-appliances',
                'dryer': 'clothes-dryers',
                'ev': 'ev-chargers',
                'other': 'other-appliances'
            };
            
            return categoryMap[goalType];
        }

        filterProductsByCapacity(products, availableCapacity, preferences = {}) {
            return products.filter(product => {
                const panelAmps = product.panel_amps_240v || 0;
                
                // Basic capacity filter
                if (panelAmps > availableCapacity) return false;
                
                // Apply preference filters if specified
                if (preferences.maxCost && product.cost_max > preferences.maxCost) return false;
                if (preferences.energyStar && !product.energy_star_rated) return false;
                if (preferences.manufacturer && !product.manufacturer.toLowerCase().includes(preferences.manufacturer.toLowerCase())) return false;
                
                return true;
            }).sort((a, b) => {
                // Sort by panel capacity efficiency (lower amps = better)
                return (a.panel_amps_240v || 0) - (b.panel_amps_240v || 0);
            });
        }

        estimateLoadForGoal(goal, category) {
            const products = this.database.getProductsByCategory(category);
            if (products.length === 0) return 0;
            
            // Use average panel amps for the category
            const avgPanelAmps = products.reduce((sum, p) => sum + (p.panel_amps_240v || 0), 0) / products.length;
            return avgPanelAmps * goal.quantity;
        }
    }

    // Create global load calculator instance
    try {
        window.loadCalculator = new LoadCalculator(window.applianceDatabase);
    } catch (error) {
        console.error('Error initializing load calculator:', error);
        // Create fallback instance
        window.loadCalculator = {
            calculateTotalLoad: () => ({ totalLoad: 0, breakdown: [] }),
            checkCapacityFit: () => ({ fits: false, totalLoad: 0, remainingCapacity: 0, breakdown: [] }),
            getRecommendations: () => [],
            mapGoalToCategory: () => null,
            filterProductsByCapacity: () => [],
            estimateLoadForGoal: () => 0
        };
    }

    // ==========================================================================
    // Step Class Definition
    // ==========================================================================

    class Step {
        constructor(config) {
            this.id = config.id;
            this.title = config.title;
            this.description = config.description;
            this.isOptional = config.isOptional;
            this.nextStep = config.nextStep;
            this.isComplete = false;
            this.skipState = config.skipState || false;
            this.validateStep = config.validation;
            this.getResults = config.getResults;
            this.element = document.getElementById(this.id);
            
            // Add skip state change listener if this is an optional step
            if (this.isOptional) {
                const skipCheckbox = this.element?.querySelector('input[type="checkbox"]');
                if (skipCheckbox) {
                    skipCheckbox.addEventListener('change', () => {
                        this.skipState = skipCheckbox.checked;
                        // Force step completion check when checkbox state changes
                        stepManager.checkStepCompletion();
                    });
                }
            }
        }

        getNextButton() {
            return this.element?.querySelector('.next-button');
        }

        getSaveButton() {
            return this.element?.querySelector('.save-button');
        }

        createNextButton() {
            if (!this.element) return null;
            
            const existingButton = this.getNextButton();
            if (existingButton) return existingButton;
            
            const button = document.createElement('button');
            button.className = 'next-button';
            
            // Special handling for the final step
            if (!this.nextStep) {
                button.textContent = 'Celebrate!';
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Trigger confetti
                    try {
                        if (typeof confetti === 'function') {
                            confetti({
                                particleCount: 100,
                                spread: 70,
                                origin: { y: 0.6 }
                            });
                        }
                    } catch (confettiError) {
                        console.warn('Confetti animation failed:', confettiError.message);
                    }
                    
                    // Show celebration message
                    const celebrationMessage = document.createElement('div');
                    celebrationMessage.className = 'celebration-message';
                    celebrationMessage.innerHTML = `
                        <h3>🎉 Congratulations! 🎉</h3>
                        <p>You've completed your electrification plan!</p>
                        <p>Don't forget to save your project file for future reference.</p>
                    `;
                    
                    // Insert the message before the buttons
                    const buttonContainer = this.element.querySelector('.button-container');
                    if (buttonContainer) {
                        buttonContainer.parentNode.insertBefore(celebrationMessage, buttonContainer);
                    }
                });
            } else {
                button.textContent = 'Next';
            }
            
            this.element.appendChild(button);
            return button;
        }

        createSaveButton() {
            if (!this.element) return null;
            
            const existingButton = this.getSaveButton();
            if (existingButton) return existingButton;
            
            const button = document.createElement('button');
            button.className = 'save-button';
            button.textContent = 'Save Project to File';
            this.element.appendChild(button);
            
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await saveProjectFile();
            });
            
            return button;
        }

        async loadProductRecommendations() {
            // Get user's electrification goals from Step 2
            const goals = window.currentProject?.steps?.electrificationGoals || {};
            const availableCapacity = window.currentProject?.steps?.loadAnalysis?.maxCapacity || 0;
            
            if (!goals.selectedAppliances || goals.selectedAppliances.length === 0) {
                console.log('No electrification goals found');
                return;
            }
            
            if (availableCapacity === 0) {
                console.log('No available capacity information found');
                return;
            }
            
            console.log('Loading product recommendations for:', goals.selectedAppliances);
            console.log('Available capacity:', availableCapacity);
            
            // Get recommendations from load calculator
            const recommendations = window.loadCalculator.getRecommendations(goals, availableCapacity);
            console.log('Product recommendations:', recommendations);
            
            // Display recommendations in the UI
            this.displayProductRecommendations(recommendations, availableCapacity);
        }

        displayProductRecommendations(recommendations, availableCapacity) {
            const container = this.element.querySelector('.content-box');
            if (!container) return;
            
            // Create recommendations section
            let recommendationsHTML = `
                <h3>Product Recommendations</h3>
                <p>Based on your electrification goals and available panel capacity (${availableCapacity} amps), here are our recommendations:</p>
            `;
            
            if (recommendations.length === 0) {
                recommendationsHTML += '<p><em>No products found that fit within your panel capacity.</em></p>';
            } else {
                recommendations.forEach(rec => {
                    recommendationsHTML += `
                        <div class="recommendation-category">
                            <h4>${this.getCategoryDisplayName(rec.category)}</h4>
                            <p>${rec.goal.quantity} appliance(s) needed</p>
                            <div class="product-grid">
                    `;
                    
                    rec.products.forEach(product => {
                        recommendationsHTML += `
                            <div class="product-card" data-product-id="${product.id}" data-category="${rec.category}">
                                <h5>${product.name}</h5>
                                <p><strong>Manufacturer:</strong> ${product.manufacturer}</p>
                                <p><strong>Panel Load:</strong> ${product.panel_amps_240v} amps</p>
                                <p><strong>Cost:</strong> $${product.cost_min.toLocaleString()} - $${product.cost_max.toLocaleString()}</p>
                                <button class="select-product-btn" onclick="selectProduct('${product.id}', '${rec.category}')">Select This Product</button>
                            </div>
                        `;
                    });
                    
                    recommendationsHTML += `
                            </div>
                        </div>
                    `;
                });
            }
            
            // Add selected products summary
            recommendationsHTML += `
                <div class="selected-products-summary" style="display: none;">
                    <h3>Your Selected Products</h3>
                    <div id="selectedProductsList"></div>
                    <div class="capacity-summary">
                        <p><strong>Total Panel Load:</strong> <span id="totalPanelLoad">0</span> amps</p>
                        <p><strong>Remaining Capacity:</strong> <span id="remainingCapacity">${availableCapacity}</span> amps</p>
                    </div>
                </div>
            `;
            
            // Insert recommendations after existing content
            const existingContent = container.querySelector('p:last-of-type');
            if (existingContent) {
                existingContent.insertAdjacentHTML('afterend', recommendationsHTML);
            } else {
                container.insertAdjacentHTML('beforeend', recommendationsHTML);
            }
        }

        getCategoryDisplayName(category) {
            return DISPLAY_NAMES.categories[category] || category;
        }

        async populateCsvAppliancesTable() {
            try {
                console.log('Starting CSV appliances table population...');
                
                // Get user's electrification goals from Step 2
                const goals = window.currentProject?.steps?.electrificationGoals || {};
                const availableCapacity = window.currentProject?.steps?.loadAnalysis?.maxCapacity || 0;
                
                console.log('Goals found:', goals);
                console.log('Available capacity:', availableCapacity);
                
                if (!goals.selectedAppliances || goals.selectedAppliances.length === 0) {
                    console.log('No electrification goals found for CSV table');
                    // Show a message in the table instead of returning
                    this.showNoGoalsMessage();
                    return;
                }
                
                if (availableCapacity === 0) {
                    console.log('No available capacity information found for CSV table');
                    // Show a message in the table instead of returning
                    this.showNoCapacityMessage();
                    return;
                }
                
                console.log('Populating CSV appliances table for:', goals.selectedAppliances);
                console.log('Available capacity:', availableCapacity);
                
                // Initialize appliance database if not already done
                if (!window.applianceDatabase || !window.applianceDatabase.isInitialized) {
                    try {
                        await window.applianceDatabase.initialize();
                        console.log('Appliance database initialized for CSV table');
                    } catch (error) {
                        console.error('Failed to initialize appliance database for CSV table:', error);
                        return;
                    }
                }
                
                // Get the lowest-amperage appliance for each selected type
                const selectedAppliances = goals.selectedAppliances;
                const csvTableBody = document.getElementById('csvAppliancesTableBody');
                const totalPanelLoadSpan = document.getElementById('totalCsvPanelLoad');
                const remainingCapacitySpan = document.getElementById('remainingCsvCapacity');
                
                if (!csvTableBody || !totalPanelLoadSpan || !remainingCapacitySpan) {
                    console.warn('CSV table elements not found');
                    return;
                }
                
                // Clear existing table content
                csvTableBody.innerHTML = '';
                
                let totalPanelLoad = 0;
                const applianceMap = {
                    'heating': 'heat-pumps',
                    'waterheater': 'water-heaters',
                    'cooking': 'cooking-appliances',
                    'dryer': 'clothes-dryers',
                    'ev': 'ev-chargers',
                    'other': 'other-appliances'
                };
                
                // Process each selected appliance type
                for (const appliance of selectedAppliances) {
                    const category = applianceMap[appliance.type];
                    if (!category) {
                        console.warn('Unknown appliance type:', appliance.type);
                        continue;
                    }
                    
                    const products = window.applianceDatabase.getProductsByCategory(category);
                    
                    if (products.length === 0) {
                        console.warn('No products found for category:', category);
                        continue;
                    }
                    
                    // For heating systems, select appropriate products based on capacity requirements
                    if (appliance.type === 'heating' && appliance.heatingSystems) {
                        // Create one row per individual heating system with capacity-appropriate products
                        for (let i = 0; i < appliance.quantity; i++) {
                            const heatingSystem = appliance.heatingSystems[i];
                            if (!heatingSystem) continue;
                            
                            // Find the lowest amperage product that meets or exceeds the required capacity
                            const requiredCapacity = heatingSystem.capacity;
                            const suitableProducts = products.filter(product => 
                                (product.capacity_btu || 0) >= requiredCapacity
                            );
                            
                            if (suitableProducts.length === 0) {
                                console.warn(`No products found for heating system ${heatingSystem.id} with capacity >= ${requiredCapacity} BTU`);
                                continue;
                            }
                            
                            // Sort by panel amps (lowest first) and get the lowest-amperage suitable product
                            const sortedSuitableProducts = suitableProducts.sort((a, b) => (a.panel_amps_240v || 0) - (b.panel_amps_240v || 0));
                            const selectedProduct = sortedSuitableProducts[0];
                            
                            const applianceAmps = selectedProduct.panel_amps_240v || 0;
                            totalPanelLoad += applianceAmps;
                            
                            // Create table row for this heating system
                            const row = document.createElement('tr');
                            const displayName = `${DISPLAY_NAMES.applianceTypes[appliance.type] || appliance.type} ${heatingSystem.id}`;
                            
                            row.innerHTML = `
                                <td>${displayName}</td>
                                <td></td>
                                <td>${selectedProduct.load_calc_cf || 'N/A'}</td>
                                <td>$${(selectedProduct.cost_min || 0).toLocaleString()} - $${(selectedProduct.cost_max || 0).toLocaleString()}</td>
                                <td><button class="details-btn" onclick="showProductDetails('${selectedProduct.id || ''}', '${category}', '${appliance.type}')">📋 Details</button></td>
                            `;
                            
                            // Add the dropdown to the second cell
                            const dropdown = this.createProductDropdown(
                                suitableProducts, 
                                selectedProduct.id, 
                                `${appliance.type}_${heatingSystem.id}`,
                                category
                            );
                            row.cells[1].appendChild(dropdown);
                            csvTableBody.appendChild(row);
                            
                            console.log(`Added heating system ${heatingSystem.id}: ${selectedProduct.name} (${selectedProduct.capacity_btu} BTU >= ${requiredCapacity} BTU required), ${applianceAmps} amps`);
                        }
                    } else {
                        // For non-heating appliances, use the original logic
                        // Sort by panel amps (lowest first) and get the lowest-amperage product
                        const sortedProducts = products.sort((a, b) => (a.panel_amps_240v || 0) - (b.panel_amps_240v || 0));
                        const lowestAmpProduct = sortedProducts[0];
                        
                        if (lowestAmpProduct) {
                            // Create one row per individual appliance
                            for (let i = 0; i < appliance.quantity; i++) {
                                const applianceAmps = lowestAmpProduct.panel_amps_240v || 0;
                                totalPanelLoad += applianceAmps;
                                
                                // Create table row for each individual appliance
                                const row = document.createElement('tr');
                                
                                // Get the display name with numbering for individual appliances
                                const displayName = `${DISPLAY_NAMES.applianceTypes[appliance.type] || appliance.type} ${i + 1}`;
                                
                                row.innerHTML = `
                                    <td>${displayName}</td>
                                    <td></td>
                                    <td>${lowestAmpProduct.load_calc_cf || 'N/A'}</td>
                                    <td>$${(lowestAmpProduct.cost_min || 0).toLocaleString()} - $${(lowestAmpProduct.cost_max || 0).toLocaleString()}</td>
                                    <td><button class="details-btn" onclick="showProductDetails('${lowestAmpProduct.id || ''}', '${category}', '${appliance.type}')">📋 Details</button></td>
                                `;
                                
                                // Add the dropdown to the second cell
                                const dropdown = this.createProductDropdown(
                                    products, 
                                    lowestAmpProduct.id, 
                                    `${appliance.type}_${i + 1}`,
                                    category
                                );
                                row.cells[1].appendChild(dropdown);
                                
                                // Quick debug: Check if load_calc_cf exists and what it contains
                                console.log('CF Debug - Product keys:', Object.keys(lowestAmpProduct));
                                console.log('CF Debug - load_calc_cf value:', lowestAmpProduct.load_calc_cf);
                                console.log('CF Debug - Raw product:', lowestAmpProduct);
                                csvTableBody.appendChild(row);
                            }
                            
                            console.log(`Added ${appliance.quantity} ${category} appliance(s): ${lowestAmpProduct.name}, ${appliance.quantity * (lowestAmpProduct.panel_amps_240v || 0)} total amps`);
                        }
                    }
                }
                
                // Update summary information for both panels
                // Round the total panel load to 1 decimal place
                const roundedTotalPanelLoad = Math.round(totalPanelLoad * 10) / 10;
                totalPanelLoadSpan.textContent = roundedTotalPanelLoad;
                
                // Get the individual capacity values for each approach
                const topDownInput = document.getElementById('topDownCapacity');
                const bottomUpInput = document.getElementById('bottomUpCapacity');
                const topDownCapacity = topDownInput && topDownInput.value ? parseInt(topDownInput.value) : null;
                const bottomUpCapacity = bottomUpInput && bottomUpInput.value ? parseInt(bottomUpInput.value) : null;
                
                // Calculate remaining capacity for Top-Down approach (NEC 220.87)
                // Uses raw panel amps without CF
                let topDownRemaining = null;
                if (topDownCapacity && topDownCapacity > 0) {
                    topDownRemaining = Math.round((topDownCapacity - totalPanelLoad) * 10) / 10;
                }
                
                // Calculate remaining capacity for Bottom-Up approach (NEC 220.83)
                // Applies CF to each appliance's panel amps
                let bottomUpRemaining = null;
                let bottomUpTotalLoad = 0;
                
                if (bottomUpCapacity && bottomUpCapacity > 0) {
                    // Recalculate total load with CF applied for Bottom-Up approach
                    bottomUpTotalLoad = window.applianceDatabase.calculateBottomUpLoad(selectedAppliances);
                    // Round the total load to 1 decimal place
                    bottomUpTotalLoad = Math.round(bottomUpTotalLoad * 10) / 10;
                    bottomUpRemaining = Math.round((bottomUpCapacity - bottomUpTotalLoad) * 10) / 10;
                }
                
                // Update Top-Down panel
                if (remainingCapacitySpan && topDownRemaining !== null) {
                    remainingCapacitySpan.textContent = topDownRemaining;
                    
                    // Visual feedback for Top-Down capacity
                    if (topDownRemaining < 0) {
                        remainingCapacitySpan.textContent = `${topDownRemaining} (OVER CAPACITY!)`;
                        remainingCapacitySpan.style.color = 'var(--error-color)';
                    } else if (topDownRemaining < 10) {
                        remainingCapacitySpan.style.color = 'var(--warning-color)';
                    } else {
                        remainingCapacitySpan.style.color = 'var(--success-color)';
                    }
                }
                
                // Update Bottom-Up panel
                const totalPanelLoadSpan2 = document.getElementById('totalCsvPanelLoad2');
                const remainingCapacitySpan2 = document.getElementById('remainingCsvCapacity2');
                if (totalPanelLoadSpan2 && bottomUpTotalLoad > 0) {
                    totalPanelLoadSpan2.textContent = bottomUpTotalLoad;
                } else if (totalPanelLoadSpan2) {
                    totalPanelLoadSpan2.textContent = roundedTotalPanelLoad; // Fallback to rounded raw load if no CF calculation
                }
                
                if (remainingCapacitySpan2 && bottomUpRemaining !== null) {
                    remainingCapacitySpan2.textContent = bottomUpRemaining;
                    
                    // Visual feedback for Bottom-Up capacity
                    if (bottomUpRemaining < 0) {
                        remainingCapacitySpan2.textContent = `${bottomUpRemaining} (OVER CAPACITY!)`;
                        remainingCapacitySpan2.style.color = 'var(--error-color)';
                    } else if (bottomUpRemaining < 10) {
                        remainingCapacitySpan2.style.color = 'var(--warning-color)';
                    } else {
                        remainingCapacitySpan2.style.color = 'var(--success-color)';
                    }
                }
                
                // Show/hide Power Reduction Options based on capacity status
                const powerReductionOptions = document.getElementById('powerReductionOptions');
                const isOverCapacity = (topDownRemaining !== null && topDownRemaining < 0) || 
                                      (bottomUpRemaining !== null && bottomUpRemaining < 0);
                if (powerReductionOptions) {
                    powerReductionOptions.style.display = isOverCapacity ? 'block' : 'none';
                }
                
                // Update calculation results display
                if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                    window.applianceDatabase.updateCalculationResultsDisplay();
                }
                
                // Apply any existing appliance selections after populating the table
                this.applyExistingApplianceSelections();
                
                // Update total cost range display
                this.updateTotalCostRangeDisplay();
                
                console.log('CSV appliances table populated successfully');
                
            } catch (error) {
                console.error('Error populating CSV appliances table:', error);
            }
        }

        getEnergyRating(product) {
            const ratings = [];
            
            if (product.seer) ratings.push(`SEER: ${product.seer}`);
            if (product.hspf) ratings.push(`HSPF: ${product.hspf}`);
            if (product.uef) ratings.push(`UEF: ${product.uef}`);
            if (product.cef) ratings.push(`CEF: ${product.cef}`);
            if (product.energy_star_rated) ratings.push('Energy Star');
            
            return ratings.length > 0 ? ratings.join(', ') : 'N/A';
        }

        showNoGoalsMessage() {
            const csvTableBody = document.getElementById('csvAppliancesTableBody');
            if (csvTableBody) {
                csvTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; color: var(--text-secondary); font-style: italic;">
                            No electrification goals selected. Please go back to Step 2 to select your electrification goals.
                        </td>
                    </tr>
                `;
            }
            
            // Clear summary information
            this.clearCsvSummary();
        }

        showNoCapacityMessage() {
            const csvTableBody = document.getElementById('csvAppliancesTableBody');
            if (csvTableBody) {
                csvTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; color: var(--text-secondary); font-style: italic;">
                            No panel capacity information available. Please complete Step 4 to calculate your available capacity.
                        </td>
                    </tr>
                `;
            }
            
            // Clear summary information
            this.clearCsvSummary();
        }

        clearCsvSummary() {
            const totalPanelLoadSpan = document.getElementById('totalCsvPanelLoad');
            const remainingCapacitySpan = document.getElementById('remainingCsvCapacity');
            const totalPanelLoadSpan2 = document.getElementById('totalCsvPanelLoad2');
            const remainingCapacitySpan2 = document.getElementById('remainingCsvCapacity2');
            
            if (totalPanelLoadSpan) totalPanelLoadSpan.textContent = '0.0';
            if (remainingCapacitySpan) remainingCapacitySpan.textContent = '0.0';
            if (totalPanelLoadSpan2) totalPanelLoadSpan2.textContent = '0.0';
            if (remainingCapacitySpan2) remainingCapacitySpan2.textContent = '0.0';
            
            // Reset colors to default
            if (remainingCapacitySpan) remainingCapacitySpan.style.color = '';
            if (remainingCapacitySpan2) remainingCapacitySpan2.style.color = '';
            
            // Also update the calculation results display
            if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                window.applianceDatabase.updateCalculationResultsDisplay();
            }
        }

        // Create a dropdown for product selection
        createProductDropdown(products, selectedProductId, applianceKey, category) {
            const dropdown = document.createElement('select');
            dropdown.className = 'product-selector';
            dropdown.setAttribute('data-appliance-key', applianceKey);
            dropdown.setAttribute('data-category', category);
            
            // Add event listener for product changes - bind to the Step instance
            const stepInstance = this;
            dropdown.addEventListener('change', function(event) {
                stepInstance.handleProductSelectionChange(event, applianceKey);
            });
            
            // Create options for each product
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (${product.panel_amps_240v || 0} amps)`;
                option.selected = product.id === selectedProductId;
                dropdown.appendChild(option);
            });
            
            return dropdown; // Return the DOM element directly
        }

        // Handle product selection changes
        handleProductSelectionChange(event, applianceKey) {
            const selectedProductId = event.target.value;
            const category = event.target.getAttribute('data-category');
            
            // Store the selection in the project data
            if (!window.currentProject) {
                window.currentProject = {};
            }
            if (!window.currentProject.steps) {
                window.currentProject.steps = {};
            }
            if (!window.currentProject.steps.applianceSelections) {
                window.currentProject.steps.applianceSelections = {};
            }
            
            window.currentProject.steps.applianceSelections[applianceKey] = {
                productId: selectedProductId,
                category: category
            };
            
            // Save to localStorage
            this.saveProjectToLocalStorage();
            
            // Recalculate and update the table
            this.updateTableWithNewSelections();
        }

        // Update table with new product selections
        updateTableWithNewSelections() {
            // Get current selections
            const selections = window.currentProject?.steps?.applianceSelections || {};
            
            // Update each row's data based on selections
            const rows = document.querySelectorAll('#csvAppliancesTableBody tr');
            
            rows.forEach((row, index) => {
                const productSelector = row.querySelector('.product-selector');
                if (productSelector) {
                    const applianceKey = productSelector.getAttribute('data-appliance-key');
                    const category = productSelector.getAttribute('data-category');
                    const selection = selections[applianceKey];
                    
                    if (selection) {
                        const product = window.applianceDatabase.getProductById(selection.productId, category);
                        if (product) {
                            // Update the coincidence factor column
                            const cfCell = row.cells[2];
                            if (cfCell) {
                                cfCell.textContent = product.load_calc_cf || 'N/A';
                            }
                            
                            // Update the cost column
                            const costCell = row.cells[3];
                            if (costCell) {
                                costCell.textContent = `$${(product.cost_min || 0).toLocaleString()} - $${(product.cost_max || 0).toLocaleString()}`;
                            }
                            
                            // Update the details button
                            const detailsBtn = row.querySelector('.details-btn');
                            if (detailsBtn) {
                                detailsBtn.onclick = () => showProductDetails(product.id, category, applianceKey.split('_')[0]);
                            }
                        } else {
                            console.warn(`Product not found for ID: ${selection.productId} in category: ${category}`);
                        }
                    }
                }
            });
            
            // Recalculate totals and update display
            this.recalculateAndUpdateDisplay();
        }

        // Calculate total cost range from all products in the table
        calculateTotalCostRange() {
            let totalCostMin = 0;
            let totalCostMax = 0;
            const rows = document.querySelectorAll('#csvAppliancesTableBody tr');
            
            rows.forEach(row => {
                const productSelector = row.querySelector('.product-selector');
                if (productSelector && productSelector.value) {
                    const category = productSelector.getAttribute('data-category');
                    const selectedProductId = productSelector.value;
                    const product = window.applianceDatabase?.getProductById(selectedProductId, category);
                    
                    if (product) {
                        totalCostMin += product.cost_min || 0;
                        totalCostMax += product.cost_max || 0;
                    }
                    } else {
                        // Fallback: try to parse cost from the cost cell (column index 3)
                        const costCell = row.cells[3];
                    if (costCell) {
                        const costText = costCell.textContent.trim();
                        // Parse format like "$1,234 - $5,678"
                        const costMatch = costText.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
                        if (costMatch) {
                            const min = parseInt(costMatch[1].replace(/,/g, ''));
                            const max = parseInt(costMatch[2].replace(/,/g, ''));
                            if (!isNaN(min) && !isNaN(max)) {
                                totalCostMin += min;
                                totalCostMax += max;
                            }
                        }
                    }
                }
            });
            
            return { min: totalCostMin, max: totalCostMax };
        }

        // Update total cost range display
        updateTotalCostRangeDisplay() {
            const { min, max } = this.calculateTotalCostRange();
            const totalCostRangeSpan = document.getElementById('totalCostRange');
            if (totalCostRangeSpan) {
                if (min === 0 && max === 0) {
                    totalCostRangeSpan.textContent = '-';
                } else {
                    totalCostRangeSpan.textContent = `$${min.toLocaleString()} - $${max.toLocaleString()}`;
                }
            }
        }

        // Recalculate totals and update display
        recalculateAndUpdateDisplay() {
            // Get current selections
            const selections = window.currentProject?.steps?.applianceSelections || {};
            
            let totalPanelLoad = 0;
            const rows = document.querySelectorAll('#csvAppliancesTableBody tr');
            
            rows.forEach(row => {
                const productSelector = row.querySelector('.product-selector');
                if (productSelector) {
                    const category = productSelector.getAttribute('data-category');
                    const selectedProductId = productSelector.value;
                    const product = window.applianceDatabase.getProductById(selectedProductId, category);
                    
                    if (product) {
                        totalPanelLoad += product.panel_amps_240v || 0;
                    }
                }
            });
            
            // Round the total load to 1 decimal place
            totalPanelLoad = Math.round(totalPanelLoad * 10) / 10;
            
            // Update the total panel load display
            const totalPanelLoadSpan = document.getElementById('totalCsvPanelLoad');
            if (totalPanelLoadSpan) {
                totalPanelLoadSpan.textContent = totalPanelLoad;
            }
            
            // Update total cost range display
            this.updateTotalCostRangeDisplay();
            
            // Update remaining capacity calculations
            this.updateRemainingCapacity(totalPanelLoad);
        }

        // Update remaining capacity calculations
        updateRemainingCapacity(totalPanelLoad) {
            const topDownInput = document.getElementById('topDownCapacity');
            const bottomUpInput = document.getElementById('bottomUpCapacity');
            const topDownCapacity = topDownInput && topDownInput.value ? parseInt(topDownInput.value) : null;
            const bottomUpCapacity = bottomUpInput && bottomUpInput.value ? parseInt(bottomUpInput.value) : null;
            
            // Declare variables to track remaining capacity
            let topDownRemaining = null;
            let bottomUpRemaining = null;
            
            // Update Top-Down remaining capacity (NEC 220.87)
            // Uses raw panel amps without CF
            if (topDownCapacity && topDownCapacity > 0) {
                topDownRemaining = Math.round((topDownCapacity - totalPanelLoad) * 10) / 10;
                const remainingCapacitySpan = document.getElementById('remainingCsvCapacity');
                
                if (remainingCapacitySpan) {
                    remainingCapacitySpan.textContent = topDownRemaining;
                    
                    if (topDownRemaining < 0) {
                        remainingCapacitySpan.textContent = `${topDownRemaining} (OVER CAPACITY!)`;
                        remainingCapacitySpan.style.color = 'var(--error-color)';
                    } else if (topDownRemaining < 10) {
                        remainingCapacitySpan.style.color = 'var(--warning-color)';
                    } else {
                        remainingCapacitySpan.style.color = 'var(--success-color)';
                    }
                }
            }
            
            // Update Bottom-Up remaining capacity (NEC 220.83)
            // Applies CF to each appliance's panel amps
            if (bottomUpCapacity && bottomUpCapacity > 0) {
                // Calculate the CF-adjusted total load
                let bottomUpTotalLoad = 0;
                const rows = document.querySelectorAll('#csvAppliancesTableBody tr');
                
                rows.forEach(row => {
                    const productSelector = row.querySelector('.product-selector');
                    if (productSelector) {
                        const category = productSelector.getAttribute('data-category');
                        const selectedProductId = productSelector.value;
                        const product = window.applianceDatabase.getProductById(selectedProductId, category);
                        
                        if (product) {
                            const panelAmps = product.panel_amps_240v || 0;
                            const capacityFactor = product.load_calc_cf || 1.0;
                            const cfAdjustedLoad = panelAmps * capacityFactor;
                            bottomUpTotalLoad += cfAdjustedLoad;
                        }
                    }
                });
                
                // Round the total load to 1 decimal place
                bottomUpTotalLoad = Math.round(bottomUpTotalLoad * 10) / 10;
                
                // Update the Bottom-Up total panel load display
                const totalPanelLoadSpan2 = document.getElementById('totalCsvPanelLoad2');
                if (totalPanelLoadSpan2) {
                    totalPanelLoadSpan2.textContent = bottomUpTotalLoad;
                }
                
                // Calculate remaining capacity
                bottomUpRemaining = Math.round((bottomUpCapacity - bottomUpTotalLoad) * 10) / 10;
                const remainingCapacitySpan2 = document.getElementById('remainingCsvCapacity2');
                
                if (remainingCapacitySpan2) {
                    remainingCapacitySpan2.textContent = bottomUpRemaining;
                    
                    if (bottomUpRemaining < 0) {
                        remainingCapacitySpan2.textContent = `${bottomUpRemaining} (OVER CAPACITY!)`;
                        remainingCapacitySpan2.style.color = 'var(--error-color)';
                    } else if (bottomUpRemaining < 10) {
                        remainingCapacitySpan2.style.color = 'var(--warning-color)';
                    } else {
                        remainingCapacitySpan2.style.color = 'var(--success-color)';
                    }
                }
            }
            
            // Show/hide Power Reduction Options based on capacity status
            const powerReductionOptions = document.getElementById('powerReductionOptions');
            const isOverCapacity = (topDownRemaining !== null && topDownRemaining < 0) || 
                                  (bottomUpRemaining !== null && bottomUpRemaining < 0);
            if (powerReductionOptions) {
                powerReductionOptions.style.display = isOverCapacity ? 'block' : 'none';
            }
        }

        // Save project to localStorage
        saveProjectToLocalStorage() {
            try {
                if (window.currentProject) {
                    localStorage.setItem('panelWizardProject', JSON.stringify(window.currentProject));
                    console.log('Project saved to localStorage');
                }
            } catch (error) {
                console.error('Error saving project to localStorage:', error);
            }
        }

        // Apply loaded appliance selections to the table
        applyLoadedApplianceSelections() {
            const selections = window.currentProject?.steps?.applianceSelections || {};
            if (Object.keys(selections).length === 0) {
                return;
            }
            
            // Clean up any old timestamp data
            Object.values(selections).forEach(selection => {
                if (selection.timestamp) {
                    delete selection.timestamp;
                }
            });
            
            // Wait for the table to be populated
            const checkTable = () => {
                const tableBody = document.getElementById('csvAppliancesTableBody');
                if (!tableBody || tableBody.children.length === 0) {
                    setTimeout(checkTable, 500);
                    return;
                }
                
                // Apply each selection to the corresponding dropdown
                Object.entries(selections).forEach(([applianceKey, selection]) => {
                    const row = Array.from(tableBody.children).find(row => {
                        const selector = row.querySelector('.product-selector');
                        return selector && selector.getAttribute('data-appliance-key') === applianceKey;
                    });
                    
                    if (row) {
                        const dropdown = row.querySelector('.product-selector');
                        if (dropdown) {
                            // Set the selected value
                            dropdown.value = selection.productId;
                            
                            // Trigger the change event to update the display
                            const event = new Event('change', { bubbles: true });
                            dropdown.dispatchEvent(event);
                        }
                    } else {
                        console.warn(`Row not found for appliance key: ${applianceKey}`);
                    }
                });
            };
            
            checkTable();
        }

        // Apply existing appliance selections when table is populated
        applyExistingApplianceSelections() {
            const selections = window.currentProject?.steps?.applianceSelections || {};
            if (Object.keys(selections).length === 0) {
                return;
            }
            
            // Clean up any old timestamp data
            Object.values(selections).forEach(selection => {
                if (selection.timestamp) {
                    delete selection.timestamp;
                }
            });
            
            // Apply each selection to the corresponding dropdown
            Object.entries(selections).forEach(([applianceKey, selection]) => {
                const row = document.querySelector(`[data-appliance-key="${applianceKey}"]`)?.closest('tr');
                if (row) {
                    const dropdown = row.querySelector('.product-selector');
                    if (dropdown) {
                        // Set the selected value
                        dropdown.value = selection.productId;
                        
                        // Update the display without triggering the change event
                        this.updateRowDisplayForSelection(row, selection);
                    }
                } else {
                    console.warn(`Row not found for appliance key: ${applianceKey}`);
                }
            });
            
            // Recalculate totals with the applied selections
            this.recalculateAndUpdateDisplay();
        }

        // Update row display for a specific selection without triggering change event
        updateRowDisplayForSelection(row, selection) {
            const category = selection.category;
            const product = window.applianceDatabase.getProductById(selection.productId, category);
            
            if (product) {
                // Update the coincidence factor column
                const cfCell = row.cells[2];
                if (cfCell) {
                    cfCell.textContent = product.load_calc_cf || 'N/A';
                }
                
                // Update the cost column
                const costCell = row.cells[3];
                if (costCell) {
                    costCell.textContent = `$${(product.cost_min || 0).toLocaleString()} - $${(product.cost_max || 0).toLocaleString()}`;
                }
                
                // Update the details button
                const detailsBtn = row.querySelector('.details-btn');
                if (detailsBtn) {
                    // Extract appliance type from the row's appliance key
                    const applianceKey = row.querySelector('.product-selector')?.getAttribute('data-appliance-key');
                    const applianceType = applianceKey ? applianceKey.split('_')[0] : '';
                    detailsBtn.onclick = () => showProductDetails(product.id, category, applianceType);
                }
            }
        }

        // Get all current appliance selections including defaults
        getAllCurrentApplianceSelections() {
            const allSelections = {};
            
            // Get existing selections from the project
            const existingSelections = window.currentProject?.steps?.applianceSelections || {};
            Object.assign(allSelections, existingSelections);
            
            // Get current selections from the table (including defaults that weren't changed)
            const tableBody = document.getElementById('csvAppliancesTableBody');
            
            if (tableBody) {
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach((row, index) => {
                    const productSelector = row.querySelector('.product-selector');
                    
                    if (productSelector) {
                        const applianceKey = productSelector.getAttribute('data-appliance-key');
                        const category = productSelector.getAttribute('data-category');
                        const selectedProductId = productSelector.value;
                        
                        if (applianceKey && category && selectedProductId) {
                            // If this selection doesn't exist yet, add it
                            if (!allSelections[applianceKey]) {
                                allSelections[applianceKey] = {
                                    productId: selectedProductId,
                                    category: category
                                    // Removed timestamp as it's not needed
                                };
                            }
                        }
                    }
                });
            }
            
            return allSelections;
        }
    }

    // ==========================================================================
    // Global Product Selection Functions
    // ==========================================================================

    // Global function to show product details in a popup
    window.showProductDetails = function(productId, category, applianceType) {
        if (!window.applianceDatabase) {
            console.error('Appliance database not available');
            return;
        }
        
        const product = window.applianceDatabase.getProductById(productId, category);
        if (!product) {
            // If no specific product ID, try to get a representative product from the category
            const products = window.applianceDatabase.getProductsByCategory(category);
            if (products.length > 0) {
                // Get the first product as a template for the category
                const templateProduct = products[0];
                showProductDetailsPopup(templateProduct, category, applianceType, true);
            } else {
                console.error('No products found for category:', category);
            }
            return;
        }
        
        showProductDetailsPopup(product, category, applianceType, false);
    };

    // Function to show the product details popup
    function showProductDetailsPopup(product, category, applianceType, isTemplate) {
        // Remove any existing popup
        const existingPopup = document.querySelector('.product-details-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'product-details-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        popupContent.style.cssText = `
            background: var(--background-color, #fff);
            color: var(--text-color, #333);
            border-radius: 12px;
            padding: 24px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
        `;
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 12px;
            right: 16px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-color, #333);
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.backgroundColor = 'var(--background-secondary, #f0f0f0)';
        closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'transparent';
        closeBtn.onclick = () => popup.remove();
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = isTemplate ? 
            `${DISPLAY_NAMES.categories[category] || category} - Product Information` :
            `${product.name || product.model_number || 'Product Details'}`;
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: var(--text-color, #333);
            font-size: 1.4em;
        `;
        
        // Create content sections
        const content = document.createElement('div');
        content.style.cssText = `
            display: grid;
            gap: 16px;
        `;
        
        // Add product details
        const detailsSection = createDetailsSection(product, category, applianceType);
        content.appendChild(detailsSection);
        
        // Add CSV data section
        const csvSection = createCsvDataSection(product, category);
        content.appendChild(csvSection);
        
        // Assemble popup
        popupContent.appendChild(closeBtn);
        popupContent.appendChild(title);
        popupContent.appendChild(content);
        popup.appendChild(popupContent);
        
        // Add to page
        document.body.appendChild(popup);
        
        // Close on background click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                popup.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    // Helper function to create the details section
    function createDetailsSection(product, category, applianceType) {
        const section = document.createElement('div');
        section.style.cssText = `
            background: var(--background-secondary, #f8f9fa);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color, #007bff);
        `;
        
        const title = document.createElement('h4');
        title.textContent = 'Product Details';
        title.style.cssText = `
            margin: 0 0 12px 0;
            color: var(--text-color, #333);
        `;
        
        const details = document.createElement('div');
        details.style.cssText = `
            display: grid;
            gap: 8px;
            font-size: 0.9em;
        `;
        
        // Add key product information
        const keyInfo = [
            { label: 'Manufacturer', value: product.manufacturer || 'N/A' },
            { label: 'Model', value: product.model_number || product.name || 'N/A' },
            { label: 'Panel Amps (240V)', value: `${product.panel_amps_240v || 0} amps` },
            { label: 'Cost Range', value: `$${(product.cost_min || 0).toLocaleString()} - $${(product.cost_max || 0).toLocaleString()}` }
        ];
        
        keyInfo.forEach(item => {
            if (item.value !== 'N/A') {
                const row = document.createElement('div');
                row.style.cssText = `
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 12px;
                    align-items: center;
                `;
                
                const label = document.createElement('strong');
                label.textContent = item.label + ':';
                label.style.color = 'var(--text-secondary, #666)';
                
                const value = document.createElement('span');
                value.textContent = item.value;
                
                row.appendChild(label);
                row.appendChild(value);
                details.appendChild(row);
            }
        });
        
        section.appendChild(title);
        section.appendChild(details);
        return section;
    }

    // Helper function to create the CSV data section
    function createCsvDataSection(product, category) {
        const section = document.createElement('div');
        section.style.cssText = `
            background: var(--background-secondary, #f8f9fa);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid var(--accent-color, #007bff);
        `;
        
        const title = document.createElement('h4');
        title.textContent = 'Complete Product Data';
        title.style.cssText = `
            margin: 0 0 12px 0;
            color: var(--text-color, #333);
        `;
        
        const csvData = document.createElement('div');
        csvData.style.cssText = `
            display: grid;
            gap: 8px;
            font-size: 0.9em;
            max-height: 300px;
            overflow-y: auto;
        `;
        
        // Get all available columns dynamically from the product object
        const allColumns = Object.keys(product);
        
        // Debug: Log available columns to console
        console.log('Available columns for product:', allColumns);
        console.log('Product object:', product);
        
        // Define column display names for better readability
        const columnDisplayNames = {
            'id': 'ID',
            'name': 'Name',
            'manufacturer': 'Manufacturer',
            'model_number': 'Model Number',
            'type': 'Type',
            'capacity_btu': 'Capacity (BTU/h)',
            'capacity_gal': 'Capacity (Gallons)',
            'capacity_cu_ft': 'Capacity (cu ft)',
            'charging_speed_kw': 'Charging Speed (kW)',
            'electrical_load_amps': 'Electrical Load (Amps)',
            'voltage': 'Voltage',
            'circuit_type': 'Circuit Type',
            'panel_amps_240v': 'Panel Amps (240V)',
            'cost_min': 'Cost (Min)',
            'cost_max': 'Cost (Max)',
            'efficiency_seer': 'Efficiency (SEER)',
            'efficiency_hspf': 'Efficiency (HSPF)',
            'efficiency_uef': 'Efficiency (UEF)',
            'installation_notes': 'Installation Notes',
            'installation_type': 'Installation Type',
            'smart_features': 'Smart Features',
            'tankless': 'Tankless',
            'heat_pump': 'Heat Pump',
            'induction': 'Induction',
            'special_notes': 'Special Notes',
            'load_calc_cf': 'Coincidence Factor (220.83)',
            'notes': 'Notes'
        };
        
        // Sort columns to show most important ones first
        const priorityColumns = [
            'name', 'manufacturer', 'model_number', 'type', 'capacity_btu', 'capacity_gal', 
            'capacity_cu_ft', 'charging_speed_kw', 'electrical_load_amps', 'voltage', 
            'panel_amps_240v', 'cost_min', 'cost_max', 'efficiency_seer', 'efficiency_hspf', 
            'efficiency_uef', 'heat_pump', 'induction', 'load_calc_cf'
        ];
        
        const sortedColumns = [
            ...priorityColumns.filter(col => allColumns.includes(col)),
            ...allColumns.filter(col => !priorityColumns.includes(col))
        ];
        
        sortedColumns.forEach(column => {
            if (product[column] !== undefined && product[column] !== null && product[column] !== '') {
                const row = document.createElement('div');
                row.style.cssText = `
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 12px;
                    align-items: center;
                    padding: 4px 0;
                    border-bottom: 1px solid var(--border-color, #e0e0e0);
                `;
                
                const label = document.createElement('strong');
                // Use custom display name if available, otherwise format the column name
                const displayName = columnDisplayNames[column] || 
                    column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                label.textContent = displayName + ':';
                label.style.color = 'var(--text-secondary, #666)';
                
                const value = document.createElement('span');
                // Format the value based on column type
                let displayValue = product[column];
                if (column === 'cost_min' || column === 'cost_max') {
                    displayValue = `$${Number(product[column]).toLocaleString()}`;
                } else if (column === 'tankless' || column === 'smart_features' || 
                           column === 'heat_pump' || column === 'induction') {
                    displayValue = product[column] === true ? 'Yes' : 'No';
                } else if (column === 'capacity_btu') {
                    displayValue = `${Number(product[column]).toLocaleString()} BTU/h`;
                } else if (column === 'capacity_gal') {
                    displayValue = `${product[column]} gallons`;
                } else if (column === 'capacity_cu_ft') {
                    displayValue = `${product[column]} cu ft`;
                } else if (column === 'charging_speed_kw') {
                    displayValue = `${product[column]} kW`;
                } else if (column === 'electrical_load_amps') {
                    displayValue = `${product[column]} amps`;
                } else if (column === 'panel_amps_240v') {
                    displayValue = `${product[column]} amps`;
                } else if (column === 'voltage') {
                    displayValue = `${product[column]}V`;
                }
                
                value.textContent = displayValue;
                
                row.appendChild(label);
                row.appendChild(value);
                csvData.appendChild(row);
            }
        });
        
        section.appendChild(title);
        section.appendChild(csvData);
        return section;
    }

    // Global function to select a product
    window.selectProduct = function(productId, category) {
        const product = window.applianceDatabase.getProductById(productId, category);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Initialize selected products if not exists
        if (!window.selectedProducts) {
            window.selectedProducts = [];
        }

        // Check if product is already selected
        const existingIndex = window.selectedProducts.findIndex(p => p.id === productId);
        if (existingIndex !== -1) {
            // Remove product if already selected
            window.selectedProducts.splice(existingIndex, 1);
            console.log('Product deselected:', product.name);
        } else {
            // Add product to selection
            window.selectedProducts.push({
                ...product,
                category: category
            });
            console.log('Product selected:', product.name);
        }

        // Update UI
        updateSelectedProductsDisplay();
        updateCapacitySummary();
    };

    // Function to update the selected products display
    function updateSelectedProductsDisplay() {
        const selectedProductsList = document.getElementById('selectedProductsList');
        const selectedProductsSummary = document.querySelector('.selected-products-summary');
        
        if (!selectedProductsList || !selectedProductsSummary) return;

        if (!window.selectedProducts || window.selectedProducts.length === 0) {
            selectedProductsSummary.style.display = 'none';
            return;
        }

        selectedProductsSummary.style.display = 'block';
        
        let productsHTML = '';
        window.selectedProducts.forEach(product => {
            productsHTML += `
                <div class="selected-product-item">
                    <h5>${product.name}</h5>
                    <p><strong>Category:</strong> ${getCategoryDisplayName(product.category)}</p>
                    <p><strong>Panel Load:</strong> ${product.panel_amps_240v} amps</p>
                    <p><strong>Cost:</strong> $${product.cost_min.toLocaleString()} - $${product.cost_max.toLocaleString()}</p>
                    <button class="deselect-product-btn" onclick="selectProduct('${product.id}', '${product.category}')">Remove</button>
                </div>
            `;
        });
        
        selectedProductsList.innerHTML = productsHTML;
    }

    // Function to update capacity summary
    function updateCapacitySummary() {
        if (!window.selectedProducts || !window.loadCalculator) return;
        
        const totalPanelLoadSpan = document.getElementById('totalPanelLoad');
        const remainingCapacitySpan = document.getElementById('remainingCapacity');
        
        if (!totalPanelLoadSpan || !remainingCapacitySpan) return;

        const loadInfo = window.loadCalculator.calculateTotalLoad(window.selectedProducts);
        const availableCapacity = window.currentProject?.steps?.loadAnalysis?.maxCapacity || 0;
        const remainingCapacity = availableCapacity - loadInfo.totalLoad;

        totalPanelLoadSpan.textContent = loadInfo.totalLoad;
        remainingCapacitySpan.textContent = remainingCapacity;
        
        // Store for Step 6 results
        window.calculatedTotalLoad = loadInfo.totalLoad;
        
        // Visual feedback for capacity
        if (remainingCapacity < 0) {
            remainingCapacitySpan.style.color = 'var(--error-color)';
            remainingCapacitySpan.textContent = `${remainingCapacity} (OVER CAPACITY!)`;
        } else if (remainingCapacity < 10) {
            remainingCapacitySpan.style.color = 'var(--warning-color)';
        } else {
            remainingCapacitySpan.style.color = 'var(--success-color)';
        }
    }

    // Helper function to get category display name
    function getCategoryDisplayName(category) {
        return DISPLAY_NAMES.categories[category] || category;
    }

    // ==========================================================================
    // StepManager Definition
    // ==========================================================================

    // Then modify the StepManager to use the Step class
    const StepManager = {
        currentStep: 1,
        steps: {},

        init() {
            this.defineSteps();
            this.initializeSteps();
            this.setupEventListeners();
            this.loadProgress();
            loadFormDataFromLocalStorage(); // Load form data on initialization
        },

        defineSteps() {
            console.log('Defining steps...');
            this.steps = {
                1: new Step({
                    id: 'projectInfo',
                    title: 'Project Information',
                    description: 'Enter basic project details',
                    isOptional: false,
                    nextStep: 2,
                    validation: () => !!window.currentProject,
                    getResults: () => ({
                        projectInfo: {
                            name: window.currentProject?.name
                        }
                    })
                }),
                2: new Step({
                    id: 'electrificationGoals',
                    title: 'Electrification Goals',
                    description: 'Select your electrification goals',
                    isOptional: false,
                    nextStep: 3,
                    validation: () => {
                        const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                        return Array.from(checkboxes).some(cb => cb.checked);
                    },
                    getResults: () => {
                        const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                        const selectedAppliances = [];
                        
                        checkboxes.forEach(cb => {
                            if (cb.checked) {
                                const appliance = {
                                    type: cb.value,
                                    name: cb.nextElementSibling.textContent.trim(),
                                    quantity: 1 // default quantity
                                };
                                
                                // Special handling for heating systems
                                if (cb.value === 'heating') {
                                    const heatingSystems = [];
                                    const heatingInputs = document.querySelectorAll('.heating-capacity-input');
                                    
                                    heatingInputs.forEach((input, index) => {
                                        if (input.value) {
                                            heatingSystems.push({
                                                id: index + 1,
                                                capacity: parseInt(input.value) || 30000,
                                                description: `Heating System ${index + 1}`
                                            });
                                        }
                                    });
                                    
                                    appliance.heatingSystems = heatingSystems;
                                    appliance.quantity = heatingSystems.length;
                                } else {
                                    // Get quantity if available for other appliances
                                    const quantityField = document.querySelector(`.quantity-field[data-for="${cb.value}"] input[type="number"]`);
                                    if (quantityField) {
                                        appliance.quantity = parseInt(quantityField.value) || 1;
                                    }
                                }
                                
                                selectedAppliances.push(appliance);
                            }
                        });
                        
                        return {
                            electrificationGoals: {
                                selectedAppliances: selectedAppliances
                            }
                        };
                    }
                }),
                3: new Step({
                    id: 'currentEquipment',
                    title: 'Current Equipment',
                    description: 'Enter your current panel size',
                    isOptional: false,
                    nextStep: 4,
                    validation: () => {
                        const panelAmps = document.querySelector('#panelAmps');
                        return panelAmps && panelAmps.value && 
                               parseInt(panelAmps.value) >= 10 && 
                               parseInt(panelAmps.value) <= 1000;
                    },
                    getResults: () => {
                        const panelAmps = document.querySelector('#panelAmps');
                        return {
                            currentEquipment: {
                                panelSize: panelAmps ? parseInt(panelAmps.value) : null
                            }
                        };
                    }
                }),
                4: new Step({
                    id: 'loadAnalysis',
                    title: 'Load Analysis',
                    description: 'Calculate maximum power needs',
                    isOptional: false,
                    nextStep: 5,
                    validation: () => {
                        const topDownCapacity = document.querySelector('#topDownCapacity');
                        const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
                        const panelAmps = document.querySelector('#panelAmps');
                        
                        // Check if panel size is set
                        if (!panelAmps || !panelAmps.value) {
                            return false;
                        }
                        
                        const panelSize = parseInt(panelAmps.value);
                        
                        // At least one method should be filled out
                        const hasTopDown = topDownCapacity && topDownCapacity.value;
                        const hasBottomUp = bottomUpCapacity && bottomUpCapacity.value;
                        
                        if (!hasTopDown && !hasBottomUp) {
                            return false;
                        }
                        
                        // Validate that capacity values don't exceed panel size
                        if (hasTopDown) {
                            const topDownValue = parseInt(topDownCapacity.value);
                            if (isNaN(topDownValue) || topDownValue < 0 || topDownValue > panelSize) {
                                return false;
                            }
                        }
                        
                        if (hasBottomUp) {
                            const bottomUpValue = parseInt(bottomUpCapacity.value);
                            if (isNaN(bottomUpValue) || bottomUpValue < 0 || bottomUpValue > panelSize) {
                                return false;
                            }
                        }
                        
                        return true;
                    },
                    getResults: () => {
                        const topDownCapacity = document.querySelector('#topDownCapacity');
                        const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
                        
                        // Calculate maxCapacity
                        const topDown = topDownCapacity && topDownCapacity.value ? parseInt(topDownCapacity.value) : null;
                        const bottomUp = bottomUpCapacity && bottomUpCapacity.value ? parseInt(bottomUpCapacity.value) : null;
                        let maxCapacity = null;
                        
                        if (topDown !== null && bottomUp !== null) {
                            maxCapacity = Math.max(topDown, bottomUp);
                        } else if (topDown !== null) {
                            maxCapacity = topDown;
                        } else if (bottomUp !== null) {
                            maxCapacity = bottomUp;
                        }
                        
                        return {
                            loadAnalysis: {
                                topDownCapacity: topDown,
                                bottomUpCapacity: bottomUp,
                                maxCapacity: maxCapacity
                            }
                        };
                    }
                }),
                5: new Step({
                    id: 'gasAnalysis',
                    title: 'Natural Gas Analysis',
                    description: 'Analyze gas usage and estimate electrification impacts',
                    isOptional: true,
                    nextStep: 6,
                    validation: () => {
                        const skipCheckbox = document.querySelector('#gasAnalysis input[type="checkbox"]');
                        return skipCheckbox && skipCheckbox.checked;
                    },
                    getResults: () => {
                        const skipCheckbox = document.querySelector('#gasAnalysis input[type="checkbox"]');
                        
                        return {
                            gasAnalysis: {
                                skipState: skipCheckbox ? skipCheckbox.checked : false
                            }
                        };
                    }
                }),
                6: new Step({
                    id: 'planNewAppliances',
                    title: 'Plan for New Appliances',
                    description: 'Define specific electric appliances for your home',
                    isOptional: true,
                    nextStep: 7,
                    validation: () => {
                        const skipCheckbox = document.querySelector('#planNewAppliances input[type="checkbox"]');
                        return skipCheckbox && skipCheckbox.checked;
                    },
                    getResults: () => {
                        const skipCheckbox = document.querySelector('#planNewAppliances input[type="checkbox"]');
                        return {
                            planNewAppliances: {
                                skipState: skipCheckbox ? skipCheckbox.checked : false,
                                selectedProducts: window.selectedProducts || [],
                                totalLoad: window.calculatedTotalLoad || 0
                            }
                        };
                    },
                    async onActivate() {
                        // Initialize appliance database if not already done
                        if (!window.applianceDatabase.isInitialized) {
                            try {
                                await window.applianceDatabase.initialize();
                                console.log('Appliance database loaded for Step 6');
                            } catch (error) {
                                console.error('Failed to load appliance database:', error);
                            }
                        }
                        
                        // Load user's electrification goals and show product recommendations
                        this.loadProductRecommendations();
                    }
                }),
                7: new Step({
                    id: 'actionPlan',
                    title: 'Next Steps',
                    description: 'Review and save your electrification plan',
                    isOptional: true,
                    nextStep: null,
                    validation: () => {
                        const skipCheckbox = document.querySelector('#actionPlan input[type="checkbox"]');
                        return skipCheckbox && skipCheckbox.checked;
                    },
                    getResults: () => {
                        const skipCheckbox = document.querySelector('#actionPlan input[type="checkbox"]');
                        return {
                            actionPlan: {
                                skipState: skipCheckbox ? skipCheckbox.checked : false
                            }
                        };
                    }
                })
            };
            console.log('Steps defined:', this.steps);
        },

        initializeSteps() {
            Object.values(this.steps).forEach(step => {
                if (step.element) {
                    step.createNextButton();
                    step.element.classList.remove('active', 'completed');
                    step.element.style.opacity = '0.5';
                    step.element.style.pointerEvents = 'none';
                }
            });

            this.activateStep(1);
        },

        setupEventListeners() {
            // Step 2 checkbox listeners
            const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.checkStepCompletion());
            });
            
            // Initialize capacity input states
            this.updateCapacityInputStates();

            // Panel size input listener
            const panelAmps = document.querySelector('#panelAmps');
            if (panelAmps) {
                panelAmps.addEventListener('input', () => {
                    this.checkStepCompletion();
                    this.updatePanelHeaUrl();
                    // Re-validate capacity inputs when panel size changes
                    this.revalidateCapacityInputs();
                    // Update capacity input states
                    this.updateCapacityInputStates();
                });
            }

            // Step 4 capacity input listeners
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            if (topDownCapacity) {
                topDownCapacity.addEventListener('input', () => {
                    this.validateCapacityInput(topDownCapacity, 'topDownCapacityError');
                    this.checkStepCompletion();
                    this.updateCapacitySummary();
                    // Also update the calculation results display in step 6
                    if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                        window.applianceDatabase.updateCalculationResultsDisplay();
                    }
                });
            }
            if (bottomUpCapacity) {
                bottomUpCapacity.addEventListener('input', () => {
                    this.validateCapacityInput(bottomUpCapacity, 'bottomUpCapacityError');
                    this.checkStepCompletion();
                    this.updateCapacitySummary();
                    // Also update the calculation results display in step 6
                    if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                        window.applianceDatabase.updateCalculationResultsDisplay();
                    }
                });
            }



            // Navigation listeners
            document.querySelectorAll('.nav-list a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const stepId = link.getAttribute('href').slice(1);
                    const stepNumber = Object.values(this.steps).findIndex(s => s.id === stepId) + 1;
                    if (stepNumber) this.activateStep(stepNumber);
                });
            });

            // Prevent form submission on Enter key for forms without submit handlers
            // This fixes the issue on iPhone where hitting Enter causes page to reload
            const formSelectors = [
                '#panelSizeForm',
                '#electrificationForm',
                '#step4-1 .form-group',
                '#step4-2 .form-group'
            ];

            formSelectors.forEach(selector => {
                const form = document.querySelector(selector);
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        // Blur the active input to dismiss the keyboard on mobile
                        if (document.activeElement && document.activeElement.blur) {
                            document.activeElement.blur();
                        }
                    });
                }
            });
        },

        updatePanelHeaUrl() {
            const panelAmps = document.querySelector('#panelAmps');
            const panelHeaLink = document.querySelector('#step4-1 a[href*="panel.hea.com"]');
            
            if (!panelHeaLink) {
                console.log('Panel.hea.com link not found in step 4.1');
                return;
            }
            
            if (panelAmps && panelAmps.value && !isNaN(parseInt(panelAmps.value))) {
                const panelSize = parseInt(panelAmps.value);
                const panelVoltage = 240; // Fixed at 240 volts
                
                // Construct the URL with parameters
                const baseUrl = 'https://panel.hea.com/';
                const urlParams = new URLSearchParams({
                    panelSize: panelSize,
                    panelVoltage: panelVoltage
                });
                
                const fullUrl = baseUrl + '?' + urlParams.toString();
                panelHeaLink.href = fullUrl;
                
                // Add a visual indicator that the URL has been updated
                panelHeaLink.title = `Panel Size: ${panelSize} amps, Voltage: ${panelVoltage}V`;
                
                console.log('Updated panel.hea.com URL:', fullUrl);
            } else {
                // If no panel size is set, use the base URL without parameters
                panelHeaLink.href = 'https://panel.hea.com/';
                console.log('No panel size set, using base panel.hea.com URL');
            }
        },

        validateCapacityInput(inputElement, errorElementId) {
            const panelAmps = document.querySelector('#panelAmps');
            const errorElement = document.getElementById(errorElementId);
            
            if (!panelAmps || !panelAmps.value || !errorElement) {
                return;
            }
            
            const panelSize = parseInt(panelAmps.value);
            const capacityValue = parseInt(inputElement.value);
            
            if (isNaN(capacityValue) || capacityValue < 0) {
                // Clear any existing error
                errorElement.style.display = 'none';
                errorElement.textContent = '';
                inputElement.classList.remove('error');
                return;
            }
            
            if (capacityValue > panelSize) {
                // Show error
                errorElement.textContent = `Available capacity cannot exceed your panel size of ${panelSize} amps. Please enter a value of ${panelSize} amps or less.`;
                errorElement.style.display = 'block';
                inputElement.classList.add('error');
            } else if (capacityValue === 0 && panelSize > 50) {
                // Warning for very low capacity on large panels
                errorElement.textContent = `Warning: You've entered 0 available capacity, but your panel is ${panelSize} amps. This suggests your panel may be severely overloaded. Please verify this value.`;
                errorElement.style.display = 'block';
                errorElement.style.color = 'var(--warning-color, #ff9800)';
                inputElement.classList.remove('error');
            } else {
                // Clear error
                errorElement.style.display = 'none';
                errorElement.textContent = '';
                errorElement.style.color = 'var(--error-color, #f44336)';
                inputElement.classList.remove('error');
            }
        },

        revalidateCapacityInputs() {
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            
            if (topDownCapacity && topDownCapacity.value) {
                this.validateCapacityInput(topDownCapacity, 'topDownCapacityError');
            }
            if (bottomUpCapacity && bottomUpCapacity.value) {
                this.validateCapacityInput(bottomUpCapacity, 'bottomUpCapacityError');
            }
        },

        updateCapacityInputStates() {
            const panelAmps = document.querySelector('#panelAmps');
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            
            const hasPanelSize = panelAmps && panelAmps.value && !isNaN(parseInt(panelAmps.value));
            
            if (topDownCapacity) {
                topDownCapacity.disabled = !hasPanelSize;
                topDownCapacity.placeholder = hasPanelSize ? 'e.g., 40' : 'Complete Step 3 first';
            }
            
            if (bottomUpCapacity) {
                bottomUpCapacity.disabled = !hasPanelSize;
                bottomUpCapacity.placeholder = hasPanelSize ? 'e.g., 35' : 'Complete Step 3 first';
            }
            
            // Clear any existing errors when panel size is not set
            if (!hasPanelSize) {
                this.clearCapacityErrors();
            }
        },

        clearCapacityErrors() {
            const topDownError = document.getElementById('topDownCapacityError');
            const bottomUpError = document.getElementById('bottomUpCapacityError');
            const topDownInput = document.querySelector('#topDownCapacity');
            const bottomUpInput = document.querySelector('#bottomUpCapacity');
            
            if (topDownError) {
                topDownError.style.display = 'none';
                topDownError.textContent = '';
                topDownError.style.color = 'var(--error-color, #f44336)';
            }
            if (bottomUpError) {
                bottomUpError.style.display = 'none';
                bottomUpError.textContent = '';
                bottomUpError.style.color = 'var(--error-color, #f44336)';
            }
            if (topDownInput) {
                topDownInput.classList.remove('error');
            }
            if (bottomUpInput) {
                bottomUpInput.classList.remove('error');
            }
        },

        updateCapacitySummary() {
            const summarySection = document.querySelector('#capacitySummary');
            const summaryText = document.querySelector('#capacitySummaryText');
            const panelAmps = document.querySelector('#panelAmps');
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            
            if (!summarySection || !summaryText || !panelAmps || !panelAmps.value) return;
            
            const panelSize = parseInt(panelAmps.value);
            const topDown = topDownCapacity && topDownCapacity.value ? parseInt(topDownCapacity.value) : null;
            const bottomUp = bottomUpCapacity && bottomUpCapacity.value ? parseInt(bottomUpCapacity.value) : null;
            
            let maxCapacity = null;
            if (topDown !== null && bottomUp !== null) {
                maxCapacity = Math.max(topDown, bottomUp);
            } else if (topDown !== null) {
                maxCapacity = topDown;
            } else if (bottomUp !== null) {
                maxCapacity = bottomUp;
            }
            
            if (maxCapacity !== null && !isNaN(maxCapacity)) {
                summarySection.style.display = 'block';
                
                // Base message
                let message = `You have ${maxCapacity} amps of remaining capacity on your ${panelSize} amp panel.<br>`;
                
                // Add contextual message based on capacity
                if (maxCapacity < 10) {
                    message += "You may need to upsize your panel.<br>";
                } else if (maxCapacity > 50) {
                    message += "You should have plenty of capacity to electrify your home with your existing panel!<br>";
                } else {
                    message += "You should be able to electrify using your existing panel if you are careful.<br>";
                }
                message += "Please continue to learn more.";
                
                summaryText.innerHTML = message;
            } else {
                summarySection.style.display = 'none';
            }
        },

        getApplianceDisplayName(type) {
            return DISPLAY_NAMES.applianceTypes[type] || type;
        },

        getApplianceDetails(type, quantity) {
            switch (type) {
                case 'heating':
                    return `Replace with ${quantity} heat pump(s)`;
                case 'waterheater':
                    return `Replace ${quantity} natural gas water heater(s) with electric equivalents`;
                case 'cooking':
                    return `Replace ${quantity} natural gas cooking appliance(s) with electric equivalents`;
                case 'dryer':
                    return `Replace ${quantity} natural gas dryer(s) with electric equivalents`;
                case 'other':
                    return `Replace ${quantity} other natural gas appliance(s) with electric equivalents`;
                case 'ev':
                    return `Add ${quantity} EV charger(s)`;
                case 'gasmeter':
                    return 'Remove gas meter to create space for electrical equipment';
                default:
                    return 'Electric replacement';
            }
        },

        activateStep(stepNumber) {
            const step = this.steps[stepNumber];
            if (!step) return;

            // First, deactivate all steps
            Object.values(this.steps).forEach(s => {
                if (s.element) {
                    s.element.classList.remove('active', 'completed');
                    s.element.style.opacity = '0';
                    s.element.style.visibility = 'hidden';
                    s.element.style.pointerEvents = 'none';
                }
            });

            // Then, activate the current step
            if (step.element) {
                step.element.classList.add('active');
                step.element.style.opacity = '1';
                step.element.style.visibility = 'visible';
                step.element.style.pointerEvents = 'auto';
            }

            // Show completed steps
            Object.values(this.steps).forEach(s => {
                if (s.isComplete && s.element) {
                    s.element.classList.add('completed');
                    s.element.style.opacity = '0.8';
                    s.element.style.visibility = 'visible';
                    s.element.style.pointerEvents = 'auto';
                }
            });

            this.currentStep = stepNumber;
            this.checkStepCompletion();
            
            // Special handling for step 6 - populate appliances summary table
            if (stepNumber === 6) {
                const step6 = this.steps[6];
                if (step6 && step6.populateCsvAppliancesTable) {
                    step6.populateCsvAppliancesTable();
                }
            }
            
            // Special handling for step 4 - update panel.hea.com URL
            if (stepNumber === 4) {
                this.updatePanelHeaUrl();
            }
        },

        checkStepCompletion() {
            const step = this.steps[this.currentStep];
            if (!step || !step.element) return;

            const nextButton = step.getNextButton() || step.createNextButton();
            if (!nextButton) return;

            const isValid = step.validateStep();

            if (isValid) {
                nextButton.classList.add('active');
                step.isComplete = true;
                if (step.nextStep) {
                    nextButton.onclick = () => this.completeStep(step.id);
                }

                // Add save button for step 2 and beyond
                if (this.currentStep >= 2) {
                    const saveButton = step.getSaveButton() || step.createSaveButton();
                    if (saveButton) {
                        saveButton.classList.add('active');
                    }
                }
            } else {
                nextButton.classList.remove('active');
                step.isComplete = false;
                nextButton.onclick = null;

                // Remove save button if step is not complete
                const saveButton = step.getSaveButton();
                if (saveButton) {
                    saveButton.classList.remove('active');
                }
            }

            // Update reset button visibility when step 1 completion status changes
                    if (typeof updateResetButtonVisibility === 'function') {
            updateResetButtonVisibility();
        }
        },

        completeStep(stepId) {
            const step = Object.values(this.steps).find(s => s.id === stepId);
            if (!step) return;

            step.isComplete = true;
            
            // Get and save step results to the current project immediately
            const results = step.getResults();
            if (results && window.currentProject) {
                if (!window.currentProject.steps) {
                    window.currentProject.steps = {};
                }
                Object.assign(window.currentProject.steps, results);
            }

            if (step.nextStep) {
                this.activateStep(step.nextStep);
                
                // Add smooth scrolling to the next step
                const nextStepElement = this.steps[step.nextStep].element;
                if (nextStepElement) {
                    nextStepElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            this.saveProgress();
        },



        saveProgress() {
            const progress = {
                currentStep: this.currentStep,
                steps: Object.entries(this.steps).reduce((acc, [key, step]) => {
                    acc[key] = { isComplete: step.isComplete };
                    return acc;
                }, {})
            };
            localStorage.setItem('stepProgress', JSON.stringify(progress));
        },

        loadProgress() {
            const savedProgress = JSON.parse(localStorage.getItem('stepProgress'));
            if (savedProgress) {
                this.currentStep = savedProgress.currentStep;
                Object.entries(savedProgress.steps).forEach(([key, data]) => {
                    if (this.steps[key]) {
                        this.steps[key].isComplete = data.isComplete;
                    }
                });
                this.activateStep(this.currentStep);
            }
        }
    };

    // Create global stepManager variable after StepManager is defined
    const stepManager = StepManager;

    // Initialize StepManager after it's defined
    try {
        StepManager.init();
        
        // Update panel.hea.com URL after initialization if panel size is already set
        if (stepManager && typeof stepManager.updatePanelHeaUrl === 'function') {
            // Use setTimeout to ensure DOM is fully ready
            setTimeout(() => {
                stepManager.updatePanelHeaUrl();
            }, 100);
        }
    } catch (error) {
        console.error('Error initializing StepManager:', error);
    }

    // Helper function to get current project name
    function getCurrentProjectName() {
        const currentProjectElement = document.querySelector('.current-project .project-name');
        return currentProjectElement ? currentProjectElement.textContent : null;
    }

    // Make sure createProject function is defined before it's used
    function createProject(name) {
        return {
            name: name,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            steps: {
                projectInfo: {
                    name: name
                },
                electrificationGoals: {
                    selectedAppliances: []
                },
                currentEquipment: {
                    panelSize: null
                },
                loadAnalysis: {
                    topDownCapacity: null,
                    bottomUpCapacity: null,
                    maxCapacity: null
                },
                gasAnalysis: {
                    skipState: false
                },
                planNewAppliances: {
                    skipState: false
                },
                actionPlan: {
                    skipState: false
                }
            },
            version: window.APP_VERSION || 'v0'
        };
    }

    // Update the import project function
    function importProject(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const projectData = JSON.parse(e.target.result);
                
                // Validate project data
                if (!projectData.name || !projectData.steps) {
                    throw new Error('Invalid project file format');
                }
                
                // Store in memory
                window.currentProject = projectData;
                
                // Update UI to show imported project
                updateFormToShowCurrentProject(projectData.name);
                
                // Add Next button to step 1
                const step1 = document.getElementById('projectInfo');
                if (step1) {
                    // Remove existing next button if it exists
                    const existingButton = step1.querySelector('.next-button');
                    if (existingButton) {
                        existingButton.remove();
                    }
                    
                    const nextButton = document.createElement('button');
                    nextButton.className = 'next-button active';
                    nextButton.textContent = 'Next';
                    step1.appendChild(nextButton);

                    // Update the click handler to use the StepManager's methods
                    nextButton.addEventListener('click', () => {
                        if (typeof stepManager !== 'undefined' && stepManager && stepManager.completeStep) {
                            stepManager.completeStep('projectInfo');
                        }
                    });
                }
                
                // Update step completion status
                if (typeof stepManager !== 'undefined' && stepManager && stepManager.steps && stepManager.steps[1]) {
                    stepManager.steps[1].isComplete = true;
                }
    
                
                // Load saved electrification goals if they exist
                if (projectData.steps.electrificationGoals && 
                    projectData.steps.electrificationGoals.selectedAppliances) {
                    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        const appliance = projectData.steps.electrificationGoals.selectedAppliances
                            .find(appliance => appliance.type === checkbox.value);
                        
                        if (appliance) {
                            checkbox.checked = true;
                            
                            // Special handling for heating systems
                            if (checkbox.value === 'heating' && appliance.heatingSystems) {
                                restoreHeatingSystems(appliance.heatingSystems);
                            } else {
                                // Load quantity value if available for other appliances
                                const quantityField = document.querySelector(`.quantity-field[data-for="${checkbox.value}"] input[type="number"]`);
                                if (quantityField && appliance.quantity) {
                                    quantityField.value = appliance.quantity;
                                }
                            }
                        } else {
                            checkbox.checked = false;
                        }
                        
                        // Update quantity field visibility
                        handleQuantityFieldVisibility(checkbox);
                    });
                    
                    // Trigger validation check to update Next button
                    if (typeof stepManager !== 'undefined' && stepManager && stepManager.checkStepCompletion) {
                        stepManager.checkStepCompletion();
                    }
                }

                // Load panel size if it exists
                if (projectData.steps.currentEquipment && projectData.steps.currentEquipment.panelSize) {
                    const panelAmps = document.querySelector('#panelAmps');
                    if (panelAmps) {
                        panelAmps.value = projectData.steps.currentEquipment.panelSize;
                    }
                }

                // Load capacity data from step 4 if it exists
                if (projectData.steps.loadAnalysis) {
                    const topDownCapacity = document.querySelector('#topDownCapacity');
                    const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
                    
                    if (projectData.steps.loadAnalysis.topDownCapacity && topDownCapacity) {
                        topDownCapacity.value = projectData.steps.loadAnalysis.topDownCapacity;
                    }
                    
                    if (projectData.steps.loadAnalysis.bottomUpCapacity && bottomUpCapacity) {
                        bottomUpCapacity.value = projectData.steps.loadAnalysis.bottomUpCapacity;
                    }
                    
                    // Update the calculation results display after loading the capacity values
                    if (window.applianceDatabase && window.applianceDatabase.updateCalculationResultsDisplay) {
                        window.applianceDatabase.updateCalculationResultsDisplay();
                    }
                }

                // Load skip states from project data (excluding loadAnalysis which is now required)
                ['gasAnalysis', 'planNewAppliances', 'actionPlan'].forEach(stepId => {
                    const skipCheckbox = document.querySelector(`#${stepId} input[type="checkbox"]`);
                    if (skipCheckbox && projectData.steps[stepId] && projectData.steps[stepId].skipState !== undefined) {
                        skipCheckbox.checked = projectData.steps[stepId].skipState;
                        // Also update the step manager's state
                        if (typeof stepManager !== 'undefined' && stepManager && stepManager.steps) {
                            const step = Object.values(stepManager.steps).find(s => s.id === stepId);
                            if (step) {
                                step.skipState = projectData.steps[stepId].skipState;
                            }
                        }
                    }
                });
                
                // Update step completion status for all steps
                if (typeof stepManager !== 'undefined' && stepManager && stepManager.checkStepCompletion) {
                    stepManager.checkStepCompletion();
                }
                
                // Update capacity summary if panel size and capacity data are loaded
                if (typeof stepManager !== 'undefined' && stepManager && stepManager.updateCapacitySummary) {
                    stepManager.updateCapacitySummary();
                }
                
                // If we're currently on step 6, populate the appliances summary
                if (typeof stepManager !== 'undefined' && stepManager && stepManager.currentStep === 6) {
                    const step6 = stepManager.steps[6];
                    if (step6 && step6.populateCsvAppliancesTable) {
                        step6.populateCsvAppliancesTable();
                    }
                }
                
                alert('Project loaded successfully!');
                
            } catch (error) {
                alert('Error loading project: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    function updateFormToShowCurrentProject(projectName) {
        // Clear the form and show current project info
        const projectForm = document.querySelector('.project-form');
        projectForm.innerHTML = `
            <div class="current-project">
                <div class="current-project-content">
                    <div class="project-info">
                        <h4>Current Project:</h4>
                        <p class="project-name">${projectName}</p>
                    </div>
                    <div class="project-actions">
                        <button type="button" class="secondary-button switch-project-btn">Switch to a different project</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to new button
        projectForm.querySelector('.switch-project-btn').addEventListener('click', resetProjectForm);
    }
    
    function resetProjectForm() {
        const projectForm = document.querySelector('.project-form');
        projectForm.innerHTML = `
            <h3>Project Management</h3>
            <p>Start a new project or open an existing one from a file.</p>
            
            <div class="project-options">
                <div class="project-option new-project-option">
                    <h4>Start a New Project</h4>
                    <p>Create a new electrification project from scratch.</p>
                    <form id="newProjectForm" class="form-group">
                        <label for="projectName">Project Name:</label>
                        <input 
                            type="text" 
                            id="projectName" 
                            placeholder="e.g., Byrd House or 123 River Road"
                            required
                        >
                        <p class="form-help">This name will be used for your project file</p>
                        <button type="submit" class="primary-button">Create Project</button>
                    </form>
                </div>

                <div class="project-option open-project-option">
                    <h4>Open Existing Project</h4>
                    <p>Continue working on a previously saved project file.</p>
                    <div class="form-group">
                        <div class="import-section">
                            <input type="file" id="importFile" accept=".json">
                            <p class="form-help">Select a PanelWizard project file (.json)</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Set default project name in the reset form
        const projectNameInput = document.getElementById('projectName');
        if (projectNameInput) {
            projectNameInput.value = getDefaultProjectName();
        }

        // Reattach event listeners
        document.getElementById('newProjectForm').addEventListener('submit', handleNewProject);
        document.getElementById('importFile').addEventListener('change', handleFileImport);
    }

    // Helper function to show errors
    function showError(message) {
        try {
            alert('Error: ' + message);
        } catch (error) {
            console.error('Error displaying error message:', error.message);
            console.error('Original error:', message);
        }
    }

    // Make functions available globally for onclick handlers
    try {
        window.addHeatingSystem = addHeatingSystem;
        window.removeHeatingSystem = removeHeatingSystem;
        window.updateAddHeatingButtonState = updateAddHeatingButtonState;
        window.restoreHeatingSystems = restoreHeatingSystems;
        window.refreshApplianceDatabase = function() {
            if (window.applianceDatabase) {
                return window.applianceDatabase.refresh();
            } else {
                console.error('Appliance database not available');
            }
        };
        

    } catch (error) {
        console.warn('Warning: Could not make functions globally available:', error.message);
    }

    // Simple helper function for development
    window.showLocalSetupInstructions = function() {
        console.log('=== LOCAL DEVELOPMENT SETUP ===');
        console.log('To use local CSV files, serve from a local web server:');
        console.log('  python -m http.server 8000');
        console.log('  npx serve .');
        console.log('  VS Code Live Server extension');
        console.log('==========================================');
    };
    
    console.log('PanelWizard initialization complete');
})(); 