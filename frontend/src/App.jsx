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
</section>
    </div>
  );
}
