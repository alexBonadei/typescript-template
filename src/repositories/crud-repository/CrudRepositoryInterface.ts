import { PatchCrudResponse } from './crud-service-repository/types'

export interface CrudRepositoryInterface {
  getAll<T>(endpoint: string, sortBy?: string, query?: {[key: string]: any}): Promise<T[]>;
  getOne<T>(endpoint: string, queryParams: { [key: string]: string }): Promise<T | undefined>;
  getManyByIds<T>(endpoint: string, ids: string[], sortBy?: string): Promise<T[]>;
  createOne<T>(endpoint: string, item: T): Promise<any>;
  upsertOne<T>(endpoint: string, item: T, keys: object): Promise<T>;
  getMany<T>(endpoint: string, queryParams: { [key: string]: any }, sortBy?: string): Promise<T[]>;
  updateOneById<T>(endpoint: string, id: string, data: {[key:string]: any}): Promise<PatchCrudResponse<T>>;
  updateOneByQuery<T>(endpoint: string, query: {[key:string]: string}, data: {[key:string]: any}): Promise<PatchCrudResponse<T>>
  updateMany<T>(endpoint: string, items: T[]): Promise<number>
  getOneById<T>(endpoint: string, id: string): Promise<T | undefined>;
  pullStringItemFromOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T>
  pushStringItemToOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T>
  addToSetStringItemToOneField<T>(endpoint: string, id: string, field: string, value: string): Promise<T>
  pushObjectItemToOneField<T>(endpoint: string, id: string, field: string, value: any): Promise<T>
  countItems(endpoint: string, queryParams?: { [key: string]: any }): Promise<number>
  getSomePaginated<T>(endpoint: string, queryParams: { [key: string]: any }, length?: number, skip?:number, sortBy?: string): Promise<T[]>;
  createMany<T>(endpoint: string, items: T[]): Promise<any>
  deleteOneById(endpoint: string, id: string): Promise<void>;
}
