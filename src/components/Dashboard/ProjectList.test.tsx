import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProjectList from './ProjectList';
import type { Project } from '../../types/project';

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'test-id-1',
    nome: 'Projeto Alpha',
    responsavel: 'João Silva',
    dataInicio: '2024-01-15',
    dataFim: '2024-06-30',
    funcionalidades: ['Login', 'Dashboard'],
    descricao: 'Descrição do projeto',
    ...overrides,
  };
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProjectList', () => {
  it('renders empty state message when projects list is empty', () => {
    renderWithRouter(<ProjectList projects={[]} />);
    expect(screen.getByText('Nenhum projeto cadastrado.')).toBeInTheDocument();
  });

  it('does not render empty state message when projects exist', () => {
    renderWithRouter(<ProjectList projects={[makeProject()]} />);
    expect(screen.queryByText('Nenhum projeto cadastrado.')).not.toBeInTheDocument();
  });

  it('renders project name and responsável for each project', () => {
    const projects = [
      makeProject({ id: '1', nome: 'Projeto A', responsavel: 'Maria' }),
      makeProject({ id: '2', nome: 'Projeto B', responsavel: 'Carlos' }),
    ];

    renderWithRouter(<ProjectList projects={projects} />);

    expect(screen.getByText('Projeto A')).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByText('Projeto B')).toBeInTheDocument();
    expect(screen.getByText(/Carlos/)).toBeInTheDocument();
  });

  it('renders a "Visualizar Timeline" button for each project', () => {
    const projects = [
      makeProject({ id: '1' }),
      makeProject({ id: '2' }),
    ];

    renderWithRouter(<ProjectList projects={projects} />);

    const buttons = screen.getAllByRole('button', { name: 'Visualizar Timeline' });
    expect(buttons).toHaveLength(2);
  });

  it('renders one card per project', () => {
    const projects = [
      makeProject({ id: '1', nome: 'P1' }),
      makeProject({ id: '2', nome: 'P2' }),
      makeProject({ id: '3', nome: 'P3' }),
    ];

    renderWithRouter(<ProjectList projects={projects} />);

    const buttons = screen.getAllByRole('button', { name: 'Visualizar Timeline' });
    expect(buttons).toHaveLength(3);
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('P2')).toBeInTheDocument();
    expect(screen.getByText('P3')).toBeInTheDocument();
  });
});
