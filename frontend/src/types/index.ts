import type { CategoryColor } from "@/lib/colors-registry"
import type { TransactionType } from "@/lib/config/transaction-type.config"
import type { CategoryIconName } from "@/lib/icons-registry"

export interface User {
  id: string
  name: string
  email: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface Category {
  id: string
  title: string
  description: string
  icon: CategoryIconName
  color: CategoryColor
  transactionsCount: number
  author?: User
  createdAt: Date
  updatedAt?: Date
}

export interface Transaction {
  id: string
  description: string
  value: number
  type: TransactionType
  date: Date
  author?: User
  category?: Category
  createdAt: Date
  updatedAt?: Date
}

export interface TransactionDTO {
  id: string
  description: string
  value: string
  type: TransactionType
  date: Date
  author?: User
  category?: Category
  createdAt: Date
  updatedAt?: Date
}

