export class CrudServiceError extends Error {
  customCode: string

  constructor(message: string, customCode: string) {
    super(message)
    this.customCode = customCode
    this.name = this.constructor.name
  }
}
