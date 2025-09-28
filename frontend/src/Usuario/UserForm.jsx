import React, { useState } from "react";

export default function UserForm({ onCreated }) {
  const [nombre, setNombre] = useState(""); // useState("") inicializa el estado con una cadena vacía.

  const submit = async (e) => {// se  ejecuta cuando el usuario envia el formulario.
    e.preventDefault();  // Previene que el formulario recargue la página (comportamiento por defecto).
    await fetch("/api/usuarios", { // Hace una petición HTTP POST al servidor para crear un nuevo usuario.
      method: "POST", // Método HTTP para crear recursos.
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    setNombre(""); // Limpia el campo de nombre después de enviar.
    if (onCreated) onCreated(); // se ejecuta para actualizar la lista.
  };

   // Renderiza el formulario
  return (
    <form onSubmit={submit}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)} // Actualiza el estado cuando el usuario escribe.
        placeholder="Nombre"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
