export interface PostCrudResponse {
  _id: string
}

export type PatchCrudResponse<T> = T & { _id: string }
