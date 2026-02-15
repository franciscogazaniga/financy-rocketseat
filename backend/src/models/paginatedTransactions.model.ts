import { Field, Int, ObjectType } from "type-graphql"
import { TransactionModel } from "./transaction.model"

@ObjectType()
export class PaginatedTransactions {
  @Field(() => [TransactionModel])
  data: TransactionModel[]

  @Field(() => Int, { nullable: true })
  total: number

  @Field(() => Int, { nullable: true })
  page: number

  @Field(() => Int, { nullable: true })
  totalPages: number
}