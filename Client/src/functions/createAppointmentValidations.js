const validateCreateAppointment = (data) => {
  const validationErrors = {};

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours, 10);
    const parsedMinutes = parseInt(minutes, 10);
    const existingHours = time !== ""
    const validateTime = time >= "06:00" && time <= "20:00"
    return (
      // parsedHours >= 6 &&
      // parsedHours <= 20 &&
      // (parsedHours !== 0 || parsedMinutes !== 0) && 
      // parsedMinutes >= 0 &&
      // parsedMinutes < 60
      existingHours && validateTime
    );
  };

  // if (!data.date_from || !isValidTime(data.date_from)) {
  //   validationErrors.date_from = "Selecciona una hora de inicio válida entre las 6:00 am y las 8:00 pm";
  // }

  // if (!data.date_to || !isValidTime(data.date_to)) {
  //   validationErrors.date_to = "Selecciona una hora de finalización válida entre las 6:00 am y las 8:00 pm";
  // } else if (data.date_from && data.date_to && data.date_from >= data.date_to) {
  //   validationErrors.date_to = "La hora de finalización debe ser posterior a la hora de inicio";
  // }

  return validationErrors;
};

export default validateCreateAppointment;