import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model";
import { IsAuth } from "../middlewares/auth.middleware";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import { UserService } from "../services/user.service";
import { CategoryFilters } from "../dtos/input/categoryFilters.input";
import { TransactionService } from "../services/transaction.service";
import { TransactionModel } from "../models/transaction.model";
import { TransactionFilters } from "../dtos/input/transactionFilters.input";
import { centsToMoney } from "../utils/centsToMoney";
import { CategoriesStats } from "../models/categoriesStats.model";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()
  private userService = new UserService()
  private transactionService = new TransactionService()

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    await this.categoryService.deleteCategory(id, user.id)

    return true
  }

  @FieldResolver(() => UserModel)
  async author(@Root() category: CategoryModel): Promise<UserModel> {
    return this.userService.findUser(category.authorId)
  }

  @FieldResolver(() => [TransactionModel])
  async transactions(
    @Root() category: CategoryModel,
    @GqlUser() user: User): Promise<TransactionModel[]> {
    const result = await this.transactionService.list(user.id, {
      categoryId: category.id
    })

    return result.data.map(transaction => ({
      ...transaction,
      value: centsToMoney(transaction.value)
    }))
  }

  // @FieldResolver(() => Int)
  // async transactionsCount(@Root() category: CategoryModel) {
  //   return await this.transactionService.getCategoriesStats(category.id)
  // }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: User
  ): Promise<CategoryModel> { 
    return this.categoryService.findById(id, user.id)
  }

  @Query(() => [CategoryModel])
  async getCategories(
    @Arg('filters', () => CategoryFilters, { nullable: true }) filters: CategoryFilters,
    @GqlUser() user: User
  ): Promise<CategoryModel[]> {
    const categories =
      await this.categoryService.findMany(filters, user.id)

    return categories.map(categories => (categories))
  }

  @Query(() => [CategoriesStats])
  async listCategoriesWithStats(@GqlUser() user: User) {
    const authorId = user.id

    const categories = await this.categoryService.findMany(null, authorId)
    const stats = await this.transactionService.getCategoriesStats(authorId)

    const statsMap = Object.fromEntries(
      stats.map(s => [
        s.categoryId,
        {
          count: s._count.id,
          totalValue: s._sum.value ?? 0,
        }
      ])
    )

    return categories.map(category => ({
      ...category,
      transactionsCount: statsMap[category.id]?.count ?? 0,
      totalValue: statsMap[category.id]?.totalValue ?? 0,
    }))
  }
}