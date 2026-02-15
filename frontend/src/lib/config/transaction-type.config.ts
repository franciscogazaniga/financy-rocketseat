import { CircleArrowUp, CircleArrowDown } from "lucide-react"

export const TRANSACTION_TYPE_CONFIG = {
  INCOME: {
    prefix: "+",
    Icon: CircleArrowUp,
    color: "text-green-base",
  },
  OUTCOME: {
    prefix: "-",
    Icon: CircleArrowDown,
    color: "text-red-base",
  },
} as const

export type TransactionType = keyof typeof TRANSACTION_TYPE_CONFIG