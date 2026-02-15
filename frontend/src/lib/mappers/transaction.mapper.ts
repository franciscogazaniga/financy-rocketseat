import type { TransactionDTO, Transaction } from "@/types"

export function mapTransaction(dto: TransactionDTO): Transaction {
  return {
    ...dto,
    value: Number(dto.value)/100
  }
}