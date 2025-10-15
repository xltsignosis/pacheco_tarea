import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra el título principal', () => {
  render(<App />);
  expect(screen.getByText(/Sistema Universitario/i)).toBeInTheDocument();
});

test('renderiza el formulario de usuarios', () => {
  render(<App />);
  expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Agregar/i })).toBeInTheDocument();
});

test('renderiza el botón de Procesar Pago', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Procesar Pago/i })).toBeInTheDocument();
});

test('renderiza todos los componentes principales de la app', () => {
  render(<App />);
  expect(screen.getByText(/Sistema Universitario/i)).toBeInTheDocument();
  expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
  expect(screen.getByText(/Servicio de pagos/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Procesar Pago/i })).toBeInTheDocument();
});


test('renderiza los componentes dependientes de fetch sin errores', async () => {
  render(<App />);
  // Espera que cargue la lista de pagos o usuarios mockeados
  expect(await screen.findByText(/Lista de Pagos/i)).toBeInTheDocument();
  expect(await screen.findByText(/Pagos agrupados por mes/i)).toBeInTheDocument();
});