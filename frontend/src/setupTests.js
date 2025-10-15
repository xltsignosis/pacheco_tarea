import '@testing-library/jest-dom';
import 'whatwg-fetch';

// setupTests.js
const originalError = console.error;
console.error = (...args) => {
  const msg = args.join(" ");
  if (msg.includes("AggregateError") || msg.includes("Cross origin")) {
    return; // Ignorar errores del entorno jsdom
  }
  originalError(...args);
};
