import jsPDF from 'jspdf';
import { Employee, PayrollCalculation, CompanySettings } from '../types';
import { formatCurrency } from './payroll';

const drawPayslip = (doc: jsPDF, employee: Employee, calculation: PayrollCalculation, companySettings: CompanySettings, yOffset: number = 0) => {
  const startY = 20 + yOffset;
  
  // Main border
  doc.setLineWidth(0.5);
  doc.rect(10, startY, 190, 120);
  
  // Header section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Recibo de Pagamento', 12, startY + 8);
  
  // Company info section
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(companySettings.name, 12, startY + 15);
  doc.text(`${companySettings.address}`, 12, startY + 20);
  doc.text(`CNP: ${companySettings.nif}`, 12, startY + 25);
  
  // Reference month
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('pt-AO', { 
    year: 'numeric', 
    month: 'long' 
  });
  doc.setFont('helvetica', 'bold');
  doc.text('Mês de Referência', 140, startY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(monthYear, 170, startY + 15);
  
  // Employee info table header
  doc.setLineWidth(0.3);
  doc.rect(12, startY + 30, 176, 12);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  
  // Table headers
  doc.text('Matrícula', 14, startY + 38);
  doc.text('Nome do Funcionário', 35, startY + 38);
  doc.text('INSS', 90, startY + 38);
  doc.text('Cargo', 110, startY + 38);
  doc.text('Empresa', 140, startY + 38);
  doc.text('Local', 155, startY + 38);
  doc.text('Depto', 170, startY + 38);
  doc.text('Sector', 180, startY + 38);
  doc.text('Secção/Folha', 185, startY + 38);
  
  // Employee data row
  doc.rect(12, startY + 42, 176, 8);
  doc.setFont('helvetica', 'normal');
  doc.text('10', 14, startY + 48);
  doc.text(employee.name.substring(0, 20), 35, startY + 48);
  doc.text('-', 90, startY + 48);
  doc.text(employee.position.substring(0, 15), 110, startY + 48);
  doc.text('1', 140, startY + 48);
  doc.text('PALANCA', 155, startY + 48);
  doc.text('LIMPEZA', 170, startY + 48);
  doc.text('-', 180, startY + 48);
  doc.text('may-25', 185, startY + 48);
  
  // Payment details table
  doc.rect(12, startY + 55, 176, 35);
  
  // Table headers
  doc.setFont('helvetica', 'bold');
  doc.text('Código', 14, startY + 62);
  doc.text('Descrição', 35, startY + 62);
  doc.text('Referência', 90, startY + 62);
  doc.text('Vencimentos', 120, startY + 62);
  doc.text('Descontos', 160, startY + 62);
  
  // Payment rows
  doc.setFont('helvetica', 'normal');
  let rowY = startY + 68;
  
  // Salary
  doc.text('1', 14, rowY);
  doc.text('SALÁRIO', 35, rowY);
  doc.text(formatCurrency(calculation.baseSalary).replace('AOA', 'Kz'), 120, rowY);
  doc.text(formatCurrency(5000).replace('AOA', 'Kz'), 160, rowY);
  rowY += 5;
  
  // INSS
  doc.text('11', 14, rowY);
  doc.text('INSS SOBRE SALÁRIO', 35, rowY);
  doc.text('0,00 Kz', 120, rowY);
  doc.text('0,00 Kz', 160, rowY);
  rowY += 5;
  
  // Absences
  if (employee.absences > 0) {
    doc.text('19', 14, rowY);
    doc.text('FALTAS', 35, rowY);
    doc.text('0,00 Kz', 120, rowY);
    doc.text(formatCurrency(calculation.deductions).replace('AOA', 'Kz'), 160, rowY);
    rowY += 5;
  }
  
  // Irregularities
  doc.text('33', 14, rowY);
  doc.text('DESC IRREGULARIDADES', 35, rowY);
  doc.text('0,00 Kz', 120, rowY);
  doc.text('0,00 Kz', 160, rowY);
  rowY += 5;
  
  // Salary advance
  if (calculation.totalAdvances > 0) {
    doc.text('34', 14, rowY);
    doc.text('ADTO SALARIAL', 35, rowY);
    doc.text(formatCurrency(calculation.totalAdvances).replace('AOA', 'Kz'), 120, rowY);
    doc.text('0,00 Kz', 160, rowY);
    rowY += 5;
  }
  
  // Overtime
  if (calculation.overtimePayment > 0) {
    doc.text('', 14, rowY);
    doc.text('ADICIONAIS DIAS/EXTRAS', 35, rowY);
    doc.text('0,00 Kz', 120, rowY);
    doc.text('0,00 Kz', 160, rowY);
    rowY += 5;
  }
  
  // 13th salary
  doc.text('', 14, rowY);
  doc.text('SUB 13º SALÁRIO', 35, rowY);
  doc.text('0,00 Kz', 120, rowY);
  doc.text('0,00 Kz', 160, rowY);
  
  // Totals section
  doc.setLineWidth(0.5);
  doc.rect(12, startY + 95, 176, 20);
  
  // Total earnings and deductions
  doc.setFont('helvetica', 'bold');
  doc.text('Total de Vencimentos', 80, startY + 102);
  doc.text('Total de Descontos', 140, startY + 102);
  doc.text(formatCurrency(calculation.grossPay).replace('AOA', 'Kz'), 80, startY + 108);
  doc.text(formatCurrency(calculation.totalAdvances + calculation.deductions + 5000).replace('AOA', 'Kz'), 140, startY + 108);
  
  // Net pay
  doc.setFontSize(10);
  doc.text('Valor Líquido', 160, startY + 102);
  doc.text(formatCurrency(calculation.netPay - 5000).replace('AOA', 'Kz'), 160, startY + 108);
  
  // Base salary
  doc.setFontSize(8);
  doc.text('Salário Base', 160, startY + 115);
  doc.text(formatCurrency(calculation.baseSalary).replace('AOA', 'Kz'), 160, startY + 120);
  
  // Signature section
  doc.rect(12, startY + 120, 176, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DECLARO TER RECEBIDO A IMPORTÂNCIA', 14, startY + 128);
  doc.text('LÍQUIDA DISCRIMINADA NESTE RECIBO', 14, startY + 132);
  
  doc.text('DATA', 80, startY + 128);
  doc.text('___/___/______', 80, startY + 132);
  
  doc.text('ASSINATURA DO EMPREGADO', 140, startY + 128);
  doc.text('_________________________', 140, startY + 132);
};

export const generateInvoicePDF = (employee: Employee, calculation: PayrollCalculation, companySettings: CompanySettings) => {
  const doc = new jsPDF();
  
  // First copy
  drawPayslip(doc, employee, calculation, companySettings, 0);
  
  // Second copy (offset by 140 units)
  drawPayslip(doc, employee, calculation, companySettings, 140);
  
  // Save the PDF
  const fileName = `recibo_pagamento_${employee.name.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-AO', { year: 'numeric', month: 'long' }).replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};