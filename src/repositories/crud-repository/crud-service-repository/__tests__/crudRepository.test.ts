import axios, { AxiosInstance } from 'axios'
import { BaseLogger } from 'pino'
import { CrudServiceRepository } from '../CrudServiceRepository'
import nock from 'nock'
import { items } from './samples'
import { CrudRepositoryInterface } from '../../CrudRepositoryInterface'
import { CrudServiceError } from '../errors'

describe('CrudServiceRepository', () => {
  let httpClient: AxiosInstance
  let mockLogger: jest.Mocked<BaseLogger>
  let repository: CrudRepositoryInterface

  beforeEach(() => {
    httpClient = axios.create({ baseURL: 'https://localhost:8080' })

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any

    repository = new CrudServiceRepository(httpClient, mockLogger)
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })


  describe('getAll()', () => {
    it('should correctly get items', async() => {
      const httpMock = nock('https://localhost:8080')
        .get('/items/export')
        .reply(200, items)

      const actual = await repository.getAll('/items')

      httpMock.done()
      expect(actual).toEqual(items)
    })

    it('throws error if the get call fails', async() => {
      const httpMock = nock('https://localhost:8080')
        .get('/items/export')
        .replyWithError('error')

      await expect(repository.getAll('/items')).rejects.toThrow('error')

      httpMock.done()
    })

    it('Throws error if response is not 2xx', async() => {
      const httpMock = nock('https://localhost:8080')
        .get('/items/export')
        .reply(404, {})

      await expect(repository.getAll('/items')).rejects.toThrow()

      httpMock.done()
    })
  })

  describe('getOne()', () => {
    const query = { name: 'John Doe', city: 'Milan' }
    it('should return the item', async() => {
      const crudResponse = [{ _id: 'id1', name: 'John Doe' }]
      const httpNock = nock('https://localhost:8080')
        .get('/items')
        .query(query)
        .reply(200, crudResponse)

      const actual = await repository.getOne<typeof crudResponse[0]>('/items', query)

      expect(actual).toEqual(crudResponse[0])
      httpNock.done()
    })

    it('should return undefined if does not find an item', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items')
        .query(query)
        .reply(200, [])

      const actual = await repository.getOne('/items', query)

      expect(actual).toBeUndefined()
      httpNock.done()
    })

    it('return undefined if the get call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items')
        .query(query)
        .replyWithError('error')

      const actual = await repository.getOne('/items', query)

      expect(actual).toBeUndefined()
      httpNock.done()
    })

    it('return undefined if the get call does not return 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items')
        .query(query)
        .reply(400, {})

      const actual = await repository.getOne('/items', query)

      expect(actual).toBeUndefined()
      httpNock.done()
    })
  })

  describe('getManyByIds()', () => {
    it('should return the items', async() => {
      const ids = ['id1', 'id2', 'id3']
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({
          _q: JSON.stringify({
            _id: {
              $in: ids,
            },
          }),
        })
        .reply(200, items)

      const actual = await repository.getManyByIds('/items', ['id1', 'id2', 'id3'])

      expect(actual).toEqual(items)
      httpNock.done()
    })

    it('throws error if the get call fails', async() => {
      const ids = ['id1', 'id2', 'id3']
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({
          _q: JSON.stringify({
            _id: {
              $in: ids,
            },
          }),
        })
        .replyWithError('error')

      await expect(repository.getManyByIds('/items', ['id1', 'id2', 'id3'])).rejects.toThrow('error')

      httpNock.done()
    })

    it('Throws error if response is not 2xx', async() => {
      const ids = ['id1', 'id2', 'id3']
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({
          _q: JSON.stringify({
            _id: {
              $in: ids,
            },
          }),
        })
        .reply(404)

      await expect(repository.getManyByIds('/items', ['id1', 'id2', 'id3'])).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('createOne()', () => {
    const item = {
      name: 'name',
      description: 'description',
    }
    const mockedCrudResponse = {
      _id: '5e8ae13bb74dbf0011444ed5',
    }
    it('should create one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items', item)
        .reply(201, mockedCrudResponse)

      const actual = await repository.createOne<typeof item>('/items', item)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })

    it('should throw a specific error if the items are duplicated', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items', item)
        .replyWithError({ message: 'error', statusCode: 409 })

      await expect(repository.createOne<typeof item>('/items', item)).rejects.toThrow(
        new CrudServiceError('Duplicated Item', 'Duplicated Item')
      )

      httpNock.done()
    })

    it('should throw error if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items', item)
        .replyWithError('error')

      await expect(repository.createOne<typeof item>('/items', item)).rejects.toThrow('error')

      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items', item)
        .reply(404)

      await expect(repository.createOne<typeof item>('/items', item)).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('upsertOne()', () => {
    const item = {
      name: 'name',
      description: 'description',
    }
    const keys = {
      name: 'name',
    }
    const mockedCrudResponse = {
      _id: '5e8ae13bb74dbf0011444ed5',
    }
    it('should upsert one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items/upsert-one', { $set: item })
        .query(keys)
        .reply(201, mockedCrudResponse)

      const actual = await repository.upsertOne<typeof item>('/items', item, keys)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })

    it('should throw error if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items/upsert-one', { $set: item })
        .query(keys)
        .replyWithError('error')

      await expect(repository.upsertOne<typeof item>('/items', item, keys)).rejects.toThrow('error')

      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items/upsert-one', { $set: item })
        .query(keys)
        .reply(404)

      await expect(repository.upsertOne<typeof item>('/items', item, keys)).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('getMany()', () => {
    const query = { name: 'John Doe' }
    it('should return the items', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({ _q: JSON.stringify(query) })
        .reply(200, items)

      const actual = await repository.getMany<typeof items>('/items', query)

      expect(actual).toEqual(items)
      httpNock.done()
    })

    it('throws error if the get call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({ _q: JSON.stringify(query) })
        .replyWithError('error')

      await expect(repository.getMany('/items', query)).rejects.toThrow('error')
      httpNock.done()
    })

    it('throws error if the get call does not return 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items/export')
        .query({ _q: JSON.stringify(query) })
        .reply(400, {})

      await expect(repository.getMany('/items', query)).rejects.toThrow()
      httpNock.done()
    })
  })

  describe('updateOneById()', () => {
    const data = {
      name: 'name',
      description: 'description',
    }
    const id = '5e8ae13bb74dbf0011444ed5'

    const mockedCrudResponse = {
      _id: id,
    }
    it('should update one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, { $set: data })
        .reply(201, mockedCrudResponse)

      const actual = await repository.updateOneById<typeof data>('/items', id, data)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })

    it('should throw error if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, { $set: data })
        .replyWithError('error')

      await expect(repository.updateOneById<typeof data>('/items', id, data)).rejects.toThrow('error')

      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, { $set: data })
        .reply(404)

      await expect(repository.updateOneById<typeof data>('/items', id, data)).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('updateMany()', () => {
    const data = [
      {
        filter: {
          _id: '664c94fddbc1dde8223d902f',
        },
        update: {
          $addToSet: {
            item: '6656f16211947366d7bb8513',
          },
        },
      },
    ]

    const mockedCrudResponse = 1

    it('should update Many item', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/bulk`, data)
        .reply(201, { mockedCrudResponse })

      const actual = await repository.updateMany('/items', data)

      expect(actual).toEqual({ mockedCrudResponse })
      httpNock.done()
    })

    it('should throw error if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch('/items/bulk', data)
        .replyWithError('error')

      await expect(repository.updateMany('/items', data)).rejects.toThrow('error')

      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch('/items/bulk', data)
        .reply(404)

      await expect(repository.updateMany('/items', data)).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('updateOneByQuery()', () => {
    const data = {
      name: 'name',
      description: 'description',
    }
    const id = '5e8ae13bb74dbf0011444ed5'
    const query = { name: 'Pinco' }

    const mockedCrudResponse = {
      _id: id,
    }
    it('should update one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items`, data)
        .query(query)
        .reply(201, mockedCrudResponse)

      const actual = await repository.updateOneByQuery<typeof data>('/items', query, data)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })

    it('should throw error if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items`, data)
        .query(query)
        .replyWithError('error')

      await expect(repository.updateOneByQuery<typeof data>('/items', query, data)).rejects.toThrow('error')

      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items`, data)
        .query(query)
        .reply(404)

      await expect(repository.updateOneByQuery<typeof data>('/items', query, data)).rejects.toThrow()

      httpNock.done()
    })
  })

  describe('getOneById()', () => {
    const item = {
      name: 'name',
      description: 'description',
    }
    const id = '5e8ae13bb74dbf0011444ed5'

    it('should get one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .get(`/items/${id}`)
        .reply(200, item)

      const actual = await repository.getOneById<typeof item>('/items', id)

      expect(actual).toEqual(item)
      httpNock.done()
    })

    it('should return undefined if the repository response is 404', async() => {
      const httpNock = nock('https://localhost:8080')
        .get(`/items/${id}`)
        .reply(404)

      const actual = await repository.getOneById<typeof item>('/items', id)

      expect(actual).toBeUndefined()
      httpNock.done()
    })

    it('should return undefined if the call fails', async() => {
      const httpNock = nock('https://localhost:8080')
        .get(`/items/${id}`)
        .replyWithError('error')

      const actual = await repository.getOneById<typeof item>('/items', id)

      expect(actual).toBeUndefined()
      httpNock.done()
    })

    it('should throw error if the crud response is not 2xx nor 404', async() => {
      const httpNock = nock('https://localhost:8080')
        .get(`/items/${id}`)
        .reply(401)

      const actual = await repository.getOneById<typeof item>('/items', id)

      expect(actual).toBeUndefined()
      httpNock.done()
    })
  })

  describe('pullStringItemFromOneField()', () => {
    const id = '5e8ae13bb74dbf0011444ed5'

    const mockedCrudResponse = {
      _id: id,
    }

    const field = 'softwareItemsIds'
    const value = '664c9fb4e05baff966dab822'

    const body = {
      $pull: {
        softwareItemsIds: value,
      },
    }

    it('should pull the value from the array defined in the field', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, body)
        .reply(200, mockedCrudResponse)

      const actual = await repository.pullStringItemFromOneField('/items', id, field, value)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })
  })

  describe('pushStringItemToOneField()', () => {
    const id = '5e8ae13bb74dbf0011444ed5'

    const mockedCrudResponse = {
      _id: id,
    }

    const field = 'softwareItemsIds'
    const value = '664c9fb4e05baff966dab822'

    const body = {
      $push: {
        softwareItemsIds: value,
      },
    }

    it('should push the value to the array defined in the field', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, body)
        .reply(200, mockedCrudResponse)

      const actual = await repository.pushStringItemToOneField('/items', id, field, value)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })
  })

  describe('addToSetStringItemToOneField()', () => {
    const id = '5e8ae13bb74dbf0011444ed5'

    const mockedCrudResponse = {
      _id: id,
    }

    const field = 'softwareItemsIds'
    const value = '664c9fb4e05baff966dab822'

    const body = {
      $addToSet: {
        softwareItemsIds: value,
      },
    }

    it('should add to set the value to the array defined in the field', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, body)
        .reply(200, mockedCrudResponse)

      const actual = await repository.addToSetStringItemToOneField('/items', id, field, value)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })
  })

  describe('pushObjectItemToOneField()', () => {
    const id = '5e8ae13bb74dbf0011444ed5'

    const mockedCrudResponse = {
      _id: id,
    }

    const field = 'softwareItemsIds'
    const value = {
      foo: 'bar',
    }

    const body = {
      $push: {
        softwareItemsIds: {
          foo: 'bar',
        },
      },
    }

    it('should push to array the object', async() => {
      const httpNock = nock('https://localhost:8080')
        .patch(`/items/${id}`, body)
        .reply(200, mockedCrudResponse)

      const actual = await repository.pushObjectItemToOneField('/items', id, field, value)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })
  })

  describe('countItems()', () => {
    it('should return the count of items', async() => {
      const httpNock = nock('https://localhost:8080')
        .get(`/items/count`)
        .reply(200, () => { return 42 })

      const actual = await repository.countItems('/items')

      expect(actual).toEqual(42)
      httpNock.done()
    })
  })

  describe('getSomePaginated()', () => {
    it('should correctly fetch items with pagination options', async() => {
      const httpNock = nock('https://localhost:8080')
        .get('/items')
        .query({
          _q: JSON.stringify({ version: '0.1.0' }),
          _s: 'name',
          _l: 10,
          _sk: 0,
        })
        .reply(200, items)


      const actual = await repository.getSomePaginated('/items', { version: '0.1.0' }, 10, 0, 'name')

      expect(actual).toEqual(items)
      httpNock.done()
    })
  })

  describe('createMany()', () => {
    const items = [
      {
        name: 'name',
        description: 'description',
      },
      {
        name: 'nameeee',
        description: 'no',
      },
    ]
    const mockedCrudResponse = [
      {
        _id: '5e8ae13bb74dbf0011444ed5',
      },
      {
        _id: '5e8ae13bb74dbf0011444ed6',

      },
    ]
    it('should create many items', async() => {
      const httpNock = nock('https://localhost:8080')
        .post('/items/bulk', items)
        .reply(201, mockedCrudResponse)

      const actual = await repository.createMany<typeof items[0]>('/items', items)

      expect(actual).toEqual(mockedCrudResponse)
      httpNock.done()
    })
  })

  describe('deleteOneById()', () => {
    const id = '5e8ae13bb74dbf0011444ed5'

    it('should delete one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .delete(`/items/${id}`)
        .reply(204)

      const actual = await repository.deleteOneById('/items', id)

      expect(actual).toBeUndefined()
      httpNock.done()
    })

    it('should not delete an item', async() => {
      const httpNock = nock('https://localhost:8080')
        .delete(`/items/${id}`)
        .reply(500)

      await expect(repository.deleteOneById('/items', id)).rejects.toThrow('Request failed with status code 500')

      httpNock.done()
    })

    it('should throw an error while removing one item', async() => {
      const httpNock = nock('https://localhost:8080')
        .delete(`/items/${id}`)
        .replyWithError({ message: 'Not Found', statusCode: 404 })

      await expect(repository.deleteOneById('/items', id)).rejects.toThrow('Not Found')

      httpNock.done()
    })
  })
})
