# PanelWizard
A tool to help homeowners fully electrify their home using their existing electric panel.

Challenge: Most Americans use fossil fuels in their homes and while driving. To help with the climate crisis, Americans need to migrate off fossil fuels. Electricity in most US states continues to get cleaner -- meaning electric generation produces less carbon emissions -- so replacing fossil fueled devices with electric equivalents reduces carbon emissions. We call this process "home electrification".

The fossil fuels used by homeowners: Natural gas, fuel oil, propane, gasoline, diesel

Examples of home electrification:
1. Replacing a natural gas furnace with a modern electric heat pump. The heat pump is far more efficient, so less energy is used and operating costs usually go down, but the home will use more electricity. 
2. Replacing a gasoline car with an electric vehicle. This also reduces total energy use, but the owner needs to install an electric vehicle charger in their home and their electric use will go up.
3. Replacing a natural gas water heater with a heat pump water heater.
4. Replacing a natural gas clothes dryer with a condensing ventless electric dryer.
5. Replacing a natural gas cooktop with an induction cooktop.
All of these changes reduce the amount of fossil fuels used by the homeowner.

# Development process
We are going to build a modern software tool that helps US homeowners understand how to electrify their home using their existing electrical panel. The tool will run in any modern browser and be beautiful. We will use AWS Amplify to serve the tool to the public. we will create a simple, modern, responsive app using vanilla HTML, CSS, and JavaScript formatted in separate code blocks and including introductory text to each section of these files. We will use dark mode as the default and it will be responsive and optimized for mobile devices but also desktop friendly. We will use opengraph meta tags for social sharing and viewport tags for optimal viewing. We will use the helvetica neue font, and use #ff7f00 highlights. All scroll elements will be thin and use dark mode.

# Requirements:
- Final requirement is Github open source project.
- Initial development focused on the Steel Thread pattern: Not all functions are required to be completed, but the tool must run.
- We will provide a high level specification, an overview of the structure, with stubs for future functions.
- Tool should run in the most popular browsers.
- Tool will allow users to answer questions and see results.

# Tool inputs from user:
1. Required: Current electric panel size, in Amps.
2. Reqired: Used panel capacity over the past year, either measured or estimated (?)
3. List of fossil devices to be electrified
4. Device specific issues, like Minimum tonnage of HVAC needed, EV charging speed, etc.
5. Proximity to unused and used 240V circuits/outlets

# Tool outputs for the user:
- Remaining panel capacity before and after electrification
- List of devices to be replaced and electrified
- List of devices to be added

# Local Development Setup
1. Clone the repository
2. Open index.html in a modern browser