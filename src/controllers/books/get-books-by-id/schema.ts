import { errorSchema } from '../../../utils/errors/schema'

export const schema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        author: { type: 'string' },
        genres: { type: 'array', items: { type: 'string' } },
        authorBooks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
            },
          },
        },
      },
    },
    '4xx': errorSchema,
    500: errorSchema,
  },
} as const

export type GetBookByIdSchema = typeof schema
