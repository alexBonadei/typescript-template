import { FromSchema, JSONSchema } from 'json-schema-to-ts'

export const envSchema = {
  type: 'object',
  properties: {
    HTTP_PORT: { type: 'number', default: 3000 },
    LOG_LEVEL: { type: 'string', default: 'info' },
    CRUD_SERVICE_URL: { type: 'string', default: 'http://crud-service' },
  },
  additionalProperties: false,
  required: [],
} as const satisfies JSONSchema

export type Envs = FromSchema<typeof envSchema>
