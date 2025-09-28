import React from "react";
import UserForm from "./Usuario/UserForm";
import UserList from "./Usuario/UserList";
import LoanForm from "./Usuario/LoanForm";
import LoanList from "./Usuario/LoanList";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <h1 className="title">💻Sistema Universitario</h1>

      <section className="card">
        <h2>👤 Usuarios</h2>
        <UserForm />
        <UserList />
      </section>

      <section className="card">
        <h2>💰 Préstamos</h2>
        <LoanForm />
        <LoanList />
      </section>
    </div>
  );
}
