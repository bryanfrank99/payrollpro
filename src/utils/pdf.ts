import jsPDF from 'jspdf';
import { Employee, PayrollCalculation, CompanySettings } from '../types';
import { formatCurrency } from './payroll';

const drawPayslip = (doc: jsPDF, employee: Employee, calculation: PayrollCalculation, companySettings: CompanySettings) => {
  // Configuración para A4
  const marginX = 15;
  const width = 180;
  const startY = 20;
  let cursorY = startY;

  // Marco principal
  doc.setLineWidth(0.7);
  doc.rect(marginX, startY, width, 140);

  // Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Recibo de Pagamento', marginX + 2, cursorY + 8);

  // Datos empresa
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(companySettings.name, marginX + 2, cursorY + 16);
  doc.text(companySettings.address, marginX + 2, cursorY + 22);
  doc.text(`NIF: ${companySettings.nif}`, marginX + 2, cursorY + 28);

  // Mes de referencia
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('pt-AO', { year: 'numeric', month: '2-digit' });
  doc.setFont('helvetica', 'bold');
  doc.text('Mês de Referência:', marginX + width - 60, cursorY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(monthYear, marginX + width - 20, cursorY + 16, { align: 'right' });

  // Tabla de empleado
  doc.setLineWidth(0.3);
  doc.rect(marginX + 2, cursorY + 32, width - 4, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Funcionário:', marginX + 6, cursorY + 39);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.name, marginX + 30, cursorY + 39);
  doc.setFont('helvetica', 'bold');
  doc.text('Cargo:', marginX + 6, cursorY + 45);
  doc.setFont('helvetica', 'normal');
  doc.text(employee.position, marginX + 30, cursorY + 45);

  // Tabla de conceptos
  const tableY = cursorY + 48;
  const tableHeight = 44;
  doc.setLineWidth(0.3);
  doc.rect(marginX + 2, tableY, width - 4, tableHeight);

  // Encabezados de la tabla
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Descrição', marginX + 6, tableY + 7);
  doc.text('Vencimentos', marginX + 80, tableY + 7);
  doc.text('Descontos', marginX + 130, tableY + 7);

  // Filas de conceptos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let rowY = tableY + 14;
  const rowStep = 7;

  // Salario base
  doc.text('Salário Base', marginX + 6, rowY);
  doc.text(formatCurrency(calculation.baseSalary).replace('AOA', 'Kz'), marginX + 80, rowY);
  rowY += rowStep;

  if (calculation.transportAllowance > 0) {
    doc.text('Subsídio de Transporte', marginX + 6, rowY);
    doc.text(formatCurrency(calculation.transportAllowance).replace('AOA', 'Kz'), marginX + 80, rowY);
    rowY += rowStep;
  }
  if (calculation.foodAllowance > 0) {
    doc.text('Subsídio de Alimentação', marginX + 6, rowY);
    doc.text(formatCurrency(calculation.foodAllowance).replace('AOA', 'Kz'), marginX + 80, rowY);
    rowY += rowStep;
  }
  if (calculation.overtimePayment > 0) {
    doc.text('Horas Extras', marginX + 6, rowY);
    doc.text(formatCurrency(calculation.overtimePayment).replace('AOA', 'Kz'), marginX + 80, rowY);
    rowY += rowStep;
  }
  if (calculation.deductions > 0) {
    doc.text('Faltas', marginX + 6, rowY);
    doc.text(formatCurrency(0), marginX + 80, rowY);
    doc.text(`-${formatCurrency(calculation.deductions).replace('AOA', 'Kz')}`, marginX + 130, rowY);
    rowY += rowStep;
  }
  if (calculation.totalAdvances > 0) {
    doc.text('Adiantamentos', marginX + 6, rowY);
    doc.text(formatCurrency(0), marginX + 80, rowY);
    doc.text(`-${formatCurrency(calculation.totalAdvances).replace('AOA', 'Kz')}`, marginX + 130, rowY);
    rowY += rowStep;
  }

  // Totales
  const totalY = tableY + tableHeight + 3;
  doc.setLineWidth(0.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.rect(marginX + 2, totalY, 60, 10);
  doc.text('Total de Vencimentos', marginX + 6, totalY + 7);
  doc.text(formatCurrency(calculation.grossPay).replace('AOA', 'Kz'), marginX + 55, totalY + 7, { align: 'right' });
  doc.rect(marginX + 2 + 60, totalY, 60, 10);
  doc.text('Total de Descontos', marginX + 66, totalY + 7);
  doc.text(formatCurrency((calculation.deductions + calculation.totalAdvances)).replace('AOA', 'Kz'), marginX + 115, totalY + 7, { align: 'right' });

  // Valor Líquido y Salario Base
  const valorY = totalY + 15;
  doc.setFontSize(11);
  doc.text('Valor Líquido', marginX + 2, valorY);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(calculation.netPay).replace('AOA', 'Kz'), marginX + 50, valorY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Salário Base', marginX + 66, valorY);
  doc.text(formatCurrency(calculation.baseSalary).replace('AOA', 'Kz'), marginX + 115, valorY, { align: 'right' });

  // Área de firma con fondo amarillo claro
  const firmaY = valorY + 10;
  doc.setFillColor(255, 245, 200);
  doc.rect(marginX + 2, firmaY, width - 4, 18, 'F');
  doc.setLineWidth(0.3);
  doc.rect(marginX + 2, firmaY, width - 4, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('DECLARO TER RECEBIDO A IMPORTÂNCIA', marginX + 6, firmaY + 6);
  doc.text('LÍQUIDA DISCRIMINADA NESTE RECIBO', marginX + 6, firmaY + 11);
  doc.text('DATA', marginX + 70, firmaY + 6);
  doc.text('___/___/______', marginX + 70, firmaY + 11);
  doc.text('ASSINATURA DO EMPREGADO', marginX + 120, firmaY + 6);
  doc.text('_________________________', marginX + 120, firmaY + 11);
};

export const generateInvoicePDF = (employee: Employee, calculation: PayrollCalculation, companySettings: CompanySettings) => {
  const doc = new jsPDF({ format: 'a4' });
  drawPayslip(doc, employee, calculation, companySettings);
  const fileName = `recibo_pagamento_${employee.name.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-AO', { year: 'numeric', month: 'long' }).replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};