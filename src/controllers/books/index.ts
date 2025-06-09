import { FastifyInstance } from 'fastify'

import { schema as getBooksSchema } from './get-books/schema'
import { getBooksHandler } from './get-books/handler'
import { schema as getBookByIdSchema } from './get-books-by-id/schema'
import { getBookByIdHandler } from './get-books-by-id/handler'


export default async function registerRoute(fastify: FastifyInstance) {
  fastify.get('/books', { schema: getBooksSchema }, getBooksHandler)
  fastify.get('/books/:id', { schema: getBookByIdSchema }, getBookByIdHandler)
}
