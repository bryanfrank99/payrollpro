export interface Employee {
  id: string;
  name: string;
  position: string;
  baseSalary: number;
  transportAllowance: number;
  foodAllowance: number;
  overtimeHours: number;
  absences: number;
  hireDate: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Advance {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  description: string;
  approvedBy: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'hr' | 'viewer';
  name: string;
}

export interface PayrollCalculation {
  employeeId: string;
  baseSalary: number;
  transportAllowance: number;
  foodAllowance: number;
  overtimePayment: number;
  totalAdvances: number;
  deductions: number;
  grossPay: number;
  netPay: number;
}

export interface CompanySettings {
  id: string;
  name: string;
  address: string;
  nif: string;
  phone: string;
  email: string;
  city: string;
  country: string;
}