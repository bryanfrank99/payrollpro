import React from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Employee, Advance } from '../types';
import { calculatePayroll, formatCurrency } from '../utils/payroll';

interface DashboardProps {
  employees: Employee[];
  advances: Advance[];
}

export const Dashboard: React.FC<DashboardProps> = ({ employees, advances }) => {
  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  const totalPayroll = activeEmployees.reduce((total, employee) => {
    const calculation = calculatePayroll(employee, advances);
    return total + calculation.netPay;
  }, 0);
  
  const totalAdvances = advances.reduce((total, advance) => total + advance.amount, 0);
  
  const employeesWithAdvances = [...new Set(advances.map(a => a.employeeId))].length;

  const stats = [
    {
      name: 'Empleados Activos',
      value: activeEmployees.length,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Nómina Total',
      value: formatCurrency(totalPayroll),
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Anticipos Totales',
      value: formatCurrency(totalAdvances),
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Empleados con Anticipos',
      value: employeesWithAdvances,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  const recentAdvances = advances
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const topEarners = activeEmployees
    .map(employee => ({
      ...employee,
      netPay: calculatePayroll(employee, advances).netPay
    }))
    .sort((a, b) => b.netPay - a.netPay)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Resumen general del sistema de nómina</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Advances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Anticipos Recientes</h3>
          </div>
          <div className="p-6">
            {recentAdvances.length > 0 ? (
              <div className="space-y-4">
                {recentAdvances.map((advance) => {
                  const employee = employees.find(emp => emp.id === advance.employeeId);
                  return (
                    <div key={advance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{employee?.name}</p>
                        <p className="text-sm text-gray-600">{advance.description}</p>
                        <p className="text-xs text-gray-500">{new Date(advance.date).toLocaleDateString('es-CO')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(advance.amount)}</p>
                        <p className="text-xs text-gray-600">por {advance.approvedBy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay anticipos registrados</p>
            )}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Mayores Salarios</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topEarners.map((employee, index) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(employee.netPay)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};