import { errorSchema } from '../../../utils/errors/schema'

export const schema = {
  querystring: {
    type: 'object',
    properties: {
      _l: { type: 'number' },
      _sk: { type: 'number' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          author: { type: 'string' },
          genres: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    '4xx': errorSchema,
    500: errorSchema,
  },
} as const

export type GetBooksSchema = typeof schema
