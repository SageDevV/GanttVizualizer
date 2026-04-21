import { useState } from 'react';
import type { ProjectFormData, ValidationError } from '../../types/project';
import { validateProjectForm } from '../../utils/validationUtils';
import FeatureFieldList from './FeatureFieldList';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

export default function ProjectForm({ onClose, onSubmit }: ProjectFormProps) {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [funcionalidades, setFuncionalidades] = useState<string[]>([]);
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const getFieldError = (field: string): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: ProjectFormData = {
      nome,
      responsavel,
      dataInicio,
      dataFim,
      funcionalidades,
      descricao,
    };

    const validationErrors = validateProjectForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    onSubmit(formData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nomeError = getFieldError('nome');
  const responsavelError = getFieldError('responsavel');
  const dataInicioError = getFieldError('dataInicio');
  const dataFimError = getFieldError('dataFim');
  const descricaoError = getFieldError('descricao');

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Novo Projeto"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Novo Projeto</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="nome">
              Nome<span className={styles.required}>*</span>
            </label>
            <input
              id="nome"
              className={`${styles.input}${nomeError ? ` ${styles.inputError}` : ''}`}
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErrors((prev) => prev.filter((err) => err.field !== 'nome'));
              }}
              placeholder="Nome do projeto"
              aria-invalid={!!nomeError}
              aria-describedby={nomeError ? 'nome-error' : undefined}
            />
            {nomeError && (
              <span id="nome-error" className={styles.error} role="alert">
                {nomeError}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="responsavel">
              Responsável<span className={styles.required}>*</span>
            </label>
            <input
              id="responsavel"
              className={`${styles.input}${responsavelError ? ` ${styles.inputError}` : ''}`}
              type="text"
              value={responsavel}
              onChange={(e) => {
                setResponsavel(e.target.value);
                setErrors((prev) => prev.filter((err) => err.field !== 'responsavel'));
              }}
              placeholder="Nome do responsável"
              aria-invalid={!!responsavelError}
              aria-describedby={responsavelError ? 'responsavel-error' : undefined}
            />
            {responsavelError && (
              <span id="responsavel-error" className={styles.error} role="alert">
                {responsavelError}
              </span>
            )}
          </div>

          <div className={styles.dateRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dataInicio">
                Data de Início<span className={styles.required}>*</span>
              </label>
              <input
                id="dataInicio"
                className={`${styles.input}${dataInicioError ? ` ${styles.inputError}` : ''}`}
                type="date"
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value);
                  setErrors((prev) => prev.filter((err) => err.field !== 'dataInicio'));
                }}
                aria-invalid={!!dataInicioError}
                aria-describedby={dataInicioError ? 'dataInicio-error' : undefined}
              />
              {dataInicioError && (
                <span id="dataInicio-error" className={styles.error} role="alert">
                  {dataInicioError}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="dataFim">
                Data de Término<span className={styles.required}>*</span>
              </label>
              <input
                id="dataFim"
                className={`${styles.input}${dataFimError ? ` ${styles.inputError}` : ''}`}
                type="date"
                value={dataFim}
                onChange={(e) => {
                  setDataFim(e.target.value);
                  setErrors((prev) => prev.filter((err) => err.field !== 'dataFim'));
                }}
                aria-invalid={!!dataFimError}
                aria-describedby={dataFimError ? 'dataFim-error' : undefined}
              />
              {dataFimError && (
                <span id="dataFim-error" className={styles.error} role="alert">
                  {dataFimError}
                </span>
              )}
            </div>
          </div>

          <FeatureFieldList
            funcionalidades={funcionalidades}
            onChange={setFuncionalidades}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="descricao">
              Descrição<span className={styles.required}>*</span>
            </label>
            <textarea
              id="descricao"
              className={`${styles.textarea}${descricaoError ? ` ${styles.inputError}` : ''}`}
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                setErrors((prev) => prev.filter((err) => err.field !== 'descricao'));
              }}
              placeholder="Descrição do projeto"
              aria-invalid={!!descricaoError}
              aria-describedby={descricaoError ? 'descricao-error' : undefined}
            />
            {descricaoError && (
              <span id="descricao-error" className={styles.error} role="alert">
                {descricaoError}
              </span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button className={styles.submitButton} type="submit">
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
