// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    // Version handling
    const versionInfo = document.getElementById('versionInfo');
    
    // Set initial version
    window.APP_VERSION = window.APP_VERSION || 'v0';
    
    async function fetchGitHubVersion() {
        try {
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
            console.error('Error fetching version:', error);
            return null;
        }
    }
    
    async function updateVersion() {
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
    }
    
    // Initialize version display
    updateVersion();

    console.log('Script loading...');

    // Theme handling
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    // Check for saved theme preference, otherwise use dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    console.log('Theme system initialized');
    console.log('Current theme:', savedTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggleIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });

    // Reset button functionality
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
        if (confirm('This will clear all saved data and reload the page. Make sure you have saved your project file before proceeding. Clear all?')) {
            localStorage.clear();
            location.reload();
        }
    });

    // Navigation toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Project form handling
    const newProjectForm = document.getElementById('newProjectForm');
    const openProjectBtn = document.getElementById('openProjectBtn');
    const importFile = document.getElementById('importFile');

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
    const projectNameInput = document.getElementById('projectName');
    if (projectNameInput) {
        projectNameInput.value = getDefaultProjectName();
        console.log('Default project name set:', projectNameInput.value);
    }

    if (newProjectForm) {
        newProjectForm.addEventListener('submit', handleNewProject);
        console.log('Project form initialized');
    }

    if (openProjectBtn) {
        openProjectBtn.addEventListener('click', showProjectsList);
        console.log('Open project button initialized');
    }

    if (importFile) {
        importFile.addEventListener('change', handleFileImport);
        console.log('File import initialized');
    }

    // Initialize step 1
    const step1 = document.getElementById('projectInfo');
    if (step1) {
        step1.classList.add('active');
        step1.style.opacity = '1';
        step1.style.pointerEvents = 'auto';
        console.log('Step 1 activated');
    }

    // Initialize navigation
    const step1Link = document.querySelector('.nav-list a[href="#projectInfo"]');
    if (step1Link) {
        step1Link.classList.add('active');
        console.log('Step 1 navigation activated');
    }

    // Add event listeners for step 2 checkboxes
    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            stepManager.checkStepCompletion();
            handleQuantityFieldVisibility(checkbox);
        });
    });

    // Initialize quantity field visibility
    checkboxes.forEach(checkbox => {
        handleQuantityFieldVisibility(checkbox);
    });

    console.log('Initialization complete');

    // Function to handle quantity field visibility
    function handleQuantityFieldVisibility(checkbox) {
        const value = checkbox.value;
        const quantityField = document.querySelector(`.quantity-field[data-for="${value}"]`);
        
        if (quantityField) {
            if (checkbox.checked) {
                quantityField.classList.add('show');
            } else {
                quantityField.classList.remove('show');
            }
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
                stepManager.completeStep('projectInfo');
            });
        }
        
        // Update step completion status
        stepManager.steps[1].isComplete = true;
        stepManager.updateNavigation();
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
                    
                    // Load quantity value if available
                    const quantityField = document.querySelector(`.quantity-field[data-for="${checkbox.value}"] input[type="number"]`);
                    if (quantityField && appliance.quantity) {
                        quantityField.value = appliance.quantity;
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
                        window.webkitRequestFileSystem(window.TEMPORARY, dataBlob.size, resolve, reject);
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
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project: ' + error.message);
        }
    }

    function deleteProject(projectName) {
        // Show confirmation dialog
        const confirmDelete = confirm(`Are you sure you want to delete the project "${projectName}"? Make sure you have downloaded a copy if you want to save it.`);
        
        if (confirmDelete) {
            let proSects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
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

    // First, add the Step class definition
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
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    
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
    }

    // Then modify the StepManager to use the Step class
    const StepManager = {
        currentStep: 1,
        steps: {},

        init() {
            this.defineSteps();
            this.initializeSteps();
            this.setupEventListeners();
            this.loadProgress();
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
                                
                                // Get quantity if available
                                const quantityField = document.querySelector(`.quantity-field[data-for="${cb.value}"] input[type="number"]`);
                                if (quantityField) {
                                    appliance.quantity = parseInt(quantityField.value) || 1;
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
                    isOptional: true,
                    nextStep: 5,
                    validation: () => {
                        const skipCheckbox = document.querySelector('#loadAnalysis input[type="checkbox"]');
                        if (skipCheckbox && skipCheckbox.checked) return true;
                        
                        const topDownCapacity = document.querySelector('#topDownCapacity');
                        const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
                        
                        // At least one method should be filled out
                        return (topDownCapacity && topDownCapacity.value) || 
                               (bottomUpCapacity && bottomUpCapacity.value);
                    },
                    getResults: () => {
                        const topDownCapacity = document.querySelector('#topDownCapacity');
                        const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
                        const skipCheckbox = document.querySelector('#loadAnalysis input[type="checkbox"]');
                        
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
                                skipState: skipCheckbox ? skipCheckbox.checked : false,
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
                    id: 'actionPlan',
                    title: 'Action Plan',
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

            // Panel size input listener
            const panelAmps = document.querySelector('#panelAmps');
            if (panelAmps) {
                panelAmps.addEventListener('input', () => this.checkStepCompletion());
            }

            // Step 4 capacity input listeners
            const topDownCapacity = document.querySelector('#topDownCapacity');
            const bottomUpCapacity = document.querySelector('#bottomUpCapacity');
            if (topDownCapacity) {
                topDownCapacity.addEventListener('input', () => {
                    this.checkStepCompletion();
                    this.updateCapacitySummary();
                });
            }
            if (bottomUpCapacity) {
                bottomUpCapacity.addEventListener('input', () => {
                    this.checkStepCompletion();
                    this.updateCapacitySummary();
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
                summaryText.textContent = `You have ${maxCapacity} amps of remaining capacity on your ${panelSize} amp panel.`;
            } else {
                summarySection.style.display = 'none';
            }
        },

        activateStep(stepNumber) {
            console.log('activateStep called with stepNumber:', stepNumber);
            const step = this.steps[stepNumber];
            console.log('Found step:', step);
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
            this.updateNavigation();
            this.checkStepCompletion();
        },

        checkStepCompletion() {
            const step = this.steps[this.currentStep];
            if (!step || !step.element) return;

            const nextButton = step.getNextButton() || step.createNextButton();
            if (!nextButton) return;

            const isValid = step.validateStep();
            console.log(`Step ${step.id} validation result:`, isValid);

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

            // Force UI update
            this.updateNavigation();
            
            // Log the current state for debugging
            console.log(`Step ${step.id} state:`, {
                isValid,
                isComplete: step.isComplete,
                skipState: step.skipState,
                nextButtonActive: nextButton.classList.contains('active')
            });
        },

        completeStep(stepId) {
            const step = Object.values(this.steps).find(s => s.id === stepId);
            if (!step) return;

            step.isComplete = true;
            step.getResults();  // Save step results when completing

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

        updateNavigation() {
            Object.entries(this.steps).forEach(([number, step]) => {
                const navLink = document.querySelector(`a[href="#${step.id}"]`);
                if (!navLink) return;

                navLink.classList.remove('active', 'completed');
                if (number == this.currentStep) {
                    navLink.classList.add('active');
                } else if (step.isComplete) {
                    navLink.classList.add('completed');
                }
            });
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
    StepManager.init();

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
                currentUsage: {
                    panelSize: null
                },
                loadAnalysis: {
                    skipState: false
                },
                gasAnalysis: {
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
                        stepManager.completeStep('projectInfo');
                    });
                }
                
                // Update step completion status
                stepManager.steps[1].isComplete = true;
                stepManager.updateNavigation();
                
                // Load saved electrification goals if they exist
                if (projectData.steps.electrificationGoals && 
                    projectData.steps.electrificationGoals.selectedAppliances) {
                    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        const appliance = projectData.steps.electrificationGoals.selectedAppliances
                            .find(appliance => appliance.type === checkbox.value);
                        
                        if (appliance) {
                            checkbox.checked = true;
                            
                            // Load quantity value if available
                            const quantityField = document.querySelector(`.quantity-field[data-for="${checkbox.value}"] input[type="number"]`);
                            if (quantityField && appliance.quantity) {
                                quantityField.value = appliance.quantity;
                            }
                        } else {
                            checkbox.checked = false;
                        }
                        
                        // Update quantity field visibility
                        handleQuantityFieldVisibility(checkbox);
                    });
                    
                    // Trigger validation check to update Next button
                    stepManager.checkStepCompletion();
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
                }

                // Load skip states from project data
                ['loadAnalysis', 'gasAnalysis', 'actionPlan'].forEach(stepId => {
                    const skipCheckbox = document.querySelector(`#${stepId} input[type="checkbox"]`);
                    if (skipCheckbox && projectData.steps[stepId] && projectData.steps[stepId].skipState !== undefined) {
                        skipCheckbox.checked = projectData.steps[stepId].skipState;
                        // Also update the step manager's state
                        const step = Object.values(stepManager.steps).find(s => s.id === stepId);
                        if (step) {
                            step.skipState = projectData.steps[stepId].skipState;
                        }
                    }
                });
                
                // Update step completion status for all steps
                stepManager.checkStepCompletion();
                
                // Update capacity summary if panel size and capacity data are loaded
                stepManager.updateCapacitySummary();
                
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
})(); 