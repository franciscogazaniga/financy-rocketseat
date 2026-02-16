import { CircleArrowUp, CircleArrowDown } from "lucide-react"

export const TRANSACTION_TYPE_CONFIG = {
  INCOME: {
    name: "INCOME",
    prefix: "+",
    Icon: CircleArrowUp,
    color: "text-green-base",
  },
  EXPENSE: {
    name: "EXPENSE",
    prefix: "-",
    Icon: CircleArrowDown,
    color: "text-red-base",
  },
} as const

export type TransactionType = keyof typeof TRANSACTION_TYPE_CONFIG