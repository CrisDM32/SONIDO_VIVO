function aBase64Url(objeto) {
  const bytes = new TextEncoder().encode(JSON.stringify(objeto));
  const binario = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binario).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function crearToken(datos = {}, { vencido = false } = {}) {
  const ahora = Math.floor(Date.now() / 1000);
  const payload = {
    nombre: "José Pérez",
    correo: "admin@sonidovivo.cl",
    perfil: "administrador",
    exp: vencido ? ahora - 60 : ahora + 3600,
    ...datos,
  };

  return `${aBase64Url({ alg: "HS256" })}.${aBase64Url(payload)}.firma`;
}
