import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input";
import { TransactionFilters } from "../dtos/input/transactionFilters.input";
import { moneyToCents } from "../utils/moneyToCents";

export class TransactionService {
  async createTransaction(data: CreateTransactionInput, authorId: string) {
    if(!data.categoryId) {
      throw new Error('Uma categoria precisa ser informada.')
    }

    return prismaClient.transaction.create({
      data: {
        authorId: authorId,
        categoryId: data.categoryId,
        description: data.description,
        value: moneyToCents(data.value),
        date: data.date,
        type: data.type,
      }
    })
  }

  async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id,
        authorId: userId,
      }
    })

    if(!transaction) {
      throw new Error('Transação não encontrada.')
    }
    return prismaClient.transaction.update({
      where: { id },
      data: {
        categoryId: data.categoryId,
        description: data.description,
        value: moneyToCents(data.value),
        date: data.date,
        type: data.type,
      }
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const findTransaction = await prismaClient.transaction.findUnique({
      where: {
        id,
        authorId: userId
      }
    })

    if(!findTransaction) {
      throw new Error('Transação não encontrada.')
    }

    return prismaClient.transaction.delete({
      where: {
        id
      }
    })
  }

  async list(authorId: string, input?: TransactionFilters) {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortOrder = "desc",
      description,
      categoryId,
      startDate,
      endDate,
      type,
    } = input ?? {}

    const skip = (page - 1) * limit

    const where: Prisma.TransactionWhereInput = { authorId }

    if (description) {
      where.description = {
        contains: description.toLowerCase(),
      } as Prisma.StringFilter
    }

    if (categoryId) where.categoryId = categoryId
    if (type) where.type = type

    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lt: new Date(endDate) }),
      }
    }

    const [data, total, totalIncomeResult, totalExpenseResult] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      prismaClient.transaction.count({ where }),
      prismaClient.transaction.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { value: true },
      }),
      prismaClient.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { value: true },
      }),
    ])

    const totalIncome = totalIncomeResult._sum.value ?? 0
    const totalExpense = totalExpenseResult._sum.value ?? 0

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      totalValue: totalIncome - totalExpense,
      totalIncome: totalIncome,
      totalExpense: totalExpense,
    }
  }

  async transactionsCount(categoryId: string) {
    return prismaClient.transaction.count({
      where: { categoryId }
    })
  }

  async getTransactionStats(userId: string) {
    const total = await prismaClient.transaction.count({
      where: { authorId: userId }
    })

    const mostUsed = await prismaClient.transaction.groupBy({
      by: ["categoryId"],
      where: { authorId: userId },
      _count: {
        categoryId: true
      },
      orderBy: {
        _count: {
          categoryId: "desc"
        }
      },
      take: 1
    })

    let mostUsedCategory = null

    if (mostUsed.length > 0) {
      mostUsedCategory = await prismaClient.category.findUnique({
        where: {
          id: mostUsed[0].categoryId
        },
        select: {
          id: true,
          title: true
        }
      })
    }

    return {
      total,
      mostUsedCategoryId: mostUsedCategory?.id ?? null,
      mostUsedCategoryName: mostUsedCategory?.title ?? null
    }
  }
}

