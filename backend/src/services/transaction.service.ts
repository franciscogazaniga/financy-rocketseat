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

  async findMany(filters: TransactionFilters, authorId: string) {
    const where: Prisma.TransactionWhereInput = {
      authorId
    }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters?.date) {
      where.date = {}
      where.date.gte = filters.date
    }

    return prismaClient.transaction.findMany({
      where
    })
  }

  async list(input: TransactionFilters, authorId: string) {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortOrder = "desc",
      description,
      categoryId,
      date,
      type,
    } = input

    const skip = (page - 1) * limit
    
    const where: Prisma.TransactionWhereInput = {
      authorId,
    }

    if (description) {
      where.description = {
        contains: description,
        mode: "insensitive"
      } as Prisma.StringFilter
    }

    if (categoryId) where.categoryId = categoryId
    if (type) where.type = type

    if (date) {
      const start = new Date(date)
      start.setDate(1)
      start.setHours(0,0,0,0)

      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)
      end.setMilliseconds(-1)

      where.createdAt = {
        gte: start,
        lte: end
      }
    }

    const [data, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder
        }
      }),
      prismaClient.transaction.count({ where })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total/limit)
    }
  }

  async transactionsCount(categoryId: string) {
    return prismaClient.transaction.count({
      where: { categoryId }
    })
  }
}

