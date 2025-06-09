import { TypedReply, TypedRequest } from '../../../config/types'
import { Envs } from '../../../config/envs'
import {
  CrudServiceRepository,
} from '../../../repositories/crud-repository/crud-service-repository/CrudServiceRepository'
import { GetBookByIdSchema } from './schema'
import { LibraryService } from '../../../services/library/LibraryService'

export async function getBookByIdHandler(request: TypedRequest<GetBookByIdSchema>, reply: TypedReply<GetBookByIdSchema>) {
  const { log, params: { id } } = request
  const crudClient = request.getHttpClient(request.getEnvs<Envs>().CRUD_SERVICE_URL)
  const crudRepository = new CrudServiceRepository(crudClient, log)

  const libraryService = new LibraryService(crudRepository, log)

  const book = await libraryService.getBookById(id)

  return reply.send(book)
}
