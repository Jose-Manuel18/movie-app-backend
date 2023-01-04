import { schema } from './schema'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { ApolloServer } from '@apollo/server'
import { createContext } from './context'
import { expressMiddleware } from '@apollo/server/express4'
import http from 'http'
const app = express()
const httpServer = http.createServer(app)

import './firebase/firebase'

const server = new ApolloServer({
  schema,
})
app.use(
  bodyParser.json(),
  cors({
    origin: 'http://localhost:19006',
  })
)
const serverStartFunction = async () => {
  await server.start()
  app.use(expressMiddleware(server, { context: createContext }))
}
serverStartFunction()

const startServer = async () => {
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:4000/`)
}
startServer()
