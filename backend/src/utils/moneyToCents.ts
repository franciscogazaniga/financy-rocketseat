export function moneyToCents(value: string): number {
  const [reais, centavos = "0"] = value.split(".")
  return Number(reais) * 100 + Number(centavos.padEnd(2, "0").slice(0,2))
}