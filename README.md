# PanelWizard

A comprehensive tool to help homeowners plan their home electrification using their existing electrical panel capacity. PanelWizard analyzes your current electrical setup and provides a customized strategy for transitioning from fossil fuels to clean electricity.

## Overview

Most Americans use fossil fuels in their homes and while driving. To help with the climate crisis, Americans need to migrate off fossil fuels. Electricity in most US states continues to get cleaner -- meaning electric generation produces less carbon emissions -- so replacing fossil fueled devices with electric equivalents reduces carbon emissions. We call this process "home electrification".

### Fossil Fuels Used by Homeowners
- Natural gas
- Fuel oil  
- Propane
- Gasoline
- Diesel

### Examples of Home Electrification
1. **Heating Systems**: Replace natural gas furnaces with modern electric heat pumps
2. **Water Heaters**: Switch from gas to heat pump water heaters
3. **Cooking**: Replace gas stoves with induction cooktops
4. **Transportation**: Install EV chargers for electric vehicles
5. **Appliances**: Convert gas dryers to electric condensing models

## Current Features

### 1. Project Management
- Create and save electrification projects
- Import/export project files (.json format)
- Project naming and organization

### 2. Electrification Goals Assessment
- **Heating Systems**: Specify BTU/h capacity for gas heating units
- **Water Heaters**: Quantity of gas water heaters to replace
- **Cooking Appliances**: Gas stoves, ovens, and ranges
- **Clothes Dryers**: Gas dryer replacement planning
- **Other Gas Appliances**: Pool heaters, BBQs, fireplaces, etc.
- **EV Chargers**: Electric vehicle charging infrastructure
- **Gas Meter Removal**: Space optimization considerations

### 3. Electrical Panel Analysis
- Panel size input (10-1000 amps, 240V)
- **Top-Down Approach**: Use actual electricity usage data (NEC 220.87)
- **Bottom-Up Approach**: Calculate capacity by summing electrical loads (NEC 220.83)
- Available capacity calculations
- Validation and error handling

### 4. Natural Gas Analysis (Optional)
- Gas usage data analysis
- Bill impact calculations
- Heat pump sizing estimates
- Professional consultation recommendations

### 5. Appliance Selection & Planning
- **Comprehensive Product Database**: 6 categories with detailed specifications
  - Heat Pumps
  - Water Heaters  
  - Cooking Appliances
  - Clothes Dryers
  - EV Chargers
  - Other Appliances
- Product filtering and selection
- Panel load calculations
- Capacity factor adjustments
- Cost range information

### 6. Load Calculation Methods
- **NEC 220.87 (Top-Down)**: Based on actual usage data
- **NEC 220.83 (Bottom-Up)**: Sum of all loads with coincidence factors
- Real-time capacity calculations
- Remaining capacity analysis

### 7. Implementation Planning
- Timeline planning recommendations
- Budget considerations
- Incentive and rebate information
- Contractor selection guidance
- Permit requirement overview

### 8. Advanced Features
- **Print Functionality**: Generate printable reports of selections and calculations
- **Theme Toggle**: Dark/light mode support
- **Responsive Design**: Mobile and desktop optimized
- **Data Persistence**: Local storage for project data
- **Version Management**: Automatic version tracking

## Technical Architecture

### Frontend Technology
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties
- **Responsive Design**: Mobile-first approach

### Data Management
- **CSV Database**: Product data stored in structured CSV files
- **Local Storage**: Project persistence and user preferences
- **JSON Export/Import**: Project file format

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support
- CSS Grid and Flexbox support

## Local Development Setup

### Prerequisites
- Modern web browser
- Local web server (required for CSV loading)

### Quick Start
1. Clone the repository
2. Start a local web server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # VS Code Live Server extension
   ```
3. Open `http://localhost:8000` in your browser

### Development Notes
- CSV files are loaded from `data/appliances/` directory
- Local development requires a web server due to CORS restrictions
- The application automatically detects local vs. production environments

## Deployment

### AWS Amplify
- Static site hosting
- Automatic deployments from Git
- Global CDN distribution

### Production Environment
- CSV data served from `https://wizard.hea.com/data/appliances/`
- Version tracking via GitHub commits
- Pacific Time zone for version timestamps

# Third-Party Integration

PanelWizard supports URL parameters for third-party integration, allowing partners to pre-populate the application with specific configuration data.

## URL Parameters

### `panelSize`
- **Type**: Integer (amps)
- **Range**: 10-1000
- **Description**: Sets the electrical panel size in amps
- **Example**: `?panelSize=200`

### `topDownCapacity`
- **Type**: Integer (amps)
- **Range**: 0+
- **Description**: Sets the available capacity using the top-down approach (NEC 220.87)
- **Example**: `?topDownCapacity=40`

### `bottomUpCapacity`
- **Type**: Integer (amps)
- **Range**: 0+
- **Description**: Sets the available capacity using the bottom-up approach (NEC 220.83)
- **Example**: `?bottomUpCapacity=35`

## Usage Examples

### Basic Configuration
```
index.html?panelSize=200
```

### Complete Configuration
```
index.html?panelSize=200&topDownCapacity=40&bottomUpCapacity=35
```

### Partial Configuration
```
index.html?panelSize=150&topDownCapacity=30
```

## Integration Notes

- All parameters are optional and can be used in any combination
- Invalid values (non-integers, out of range) are ignored with console warnings
- The application functions normally even if parameters are missing or invalid
- Parameters are processed when the page loads, before user interaction
- This feature is designed for programmatic integration, not end-user sharing

## Use Cases

- **Database Integration**: Pre-populate forms from customer data
- **API Integration**: Pass configuration data from external systems
- **Workflow Integration**: Embed PanelWizard in larger electrification planning tools
- **Testing**: Pre-configure the application for specific test scenarios