  export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value/100)
  }

  export const formatCurrencyFromString = (value: string) => {
    const numeric = value.replace(/[^\d-]/g, "")

    const number = Number(numeric) / 100

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(number)
  }