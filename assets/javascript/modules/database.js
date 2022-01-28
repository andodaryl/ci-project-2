// IMPORTS
import CODE from './dictionary.js' // Public Dictionary

// DEFAULT DATA
const metaData = {
  currentYear: new Date().getFullYear(),
  getUniqueInteger() {
    return Date.now()
  },
  default: {
    bookList: [],
    book: {
      title: 'Enter Title',
      totalPages: 0,
      year: this.currentYear,
      authorList: [],
      subjectList: [],
    }
  }
}
Object.freeze(metaData) // Prevent changes to metaData

// CLASSES
const Book = class {
  constructor() {
    // Create properties from default values
    const BOOKFIELDS = Object.entries(metaData.default.book)
    BOOKFIELDS.forEach(BOOKFIELD => this[BOOKFIELD[0]] = BOOKFIELD[1])
    // Create new unique id
    this[CODE.FIELD_TYPE.ID] = metaData.getUniqueInteger()
  }
}

// DATABASE
const data = {  
  bookList: [],
}
const databaseAPI = {
    isObjectLiteral(input) {
    return input.constructor === Book || input.constructor === Object ? true : false
    },
    checkDataIntegrity(input, type) {
      let RESULT // STATUS_SUCCESS or FAILURE
      try {
        switch (type) {
          case CODE.OBJ_TYPE.BOOKLIST:
            const BOOKLIST = input
            // Exit early if bookList is not an array
            const validBookList = Array.isArray(BOOKLIST)
            if (!validBookList) throw 'Given' + type + ' is not an array'
            RESULT = CODE.STATUS_TYPE.SUCCESS
            break;
          case CODE.OBJ_TYPE.BOOK:
            const BOOK = input
            // Exit early if book is not object literal
            const validBook = this.isObjectLiteral(BOOK)
            if (!validBook) throw 'Given ' + type + ' is not an object literal'
            // Check all book fields & exit if invalid field found
            const validFields = Object.entries(BOOK)
            .every(BOOKFIELD => this.checkDataIntegrity(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD))
            if (!validFields) throw 'Given' + type + ' contains an invalid field'
            RESULT = CODE.STATUS_TYPE.SUCCESS
            break;
          case CODE.OBJ_TYPE.BOOKFIELD:
            const BOOKFIELD = input
            const [FIELD_TYPE, FIELD_VALUE] = BOOKFIELD
            switch(FIELD_TYPE) {
              case CODE.FIELD_TYPE.TITLE:
                // Exit early if not string
                const validTitle = typeof FIELD_VALUE === 'string'
                if (!validTitle) throw 'Given ' + key + ' is not a string'
                RESULT = CODE.STATUS_TYPE.SUCCESS
                break;
              case CODE.FIELD_TYPE.TOTALPAGES:
              case CODE.FIELD_TYPE.YEAR:
              case CODE.FIELD_TYPE.ID:
                // Exit early if not an integer
                const validInteger = Number.isInteger(FIELD_VALUE)
                if (!validInteger) throw 'Given ' + key + ' is not an integer'
                RESULT = CODE.STATUS_TYPE.SUCCESS
                break;
              case CODE.FIELD_TYPE.AUTHORLIST:
              case CODE.FIELD_TYPE.SUBJECTLIST:
                // Exit early if not an array
                const validArray = Array.isArray(FIELD_VALUE)
                if (!validArray) throw 'Given ' + key + ' is not an array'
                RESULT = CODE.STATUS_TYPE.SUCCESS
                break;
            }
            break;
          default:
            throw 'Unknown type'
        }
      } catch (error) {
        console.error('Could not check data integrity: ' + error)
        RESULT = CODE.STATUS_TYPE.FAILURE
      }
      return RESULT
    },
    getSafeData(input, type) {
      let RESULT // BOOKLIST, BOOK, BOOKFIELD or STATUS_FAILURE
      try {
        switch(type) {
          case CODE.OBJ_TYPE.BOOKLIST:
            const BOOKLIST = input
            const safeBookList = []
            const updateSafeBookList = (bookListData) => {
              safeBookList.push(...bookListData)
            }
            // Find safe books in bookList else replace with default list
            const checkBookListData = this.checkDataIntegrity(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
            if (checkBookListData === CODE.STATUS_TYPE.SUCCESS) {
              // Filter safe books
              const safeBooksFound = BOOKLIST.filter(BOOK => {
                const checkBookData = this.checkDataIntegrity(BOOK, CODE.OBJ_TYPE.BOOK)
                return checkBookData === CODE.STATUS_TYPE.SUCCESS
              })
              // Use safe books            
              updateSafeBookList(safeBooksFound)
            } else {
              // Use default values
              updateSafeBookList(metaData.default.bookList)
            }
            RESULT = safeBookList
            break;
          case CODE.OBJ_TYPE.BOOK:
            const BOOK = input
            const safeBook = {}
            const updateSafeBook = (bookData) => {
              for (let index = 0; index < bookData.length; index++) {
                const BOOKFIELD = bookData[index]
                const [FIELD_TYPE, FIELD_VALUE] = BOOKFIELD
                safeBook[FIELD_TYPE] = FIELD_VALUE            
              }
            }
            // Keep given book data if safe else replace invalid bookfields with default values
            const checkBookData = this.checkDataIntegrity(BOOK, CODE.OBJ_TYPE.BOOK)
            if (checkBookData === CODE.STATUS_TYPE.SUCCESS) {
              const givenData = Object.entries(BOOK)
              // Use & trust given book fields
              updateSafeBook(givenData)
            } else {
              // Get safe book data else create new book with default values
              const getSafeBookData = () => this.isObjectLiteral(givenData)
              ? givenData.map(BOOKFIELD => this.getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD))
              : new Book
              // Use safe data
              updateSafeBook(getSafeBookData())
            }
            RESULT = safeBook
            break;
          case CODE.OBJ_TYPE.BOOKFIELD:
            const BOOKFIELD = input
            const safeField = []
            const updateSafeField = fieldData => safeField.push(...fieldData)
            // Keep bookfield data if safe else replace with default values
            const checkFieldData = this.checkDataIntegrity(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
            if (checkFieldData === CODE.STATUS_TYPE.SUCCESS) {
              const givenData = BOOKFIELD
              // Use & trust given bookfield data
              updateSafeField(givenData)
            } else {
              // Get default bookfield values or create new id
              const FIELD_TYPE = BOOKFIELD[0]
              const FIELD_VALUE = FIELD_TYPE === CODE.FIELD_TYPE.ID
              ? metaData.getUniqueInteger()
              : metaData.default.book[FIELD_TYPE]
              const defaultField = [FIELD_TYPE, FIELD_VALUE]
              // Use default values
              updateSafeField(defaultField)
            }
            RESULT = safeField
            break;
          default:
            throw 'Unknown type'
        }
      } catch (error) {
        console.error('Could not retrieve safe data: ' + error)
        RESULT = CODE.STATUS_TYPE.FAILURE
      }
      return RESULT
    },
    updateBookList(input, type) {
    const oldBookList = [...data.bookList]
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
  addBook({...bookData}) {
    let RESULT // BOOK or STATUS_FAILURE
    try {
      const BOOK = new Book(...bookData) // Contains data validation
      this.updateBookList(BOOK, CODE.OBJ_TYPE.BOOK)
      RESULT = BOOK
    } catch (error) {
      console.error('Could not add book to database: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
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
    }, [...data.bookList]
    )
    return searchResults
  },
  saveToBrowser() {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Sanitize data for storage
      const safeData = this.getSafeData(data.bookList, CODE.OBJ_TYPE.BOOKLIST)
      const safeDataString = JSON.stringify(safeData)
      // Attempt to save
      localStorage.setItem(CODE.OBJ_TYPE.BOOKLIST, safeDataString)
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      console.error('Save to browser failed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  loadFromBrowser() {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Check for stored data & sanitize, else use default if empty
      const dataFound = localStorage.getItem(CODE.DATASTORE_LABEL)
      const parsedData = dataFound ? JSON.parse(dataFound) : [...metaData.default.bookList]
      const safeData = this.getSafeData(parsedData, CODE.OBJ_TYPE.BOOKLIST)
      this.updateBookList(safeData, CODE.OBJ_TYPE.BOOKLIST)
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      error => console.error('Load from browser failed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
}

// EXPORT
export default databaseAPI