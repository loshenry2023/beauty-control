const newConsumableValidation = (data) => {
  const validationErrors = {};

  // Validación de campos obligatorios
  if (!data.productName) {
    validationErrors.productName = "Ingresa un nombre de producto";
  }

  if (!data.description) {
    validationErrors.description = "Ingresa una descripción";
  }

  if (!data.supplier) {
    validationErrors.supplier = "Ingresa un proveedor";
  }

  if (data.amount <= 0) {
    validationErrors.amount = "La cantidad debe ser mayor a 0";
  }

  if (data.price <= 0) {
    validationErrors.price = "El precio debe ser mayor a 0";
  }

  if (!data.brnchId) {
    validationErrors.branchId = "Selecciona una sucursal";
  }

  // Validación de nombre y descripción con al menos 3 caracteres
  if (data.productName.length < 3) {
    validationErrors.productName = "El nombre debe tener al menos 3 caracteres";
  }

  if (data.description.length < 3) {
    validationErrors.description =
      "La descripción debe tener al menos 3 caracteres";
  }

  return validationErrors;
};

export default newConsumableValidation;
