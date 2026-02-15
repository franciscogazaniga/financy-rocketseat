import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input";
import { CategoryFilters } from "../dtos/input/categoryFilters.input";

export class CategoryService {
  async createCategory(data: CreateCategoryInput, authorId: string) {
    const findCategory = await prismaClient.category.findUnique({
      where: {
        title: data.title
      }
    })

    if(findCategory) {
      throw new Error('Categoria já cadastrada.')
    }

    return prismaClient.category.create({
      data: {
        authorId: authorId,
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color
      }
    })
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
        authorId: userId
      }
    })

    if(!category) {
      throw new Error('Categoria não encontrada.')
    }

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        color: data.color,
        icon: data.icon,
      }
    })
  }

  async deleteCategory(id: string, userId: string) {
    const findCategory = await prismaClient.category.findUnique({
      where: {
        id,
        authorId: userId
      }
    })

    if(!findCategory) {
      throw new Error('Categoria não encontrada.')
    }

    const transactions = await prismaClient.transaction.findMany({
      where: {
        categoryId: id
      }
    })

    if(transactions.length > 0) {
      throw new Error('Não é possível deletar uma categoria que possui transações atreladas.')
    }

    return prismaClient.category.delete({
      where: {
        id
      }
    })
  }

  async findById(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id,
        authorId: userId,
      }
    })

    if(!category) { 
      throw new Error('Categoria não encontrada.')
    }

    return category
  }

  async findMany(filters: CategoryFilters, authorId: string) {
    const where: Prisma.CategoryWhereInput = {
      authorId
    }

    if (filters?.title) {
      where.title = filters.title
    }

    return prismaClient.category.findMany({
      where
    })
  }
}