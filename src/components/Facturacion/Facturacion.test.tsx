import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Facturacion } from './Facturacion';

describe('Facturacion Component', () => {
  it('renders correctly', () => {
    render(<Facturacion />);
    
    // Verificar que el título principal esté presente
    expect(screen.getByText(/Facturación/i)).toBeInTheDocument();
    
    // Verificar que exista el texto de gestión
    expect(screen.getByText(/Gestión de facturas/i)).toBeInTheDocument();
    
    // Verificar que el botón de filtrar esté presente
    const filterButton = screen.getByRole('button', { name: /Filtrar/i });
    expect(filterButton).toBeInTheDocument();
    
    // Verificar que la sección de facturas esté presente
    expect(screen.getByText(/Facturas/i)).toBeInTheDocument();
  });
});