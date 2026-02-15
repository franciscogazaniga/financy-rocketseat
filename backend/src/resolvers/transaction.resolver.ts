import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { IsAuth } from "../middlewares/auth.middleware";
import { TransactionModel } from "../models/transaction.model";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { centsToMoney } from "../utils/centsToMoney";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { TransactionFilters } from "../dtos/input/transactionFilters.input";
import { PaginatedTransactions } from "../models/paginatedTransactions.model";

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private userService = new UserService()
  private categoryService = new CategoryService()

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    const transaction = await this.transactionService.createTransaction(
      data,
      user.id
    )

    return {
      ...transaction,
      value: centsToMoney(transaction.value)
    }
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<TransactionModel> {
    const transaction = await this.transactionService.updateTransaction(id, data, user.id)

    return {
      ...transaction,
      value: centsToMoney(transaction.value)
    }
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    await this.transactionService.deleteTransaction(id, user.id)

    return true
  }

  //FieldResolver serve para mostrar o objeto no resultado da query
  @FieldResolver(() => UserModel)
  async author(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.authorId)
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel,
    @GqlUser() user: User): Promise<CategoryModel> {
    return this.categoryService.findById(transaction.categoryId, user.id)
  }

  @Query(() => PaginatedTransactions)
  async getTransactions(
    @Arg('input', () => TransactionFilters, { nullable: true }) input: TransactionFilters,
    @GqlUser() user: User
  ): Promise<PaginatedTransactions> {
    const result = await this.transactionService.list(input, user.id)

    return {
      ...result,
      data: result.data.map(transaction => ({
        ...transaction,
        value: centsToMoney(transaction.value)
      }))
    }
  }
}



