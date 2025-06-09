import { CrudRepositoryInterface } from '../../../repositories/crud-repository/CrudRepositoryInterface'
import { BaseLogger } from 'pino'
import { LibraryService } from '../LibraryService'
import { ENDPOINTS } from '../constants'

describe('LibraryService', () => {
  let mockRepository: jest.Mocked<CrudRepositoryInterface>
  let libraryService: LibraryService
  let mockLogger: BaseLogger

  beforeEach(() => {
    mockRepository = jest.mocked({
      getOneById: jest.fn(),
      getAll: jest.fn(),
      getSomePaginated: jest.fn(),
    } as unknown as CrudRepositoryInterface)

    mockLogger = jest.mocked({
      error: jest.fn(),
    } as unknown as BaseLogger)

    libraryService = new LibraryService(mockRepository, mockLogger)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getBookById', () => {
    it('should return book with suggestions', async() => {
      const mockBook = {
        _id: 'book1',
        title: 'Book Title',
        author: 'Author Name',
      }

      const mockAuthorBooks = [
        { _id: 'book2', title: 'Another Book', author: 'Author Name' },
        { _id: 'book3', title: 'Yet Another Book', author: 'Author Name' },
      ]

      mockRepository.getOneById.mockResolvedValue(mockBook)
      mockRepository.getAll.mockResolvedValue(mockAuthorBooks)

      const result = await libraryService.getBookById('book1')

      expect(result).toEqual({
        ...mockBook,
        authorBooks: [
          { _id: 'book2', title: 'Another Book' },
          { _id: 'book3', title: 'Yet Another Book' },
        ],
      })
      expect(mockRepository.getOneById).toHaveBeenCalledWith(ENDPOINTS.BOOKS, 'book1')
      expect(mockRepository.getAll).toHaveBeenCalledWith(ENDPOINTS.BOOKS, 'title', { author: 'Author Name' })
    })
  })

  describe('getSomeBooks', () => {
    it('should return paginated books', async() => {
      const mockBooks = [
        { _id: 'book1', title: 'Book One', author: 'Author One' },
        { _id: 'book2', title: 'Book Two', author: 'Author Two' },
      ]

      mockRepository.getSomePaginated.mockResolvedValue(mockBooks)

      const result = await libraryService.getSomeBooks(10, 0, 'title')

      expect(result).toEqual(mockBooks)
      expect(mockRepository.getSomePaginated).toHaveBeenCalledWith(ENDPOINTS.BOOKS, {}, 10, 0, 'title')
    })
    it('should return empty array if no books found', async() => {
      mockRepository.getSomePaginated.mockResolvedValue([])

      const result = await libraryService.getSomeBooks(10, 0, 'title')

      expect(result).toEqual([])
      expect(mockRepository.getSomePaginated).toHaveBeenCalledWith(ENDPOINTS.BOOKS, {}, 10, 0, 'title')
    })
  })
})
