import { TransactionType } from "@prisma/client";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  categoryId!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  value!: string

  @Field(() => Date)
  date!: Date

  @Field(() => TransactionType)
  type!: TransactionType
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType
}