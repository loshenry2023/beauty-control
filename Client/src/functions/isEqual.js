export function isEqual(obj1, obj2) {
    // Obtener las claves de los objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
      // Verificar si el número de claves es el mismo
    if (keys1.length !== keys2.length) {
      return false;
    }
      // Iterar sobre las claves y verificar si los valores son iguales
    for (let key of keys1) {
      // Si el valor de la clave en obj1 es un objeto, llamar a isEqual recursivamente
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!isEqual(obj1[key], obj2[key])) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) { // Si los valores no son iguales, retornar falso
        return false;
      }
    }
      // Si todas las comparaciones pasan, los objetos son iguales
    return true;
  }