//! Verifico que el plan de la empresa aún siga vigente.

async function isCompanyCurrent(expireAt) {
  const currentTime = new Date();
  if (expireAt < currentTime) {
    return false;
  } else {
    return true;
  }
}

module.exports = isCompanyCurrent;
