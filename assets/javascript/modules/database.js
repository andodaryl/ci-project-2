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
  bookListUpdating:  false,
}
const databaseAPI = {
    updateBookList(input, type) {
    data.bookListUpdating = true // Activate debouncer
    const oldBookList = data.bookList.slice()
    // Push newBook or replace bookList with newBookList
    switch (type) {
      case CODE.TYPE_BOOK:
        data.bookList.push(input)
      break;
      case CODE.TYPE_BOOKLIST:
        data.bookList = input
      break;
      default:
      console.error('Invalid type, could not update book list.')
    }
    data.bookListUpdating = false // Deactivate debouncer
    return oldBookList
  },
  addBook({
    title = "Enter Title", totalPages = 0, authorList = [], subjectList = [], year  = 1984
    }) {
    // Exit early if bookList is being updated
    if (data.bookListUpdating) return CODE.STATUS_UPDATING
    let newBook = new Book({title, totalPages, authorList, subjectList, year})
    this.updateBookList(newBook, CODE.TYPE_BOOK)
    return newBook
  },
  deleteBooks([...bookNumberList]) {
    // Exit early if bookList is being updated
    if (data.bookListUpdating) return CODE.STATUS_UPDATING
    // Sanitize bookNumberList & record valid results only
    const safeDeleteList = bookNumberList
    .map(bookNumber => parseInt(bookNumber)).filter(validResult => validResult)
    // Find books to be deleted
    const booksDeleted = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) > -1 )
    // Create newBookList with deleted books removed
    const newBookList = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) < 0)
    this.updateBookList(newBookList, CODE.TYPE_BOOKLIST) // Update bookList
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
          // Check if searchTerm is in book title: case insensitive
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
    }, data.bookList.slice()
    )
    return searchResults
  },
  saveToBrowser(attempt = 0) {
    // Exit early if bookList is being updated
    if (data.bookListUpdating) return CODE.STATUS_UPDATING
    if (attempt > 3) return CODE.STATUS_FAILURE // Exit with error if max attempt reached
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
    return CODE.STATUS_SUCCESS
  },
  loadFromBrowser(attempt = 0) {
    if (data.bookListUpdating) return CODE.STATUS_UPDATING // Exit early if bookList is being updated
    if (attempt > 3) return CODE.STATUS_FAILURE // Exit with error if max attempt reached
    data.bookListUpdating = true // Activate debouncer
    // Try to load from browser with three max attempts
    try {
      // Attempt to retrieve stored bookList
      const storedBookList = JSON.parse(localStorage.getItem('bookList'));
      updateBookList(storedBookList, CODE.TYPE_BOOKLIST)
    } catch (error) {
      // Log error
      error => console.error('Load from browser failed, attempting again - error: ' + error)
      // Attempt to load again
      const newAttempt = attempt + 1
      this.loadFromBrowser(newAttempt)
    }
    data.bookListUpdating = false // Deactivate debouncer
    return CODE.STATUS_SUCCESS
  },
}

// EXPORT
export default databaseAPI