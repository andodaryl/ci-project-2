// IMPORTS
import CODE from './dictionary.js' // Public Dictionary

// DEFAULT DATA
const metaData = {
  getUniqueInteger() {
    return Date.now()
  },
  default: {
    bookList: [],
    book: {
      title: 'Enter Title',
      totalPages: 0,
      year: new Date().getFullYear(),
      authorList: [],
      subjectList: [],
    }
  }
}
Object.freeze(metaData) // Prevent changes to metaData

// CLASSES
class Book {
  constructor({...bookData}) {
    // Get safe book data
    const BOOK = bookData
    const safeBookData = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
    // Create instance properties from safe book data + new unique id
    const BOOKFIELDS = Object.entries(safeBookData)
    BOOKFIELDS.forEach(BOOKFIELD => this[BOOKFIELD[0]] = BOOKFIELD[1])
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
  matchData(input1, input2, type) {
    let RESULT // MATCH_TYPE or FAILURE
    try {
      const safeInput1 = this.getSafeData(input1, type)
      const safeInput2 = this.getSafeData(input2, type)
      let isExactMatch, isPartialMatch
      switch(type) {
        case CODE.OBJ_TYPE.BOOKFIELD:
          const BOOKFIELD1 = safeInput1
          const BOOKFIELD2 = safeInput2
          BOOKFIELD1 === BOOKFIELD2
          ? RESULT = CODE.MATCH_TYPE.EXACT
          : RESULT = CODE.MATCH_TYPE.NONE
          break;
        case CODE.OBJ_TYPE.BOOK:
          const bookData1 = Object.entries(safeInput1)
          const bookData2 = Object.entries(safeInput2)
          isExactMatch = bookData1.every(BOOKFIELD1 => 
            bookData2.every(
              BOOKFIELD2 => this.matchData(BOOKFIELD1, BOOKFIELD2, CODE.OBJ_TYPE.BOOKFIELD)
            )
          )
          isPartialMatch = bookData1.some(BOOKFIELD1 => 
            bookData2.some(
              BOOKFIELD2 => this.matchData(BOOKFIELD1, BOOKFIELD2, CODE.OBJ_TYPE.BOOKFIELD)
            )
          )
          RESULT = isExactMatch 
          ? CODE.MATCH_TYPE.EXACT 
          : isPartialMatch
          ? CODE.MATCH_TYPE.SOME
          : CODE.MATCH_TYPE.NONE
          break;
          case CODE.OBJ_TYPE.BOOKLIST:
            const BOOKLIST1 = Object.entries(safeInput1)
            const BOOKLIST2 = Object.entries(safeInput2)
            isExactMatch = BOOKLIST1.every(BOOK1 => 
              BOOKLIST2.every(
                BOOK2 => this.matchData(BOOK1, BOOK2, CODE.OBJ_TYPE.BOOKFIELD)
              )
            )
            isPartialMatch = BOOKLIST1.some(BOOK1 => 
              BOOKLIST2.some(
                BOOK2 => this.matchData(BOOK1, BOOK2, CODE.OBJ_TYPE.BOOKFIELD)
              )
            )
            RESULT = isExactMatch 
            ? CODE.MATCH_TYPE.EXACT 
            : isPartialMatch
            ? CODE.MATCH_TYPE.SOME
            : CODE.MATCH_TYPE.NONE
            break;
        default:
          throw 'Unknown type'
      }
    } catch (error) {
      console.error('Could not compare data: ' + error)
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
  deleteBooks([...idList]) {
    let RESULT // deletedBooks or STATUS_FAILURE
    try {
      // Use valid ids only
      const safeDeleteList = idList
      .filter(id => this.checkDataIntegrity(id, CODE.FIELD_TYPE.ID) === CODE.STATUS_TYPE.SUCCESS)
      // Find books to be deleted: check if book id is in safeDeleteList
      const deletedBooks = data.bookList
      .filter(BOOK => safeDeleteList.indexOf(BOOK[CODE.FIELD_TYPE.ID]) > -1 )
      // Create new BOOKLIST with deletedBooks removed
      const BOOKLIST = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) < 0)
      // Update database
      this.updateBookList(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      RESULT = deletedBooks
    } catch (error) {
      console.error('Could not delete books: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  searchList({...searchTermsObject}) {
    let RESULT // searchResults or STATUS_FAILURE
    try {
      // Filters & refines BOOKLIST according to searchTerms
      const filteringLogic = (previousResults, currentSearchTerm) => {
        const safeData = this.getSafeData(currentSearchTerm, CODE.OBJ_TYPE.BOOKFIELD)
        const [FIELD_TYPE, FIELD_VALUE] = safeData
        switch(FIELD_TYPE) {
          case CODE.FIELD_TYPE.TITLE:
            // Check match in book title: case insensitive
            return previousResults.filter(BOOK => {
              const bookTitle = BOOK[FIELD_TYPE].toLowerCase()
              return bookTitle.includes(FIELD_VALUE.toLowerCase())
            })
          case CODE.FIELD_TYPE.TOTALPAGES:
          case CODE.FIELD_TYPE.YEAR:
            // Check if book + search numbers match
            return previousResults.filter(BOOK => BOOK[FIELD_TYPE] === FIELD_VALUE)
          case CODE.FIELD_TYPE.AUTHORLIST:
          case CODE.FIELD_TYPE.SUBJECTLIST:
            // Check if some author/subjects in book are in subSearchTerms: case insensitive
            return previousResults.filter(BOOK => {
              const BOOKFIELD = BOOK[FIELD_TYPE]
              const subSearchTerms = FIELD_VALUE.map(item => item.toLowerCase())
              return BOOKFIELD.some(item => subSearchTerms.indexOf(item.toLowerCase()) > -1) 
            })
          default:
            return previousResults // No change
        }
      }
      // Activate process
      const safeBookList = this.getSafeData(data.bookList, CODE.OBJ_TYPE.BOOKLIST)
      const searchTermsArray = Object.entries(searchTermsObject)
      const searchResults = searchTermsArray.reduce(filteringLogic, safeBookList)
      RESULT = searchResults
    } catch (error) {
      console.error('Could not complete search: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
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
export default dataAPI