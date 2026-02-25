import type { PaginatedTransactions, Transaction, TransactionsStats } from "@/types";
import { mockUser } from "./user";
import { mockCategories } from "./categories";

function generateMockTransactions(): Transaction[] {
  return Array.from({ length: 31 }).map((_, index) => {
    const isExpense = index % 2 === 0

    return {
      id: (index + 1).toString(),
      description: isExpense
        ? `Despesa ${index + 1}`
        : `Receita ${index + 1}`,
      date: new Date(2024, 0, index + 1),
      categoryId: mockCategories[index % mockCategories.length].id,
      category: mockCategories[index % mockCategories.length],
      author: mockUser,
      value: isExpense ? 5000 + index * 100 : 10000 + index * 200,
      type: isExpense ? "EXPENSE" : "INCOME",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
}

export const mockTransactions: Transaction[] = generateMockTransactions()

export const mockPaginatedTransactions: {
  listTransactions: PaginatedTransactions
} = {
  listTransactions: {
    data: mockTransactions,
    limit: 5,
    total: mockTransactions.length,
    totalExpense: mockTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((acc, t) => acc + t.value, 0),
    totalIncome: mockTransactions
      .filter(t => t.type === "INCOME")
      .reduce((acc, t) => acc + t.value, 0),
    page: 1,
    totalValue: mockTransactions.reduce((acc, t) => acc + t.value, 0),
    totalPages: Math.ceil(mockTransactions.length / 10),
  }
}

export const mockTransactionsStats: {
  getTransactionsStats: TransactionsStats
} = {
  getTransactionsStats: {
    mostUsedCategoryId: mockCategories[0].id,
    mostUsedCategoryName: mockCategories[0].title,
    total: mockTransactions.length,
  }
}