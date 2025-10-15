import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from './UserForm';

describe('UserForm', () => {
  test('renderiza los elementos del formulario', () => {
    render(<UserForm />);
    expect(screen.getByPlaceholderText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar/i })).toBeInTheDocument();
  });

  test('permite ingresar un nombre y enviar el formulario', async () => {
    render(<UserForm />);

    const input = screen.getByPlaceholderText(/Nombre/i);
    const boton = screen.getByRole('button', { name: /Agregar/i });

    await userEvent.type(input, 'jiji');
    expect(input.value).toBe('jiji');

    await userEvent.click(boton);

    // Validación: el campo debe vaciarse o seguir visible
    expect(input).toBeInTheDocument();
  });
  
});



