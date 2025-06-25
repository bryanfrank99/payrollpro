import { Employee, Advance, PayrollCalculation } from '../types';

export const calculatePayroll = (employee: Employee, advances: Advance[]): PayrollCalculation => {
  const overtimeRate = 1.5;
  const hourlyRate = employee.baseSalary / 240; // Assuming 240 working hours per month
  
  const overtimePayment = employee.overtimeHours * hourlyRate * overtimeRate;
  const totalAdvances = advances
    .filter(advance => advance.employeeId === employee.id)
    .reduce((sum, advance) => sum + advance.amount, 0);
  
  // Deductions for absences (assuming daily salary = monthly salary / 30)
  const dailySalary = employee.baseSalary / 30;
  const absenceDeduction = employee.absences * dailySalary;
  
  const grossPay = employee.baseSalary + employee.transportAllowance + 
                   employee.foodAllowance + overtimePayment;
  
  const totalDeductions = totalAdvances + absenceDeduction;
  const netPay = grossPay - totalDeductions;

  return {
    employeeId: employee.id,
    baseSalary: employee.baseSalary,
    transportAllowance: employee.transportAllowance,
    foodAllowance: employee.foodAllowance,
    overtimePayment,
    totalAdvances,
    deductions: absenceDeduction,
    grossPay,
    netPay
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-AO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};