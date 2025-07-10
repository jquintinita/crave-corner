export function createEmployee({ name, role, salaryType, salaryAmount, deductions = 0 }) {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    salaryType, // "hourly" or "monthly"
    salaryAmount,
    hoursWorked: 0,
    deductions,
    dateHired: new Date().toISOString()
  };
}
