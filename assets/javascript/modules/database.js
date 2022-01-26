// DICTIONARY
const TYPEBOOK = 'BOOK'
const TYPEBOOKLIST = 'BOOKLIST'
const STATUSUPDATING = 'UPDATING'

// CLASSES
const Book = class {
  // ID system for books: pre-increment currentBookNumber & assign ID to new value
  static currentBookNumber = 0
  constructor({
    title = "Enter Title", totalPages = 0, authorList = [], subjectList = [], year = 1984
    }) {
    this.bookNumber = ++this.constructor.currentBookNumber
    this.title = title
    this.totalPages = totalPages
    this.authorList = authorList
    this.subjectList = subjectList
    this.year = parseInt(year)
  }
}

// DATABASE
const data = {
  bookList: [],
  bookListUpdating:  false,
  updateBookList(input, type) {
    this.bookListUpdating = true // Activate debouncer
    const oldBookList = this.bookList.slice()
    // Push newBook or replace bookList with newBookList
    switch (type) {
      case TYPEBOOK:
        this.bookList.push(input)
      break;
      case TYPEBOOKLIST:
        this.bookList = input
      break;
      default:
      console.error('Invalid type, could not update book list.')
    }
    this.bookListUpdating = false // Deactivate debouncer
    return oldBookList
  },
}
const databaseAPI = {
  addBook({
    title = "Enter Title", totalPages = 0, authorList = [], subjectList = [], year  = 1984
    }) {
    if (data.bookListUpdating) return STATUSUPDATING // Exit early if bookList is being updated
    let newBook = new Book({title, totalPages, authorList, subjectList, year})
    data.updateBookList(newBook, TYPEBOOK)
    return newBook
  },
  deleteBooks([...bookNumberList]) {
    if (data.bookListUpdating) return STATUSUPDATING // Exit early if bookList is being updated
    // Sanitize bookNumberList & record valid results only
    const safeDeleteList = bookNumberList
    .map(bookNumber => parseInt(bookNumber)).filter(validResult => validResult)
    // Find books to be deleted
    const booksDeleted = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) > -1 )
    // Create newBookList with deleted books removed
    const newBookList = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) < 0)
    data.updateBookList(newBookList, TYPEBOOKLIST) // Update bookList
    return booksDeleted
  },
  searchList({...searchTermsObject}) {
    const searchTermsArray = Object.entries(searchTermsObject)
    // Filters & refines bookList according to searchTerms
    const searchResults = searchTermsArray.reduce((previousResults, searchTerm) => {
      const property = searchTerm[0]
      const value = searchTerm[1]
      switch(property) {
        case 'title':
          // Check if searchTerm is in book titles: case insensitive
          return previousResults.filter(book => {
            const bookTitle = book[property].toLowerCase()
            const searchValue = value.toLowerCase()
            return bookTitle.includes(searchValue)
          })
        case 'totalPages':
        case 'year':
          // Check if book and search numbers match
          return previousResults.filter(book => book[property] === parseInt(value))
        case 'authorList':
        case 'subjectList':
          // Check if some author/subjects in book are in searchTerm array: case insensitive
          return previousResults.filter(book => {
            const bookPropList = book[property]
            const searchPropList = value.map(item => item.toLowerCase())
            return bookPropList.some(item => searchPropList.indexOf(item.toLowerCase()) > -1) 
          })
      }
      return previousResults.filter(book => book[property] == value)
    }, data.bookList.slice()
    )
    return searchResults
  },
  saveToBrowser() {
    if (data.bookListUpdating) return STATUSUPDATING // Exit early if bookList is being updated
    data.bookListUpdating = true // Activate debouncer
    window.localStorage.setItem('bookList', JSON.stringify(data.bookList));
    data.bookListUpdating = false // Deactivate debouncer
  },
  loadFromBrowser() {
    if (data.bookListUpdating) return STATUSUPDATING // Exit early if bookList is being updated
    const newBookList = JSON.parse(window.localStorage.getItem('user'));
    updateBookList(newBookList, TYPEBOOKLIST)
  },
}

// EXPORT

export default databaseAPI