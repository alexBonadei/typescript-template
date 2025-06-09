import Fastify from 'fastify'
import MiaHotStart from 'mia-hot-start'

import defaultFastifyOptions from './config/defaultFastifyOptions'
import { envSchema } from './config/envs'

import books from './controllers/books'

async function setupFastify(envSchemaOptions?: any) {
  const fastify = Fastify(structuredClone(defaultFastifyOptions))
  await fastify.register(MiaHotStart, {
    envSchema,
    envSchemaOptions,
    logLevelEnvKey: 'LOG_LEVEL',
  })

  fastify.setErrorHandler((error, request) => {
    if (!error.message) {
      error.message = 'Internal Server Error'
    }

    error.code = 'customCode' in error ? (error.customCode as string) : 'GENERIC_ERROR'

    request.log.error(error)
    throw error
  })

  fastify.addContentTypeParser('text/markdown', { parseAs: 'string' }, (request, payload, done) => {
    try {
      return done(null, payload)
    } catch (error) {
      // @ts-ignore
      // eslint-disable-next-line callback-return
      done(error)
    }
  })

  fastify.register(books)

  return fastify
}

export { setupFastify }
