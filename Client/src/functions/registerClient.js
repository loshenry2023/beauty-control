const validateClientInput = (data) => {
  const validationErrors = {};

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{8,15}$/;
  const numberPattern = /^\d+$/;

  function isDateHigherThanToday(inputDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDateObject = new Date(inputDate);
    inputDateObject.setHours(0, 0, 0, 0);
  
    return inputDateObject > today;
  }

  if (!data.email) {
    validationErrors.email = "Ingresa un correo electrónico";
  } else if (!emailPattern.test(data.email)) {
    validationErrors.email = "Correo electrónico no válido";
  }

  if (!data.name) {
    validationErrors.name = "Proporciona un nombre";
  } else if (data.name.length > 25) {
    validationErrors.name = "No debe exceder los 25 caracteres";
  }

  if (!data.lastName) {
    validationErrors.lastName = "Proporciona un apellido";
  } else if (data.lastName.length > 25) {
    validationErrors.lastName = "No debe exceder los 25 caracteres";
  }

  if (!data.phoneNumber1 || !numberPattern.test(data.phoneNumber1)) {
    validationErrors.phoneNumber1 = "El teléfono no puede quedar vacío";
  } else if (!data.phoneNumber1 || !phonePattern.test(data.phoneNumber1)) {
    validationErrors.phoneNumber1 = "Ingresa teléfono válido, 8-15 dig";
  } 

  if (data.phoneNumber2 === "") {
    null
   }  if (data.phoneNumber2 && !phonePattern.test(data.phoneNumber2)) {
    validationErrors.phoneNumber2 = "Ingresa teléfono válido, 8-15 dig";
  }

  if (isDateHigherThanToday(data.birthday)) {
    validationErrors.birthday = "Ingresa una fecha anterior al día de hoy"
  }

  if (!data.id_pers) {
    null
   } else if (data.id_pers.length > 0 && data.id_pers.length > 10) {
      validationErrors.id_pers = "El documento debe tener como máximo 10 dígitos";
    }  
  
  return validationErrors;

};

export default validateClientInput;