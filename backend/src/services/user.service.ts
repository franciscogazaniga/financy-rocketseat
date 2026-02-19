import { prismaClient } from "../../prisma/prisma";
import { CreateUserInput, UpdateUserInput } from "../dtos/input/user.input";

export class UserService {
  async createUser(data: CreateUserInput) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: data.email
      }
    })

    if(findUser) {
      throw new Error('Usuário já cadastrado.')
    }

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email
      }
    })
  }

  async updateUser(data: UpdateUserInput, userId: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    })

    if(!user) {
      throw new Error('Usuário não encontrado.')
    }

    return prismaClient.user.update({
      where: { id: userId },
      data: {
        name: data.name,
      }
    })
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if(!user) { 
      throw new Error('Usuário não encontrado.')
    }

    return user
  }
}