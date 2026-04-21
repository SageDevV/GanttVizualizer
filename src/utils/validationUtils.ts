import type { ProjectFormData, ValidationError } from '../types/project';

export function isEndDateValid(dataInicio: string, dataFim: string): boolean {
  return dataFim >= dataInicio;
}

export function validateProjectForm(data: ProjectFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  const requiredFields: { field: keyof ProjectFormData; label: string }[] = [
    { field: 'nome', label: 'Nome' },
    { field: 'responsavel', label: 'Responsável' },
    { field: 'dataInicio', label: 'Data de Início' },
    { field: 'dataFim', label: 'Data de Término' },
    { field: 'descricao', label: 'Descrição' },
  ];

  for (const { field, label } of requiredFields) {
    const value = data[field];
    if (typeof value === 'string' && value.trim() === '') {
      errors.push({
        field,
        message: `${label} é obrigatório`,
      });
    }
  }

  if (data.dataInicio.trim() !== '' && data.dataFim.trim() !== '' && !isEndDateValid(data.dataInicio, data.dataFim)) {
    errors.push({
      field: 'dataFim',
      message: 'Data de Término deve ser igual ou posterior à Data de Início',
    });
  }

  return errors;
}
