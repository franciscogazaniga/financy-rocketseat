  export const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "")

    const number = Number(numeric) / 100

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(number)
  }