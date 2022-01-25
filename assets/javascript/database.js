class Book {
  // ID system for books: pre-increment currentBookNumber & assign ID to new value of currentBookNumber
  static currentBookNumber = 0
  constructor() {
    this.bookNumber = ++this.constructor.currentBookNumber
    this.title = ""
    this.totalPages = 0
    this.authorList = []
    this.subjectList = []
    this.year = 1984
  }
}

export default databaseAPI