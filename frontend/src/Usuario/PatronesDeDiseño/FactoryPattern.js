export class PaymentFactory {
  static create(data) {
    // Validar datos
    const errors = this.validate(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Crear objeto estandarizado
    return {
      monto: parseFloat(data.monto),
      usuarioId: Number(data.usuarioId),
      metodoPago: data.metodoPago,
      descripcion: data.descripcion,
      estado: "pendiente",
      fecha: new Date().toISOString()
    };
  }

  static validate(data) {
    const errors = [];

    if (!data.monto || data.monto === '') {
      errors.push('El monto es requerido');
    }
    if (parseFloat(data.monto) <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }
    if (!data.usuarioId || data.usuarioId === '') {
      errors.push('El ID de usuario es requerido');
    }
    if (!data.descripcion || data.descripcion === '') {
      errors.push('La descripción es requerida');
    }

    return errors;
  }
}


 //Factory para crear objetos User validados
 
export class UserFactory {
  static create(data) {
    const errors = this.validate(data);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return {
      nombre: data.nombre.trim()
    };
  }

  static validate(data) {
    const errors = [];

    if (!data.nombre || data.nombre.trim() === '') {
      errors.push('El nombre es requerido');
    }
    if (data.nombre.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    return errors;
  }
}