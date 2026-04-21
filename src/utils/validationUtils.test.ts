import { describe, it, expect } from 'vitest';
import { validateProjectForm, isEndDateValid } from './validationUtils';
import type { ProjectFormData } from '../types/project';

const validFormData: ProjectFormData = {
  nome: 'Projeto Alpha',
  responsavel: 'João Silva',
  dataInicio: '2024-01-15',
  dataFim: '2024-06-30',
  funcionalidades: ['Login', 'Dashboard'],
  descricao: 'Sistema de gestão interna',
};

describe('isEndDateValid', () => {
  it('returns true when dataFim is after dataInicio', () => {
    expect(isEndDateValid('2024-01-01', '2024-06-30')).toBe(true);
  });

  it('returns true when dataFim equals dataInicio', () => {
    expect(isEndDateValid('2024-03-15', '2024-03-15')).toBe(true);
  });

  it('returns false when dataFim is before dataInicio', () => {
    expect(isEndDateValid('2024-06-30', '2024-01-01')).toBe(false);
  });
});

describe('validateProjectForm', () => {
  it('returns empty array when all fields are valid', () => {
    expect(validateProjectForm(validFormData)).toEqual([]);
  });

  it('returns error for empty nome', () => {
    const data = { ...validFormData, nome: '' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({ field: 'nome', message: 'Nome é obrigatório' });
  });

  it('returns error for whitespace-only responsavel', () => {
    const data = { ...validFormData, responsavel: '   ' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({ field: 'responsavel', message: 'Responsável é obrigatório' });
  });

  it('returns error for empty dataInicio', () => {
    const data = { ...validFormData, dataInicio: '' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({ field: 'dataInicio', message: 'Data de Início é obrigatório' });
  });

  it('returns error for empty dataFim', () => {
    const data = { ...validFormData, dataFim: '' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({ field: 'dataFim', message: 'Data de Término é obrigatório' });
  });

  it('returns error for empty descricao', () => {
    const data = { ...validFormData, descricao: '' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({ field: 'descricao', message: 'Descrição é obrigatório' });
  });

  it('returns multiple errors when multiple fields are empty', () => {
    const data = { ...validFormData, nome: '', responsavel: '', descricao: '  ' };
    const errors = validateProjectForm(data);
    expect(errors).toHaveLength(3);
    expect(errors.map(e => e.field)).toEqual(['nome', 'responsavel', 'descricao']);
  });

  it('returns date validation error when dataFim is before dataInicio', () => {
    const data = { ...validFormData, dataInicio: '2024-06-30', dataFim: '2024-01-01' };
    const errors = validateProjectForm(data);
    expect(errors).toContainEqual({
      field: 'dataFim',
      message: 'Data de Término deve ser igual ou posterior à Data de Início',
    });
  });

  it('does not return date validation error when dates are empty', () => {
    const data = { ...validFormData, dataInicio: '', dataFim: '' };
    const errors = validateProjectForm(data);
    const dateError = errors.find(e => e.message.includes('posterior'));
    expect(dateError).toBeUndefined();
  });

  it('returns both required field errors and date error when applicable', () => {
    const data = { ...validFormData, nome: '', dataInicio: '2024-06-30', dataFim: '2024-01-01' };
    const errors = validateProjectForm(data);
    expect(errors.some(e => e.field === 'nome')).toBe(true);
    expect(errors.some(e => e.field === 'dataFim' && e.message.includes('posterior'))).toBe(true);
  });
});
