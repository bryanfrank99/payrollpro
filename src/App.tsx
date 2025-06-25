import React, { useState, useEffect } from 'react';
import { Employee, Advance, CompanySettings } from './types';
import { storage } from './utils/storage';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeDetail } from './components/EmployeeDetail';
import { PayrollView } from './components/PayrollView';
import { CompanySettingsForm } from './components/CompanySettings';

function App() {
  const { user, loading, login, logout, hasPermission } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (user) {
      setEmployees(storage.getEmployees());
      setAdvances(storage.getAdvances());
      setCompanySettings(storage.getCompanySettings());
    }
  }, [user]);

  const handleLogin = (username: string) => {
    const loggedInUser = login(username);
    if (!loggedInUser) {
      setLoginError('Usuario no encontrado');
    } else {
      setLoginError('');
    }
  };

  const handleLogout = () => {
    logout();
    setSelectedEmployee(null);
    setEditingEmployee(null);
    setShowEmployeeForm(false);
    setShowCompanySettings(false);
    setActiveView('dashboard');
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployees = [...employees];
    
    if (editingEmployee) {
      const index = newEmployees.findIndex(emp => emp.id === editingEmployee.id);
      if (index !== -1) {
        newEmployees[index] = { ...employeeData, id: editingEmployee.id };
      }
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString()
      };
      newEmployees.push(newEmployee);
    }
    
    setEmployees(newEmployees);
    storage.setEmployees(newEmployees);
    setEditingEmployee(null);
    setShowEmployeeForm(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      const newEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(newEmployees);
      storage.setEmployees(newEmployees);
      
      // Also remove related advances
      const newAdvances = advances.filter(adv => adv.employeeId !== employeeId);
      setAdvances(newAdvances);
      storage.setAdvances(newAdvances);
    }
  };

  const handleAddAdvance = (advanceData: Omit<Advance, 'id'>) => {
    const newAdvance: Advance = {
      ...advanceData,
      id: Date.now().toString()
    };
    const newAdvances = [...advances, newAdvance];
    setAdvances(newAdvances);
    storage.setAdvances(newAdvances);
  };

  const handleDeleteAdvance = (advanceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este anticipo?')) {
      const newAdvances = advances.filter(adv => adv.id !== advanceId);
      setAdvances(newAdvances);
      storage.setAdvances(newAdvances);
    }
  };

  const handleSaveCompanySettings = (settings: CompanySettings) => {
    setCompanySettings(settings);
    storage.setCompanySettings(settings);
    setShowCompanySettings(false);
  };

  const handleViewChange = (view: string) => {
    if (view === 'settings') {
      setShowCompanySettings(true);
    } else {
      setActiveView(view);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'employees':
        return (
          <EmployeeList
            employees={employees}
            onEmployeeSelect={setSelectedEmployee}
            onEmployeeEdit={(employee) => {
              setEditingEmployee(employee);
              setShowEmployeeForm(true);
            }}
            onEmployeeDelete={handleDeleteEmployee}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setShowEmployeeForm(true);
            }}
            canEdit={hasPermission('write')}
          />
        );
      case 'payroll':
        return <PayrollView employees={employees} advances={advances} companySettings={companySettings} />;
      default:
        return <Dashboard employees={employees} advances={advances} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={handleViewChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showCompanySettings && companySettings && (
        <CompanySettingsForm
          settings={companySettings}
          onSave={handleSaveCompanySettings}
          onCancel={() => setShowCompanySettings(false)}
        />
      )}

      {selectedEmployee && companySettings && (
        <EmployeeDetail
          employee={selectedEmployee}
          advances={advances}
          onClose={() => setSelectedEmployee(null)}
          onAddAdvance={handleAddAdvance}
          onDeleteAdvance={handleDeleteAdvance}
          canEdit={hasPermission('write')}
          currentUser={user.name}
          companySettings={companySettings}
        />
      )}
    </div>
  );
}

export default App;