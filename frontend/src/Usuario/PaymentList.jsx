import React, { useEffect, useState } from "react";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/pagos") //hace una petición HTTP GET para obtener todos los pagos del servidor.
      .then((res) => res.json())
      .then((data) => setPayments(data))//guarda losspagos en el esatdo local.
      .catch((err) => console.error(err));//muestra el error en consola.
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus) => {//actualiza el estado de un pago.
    try {
      await fetch(`/api/pagos/${paymentId}`, { //envía una petición PUT al servidor para actualizar el estado del pago.
        method: "PUT", //se usa para actualizar recursos existentes
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),//envia el nuevo estado.
      });
      
      setPayments(prevPayments => // actualiza el estado local sin recargar desde el servidor.
        prevPayments.map(payment => //recorre todos los pagos y solo actualiza con el que coincidde.
          payment.id === paymentId //si el idno coincide con el que queremos actualizar.
            ? { ...payment, estado: newStatus }
            : payment //si no coincide, deja el pago sin cambios.
        )
      );
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };
//devuleve un color segun el estado del pago.
  const getStatusColor = (estado) => {
    switch (estado) {
      case "exitoso": return "payment-status-success";
      case "fallido": return "payment-status-failed";
      case "procesando": return "payment-status-processing";
      case "pendiente": return "payment-status-pending";
      default: return "payment-status-default";
    }
  };
//formatea el monto como moneda mexicana.
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', //formato de moneda.
      currency: 'MXN' //$ mexicanos.
    }).format(amount);
  };
//aqui fromatea la fecha 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric', //el año completo.
      month: '2-digit', //mes don 2 digitos, etc.
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    //muestra cuantos pagos hay registrados.
    <div className="card"> 
      <h3>Lista de Pagos ({payments.length})</h3>
      {payments.length === 0 ? ( //revisa si hay pagos para mostrar.
        <p>No hay pagos registrados</p>
      ) : (
        <ul className="payment-list">
          {payments.map((payment) => ( //recorre cada pago y crea un elemento visual para cada uno.
            <li key={payment.id} className="payment-item">
              <div className="payment-item-content">
                <div className="payment-info">
                  <strong>{formatAmount(payment.monto)}</strong> - Usuario ID: {payment.usuarioId}
                  <br />
                  <small>Método: {payment.metodoPago}</small>
                  <br />
                  <small>Descripción: {payment.descripcion}</small>
                  <br />
                  <small>Fecha: {formatDate(payment.fecha)}</small>
                </div>
                <div className="payment-controls">
                  <span className={`payment-status ${getStatusColor(payment.estado)}`}>
                    {payment.estado}
                  </span>
                  <br />
                  <select 
                    value={payment.estado} //valor actual del estado.
                    onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}//funcion que se ejecuta al cambiar.
                    className="payment-status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="exitoso">Exitoso</option>
                    <option value="fallido">Fallido</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}