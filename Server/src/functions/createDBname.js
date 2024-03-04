//! Genero un nombre de base de datos irrepetible.

async function createDBname() {
    const dateNow = new Date();
    const timestamp = dateNow.getTime();
    const componenteAleatorio = Math.random().toString(36).substring(2, 8); // componente aleatorio de 6 caracteres
    const nombreBaseDatos = `db${timestamp}_${componenteAleatorio}`;
    return nombreBaseDatos.toString();
}

module.exports = createDBname;
