export const tiempoAMinutos = (tiempo) => {
    const [horas, minutos] = tiempo.split(":").map(Number);
    return horas * 60 + minutos;
}

export const minutosATiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}`;
}
