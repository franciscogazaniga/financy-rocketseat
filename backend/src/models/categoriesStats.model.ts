import { Field, ObjectType } from "type-graphql"
import { CategoryModel } from "./category.model"

@ObjectType()
export class CategoriesStats extends CategoryModel {
  @Field(() => Number)
  transactionsCount: number

  @Field(() => Number)
  totalValue: number
}