export const errorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    name: { type: 'string' },
    code: { type: 'string' },
  },
  required: ['message'],
} as const
