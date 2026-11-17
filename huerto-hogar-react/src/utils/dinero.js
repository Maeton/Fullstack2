export const TASA_IVA = 0.19;

export function formatoPrecio(valor) {
  return Number(valor).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
}

/**
 * Los precios del catálogo incluyen IVA.
 * Devuelve el desglose neto + IVA = total para mostrarlo en carrito y checkout.
 */
export function desglosarIva(totalConIva) {
  const total = Math.round(Number(totalConIva) || 0);
  const neto = Math.round(total / (1 + TASA_IVA));

  return {
    neto,
    iva: total - neto,
    total,
  };
}
