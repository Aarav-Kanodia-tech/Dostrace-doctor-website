# Show Missed Medicine Counts

## Changes
- Add a missed-medicine count to each patient record using the current demo scenarios.
- Display the count as a clearly labeled column in the priority cohort table.
- Show the selected patient’s count in the signal analysis window.
- Update the synced refill state so the affected patient’s missed count changes to zero.

## Technical details
- Extend the shared patient data type with a numeric `missedMedicines` field.
- Keep filtering, search, and existing risk behavior unchanged.
- Use the existing badge and color styles for consistent status treatment.
- Verify the table and analysis window in the running preview.
