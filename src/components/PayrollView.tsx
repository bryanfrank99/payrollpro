import React, { useState } from 'react';
import { Download, Search, Calendar } from 'lucide-react';
import { Employee, Advance, CompanySettings } from '../types';
import { calculatePayroll, formatCurrency } from '../utils/payroll';
import { generateInvoicePDF } from '../utils/pdf';

interface PayrollViewProps {
  employees: Employee[];
  advances: Advance[];
  companySettings: CompanySettings | null;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ employees, advances, companySettings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'netPay'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  
  const payrollData = activeEmployees.map(employee => ({
    employee,
    calculation: calculatePayroll(employee, advances)
  }));

  const filteredData = payrollData
    .filter(({ employee }) => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.employee.name;
          bValue = b.employee.name;
          break;
        case 'position':
          aValue = a.employee.position;
          bValue = b.employee.position;
          break;
        case 'netPay':
          aValue = a.calculation.netPay;
          bValue = b.calculation.netPay;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  const totalPayroll = filteredData.reduce((sum, { calculation }) => sum + calculation.netPay, 0);
  const totalAdvances = filteredData.reduce((sum, { calculation }) => sum + calculation.totalAdvances, 0);

  const handleSort = (field: 'name' | 'position' | 'netPay') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const generateAllInvoices = () => {
    if (!companySettings) return;
    
    filteredData.forEach(({ employee, calculation }) => {
      setTimeout(() => {
        generateInvoicePDF(employee, calculation, companySettings);
      }, 100);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nómina</h2>
          <p className="text-gray-600">Resumo de pagamentos e cálculos salariais</p>
        </div>
        <button
          onClick={generateAllInvoices}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descarregar Todos os Recibos
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Funcionários Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nómina Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Adiantamentos</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAdvances)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Procurar funcionários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'name' | 'position' | 'netPay');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="position-asc">Cargo (A-Z)</option>
            <option value="position-desc">Cargo (Z-A)</option>
            <option value="netPay-desc">Salário (Maior-Menor)</option>
            <option value="netPay-asc">Salário (Menor-Maior)</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salário Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subsídios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  H. Extras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adiantamentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Líquido a Pagar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(({ employee, calculation }) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(calculation.baseSalary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(calculation.transportAllowance + calculation.foodAllowance)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div>{formatCurrency(calculation.overtimePayment)}</div>
                      <div className="text-xs text-gray-500">{employee.overtimeHours} hrs</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600">
                    {formatCurrency(calculation.totalAdvances)}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600">
                    <div>
                      <div>{formatCurrency(calculation.deductions)}</div>
                      {employee.absences > 0 && (
                        <div className="text-xs text-gray-500">{employee.absences} faltas</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(calculation.netPay)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => companySettings && generateInvoicePDF(employee, calculation, companySettings)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Não foram encontrados funcionários</h3>
            <p className="text-gray-600">Tente com outros termos de pesquisa</p>
          </div>
        )}
      </div>
    </div>
  );
};