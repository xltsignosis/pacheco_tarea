import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import PaymentForm from "./PaymentForm";

describe("PaymentForm - versión definitiva funcional en JSDOM", () => {
  let alertMock;

  beforeAll(() => {
    alertMock = jest.fn();
    Object.defineProperty(window, "alert", {
      writable: true,
      value: alertMock,
    });
  });

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ message: "Pago procesado correctamente" }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza correctamente todos los campos", () => {
    render(<PaymentForm />);
    expect(screen.getByPlaceholderText(/Monto del pago/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Usuario ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Tarjeta de Crédito/i)).toBeInTheDocument();
    expect(screen.getByText(/Examen Remedial/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Procesar Pago/i })).toBeInTheDocument();
  });

  test("muestra alerta si se intenta enviar vacío (sin bloquear required)", async () => {
    render(<PaymentForm />);

    // Quitamos temporalmente el atributo required para que se dispare el onSubmit
    document.querySelectorAll("[required]").forEach((el) => el.removeAttribute("required"));

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /Procesar Pago/i }).closest("form"));
    });

    await waitFor(() => expect(alertMock).toHaveBeenCalled());
    
    // CAMBIO: El Factory ahora lanza mensajes más específicos
    // Verificamos que el alert contenga alguna palabra clave de error de validación
    const alertMessage = alertMock.mock.calls[0][0];
    expect(
      alertMessage.includes("requerido") || 
      alertMessage.includes("monto") || 
      alertMessage.includes("usuario") ||
      alertMessage.includes("descripción")
    ).toBe(true);
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("envía correctamente el formulario con datos válidos", async () => {
    const mockOnCreated = jest.fn();
    render(<PaymentForm onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByPlaceholderText(/Monto del pago/i), { target: { value: "330" } });
    fireEvent.change(screen.getByPlaceholderText(/Usuario ID/i), { target: { value: "101" } });
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "tarjeta_credito" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "Examen_remedial" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Procesar Pago/i }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, opts] = global.fetch.mock.calls[0];
      expect(url).toContain("/api/pagos");
      expect(opts.method).toBe("POST");
      expect(opts.body).toContain('"monto":330');
      expect(opts.body).toContain('"usuarioId":101');
    });

    expect(mockOnCreated).toHaveBeenCalled();
  });
});