import { AxiosInstance } from 'axios'
import { BaseLogger } from 'pino'
import { CrudRepositoryInterface } from '../CrudRepositoryInterface'
import { PatchCrudResponse, PostCrudResponse } from './types'
import { CrudServiceError } from './errors'

export class CrudServiceRepository implements CrudRepositoryInterface {
  private client: AxiosInstance
  // @ts-ignore
  private logger: BaseLogger

  constructor(httpClient: AxiosInstance, logger: BaseLogger) {
    this.client = httpClient
    this.logger = logger
  }

  async getAll<T>(endpoint: string, sortBy?: string, query?: {[key: string]: any}): Promise<T[]> {
    const { data } = await this.client.get<T[]>(`${endpoint}/export`, {
      params: {
        _s: sortBy,
        ...query,
      },
      headers: {
        'Accept': 'application/json',
      },
    })
    return data
  }

  async getOne<T>(endpoint:string, queryParams: { [key: string]: string }): Promise<T | undefined> {
    try {
      const { data } = await this.client.get<T[]>(endpoint, {
        params: queryParams,
      })
      return data[0]
    } catch (error) {
      this.logger.error(error)
      return undefined
    }
  }

  async getManyByIds<T>(endpoint: string, ids: string[], sortBy?: string): Promise<T[]> {
    const { data } = await this.client.get<T[]>(`${endpoint}/export`, {
      params: {
        _s: sortBy,
        _q: JSON.stringify({
          _id: {
            $in: ids,
          },
        }),
      },
      headers: {
        'Accept': 'application/json',
      },
    })
    return data
  }

  async createOne<T>(endpoint: string, item: T): Promise<PostCrudResponse> {
    let data
    try {
      ({ data } = await this.client.post(endpoint, item))
    } catch (error: any) {
      if (error.statusCode === 409) {
        throw new CrudServiceError('Duplicated Item', 'ERROR_409')
      }
      throw error
    }
    return data
  }

  async upsertOne<T>(endpoint: string, item: T, keys: object): Promise<T> {
    const { data } = await this.client.post(`${endpoint}/upsert-one`, { $set: item },
      {
        params: keys,
      })

    return data
  }

  async getMany<T>(endpoint: string, queryParams: { [key: string]: any }, sortBy?: string): Promise<T[]> {
    const { data } = await this.client.get<T[]>(`${endpoint}/export`, {
      params: {
        _q: JSON.stringify(queryParams),
        _s: sortBy,
      },
      headers: { 'Accept': 'application/json' },
    })
    return data
  }

  async updateOneById<T>(endpoint: string, id: string, data: {[key:string]: any}): Promise<PatchCrudResponse<T>> {
    const { data: responseData } = await this.client.patch<PatchCrudResponse<T>>(`${endpoint}/${id}`, { $set: data })
    return responseData
  }

  async updateOneByQuery<T>(endpoint: string, query: {[key:string]: string}, data: {[key:string]: any}): Promise<PatchCrudResponse<T>> {
    const { data: responseData } = await this.client.patch<PatchCrudResponse<T>>(`${endpoint}`, data, { params: query })
    return responseData
  }

  async updateMany<T>(endpoint: string, items: T[]): Promise<number> {
    const { data: responseData } = await this.client.patch<number>(`${endpoint}/bulk`, items)
    return responseData
  }

  async getOneById<T>(endpoint: string, id: string): Promise<T | undefined> {
    try {
      const { data } = await this.client.get<T>(`${endpoint}/${id}`)
      return data
    } catch (error: any) {
      this.logger.error(error)
      return undefined
    }
  }

  async pullStringItemFromOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T> {
    const body = {
      $pull: {
        [field]: value,
      },
    }

    const { data } = await this.client.patch<T>(`${endpoint}/${id}`, body)
    return data
  }

  async pushStringItemToOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T> {
    const body = {
      $push: {
        [field]: value,
      },
    }

    const { data } = await this.client.patch<T>(`${endpoint}/${id}`, body)
    return data
  }

  async addToSetStringItemToOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T> {
    const body = {
      $addToSet: {
        [field]: value,
      },
    }

    const { data } = await this.client.patch<T>(`${endpoint}/${id}`, body)
    return data
  }

  async pushObjectItemToOneField<T>(endpoint: string, id: string, field: string, value: any): Promise<T> {
    const body = {
      $push: {
        [field]: value,
      },
    }

    const { data } = await this.client.patch<T>(`${endpoint}/${id}`, body)
    return data
  }

  async countItems(endpoint: string, queryParams: { [key: string]: any }): Promise<number> {
    const { data } = await this.client.get(`${endpoint}/count`, {
      params: {
        _q: JSON.stringify(queryParams),
      },
    })

    return data
  }

  async getSomePaginated<T>(endpoint: string, queryParams: { [key: string]: any }, length?: number, skip?:number, sortBy?: string): Promise<T[]> {
    const { data } = await this.client.get<T[]>(`${endpoint}`, {
      params: {
        _q: JSON.stringify(queryParams),
        _s: sortBy,
        _l: length,
        _sk: skip,
      },
    })
    return data
  }

  async createMany<T>(endpoint: string, items: T[]): Promise<PostCrudResponse[]> {
    const { data } = await this.client.post(`${endpoint}/bulk`, items)

    return data
  }

  async deleteOneById(endpoint: string, id: string): Promise<void> {
    try {
      await this.client.delete(`${endpoint}/${id}`)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
