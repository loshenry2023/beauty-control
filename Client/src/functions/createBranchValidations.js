function branchValidation(branch) {
    const errors = {};

    // Validación de nombre
    if (!branch.name) {
        errors.name = "El nombre no puede estar vacío";
    } else if (branch.name.length > 50) {
        errors.name = "El nombre no puede tener más de 50 caracteres";
    }

    // Validación de dirección
    if (!branch.address) {
        errors.address = "La dirección no puede estar vacía";
    }

    // Validación de teléfono
    if (!branch.phone) {
        errors.phone = "El teléfono no puede estar vacío";
    } else if (isNaN(branch.phone) || branch.phone.length < 10 || branch.phone.length > 15) {
        errors.phone = "El teléfono debe ser un número válido entre 10 y 15 dígitos";
    }

    /* // Validación de coordenadas
    if (!branch.coordinates || typeof branch.coordinates !== 'string') {
        errors.coordinates = "El enlace de coordenadas no es válido";
    } */

    // Validación de hora de apertura
    if (!branch.openningHours) {
        errors.openningHours = "La hora de apertura no puede estar vacía";
    }

    // Validación de hora de cierre
    if (!branch.clossingHours) {
        errors.clossingHours = "La hora de cierre no puede estar vacía";
    }

    // Validación de enlace de Instagram
    /* if (!branch.instagramLink) {
        errors.instagramLink = "El enlace de Instagram no puede estar vacío";
    }

    // Validación de enlace de Facebook
    if (!branch.facebookLink) {
        errors.facebookLink = "El enlace de Facebook no puede estar vacío";
    }

    // Validación de enlace de TikTok
    if (!branch.tiktokLink) {
        errors.tiktokLink = "El enlace de TikTok no puede estar vacío";
    }
    */
    return errors;
}

export default branchValidation;