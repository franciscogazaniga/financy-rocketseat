import 'dotenv/config'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { AuthResolver } from './resolvers/auth.resolver'
import { UserResolver } from './resolvers/user.resolver'
import 'reflect-metadata'
import { buildContext } from './graphql/context'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'

async function bootstrap() {
  const app = express()

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    validate: false,
    emitSchemaFile: './schema.graphql'
  })

  const server = new ApolloServer({
    schema
  })

  await server.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: buildContext
    })
  )

  app.listen({
    port: 4000
  }, () => {
    console.log(`Servidor iniciado na porta 4000!`)
  })
}

bootstrap()