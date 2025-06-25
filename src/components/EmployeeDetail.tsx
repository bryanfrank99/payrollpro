import React, { useState } from 'react';
import { X, Plus, Download, Edit, Trash2, DollarSign, Calendar, User, Mail, Phone } from 'lucide-react';
import { Employee, Advance, CompanySettings } from '../types';
import { calculatePayroll, formatCurrency, formatDate } from '../utils/payroll';
import { generateInvoicePDF } from '../utils/pdf';

interface EmployeeDetailProps {
  employee: Employee;
  advances: Advance[];
  onClose: () => void;
  onAddAdvance: (advance: Omit<Advance, 'id'>) => void;
  onDeleteAdvance: (advanceId: string) => void;
  canEdit: boolean;
  currentUser: string;
  companySettings: CompanySettings;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  advances,
  onClose,
  onAddAdvance,
  onDeleteAdvance,
  canEdit,
  currentUser,
  companySettings
}) => {
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [advanceForm, setAdvanceForm] = useState({
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const employeeAdvances = advances.filter(advance => advance.employeeId === employee.id);
  const calculation = calculatePayroll(employee, advances);

  const handleAddAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (advanceForm.amount > 0 && advanceForm.description.trim()) {
      onAddAdvance({
        employeeId: employee.id,
        amount: advanceForm.amount,
        description: advanceForm.description,
        date: advanceForm.date,
        approvedBy: currentUser
      });
      setAdvanceForm({
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAdvanceForm(false);
    }
  };

  const handleGenerateInvoice = () => {
    generateInvoicePDF(employee, calculation, companySettings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-semibold text-lg">
                {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateInvoice}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Gerar Recibo
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Informação Pessoal</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${employee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data admissão:</span>
                  <span className="text-gray-900">{formatDate(employee.hireDate)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Contacto</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="text-gray-900 break-all">{employee.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Telefone:</span>
                  <p className="text-gray-900">{employee.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Assiduidade</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Horas extras:</span>
                  <span className="text-gray-900">{employee.overtimeHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Faltas:</span>
                  <span className="text-gray-900">{employee.absences} dias</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Calculation */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Cálculo de Nómina
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Salário Base</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(calculation.baseSalary)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Subsídios</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(calculation.transportAllowance + calculation.foodAllowance)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Horas Extras</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(calculation.overtimePayment)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Bruto</p>
                <p className="text-xl font-semibold text-green-600">{formatCurrency(calculation.grossPay)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Adiantamentos</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(calculation.totalAdvances)}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Descontos</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(calculation.deductions)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600">Líquido a Pagar</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculation.netPay)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advances */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Adiantamentos</h3>
              {canEdit && (
                <button
                  onClick={() => setShowAdvanceForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Adiantamento
                </button>
              )}
            </div>

            {showAdvanceForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <form onSubmit={handleAddAdvance} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      value={advanceForm.amount}
                      onChange={(e) => setAdvanceForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="1"
                      step="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={advanceForm.date}
                      onChange={(e) => setAdvanceForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={advanceForm.description}
                      onChange={(e) => setAdvanceForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Motivo do adiantamento"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdvanceForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {employeeAdvances.length > 0 ? (
                employeeAdvances.map((advance) => (
                  <div key={advance.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{advance.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Data: {formatDate(advance.date)}</span>
                        <span>Aprovado por: {advance.approvedBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(advance.amount)}</span>
                      {canEdit && (
                        <button
                          onClick={() => onDeleteAdvance(advance.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Não há adiantamentos registados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};