// Wrap everything in an IIFE to avoid global scope pollution
(function() {
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
        if (confirm('This will clear all saved data and reload the page. Are you sure?')) {
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
    const step1 = document.getElementById('step1');
    if (step1) {
        step1.classList.add('active');
        step1.style.opacity = '1';
        step1.style.pointerEvents = 'auto';
        console.log('Step 1 activated');
    }

    // Initialize navigation
    const step1Link = document.querySelector('.nav-list a[href="#step1"]');
    if (step1Link) {
        step1Link.classList.add('active');
        console.log('Step 1 navigation activated');
    }

    // Add event listeners for step 2 checkboxes
    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            stepManager.checkStepCompletion();
        });
    });

    console.log('Initialization complete');

    // Project handling functions
    function handleNewProject(e) {
        e.preventDefault();
        
        const projectNameInput = document.getElementById('projectName');
        const projectName = projectNameInput.value;
        
        const validation = validateProjectName(projectName);
        
        if (!validation.isValid) {
            showError(validation.errors[0]);
            return;
        }
        
        // Check if project name already exists
        const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
        if (projects.some(p => p.name.toLowerCase() === validation.sanitizedName.toLowerCase())) {
            showError('A project with this name already exists. Please choose a different name.');
            return;
        }
        
        // Create new project
        const projectData = createProject(validation.sanitizedName);
        
        // Save to projects list
        projects.push(projectData);
        localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
        
        // Update form to show current project
        updateFormToShowCurrentProject(validation.sanitizedName);
        
        // Add Next button to step 1
        const step1 = document.getElementById('step1');
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
                stepManager.completeStep('step1');
                stepManager.activateStep(2);
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
            // Allows letters, numbers, spaces, hyphens, and apostrophes
            pattern: /^[a-zA-Z0-9\s\-']+$/,
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
        
        // Add Next button to step 1
        const step1 = document.getElementById('step1');
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
                stepManager.completeStep('step1');
            });
        }
        
        // Update step completion status
        stepManager.steps[1].isComplete = true;
        stepManager.updateNavigation();

        // Load saved electrification goals if they exist
        if (project.steps.electrificationGoals && 
            project.steps.electrificationGoals.selectedAppliances) {
            const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const isSelected = project.steps.electrificationGoals.selectedAppliances
                    .some(appliance => appliance.type === checkbox.value);
                checkbox.checked = isSelected;
            });
            
            // Update step 2 completion status
            stepManager.checkStepCompletion();
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

    // Update saveProjectFile to use the consolidated function
    async function saveProjectFile() {
        console.log('saveProjectFile called');
        const currentProjectName = getCurrentProjectName();
        console.log('Current project name:', currentProjectName);
        
        if (!currentProjectName) {
            alert('No project is currently loaded. Please create or load a project first.');
            return;
        }

        const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
        const currentProject = projects.find(p => p.name === currentProjectName);
        
        if (!currentProject) {
            alert('Project data not found. Please try again.');
            return;
        }

        console.log('Found current project:', currentProject);
        // Add completion timestamp
        currentProject.completedAt = new Date().toISOString();
        
        await saveFile(currentProject);
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

    // Step Management System
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
                1: this.createStep({
                    id: 'step1',
                    nextStep: 2,
                    validate: () => {
                        const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
                        console.log('Validating step 1, projects:', projects);
                        return projects.length > 0;
                    }
                }),
                2: this.createStep({
                    id: 'step2',
                    nextStep: 3,
                    validate: () => {
                        const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                        const isChecked = Array.from(checkboxes).some(cb => cb.checked);
                        console.log('Validating step 2, any checkbox checked:', isChecked);
                        return isChecked;
                    }
                }),
                3: this.createStep({
                    id: 'step3',
                    nextStep: 4,
                    validate: () => {
                        const skipCheckbox = document.querySelector('#step3 input[type="checkbox"]');
                        return skipCheckbox ? skipCheckbox.checked : false;
                    }
                }),
                4: this.createStep({
                    id: 'step4',
                    nextStep: 5,
                    validate: () => {
                        const skipCheckbox = document.querySelector('#step4 input[type="checkbox"]');
                        return skipCheckbox ? skipCheckbox.checked : false;
                    }
                }),
                5: this.createStep({
                    id: 'step5',  // This is the final step in the HTML
                    nextStep: null,
                    validate: () => {
                        const skipCheckbox = document.querySelector('#step5 input[type="checkbox"]');
                        return skipCheckbox ? skipCheckbox.checked : false;
                    }
                })
            };
            console.log('Steps defined:', this.steps);
        },

        createStep({ id, nextStep, validate }) {
            return {
                id,
                nextStep,
                isComplete: false,
                validateStep: validate,
                element: document.getElementById(id),
                getNextButton() {
                    return this.element?.querySelector('.next-button');
                },
                createNextButton() {
                    if (!this.element) return null;
                    
                    const existingButton = this.getNextButton();
                    if (existingButton) return existingButton;
                    
                    const button = document.createElement('button');
                    button.className = 'next-button';
                    button.textContent = this.nextStep ? 'Next' : 'Save Project File';
                    this.element.appendChild(button);
                    
                    // Add click handler for the final step's save button
                    if (!this.nextStep) {
                        button.addEventListener('click', async (e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent event bubbling
                            await saveProjectFile();
                        });
                    }
                    
                    return button;
                }
            };
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

            // Skip step checkbox listeners
            const skipCheckboxes = document.querySelectorAll('input[name^="skipStep"]');
            skipCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.checkStepCompletion());
            });

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

        activateStep(stepNumber) {
            console.log('activateStep called with stepNumber:', stepNumber);
            const step = this.steps[stepNumber];
            console.log('Found step:', step);
            if (!step) return;

            Object.values(this.steps).forEach(s => {
                if (s.element) {
                    console.log('Processing step element:', s.id);
                    if (s.id === step.id) {
                        console.log('Activating step:', s.id);
                        s.element.classList.add('active');
                        s.element.style.opacity = '1';
                        s.element.style.pointerEvents = 'auto';
                    } else if (s.isComplete) {
                        console.log('Marking step as completed:', s.id);
                        s.element.classList.add('completed');
                        s.element.style.opacity = '0.8';
                        s.element.style.pointerEvents = 'auto';
                    } else {
                        console.log('Deactivating step:', s.id);
                        s.element.classList.remove('active', 'completed');
                        s.element.style.opacity = '0.5';
                        s.element.style.pointerEvents = 'none';
                    }
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
                } else {
                    // For the final step, we want to handle the click directly
                    nextButton.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent event bubbling
                        await saveProjectFile();
                    };
                }
            } else {
                nextButton.classList.remove('active');
                step.isComplete = false;
                nextButton.onclick = null;
            }

            this.updateNavigation();
        },

        completeStep(stepId) {
            console.log('completeStep called with stepId:', stepId);
            const step = Object.values(this.steps).find(s => s.id === stepId);
            console.log('Found step:', step);
            if (!step) return;

            step.isComplete = true;
            console.log('Step marked as complete');
            if (step.element) {
                step.element.classList.add('completed');
                console.log('Added completed class to step element');
            }

            if (step.nextStep) {
                console.log('Moving to next step:', step.nextStep);
                this.activateStep(step.nextStep);
                const nextStep = this.steps[step.nextStep];
                if (nextStep && nextStep.element) {
                    nextStep.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                console.log('Final step completed');
                // No need to do anything special here as the save button is already set up
            }

            this.updateNavigation();
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
                }
            },
            version: "1.0"
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
                
                // Check if project name already exists
                const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
                if (projects.some(p => p.name === projectData.name)) {
                    if (!confirm(`A project named "${projectData.name}" already exists. Do you want to replace it?`)) {
                        return;
                    }
                    // Remove existing project
                    const index = projects.findIndex(p => p.name === projectData.name);
                    if (index !== -1) {
                        projects.splice(index, 1);
                    }
                }
                
                // Add the imported project
                projects.push(projectData);
                localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
                
                // Update UI to show imported project
                updateFormToShowCurrentProject(projectData.name);
                
                // Load saved electrification goals if they exist
                if (projectData.steps.electrificationGoals && 
                    projectData.steps.electrificationGoals.selectedAppliances) {
                    const checkboxes = document.querySelectorAll('#electrificationForm input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        // Check if this appliance was selected in the imported data
                        const isSelected = projectData.steps.electrificationGoals.selectedAppliances
                            .some(appliance => appliance.type === checkbox.value);
                        checkbox.checked = isSelected;
                    });
                    
                    // Trigger validation check to update Next button
                    stepManager.checkStepCompletion();
                }
                
                alert('Project imported successfully!');
                
            } catch (error) {
                alert('Error importing project: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    function updateFormToShowCurrentProject(projectName) {
        // Clear the form and show current project info
        const projectForm = document.querySelector('.project-form');
        projectForm.innerHTML = `
            <div class="current-project">
                <h4>Current Project:</h4>
                <p class="project-name">${projectName}</p>
                <div class="project-actions">
                    <button type="button" class="secondary-button view-projects-btn">View All Projects</button>
                    <button type="button" class="secondary-button new-project-btn">Start New Project</button>
                </div>
            </div>
        `;
        
        // Add event listeners to new buttons
        projectForm.querySelector('.view-projects-btn').addEventListener('click', showProjectsList);
        projectForm.querySelector('.new-project-btn').addEventListener('click', resetProjectForm);
    }
    
    function resetProjectForm() {
        const projectForm = document.querySelector('.project-form');
        projectForm.innerHTML = `
            <h3>Project Management</h3>
            <p>Choose whether to start a new project or open an existing one.</p>
            
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
                        <p class="form-help">This name will be used to save your progress locally</p>
                        <button type="submit" class="primary-button">Create Project</button>
                    </form>
                </div>

                <div class="project-option open-project-option">
                    <h4>Open Existing Project</h4>
                    <p>Continue working on a previously saved project.</p>
                    <div class="form-group">
                        <button type="button" class="primary-button" id="openProjectBtn">Browse Projects</button>
                        <div class="import-section">
                            <p>Or import a project file:</p>
                            <input type="file" id="importFile" accept=".json">
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Reattach event listeners
        document.getElementById('newProjectForm').addEventListener('submit', handleNewProject);
        document.getElementById('openProjectBtn').addEventListener('click', showProjectsList);
        document.getElementById('importFile').addEventListener('change', handleFileImport);
    }
})(); 