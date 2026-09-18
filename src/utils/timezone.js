export function identificarPeriodoDoDia(horaAtual, nascerDoSol, porDoSol) {
  function minutos(hora) {
    const parteHora = hora.split("T")[1];
    const [h, m] = parteHora.split(":").map(Number);
    return h * 60 + m;
  }
  const atual = minutos(horaAtual);
  const nascer = minutos(nascerDoSol);
  const por = minutos(porDoSol);
  if (atual < nascer) {
    return "madrugada";
  }
  if (atual < nascer + 180) {
    return "manha";
  }
  if (atual >= por - 120 && atual < por) {
    return "entardecer";
  }
  if (atual >= por) {
    return "noite";
  }
  return "dia";
}
