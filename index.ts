/* eslint-disable */
import {setupFastify} from './src/app'
import { Envs } from './src/config/envs'

async function main() {
  const fastify = await setupFastify()
  const port = fastify.getEnvs<Envs>().HTTP_PORT

  fastify.listen({ port, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

main()
