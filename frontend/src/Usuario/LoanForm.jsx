import React, { useState } from "react";

export default function LoanForm({ onCreated }) {
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/prestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descripcion, usuarioId: Number(usuarioId) }),
    });
    setDescripcion("");
    setUsuarioId("");
    if (onCreated) onCreated();
  };

  return (
    <form onSubmit={submit}>
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <input
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        placeholder="Usuario ID"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
