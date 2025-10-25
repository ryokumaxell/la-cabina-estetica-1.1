import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('se renderiza con mensaje por defecto', () => {
    render(<LoadingSpinner />);
    
    // Verificar que el mensaje por defecto esté presente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    
    // Verificar que el spinner existe (por su clase)
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Verificar que tiene el tamaño mediano por defecto
    expect(spinner).toHaveClass('w-8 h-8');
  });
  
  it('se renderiza con mensaje personalizado', () => {
    render(<LoadingSpinner message="Procesando datos..." />);
    
    // Verificar que el mensaje personalizado esté presente
    expect(screen.getByText('Procesando datos...')).toBeInTheDocument();
  });
  
  it('se renderiza con tamaño pequeño', () => {
    render(<LoadingSpinner size="sm" />);
    
    // Verificar que el spinner tiene el tamaño pequeño
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-4 h-4');
  });
  
  it('se renderiza con tamaño grande', () => {
    render(<LoadingSpinner size="lg" />);
    
    // Verificar que el spinner tiene el tamaño grande
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('w-12 h-12');
  });
});