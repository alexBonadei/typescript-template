import { TypedReply, TypedRequest } from '../../../config/types'
import { Envs } from '../../../config/envs'
import {
  CrudServiceRepository,
} from '../../../repositories/crud-repository/crud-service-repository/CrudServiceRepository'
import { GetBooksSchema } from './schema'
import { LibraryService } from '../../../services/library/LibraryService'

export async function getBooksHandler(request: TypedRequest<GetBooksSchema>, reply: TypedReply<GetBooksSchema>) {
  const { log, query: { _l, _sk } } = request
  const crudClient = request.getHttpClient(request.getEnvs<Envs>().CRUD_SERVICE_URL)
  const crudRepository = new CrudServiceRepository(crudClient, log)

  const libraryService = new LibraryService(crudRepository, log)

  const books = await libraryService.getSomeBooks(_l, _sk)

  return reply.send(books)
}
