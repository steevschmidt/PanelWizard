# Appliance Database CSV Files

This directory contains CSV files for different appliance categories used in PanelWizard Step 6. Each file contains realistic product data that users can select from when planning their home electrification.

## File Structure

- `heat-pumps.csv` - Air source heat pumps for heating/cooling
- `water-heaters.csv` - Heat pump and tankless water heaters
- `cooking-appliances.csv` - Induction ranges, cooktops, and ovens
- `clothes-dryers.csv` - Heat pump clothes dryers
- `ev-chargers.csv` - Level 2 electric vehicle chargers
- `other-appliances.csv` - Miscellaneous electric appliances

## CSV Column Definitions

### Common Fields (All Categories)
- `id` - Unique identifier for the product
- `name` - Product name and description
- `electrical_load_amps` - Electrical current requirement in amps at the specified voltage
- `voltage` - Required voltage (120V or 240V)
- `circuit_type` - Circuit requirement (dedicated, shared, etc.)
- `panel_amps_240v` - **Panel capacity impact in 240V panel amps (for calculations)**
- `cost_min` - Minimum estimated cost in USD
- `cost_max` - Maximum estimated cost in USD
- `installation_notes` - Installation requirements and notes
- `manufacturer` - Brand name
- `model_number` - Specific model identifier

### Category-Specific Fields

#### Heat Pumps
- `capacity_btu` - Heating/cooling capacity in BTU/h
- `efficiency_seer` - Seasonal Energy Efficiency Ratio
- `efficiency_hspf` - Heating Seasonal Performance Factor

#### Water Heaters
- `capacity_gal` - Tank capacity in gallons (0 for tankless)
- `efficiency_uef` - Uniform Energy Factor
- `tankless` - Whether it's a tankless model (true/false)

#### Cooking Appliances
- `type` - Appliance type (Range, Cooktop, Oven)
- `induction` - Whether it uses induction technology (true/false)

#### Clothes Dryers
- `capacity_cu_ft` - Drum capacity in cubic feet
- `heat_pump` - Whether it's a heat pump dryer (true/false)

#### EV Chargers
- `charging_speed_kw` - Charging rate in kilowatts
- `installation_type` - Installation method (hardwired, plug-in)
- `smart_features` - Whether it has smart connectivity (true/false)

#### Other Appliances
- `type` - Appliance category
- `special_notes` - Additional information or usage notes

## Panel Amps 240V Column

The `panel_amps_240v` column is **critical for accurate panel capacity calculations**. It converts all electrical loads to a standard 240V panel reference:

### **Calculation Rules**
- **240V appliances**: `panel_amps_240v` = `electrical_load_amps` (direct)
- **120V appliances**: `panel_amps_240v` = `electrical_load_amps` ÷ 2

### **Why This Matters**
- **Eliminates calculation errors** from voltage confusion
- **Standardizes panel capacity math** across all appliance types
- **Matches electrician thinking** (panel ratings are in 240V amps)
- **Enables simple addition** for total panel load calculations

### **Example Calculations**
| Appliance | Voltage | Load Amps | Panel Amps (240V) | Calculation |
|-----------|---------|-----------|-------------------|-------------|
| Heat Pump | 240V | 15A | 15A | 15A (direct) |
| Range | 240V | 40A | 40A | 40A (direct) |
| Space Heater | 120V | 12A | 6A | 12A ÷ 2 |
| Water Heater | 240V | 15A | 15A | 15A (direct) |

## Data Maintenance

### Adding New Products
1. Open the appropriate CSV file in Excel, Google Sheets, or a text editor
2. Add a new row with a unique `id` (e.g., `hp_011` for heat pumps)
3. Fill in all required fields, **ensuring `panel_amps_240v` is calculated correctly**
4. Save the file

### Updating Existing Products
1. Locate the product by `id` or `name`
2. Modify the relevant fields
3. **Verify `panel_amps_240v` calculation is still correct**
4. Save the file

### Data Validation Rules
- `electrical_load_amps` must be a positive number
- `voltage` must be either 120 or 240
- `panel_amps_240v` must equal `electrical_load_amps` for 240V appliances
- `panel_amps_240v` must equal `electrical_load_amps ÷ 2` for 120V appliances
- `cost_min` must be less than or equal to `cost_max`
- Boolean fields must be `true` or `false`

### Cost Ranges
Cost ranges represent typical installation costs including:
- Product cost
- Basic installation labor
- Basic electrical work
- Permits and inspections

Actual costs may vary based on:
- Geographic location
- Installation complexity
- Contractor rates
- Additional electrical work needed

## File Format Requirements

- Use UTF-8 encoding
- Separate fields with commas
- Enclose text fields in quotes if they contain commas
- Use consistent decimal places for numeric values
- Maintain consistent field ordering
- **Always verify `panel_amps_240v` calculations are correct**

## Integration with PanelWizard

These CSV files are loaded by the JavaScript application when Step 6 is activated. The data is parsed and used to:

1. Populate product selection interfaces
2. **Calculate electrical load requirements using `panel_amps_240v`**
3. Provide real-time capacity feedback
4. Generate product recommendations
5. Calculate total project costs

## Simplified Structure Benefits

The simplified CSV structure focuses on essential information:
- **Electrical requirements** for panel capacity calculations
- **Cost information** for budget planning
- **Installation details** for contractor guidance
- **Efficiency ratings** for energy savings calculations
- **Product specifications** for informed decision-making
- **Standardized panel capacity impact** for accurate calculations

This streamlined approach makes the files easier to maintain while preserving all critical functionality for the electrification planning tool.

## Future Enhancements

Potential additions to consider:
- Product images and links
- Regional availability
- Contractor recommendations
- Installation difficulty ratings
- Maintenance requirements
- Warranty information
- User reviews and ratings
