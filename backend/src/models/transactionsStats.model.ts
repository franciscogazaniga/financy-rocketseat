import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
export class TransactionsStats {
  @Field(() => Int)
  total: number

  @Field(() => String)
  mostUsedCategoryId: string

  @Field(() => String)
  mostUsedCategoryName: string
}