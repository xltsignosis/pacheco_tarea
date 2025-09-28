import React, { useState } from "react";

export default function PaymentForm({ onCreated }) {
  const [monto, setMonto] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [metodoPago, setMetodoPago] = useState("tarjeta_credito");
  const [descripcion, setDescripcion] = useState("");

  const submit = async (e) => {
    e.preventDefault();// previene que la pagina se recargue al enviar el formulario.
    
    // Validación básica
    if (!monto || !usuarioId || !descripcion) {
      alert("Por favor, completa todos los campos");
      return;
    }
   //validacion de monto: debe ser mayor a 0
    if (parseFloat(monto) <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    await fetch("/api/pagos", { //envia datos del pago al servidor.
      method: "POST", //crea nuevo recurso.
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        monto: parseFloat(monto), //convierte el monto de texto a numero decimal.
        usuarioId: Number(usuarioId),// convierte el Id de texto a numero entero.
        metodoPago,
        descripcion,
        estado: "pendiente", // Estado inicial
        fecha: new Date().toISOString()//fecha actual 
      }),
    });
    
    // Limpiar formulario
    setMonto("");
    setUsuarioId("");
    setMetodoPago("tarjeta_credito");//regresa al valor por defecto.
    setDescripcion("");
    
    if (onCreated) onCreated();//el callback actualiza la lsita.
  };

  return (
    <form onSubmit={submit}>
      <input //monto de pago.
        type="number"
        step="0.01" //decimales o centavos en este caso.
        value={monto}
        onChange={(e) => setMonto(e.target.value)}//actualizacion de estado cuando el susario teclea.
        placeholder="Monto del pago"
        required//campo obligatorio.
      />

      <input //campo para que la id de usaurio haga el pago.
        type="number"//solo numeros.
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}//actualiza el estado
        placeholder="Usuario ID"
        required
      />
      
      <select //selecciona el metodo de pago.
        value={metodoPago}//valor.
        onChange={(e) => setMetodoPago(e.target.value)}//actualiza el estado cuando cambia la seleccion.
      >
        <option value="tarjeta_credito">Tarjeta de Crédito</option> 
        <option value="tarjeta_debito">Tarjeta de Débito</option>
        <option value="paypal">PayPal</option>
        <option value="transferencia">Transferencia Bancaria</option>
      </select>
      
       <select //tipo de pago.
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}//actualiza el estado.
        required
      >
        <option value="">Selecciona el tipo de pago</option>
        <option value="pago_de_taller">Pago de Taller</option>
        <option value="inscripcion">Inscripción</option>
        <option value="pago_de_cuatrimestre">Pago de Cuatrimestre</option>
        <option value="seguro_anual">Seguro Anual</option>
        <option value="Examen_remedial">Examen Remedial</option>
        <option value="credencial_estudiantil">Credencial Estudiantil</option>
        <option value="otros">Otros</option>
      </select>
      
      <button type="submit">Procesar Pago</button>
    </form>
  );
}