# fastify-demo-ts

[![pipeline status][pipeline]][git-link]
[![coverage report][coverage]][git-link]

## Summary
Template with Typescript and `NOT` LC39

## Contributing

Please use `npm run commit` to add and commit your changes keeping the messages format consistent.

[pipeline]: https://git.tools.mia-platform.eu/mia-care/clients/p4samd-governance/services/p4samd-backend/badges/master/pipeline.svg
[coverage]: https://git.tools.mia-platform.eu/mia-care/clients/p4samd-governance/services/p4samd-backend/badges/master/coverage.svg
[git-link]: https://git.tools.mia-platform.eu/mia-care/clients/p4samd-governance/services/p4samd-backend/commits/master

[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/mia-care/clients/p4samd-governance/services/p4samd-backend/merge_requests

## Test Frontend and Backend locally
Add this in the index.ts file under `const port = fastify.getEnvs<Envs>().HTTP_PORT`:

```
  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    done()
  })

  fastify.options('*', (request, reply) => {
    reply
      .header('Access-Control-Allow-Origin', 'http://localhost:3000')
      .header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
      .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .header('Access-Control-Max-Age', '86400') // Opzionale, cache della preflight
      .status(204) // No Content
      .send()
  })
```

Remove it when finished! The pre-commit script won't let you commit this ;)

Set HTTP_PORT env to 3456.
