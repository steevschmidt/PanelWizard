/**
 * PanelWizard Print Module
 * Handles printing of appliances table and calculation methods
 * Includes all necessary CSS styles for print functionality
 */

class PanelWizardPrinter {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPrintButton());
        } else {
            this.setupPrintButton();
        }
        
        // Also try to set up the button when project data might be available
        // This handles cases where the project loads after the DOM
        setTimeout(() => this.setupPrintButton(), 1000);
        setTimeout(() => this.setupPrintButton(), 3000);
    }

    setupPrintButton() {
        // Check if the button already exists
        if (document.getElementById('printTableBtn')) {
            return; // Button already exists
        }
        
        // Look for the calculation methods section to place the print button below it
        const calculationMethods = document.querySelector('.calculation-methods');
        if (calculationMethods) {
            this.createPrintButtonBelowCalculations(calculationMethods);
            this.addPrintButtonEventListeners();
        } else {
            // Wait a bit and try again - the calculation methods might not be created yet
            setTimeout(() => this.setupPrintButton(), 500);
            return;
        }
    }

    createPrintButtonBelowCalculations(calculationMethods) {
        // Create print button container
        const printButtonContainer = document.createElement('div');
        printButtonContainer.className = 'print-button-container';
        printButtonContainer.innerHTML = `
            <button id="printTableBtn" class="print-button" aria-label="Print appliances table and calculations">
                🖨️ Print Table & Calculations
            </button>
            <p class="print-help">Print a copy of your appliance selections and calculation results for your records.</p>
        `;
        
        // Insert the print button after the calculation methods section
        calculationMethods.parentNode.insertBefore(printButtonContainer, calculationMethods.nextSibling);
    }

    addPrintButtonEventListeners() {
        const printBtn = document.getElementById('printTableBtn');
        if (printBtn) {
            // Remove any existing event listeners to prevent duplicates
            printBtn.replaceWith(printBtn.cloneNode(true));
            const newPrintBtn = document.getElementById('printTableBtn');
            newPrintBtn.addEventListener('click', () => this.handlePrint());
        }
    }

    handlePrint() {
        try {
            // Create print-friendly content
            const printContent = this.createPrintContent();
            
            // Open print window as a new tab (not a popup)
            const printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                alert('Popup blocked. Please allow popups for this site and try again.');
                return;
            }
            
            // Write content to the new window
            printWindow.document.write(printContent);
            printWindow.document.close();
            
            // Use a longer delay to ensure the new tab is fully ready before printing
            // This prevents the parent tab from freezing in Chrome
            setTimeout(() => {
                try {
                    if (printWindow && !printWindow.closed) {
                        printWindow.focus(); // Bring window to front
                        // Use nested setTimeout to allow browser to complete rendering
                        setTimeout(() => {
                            if (printWindow && !printWindow.closed) {
                                printWindow.print();
                            }
                        }, 250);
                    }
                } catch (e) {
                    console.error('Error during print:', e);
                }
            }, 1000); // Longer initial delay prevents parent tab freeze
        } catch (error) {
            console.error('Error handling print:', error);
            alert('Error preparing print content. Please try again.');
        }
    }

    createPrintContent() {
        const projectName = this.getProjectName();
        const currentDate = new Date().toLocaleDateString();
        const projectInfo = this.getProjectInfo();
        const tableContent = this.getTableContent();
        const totalCostRange = this.getTotalCostRange();
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PanelWizard - ${projectName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            color: #333;
        }
        .print-header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .print-header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 28px;
        }
        .project-info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .project-info h3 {
            margin-top: 0;
            color: #2196F3;
        }
        .project-info p {
            margin: 5px 0;
        }
        .appliances-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .appliances-table th,
        .appliances-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .appliances-table th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        .appliances-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .calculation-methods {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .calculation-method {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2196F3;
        }
        .calculation-method h6 {
            margin-top: 0;
            color: #2196F3;
            font-size: 16px;
        }
        .calculation-method p {
            margin: 8px 0;
        }
        .total-cost-range {
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }
        .print-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        @media print {
            body { margin: 0; }
            .print-header { border-bottom-color: #000; }
            .appliances-table th { background-color: #000 !important; color: #fff !important; }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <h1>⚡ PanelWizard</h1>
        <p>Home Electrification Planning Tool</p>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Generated:</strong> ${currentDate}</p>
    </div>
    
    <div class="project-info">
        <h3>Project Summary</h3>
        ${projectInfo}
    </div>
    
    <h2>Selected Appliances & Calculations</h2>
    ${tableContent}
    
    ${totalCostRange ? `<div class="total-cost-range"><strong>Total Cost Range:</strong> ${totalCostRange}</div>` : ''}
    
    <div class="print-footer">
        <p>Generated by PanelWizard - A Home Electrification Planning Tool</p>
        <p>For more information, visit: https://wizard.hea.com</p>
    </div>
</body>
</html>`;
    }

    getProjectName() {
        return window.currentProject?.projectName || 'PanelWizard Project';
    }

    getProjectInfo() {
        // Try to get panel size from the current project data first
        let panelSize = window.currentProject?.steps?.currentEquipment?.panelSize;
        
        // Debug logging
        console.log('Debug - currentProject:', window.currentProject);
        console.log('Debug - panelSize from project:', panelSize);
        
        // If not found in project data, try to get it from the input field
        if (!panelSize) {
            const panelAmpsInput = document.getElementById('panelAmps');
            if (panelAmpsInput && panelAmpsInput.value) {
                panelSize = panelAmpsInput.value;
                console.log('Debug - panelSize from input field:', panelSize);
            }
        }
        
        // Also try to get from localStorage if available
        if (!panelSize) {
            try {
                const savedProject = localStorage.getItem('panelWizardCurrentProject');
                if (savedProject) {
                    const projectData = JSON.parse(savedProject);
                    panelSize = projectData?.steps?.currentEquipment?.panelSize;
                    console.log('Debug - panelSize from localStorage:', panelSize);
                }
            } catch (e) {
                console.log('Debug - localStorage parse error:', e);
            }
        }
        
        // Format the panel size with proper units
        const panelSizeDisplay = panelSize ? `${panelSize} amps` : 'Not specified';
        
        const topDownCapacity = document.getElementById('topDownCapacity')?.value || 'Not specified';
        const bottomUpCapacity = document.getElementById('bottomUpCapacity')?.value || 'Not specified';
        
        return `
            <p><strong>Panel Size:</strong> ${panelSizeDisplay}</p>
            <p><strong>Top-Down Available Capacity:</strong> ${topDownCapacity} amps</p>
            <p><strong>Bottom-Up Available Capacity:</strong> ${bottomUpCapacity} amps</p>
        `;
    }

    // Method to refresh the print button (can be called externally)
    refreshPrintButton() {
        this.setupPrintButton();
    }

    getTableContent() {
        const tableElement = document.getElementById('csvAppliancesTable');
        if (!tableElement) {
            return '<p>Table not available</p>';
        }

        // Clone the table to avoid modifying the original
        const tableClone = tableElement.cloneNode(true);
        
        // Remove the Details column (last column) from the table
        const rows = tableClone.querySelectorAll('tr');
        rows.forEach(row => {
            // Remove the last cell (Details column) from each row
            if (row.cells.length > 0) {
                row.deleteCell(-1); // Remove last cell
            }
        });
        
        // Remove any interactive elements that shouldn't be printed
        const buttons = tableClone.querySelectorAll('button, .details-btn');
        buttons.forEach(btn => btn.remove());
        
        // Clean up dropdowns and other interactive elements
        const dropdowns = tableClone.querySelectorAll('select');
        dropdowns.forEach(dropdown => {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            if (selectedOption) {
                dropdown.parentNode.textContent = selectedOption.textContent;
            }
        });

        return tableClone.outerHTML;
    }

    getTotalCostRange() {
        // Calculate total cost range from all products in the table
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
                // Fallback: try to parse cost from the cost cell (column index 4)
                const costCell = row.cells[4];
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
        
        if (totalCostMin === 0 && totalCostMax === 0) {
            return null;
        }
        
        return `$${totalCostMin.toLocaleString()} - $${totalCostMax.toLocaleString()}`;
    }
}

// ==========================================================================
// Print Styles - Embedded CSS for print functionality
// ==========================================================================

const printStyles = `
/* Print Button Container Styling */
.print-button-container {
    text-align: center;
    margin: 30px 0;
    padding: 20px;
    background: var(--background-secondary, #f5f5f5);
    border-radius: var(--border-radius-md, 8px);
    border: 1px solid var(--border-color, #ddd);
}

.print-button {
    background: var(--primary-color, #4CAF50);
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border-radius: var(--border-radius-md, 8px);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.print-button:hover {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.print-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.print-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
}

.print-help {
    margin: 10px 0 0 0;
    color: var(--text-secondary, #666);
    font-size: 14px;
    font-style: italic;
}

/* Print-Specific Page Styles */
@media print {
    /* Hide interactive elements when printing the main page */
    .print-button-container,
    .theme-toggle,
    .reset-button,
    button,
    input,
    select,
    .details-btn {
        display: none !important;
    }
    
    /* Prevent page breaks within important content */
    .csv-appliances-table {
        break-inside: avoid;
    }
    
    .calculation-methods {
        break-inside: avoid;
    }
    
    /* Ensure clean print appearance */
    body {
        background: white !important;
        color: black !important;
    }
    
    .content-box {
        border: none !important;
        box-shadow: none !important;
        background: white !important;
    }
    
    /* Ensure table headers print properly */
    .appliances-table th {
        background-color: #000 !important;
        color: #fff !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
    }
    
    /* Ensure alternating row colors print */
    .appliances-table tr:nth-child(even) {
        background-color: #f9f9f9 !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
    }
}

/* Dark Theme Support for Print Button Container */
[data-theme="dark"] .print-button-container {
    background: var(--background-secondary, #1e1e1e);
    border-color: var(--border-color, #333);
}

[data-theme="dark"] .print-help {
    color: var(--text-secondary, #aaa);
}

/* Responsive Design for Print Button */
@media (max-width: 768px) {
    .print-button-container {
        padding: 15px;
        margin: 20px 0;
    }
    
    .print-button {
        padding: 10px 20px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .print-button-container {
        padding: 10px;
        margin: 15px 0;
    }
    
    .print-button {
        width: 100%;
        padding: 12px;
        font-size: 14px;
    }
}
`;

// Inject the print styles into the document head
function injectPrintStyles() {
    if (!document.getElementById('panelwizard-print-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'panelwizard-print-styles';
        styleElement.textContent = printStyles;
        document.head.appendChild(styleElement);
    }
}

// Initialize the printer when the script loads
const panelWizardPrinter = new PanelWizardPrinter();

// Make the printer available globally for external access
window.panelWizardPrinter = panelWizardPrinter;

// Inject styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPrintStyles);
} else {
    injectPrintStyles();
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PanelWizardPrinter;
}
