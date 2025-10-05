import React from "react";
import UserForm from "./Usuario/UserForm";
import UserList from "./Usuario/UserList";
import PaymentForm from "./Usuario/PaymentForm";
import PaymentList from "./Usuario/PaymentList";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <h1 className="title">💻Sistema Universitario💻</h1>

      <section className="card">
        <h2>👤 Usuarios</h2>
        <UserForm />
        <UserList />
      </section>

      {/* Microservicio de Pagos */}
<section className="microservice">
  <h2>💳Servicio de pagos</h2>
  <PaymentForm onCreated={() => window.location.reload()} />
  <PaymentList />

  {/* Botón para descargar el PDF del reporte mensual */}
  <button
    onClick={() => window.open("http://localhost:8001/reportes/por-mes/pdf", "_blank")}
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    📄 Descargar reporte mensual en PDF
  </button>
</section>
    </div>
  );
}
