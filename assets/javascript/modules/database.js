// IMPORTS
import CODE from './dictionary.js' // Public Dictionary

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
}
const databaseAPI = {
    updateBookList(input, type) {
    const oldBookList = data.bookList.slice()
    // Push newBook or replace bookList with newBookList
    switch (type) {
      case CODE.OBJ_TYPE.BOOK:
        data.bookList.push(input)
      break;
      case CODE.OBJ_TYPE.BOOKLIST:
        data.bookList = input
      break;
      default:
      console.error('Invalid type, could not update book list.')
    }
    return oldBookList
  },
  addBook({
    title = "Enter Title", totalPages = 0, authorList = [], subjectList = [], year  = 1984
    }) {
    let newBook = new Book({title, totalPages, authorList, subjectList, year})
    this.updateBookList(newBook, CODE.OBJ_TYPE.BOOK)
    return newBook
  },
  deleteBooks([...bookNumberList]) {
    // Sanitize bookNumberList & record valid results only
    const safeDeleteList = bookNumberList
    .map(bookNumber => parseInt(bookNumber)).filter(validResult => validResult)
    // Find books to be deleted
    const booksDeleted = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) > -1 )
    // Create newBookList with deleted books removed
    const newBookList = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) < 0)
    this.updateBookList(newBookList, CODE.OBJ_TYPE.BOOKLIST) // Update bookList
    return booksDeleted
  },
  searchList({...searchTermsObject}) {
    const searchTermsArray = Object.entries(searchTermsObject)
    // Filters & refines bookList according to searchTerms
    const searchResults = searchTermsArray.reduce((previousResults, searchTerm) => {
      const property = searchTerm[0]
      const value = searchTerm[1]
      switch(property) {
        case CODE.FIELD_TYPE.TITLE:
          // Check if searchTerm is in book title: case insensitive
          return previousResults.filter(book => {
            const bookTitle = book[property].toLowerCase()
            const searchValue = value.toLowerCase()
            return bookTitle.includes(searchValue)
          })
        case CODE.FIELD_TYPE.TOTALPAGES:
        case CODE.FIELD_TYPE.YEAR:
          // Check if book and search numbers match
          return previousResults.filter(book => book[property] === parseInt(value))
        case CODE.FIELD_TYPE.AUTHORLIST:
        case CODE.FIELD_TYPE.SUBJECTLIST:
          // Check if some author/subjects in book are in searchTerm array: case insensitive
          return previousResults.filter(book => {
            const bookPropList = book[property]
            const searchPropList = value.map(item => item.toLowerCase())
            return bookPropList.some(item => searchPropList.indexOf(item.toLowerCase()) > -1) 
          })
        default:
          return previousResults // No change
      }
    }, data.bookList.slice()
    )
    return searchResults
  },
  saveToBrowser(attempt = 0) {
    // Exit early if bookList is being updated
    if (data.bookListUpdating) return CODE.STATUS_TYPE.UPDATING
    if (attempt > 3) return CODE.STATUS_TYPE.FAILURE // Exit with error if max attempt reached
    // Try to save to browser with three max attempts
    try {
      // Attempt to save
      const bookListString = JSON.stringify(data.bookList)
      localStorage.setItem('bookList', bookListString)  
    } catch (error) {
      // Log error
      error => console.error('Save to browser failed, attempting again - error: ' + error)
      // Attempt to save again
      const newAttempt = attempt + 1
      this.saveToBrowser(newAttempt)
    }
    return CODE.STATUS_TYPE.SUCCESS
  },
  loadFromBrowser(attempt = 0) {
    if (attempt > 3) return CODE.STATUS_TYPE.FAILURE // Exit with error if max attempt reached
    // Try to load from browser with three max attempts
    try {
      // Attempt to retrieve stored bookList
      const storedBookList = JSON.parse(localStorage.getItem('bookList'));
      updateBookList(storedBookList, CODE.OBJ_TYPE.BOOKLIST)
    } catch (error) {
      // Log error
      error => console.error('Load from browser failed, attempting again - error: ' + error)
      // Attempt to load again
      const newAttempt = attempt + 1
      this.loadFromBrowser(newAttempt)
    }
    return CODE.STATUS_TYPE.SUCCESS
  },
}

// EXPORT
export default databaseAPI