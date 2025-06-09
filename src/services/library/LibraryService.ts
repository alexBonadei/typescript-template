
import { BaseLogger } from 'pino'
import { CrudRepositoryInterface } from '../../repositories/crud-repository/CrudRepositoryInterface'
import { BookWithSuggestions, DbBook } from './types'
import { ENDPOINTS } from './constants'

export interface LibraryServiceInterface {
  getBookById(id: string): Promise<BookWithSuggestions>
  getSomeBooks(length?: number, skip?: number, sortBy?: string): Promise<DbBook[]>
}

export class LibraryService implements LibraryServiceInterface {
  private repository: CrudRepositoryInterface
  // @ts-ignore
  private logger: BaseLogger

  constructor(repository: CrudRepositoryInterface, logger: BaseLogger) {
    this.repository = repository
    this.logger = logger
  }

  async getBookById(id: string): Promise<BookWithSuggestions> {
    const book = await this.repository.getOneById<DbBook>(ENDPOINTS.BOOKS, id)

    if (!book) {
      throw new Error(`Book with id ${id} not found`)
    }

    const authorBooks = await this.repository.getAll<DbBook>(ENDPOINTS.BOOKS, 'title', { author: book.author })

    const suggestions = authorBooks
      .filter((authorBook) => authorBook._id !== book._id)
      .map((authorBook) => ({
        _id: authorBook._id,
        title: authorBook.title,
      }))

    return {
      ...book,
      authorBooks: suggestions,
    }
  }

  async getSomeBooks(length?: number, skip?: number, sortBy?: string): Promise<DbBook[]> {
    return this.repository.getSomePaginated<DbBook>(ENDPOINTS.BOOKS, {}, length, skip, sortBy)
  }
}
