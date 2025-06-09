import { FastifyInstance } from 'fastify'
import { setupFastify } from '../../../../app'
import { testEnvs } from '../../../../__test__/testUtils'
import { LibraryService } from '../../../../services/library/LibraryService'

jest.mock('../../../../services/library/LibraryService.ts')

describe('GET /books', () => {
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

  const url = '/books'
  const length = 3
  const skip = 1

  const books = [
    { _id: 'book1', title: 'Book 1', author: 'Author 1', genres: ['Fiction', 'Adventure'] },
    { _id: 'book2', title: 'Book 2', author: 'Author 2', genres: ['Non-fiction'] },
    { _id: 'book3', title: 'Book 3', author: 'Author 3', genres: ['Science', 'Education'] },
  ]

  describe('200', () => {
    it('should correctly return the books', async() => {
      mockLibraryService.getSomeBooks.mockResolvedValue(books)

      const response = await server.inject({
        method: 'GET',
        url,
        query: {
          _l: length.toString(),
          _sk: skip.toString(),
        },
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.payload)).toEqual(books)
      expect(mockLibraryService.getSomeBooks).toHaveBeenCalledWith(length, skip)
    })
  })
})
