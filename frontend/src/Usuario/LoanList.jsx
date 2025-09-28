import React, { useEffect, useState } from "react";

export default function LoanList() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch("/api/prestamos")
      .then((res) => res.json())
      .then((data) => setLoans(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ul>
      {loans.map((l) => (
        <li key={l.id}>
          {l.descripcion} - Usuario ID: {l.usuarioId}
        </li>
      ))}
    </ul>
  );
}
