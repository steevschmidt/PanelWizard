# PanelWizard
A tool to help homeowners fully electrify their home using their existing electric panel.

Challenge: Most Americans use fossil fuels in their homes and while driving. To help with the climate crisis, Americans need to migrate off fossil fuels. Electricity in most US states continues to get cleaner -- meaning electric generation produces less carbon emissions -- so replacing fossil fueled devices with electric equivalents reduces carbon emissions. We call this process "home electrification".

The fossil fuels used by homeowners: Natural gas, fuel oil, propane, gasoline, diesel

Examples of home electrification:
1. Replacing a natural gas furnace with a modern electric heat pump. The heat pump is far more efficient, so less energy is used and operating costs usually go down, but the home will use more electricity. 
2. Replacing a gasoline car with an electric vehicle also reduces total energy use, but the owner needs to install an electric vehicle charger in their home and their electric use will go up.
3. Replacing a natural gas water heater with a heat pump water heater.
4. Replacing a natural gas clothes dryer with a condensing ventless electric dryer.
5. Replacing a natural gas cooktop with an induction cooktop.
All of these 

We are going to build a modern software tool that helps US homeowners understand how to electrify their home using their existing electrical panel.

Inputs:
1. Required: Electric panel sizes, in Amps.
2. Reqired: Used panel capacity over past year, either measured or estimated (?)
3. List of fossil devices to be electrified
4. Device specific issues, like Minimum tonnage of HVAC needed, how many EV chargers, etc.
5. Proximity to unused and used 240V circuits/outlets

Output:
- Final requirement is Github open source project
- High level specification
- Overview of the structure, with stubs for future functions.
- Tool that runs in the top three browsers.
- Tool that interacts with HEA's database (for HomeIntel customers).
- Tool that allows users answers questions and see results in a browser window.
