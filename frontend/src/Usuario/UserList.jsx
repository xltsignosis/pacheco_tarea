import React, { useEffect, useState } from "react";

export default function UserList() {// muestra la lista de usuarios.
  const [users, setUsers] = useState([]);

  useEffect(() => { //se ejecuta cuando el componente aparece en pantalla.
    fetch("/api/usuarios")// Hace una petición HTTP GET para obtener todos los usuarios.
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);
//renderiza la lista de usuarios.
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{// key es muy requerido para identificar cada elemento unico.
          u.nombre}</li> //muestra el nombre de cada usuario. 
      ))}
    </ul>
  );
}
