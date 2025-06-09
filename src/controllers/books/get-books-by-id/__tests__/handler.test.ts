import { FastifyInstance } from 'fastify'
import { setupFastify } from '../../../../app'
import { testEnvs } from '../../../../__test__/testUtils'
import { LibraryService } from '../../../../services/library/LibraryService'

jest.mock('../../../../services/library/LibraryService.ts')

describe('GET /books/:id', () => {
  let server: FastifyInstance
  let mockLibraryService: jest.Mocked<LibraryService>

  beforeEach(async() => {
    server = await setupFastify(testEnvs)

    mockLibraryService = new LibraryService({} as any, {} as any) as jest.Mocked<LibraryService>
    (LibraryService as jest.Mock).mockReturnValue(mockLibraryService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const bookId = 'book1'

  const url = `/books/${bookId}`
  const book = {
    _id: bookId,
    title: 'Book 1',
    author: 'Author 1',
    genres: ['Fiction', 'Adventure'],
    authorBooks: [
      { _id: 'book2', title: 'Book 2' },
      { _id: 'book3', title: 'Book 3' },
    ],
  }

  describe('200', () => {
    it('should correctly return the book by ID', async() => {
      mockLibraryService.getBookById.mockResolvedValue(book)

      const response = await server.inject({
        method: 'GET',
        url,
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.payload)).toEqual(book)
      expect(mockLibraryService.getBookById).toHaveBeenCalledWith(bookId)
    })
  })
})
