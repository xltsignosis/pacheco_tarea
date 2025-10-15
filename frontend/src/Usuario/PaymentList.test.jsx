import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentList from "./PaymentList";

describe("PaymentList - cobertura extendida real", () => {
  const pagosMock = [
    {
      id: 1,
      usuarioId: 101,
      monto: 330,
      metodoPago: "tarjeta_credito",
      descripcion: "Examen remedial",
      estado: "pendiente",
      fecha: "2024-10-08T10:30:00Z",
    },
  ];

  const reportesMock = [{ mes: "Octubre", total_pagos: 1, total_monto: 330 }];

  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (url.includes("3002/payments") && !options) {
        return Promise.resolve({ ok: true, json: async () => pagosMock });
      }
      if (url.includes("3000/api/reportes/por-mes")) {
        return Promise.resolve({ ok: true, json: async () => reportesMock });
      }
      if (url.includes("3002/payments/") && options?.method === "PUT") {
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
      }
      return Promise.reject(new Error("URL inesperada"));
    });
  });

  afterEach(() => jest.resetAllMocks());

  // Caso 1: sin pagos ni reportes
  test("renderiza correctamente sin pagos", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes("3002/payments")) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      if (url.includes("3000/api/reportes/por-mes")) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
    });

    await act(async () => {
      render(<PaymentList />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Lista de Pagos/i)).toBeInTheDocument();
      expect(screen.getByText(/No hay pagos registrados/i)).toBeInTheDocument();
      expect(screen.getByText(/Pagos agrupados por mes/i)).toBeInTheDocument();
      expect(screen.getByText(/No hay datos de reportes por mes/i)).toBeInTheDocument();
    });
  });

  // Caso 2: carga correcta de datos mockeados
  test("carga y muestra pagos y reportes desde los mocks", async () => {
    await act(async () => {
      render(<PaymentList />);
    });

    await waitFor(() => {
      expect(screen.getByText(/tarjeta_credito/i)).toBeInTheDocument();
      expect(screen.getByText(/Examen remedial/i)).toBeInTheDocument();
    });

    // El monto puede aparecer 2 veces (lista y tabla)
    const montos = screen.getAllByText(/\$330\.00/i);
    expect(montos.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/Pagos agrupados por mes/i)).toBeInTheDocument();
    expect(screen.getByText(/Octubre/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  // Caso 3: cambio de estado del pago
  test("permite cambiar el estado del pago", async () => {
    await act(async () => {
      render(<PaymentList />);
    });

    const select = await screen.findByRole("combobox");
    await userEvent.selectOptions(select, "exitoso");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    const lastCall = global.fetch.mock.calls[2];
    expect(lastCall[0]).toContain("http://localhost:3002/payments/");
    expect(lastCall[1].method).toBe("PUT");
    expect(lastCall[1].body).toContain("exitoso");
  });

  // Caso 4: manejo de errores con red simulada (sin mostrar console.error)
  test("maneja errores en el fetch de reportes", async () => {
    // Silencia temporalmente console.error
    const originalError = console.error;
    console.error = jest.fn();

    global.fetch = jest.fn((url) => {
      if (url.includes("3002/payments"))
        return Promise.resolve({ ok: true, json: async () => pagosMock });
      if (url.includes("3000/api/reportes/por-mes"))
        return Promise.reject(new Error("fallo de red"));
    });

    await act(async () => {
      render(<PaymentList />);
    });

    await waitFor(() => {
      expect(screen.getByText(/No hay datos de reportes por mes/i)).toBeInTheDocument();
    });

    // Restaura el console.error original
    console.error = originalError;
  });
});






