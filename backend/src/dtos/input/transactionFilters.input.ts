import { TransactionType } from "@prisma/client"
import { Field, GraphQLISODateTime, InputType } from "type-graphql"

@InputType()
export class TransactionFilters {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date
}