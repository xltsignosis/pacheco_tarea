import React, { useState } from "react";

export default function UserForm({ onCreated }) {
  const [nombre, setNombre] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    setNombre("");
    if (onCreated) onCreated();
  };

  return (
    <form onSubmit={submit}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
