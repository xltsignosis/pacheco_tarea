import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';

describe('UserList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el contenedor de usuarios', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(<UserList />);
    
    await waitFor(() => {
      const lista = screen.getByRole('list');
      expect(lista).toBeInTheDocument();
    });
  });

  test('muestra elementos cuando hay usuarios', async () => {
    const users = [
      { id: 1, nombre: 'Jonathan' },
      { id: 2, nombre: 'Pacheco' },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => users
    });

    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('Jonathan')).toBeInTheDocument();
      expect(screen.getByText('Pacheco')).toBeInTheDocument();
    });
  });

  test('renderiza correctamente cuando no hay usuarios', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(<UserList />);

    await waitFor(() => {
      const lista = screen.getByRole('list');
      const items = screen.queryAllByRole('listitem');
      expect(lista).toBeInTheDocument();
      expect(items.length).toBe(0);
    });
  });
});



