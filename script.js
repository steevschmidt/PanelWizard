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

    // Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        navToggle.classList.toggle('active');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Project form handling
    const projectForm = document.getElementById('projectForm');
    
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

    projectForm.addEventListener('submit', (e) => {
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
        
        // Create project with sanitized name
        const projectData = {
            name: validation.sanitizedName,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            steps: {}
        };
        
        // Save to projects list
        projects.push(projectData);
        localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
        
        // Update form to show current project
        updateFormToShowCurrentProject(validation.sanitizedName);
        
        // Trigger step validation check
        stepManager.checkStepCompletion();
    });
    
    function showError(message) {
        // Remove any existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Add a shake animation class
        errorDiv.classList.add('shake');
        
        // Insert error before the submit button
        const submitButton = projectForm.querySelector('button[type="submit"]');
        projectForm.insertBefore(errorDiv, submitButton);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.classList.add('fade-out');
            setTimeout(() => errorDiv.remove(), 300); // Wait for fade animation
        }, 5000);
    }
    
    function updateFormToShowCurrentProject(projectName) {
        // Clear the form and show current project info
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
        projectForm.innerHTML = `
            <label for="projectName">Project Name:</label>
            <input 
                type="text" 
                id="projectName" 
                placeholder="e.g., Byrd House or 123 River Road"
                required
            >
            <p class="form-help">This name will be used to save your progress locally</p>
            <button type="submit" class="primary-button">Start Project</button>
        `;
    }
    
    // Check for existing project on page load
    const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
    const currentProject = projects.length > 0 ? projects[projects.length - 1] : null;
    
    // Initialize the project form based on whether there's a current project
    if (currentProject) {
        updateFormToShowCurrentProject(currentProject.name);
    } else {
        resetProjectForm(); // Ensure the form is in its initial state
    }
    
    // Function to show projects list
    function showProjectsList() {
        const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
        
        // Remove any existing modal first
        const existingModal = document.querySelector('.projects-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const projectsModal = document.createElement('div');
        projectsModal.className = 'projects-modal';
        projectsModal.innerHTML = `
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
                <div class="import-section">
                    <p>Import a previously saved project:</p>
                    <input type="file" id="importFile" accept=".json">
                </div>
                <button class="close-modal-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(projectsModal);
        
        // Single event listener using event delegation
        const modalContent = projectsModal.querySelector('.projects-modal-content');
        modalContent.addEventListener('click', handleModalClick);
        
        // Handle file import
        const importFile = projectsModal.querySelector('#importFile');
        importFile.addEventListener('change', handleFileImport);
    }
    
    // Separate function for modal click handling
    function handleModalClick(e) {
        const target = e.target;
        
        if (target.classList.contains('close-modal-btn')) {
            const modal = document.querySelector('.projects-modal');
            if (modal) {
                // Remove event listener before removing modal
                const modalContent = modal.querySelector('.projects-modal-content');
                modalContent.removeEventListener('click', handleModalClick);
                modal.remove();
            }
        }
        
        if (target.classList.contains('load-btn')) {
            const project = JSON.parse(target.dataset.project);
            loadProject(project);
        }
        
        if (target.classList.contains('download-btn')) {
            const project = JSON.parse(target.dataset.project);
            downloadProject(project);
        }
        
        if (target.classList.contains('delete-btn')) {
            const projectName = target.dataset.projectName;
            deleteProject(projectName);
        }
    }
    
    function loadProject(project) {
        // Update the form to show the loaded project
        updateFormToShowCurrentProject(project.name);
        
        // Show success message in the main form area
        const successMessage = document.createElement('div');
        successMessage.className = 'load-success-message';
        successMessage.textContent = `Project "${project.name}" loaded successfully`;
        
        // Insert message after the current project display
        const currentProject = document.querySelector('.current-project');
        currentProject.appendChild(successMessage);
        
        // Delay modal removal to allow success message animation to complete
        setTimeout(() => {
            // Remove the modal
            const projectsModal = document.querySelector('.projects-modal');
            if (projectsModal) {
                projectsModal.remove();
            }
        }, 100); // Small delay to ensure smooth transition
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        // Update localStorage to mark this as the most recent project
        let projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
        // Move the loaded project to the end of the array (making it most recent)
        projects = projects.filter(p => p.name !== project.name);
        projects.push(project);
        localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
        
        // Optional: Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function downloadProject(project) {
        const dataStr = JSON.stringify(project, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${project.name.replace(/\s+/g, '_')}_panelwizard.json`;
        downloadLink.click();
        URL.revokeObjectURL(url);
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
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const project = JSON.parse(e.target.result);
                    let projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
                    projects.push(project);
                    localStorage.setItem('panelWizard_projects', JSON.stringify(projects));
                    showProjectsList(); // Refresh the list
                } catch (error) {
                    alert('Invalid project file');
                }
            };
            reader.readAsText(file);
        }
    }

    // Step Management System
    const stepManager = {
        currentStep: 1,
        steps: {
            1: {
                id: 'step1',
                isComplete: false,
                nextStep: 2,
                validateStep: () => {
                    const projects = JSON.parse(localStorage.getItem('panelWizard_projects') || '[]');
                    return projects.length > 0;
                }
            },
            2: {
                id: 'step2',
                isComplete: false,
                nextStep: 3,
                validateStep: () => {
                    // Add validation logic for electrification goals
                    return false; // TODO: Implement actual validation
                }
            },
            3: {
                id: 'step3',
                isComplete: false,
                nextStep: 4,
                validateStep: () => {
                    // Add validation logic for panel inventory
                    return false; // TODO: Implement actual validation
                }
            },
            4: {
                id: 'step4',
                isComplete: false,
                nextStep: 5,
                validateStep: () => {
                    // Add validation logic for load analysis
                    return false; // TODO: Implement actual validation
                }
            },
            5: {
                id: 'step6', // Note: ID is 'step6' due to original HTML structure
                isComplete: false,
                nextStep: null,
                validateStep: () => {
                    // Add validation logic for action plan
                    return false; // TODO: Implement actual validation
                }
            }
        },

        initializeSteps() {
            // Add next buttons to each step
            Object.values(this.steps).forEach(step => {
                const stepElement = document.getElementById(step.id);
                const nextButton = document.createElement('button');
                nextButton.className = 'next-button';
                nextButton.textContent = step.nextStep ? 'Next' : 'Complete';
                stepElement.appendChild(nextButton);

                nextButton.addEventListener('click', () => this.completeStep(step.id));
            });

            // Initialize first step
            this.activateStep(1);
            this.updateNavigation();
        },

        activateStep(stepNumber) {
            const step = this.steps[stepNumber];
            if (!step) return;

            // Update step visibility
            Object.values(this.steps).forEach(s => {
                const element = document.getElementById(s.id);
                element.classList.remove('active');
            });

            const stepElement = document.getElementById(step.id);
            stepElement.classList.add('active');
            
            // Update current step
            this.currentStep = stepNumber;
            this.updateNavigation();
            this.checkStepCompletion();
        },

        completeStep(stepId) {
            const stepNumber = Object.values(this.steps).findIndex(step => step.id === stepId) + 1;
            const step = this.steps[stepNumber];
            
            if (step && step.validateStep()) {
                step.isComplete = true;
                document.getElementById(stepId).classList.add('completed');
                
                // Move to next step if available
                if (step.nextStep) {
                    this.activateStep(step.nextStep);
                    
                    // Scroll to the next step
                    const nextStepElement = document.getElementById(this.steps[step.nextStep].id);
                    if (nextStepElement) {
                        nextStepElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                
                this.updateNavigation();
                this.saveProgress();
            }
        },

        checkStepCompletion() {
            const currentStep = this.steps[this.currentStep];
            if (!currentStep) return;

            const stepElement = document.getElementById(currentStep.id);
            const nextButton = stepElement.querySelector('.next-button');
            
            if (currentStep.validateStep()) {
                nextButton.classList.add('active');
            } else {
                nextButton.classList.remove('active');
            }

            // Force a re-render of the navigation
            this.updateNavigation();
        },

        updateNavigation() {
            // Update navigation menu items
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
                steps: this.steps
            };
            localStorage.setItem('stepProgress', JSON.stringify(progress));
        },

        loadProgress() {
            const savedProgress = JSON.parse(localStorage.getItem('stepProgress'));
            if (savedProgress) {
                this.currentStep = savedProgress.currentStep;
                this.steps = savedProgress.steps;
                this.activateStep(this.currentStep);
            }
        }
    };

    // Initialize step management after DOM content is loaded
    stepManager.initializeSteps();
    stepManager.loadProgress();

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset All Data';
    resetButton.onclick = () => {
        if (confirm('This will clear all saved data and reload the page. Are you sure?')) {
            localStorage.clear();
            location.reload();
        }
    };
    document.body.appendChild(resetButton);
}); 