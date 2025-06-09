export type DbBook = {
  _id: string
  title: string
  author: string
  genres: string[]
}

export type BookWithSuggestions = DbBook & {
  authorBooks: {
    _id: string
    title: string
  }[]
}
