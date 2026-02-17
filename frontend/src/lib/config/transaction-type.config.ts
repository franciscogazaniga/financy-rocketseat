import { CircleArrowUp, CircleArrowDown } from "lucide-react"

export const TRANSACTION_TYPE_CONFIG = {
  INCOME: {
    name: "INCOME",
    label: "Entrada",
    prefix: "+",
    Icon: CircleArrowUp,
    color: "text-green-base",
  },
  EXPENSE: {
    name: "EXPENSE",
    label: "Saída",
    prefix: "-",
    Icon: CircleArrowDown,
    color: "text-red-base",
  },
} as const

export type TransactionType = keyof typeof TRANSACTION_TYPE_CONFIG