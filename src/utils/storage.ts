import { Employee, Advance, User, CompanySettings } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'payroll_employees',
  ADVANCES: 'payroll_advances',
  CURRENT_USER: 'payroll_current_user',
  USERS: 'payroll_users',
  COMPANY_SETTINGS: 'payroll_company_settings'
};

// Initial demo data
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    name: 'Administrador Sistema'
  },
  {
    id: '2',
    username: 'hr',
    email: 'hr@company.com',
    role: 'hr',
    name: 'Recursos Humanos'
  },
  {
    id: '3',
    username: 'viewer',
    email: 'viewer@company.com',
    role: 'viewer',
    name: 'Solo Lectura'
  }
];

const DEMO_COMPANY_SETTINGS: CompanySettings = {
  id: '1',
  name: 'TALO E CHURRASCARIA COSTA',
  address: 'Av. Pedro de Castro Van Dunem-Loy, 171, Palanca-Luanda',
  nif: '5417123456',
  phone: '+244 923 456 789',
  email: 'info@taloechurrascaria.ao',
  city: 'Luanda',
  country: 'Angola'
};

const DEMO_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'João Carlos Rodrigues',
    position: 'Desenvolvedor Senior',
    baseSalary: 450000,
    transportAllowance: 25000,
    foodAllowance: 20000,
    overtimeHours: 8,
    absences: 0,
    hireDate: '2023-01-15',
    email: 'joao.carlos@company.com',
    phone: '+244 923 123 456',
    status: 'active'
  },
  {
    id: '2',
    name: 'Maria Alejandra Gomes',
    position: 'Analista de Dados',
    baseSalary: 320000,
    transportAllowance: 25000,
    foodAllowance: 20000,
    overtimeHours: 4,
    absences: 1,
    hireDate: '2023-03-10',
    email: 'maria.gomes@company.com',
    phone: '+244 924 987 654',
    status: 'active'
  },
  {
    id: '3',
    name: 'Carlos Eduardo Martinez',
    position: 'Gerente de Projetos',
    baseSalary: 550000,
    transportAllowance: 25000,
    foodAllowance: 20000,
    overtimeHours: 12,
    absences: 0,
    hireDate: '2022-11-05',
    email: 'carlos.martinez@company.com',
    phone: '+244 925 456 789',
    status: 'active'
  }
];

const DEMO_ADVANCES: Advance[] = [
  {
    id: '1',
    employeeId: '1',
    amount: 50000,
    date: '2024-01-15',
    description: 'Anticipo para gastos médicos',
    approvedBy: 'Admin'
  },
  {
    id: '2',
    employeeId: '2',
    amount: 30000,
    date: '2024-01-10',
    description: 'Anticipo quinzenal',
    approvedBy: 'HR'
  }
];

export const storage = {
  // Initialize demo data if not exists
  initializeDemoData: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEMO_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADVANCES)) {
      localStorage.setItem(STORAGE_KEYS.ADVANCES, JSON.stringify(DEMO_ADVANCES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPANY_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.COMPANY_SETTINGS, JSON.stringify(DEMO_COMPANY_SETTINGS));
    }
  },

  // Employees
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  setEmployees: (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  // Advances
  getAdvances: (): Advance[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ADVANCES);
    return data ? JSON.parse(data) : [];
  },

  setAdvances: (advances: Advance[]) => {
    localStorage.setItem(STORAGE_KEYS.ADVANCES, JSON.stringify(advances));
  },

  // Current User
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  // Company Settings
  getCompanySettings: (): CompanySettings => {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY_SETTINGS);
    return data ? JSON.parse(data) : DEMO_COMPANY_SETTINGS;
  },

  setCompanySettings: (settings: CompanySettings) => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_SETTINGS, JSON.stringify(settings));
  }
};