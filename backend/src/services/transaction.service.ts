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
      console.log(filters.categoryId)
      where.categoryId = filters.categoryId
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {}

      if (filters.startDate) {
        where.date.gte = filters.startDate
      }

      if (filters.endDate) {
        where.date.lte = filters.endDate
      }
    }

    return prismaClient.transaction.findMany({
      where
    })
  }
}

