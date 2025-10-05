import React, { useEffect, useState } from "react";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [reportesPorMes, setReportesPorMes] = useState([]);

  useEffect(() => {
    // Obtener pagos individuales
    fetch("http://localhost:3002/payments")
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error del servidor: ${errorText}`);
        }
        const data = await res.json();
        setPayments(data);
      })
      .catch((err) => console.error("Error al obtener pagos:", err.message));

    // Obtener reportes agrupados por mes desde el microservicio Python
    fetch("http://localhost:3000/api/reportes/por-mes")
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error al obtener reportes: ${errorText}`);
        }
        const data = await res.json();
        setReportesPorMes(data);
      })
      .catch((err) => console.error("Error al obtener reportes por mes:", err.message));
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await fetch(`http://localhost:3002/payments/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      });

      setPayments(prevPayments =>
        prevPayments.map(payment =>
          payment.id === paymentId
            ? { ...payment, estado: newStatus }
            : payment
        )
      );
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "exitoso": return "payment-status-success";
      case "fallido": return "payment-status-failed";
      case "procesando": return "payment-status-processing";
      case "pendiente": return "payment-status-pending";
      default: return "payment-status-default";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card">
      <h3>Lista de Pagos ({payments.length})</h3>

      {payments.length === 0 ? (
        <p>No hay pagos registrados</p>
      ) : (
        <ul className="payment-list">
          {payments.map((payment) => (
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
                    value={payment.estado}
                    onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
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

      {/* Sección de reportes por mes */}
      <div className="reportes-card">
        <h4>Pagos agrupados por mes</h4>
        {reportesPorMes.length === 0 ? (
          <p>No hay datos de reportes por mes</p>
        ) : (
          <table className="reportes-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Total de Pagos</th>
                <th>Total Monto</th>
              </tr>
            </thead>
            <tbody>
              {reportesPorMes.map((reporte, index) => (
                <tr key={index}>
                  <td>{reporte.mes}</td>
                  <td>{reporte.total_pagos}</td>
                  <td>{formatAmount(reporte.total_monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}