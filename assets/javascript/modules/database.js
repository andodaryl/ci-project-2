// IMPORTS
import CODE from './dictionary.js' // Public Dictionary

// EXPORT
export default (function() {

// HELPER FUNCTIONS
const isObjectLiteral = input => 
input.constructor === Book || input.constructor === Object ? true : false

const isObjectEntry = input => 
Array.isArray(input) && input.length === 2 && typeof input[0] === 'string'

const getUniqueInteger = () => Date.now()

// CLASSES
class Book {
  constructor({...bookData}) {
    // Get safe book data
    const safeBookData = getSafeBook(bookData)
    // Add properties to instance from safe book data + new unique id
    this[CODE.FIELD_TYPE.ID] = getUniqueInteger()
    this[CODE.FIELD_TYPE.TITLE] = safeBookData[CODE.FIELD_TYPE.TITLE]
    this[CODE.FIELD_TYPE.TOTAL_PAGES] = safeBookData[CODE.FIELD_TYPE.TOTAL_PAGES]
    this[CODE.FIELD_TYPE.YEAR] = safeBookData[CODE.FIELD_TYPE.YEAR]
    this[CODE.FIELD_TYPE.AUTHOR_LIST] = safeBookData[CODE.FIELD_TYPE.AUTHOR_LIST]
    this[CODE.FIELD_TYPE.SUBJECT_LIST] = safeBookData[CODE.FIELD_TYPE.SUBJECT_LIST]
  }
}

// DATABASE
const data = {  
  bookList: [],
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

// Prevent direct properties of these objects from being altered
Object.freeze(data) // data object
Object.freeze(data.default) // default object

// DATA INTEGRITY SYSTEM
const isBookList = (input, deepCheck = false) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // boolean
  }
  try {
    // Update RESULT
    // Shallow check: data type
    // Deep check: all array items are books that have safe fields
    RESULT.CONTENTS = deepCheck
    ? Array.isArray(input) && input.every(book => isBook(book).CONTENTS)
    : Array.isArray(input)
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS 
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not check if input is book list: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const isBook = (input, deepCheck = false) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // boolean
  }
  try {
    // Update RESULT
    // Shallow check: data type
    // Deep check: all field types are safe
    RESULT.CONTENTS = deepCheck
    ? isObjectLiteral(input) && Object.entries(input)
    .every(bookFieldArray => isBookField(...bookFieldArray).CONTENTS)
    : isObjectLiteral(input)
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS 
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not check if input is book: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const isBookField = (type, value) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // boolean
  }
  try {
    // Early exit if input is not in the form [string, value]
    if (!isObjectEntry([type, value])) throw 'Input is not an object entry'
    // Check if input is a BOOK_FIELD
    switch(type) {
      case CODE.FIELD_TYPE.TITLE:
        // Update RESULT
        RESULT.CONTENTS = typeof value === 'string'
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
        break;
      case CODE.FIELD_TYPE.TOTAL_PAGES:
      case CODE.FIELD_TYPE.YEAR:
      case CODE.FIELD_TYPE.ID:
        // Update RESULT
        RESULT.CONTENTS = Number.isInteger(value)
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
        break;
      case CODE.FIELD_TYPE.AUTHOR_LIST:
      case CODE.FIELD_TYPE.SUBJECT_LIST:
        // Update RESULT
        RESULT.CONTENTS = Array.isArray(value)
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
        break;
      default:
        throw 'Invalid type'
    }
  } catch (error) {
    if (DEBUG_MODE) console.error('Could not check if input is book field: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const getSafeBookList = (input, deepCheck = true) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // BOOK_LIST
  }
  try {
    const safeBookListArray = [...data.default[type]]
    const updateSafeData = booksArray => safeBookListArray.push(...booksArray)
    // Return default book list if fail shallow check
    // Return array of safe books that pass deep check
    // Return input if pass shallow check
    if (isBookList(input).CONTENTS) {
      const childrenArray = deepCheck
      ? input.map(BOOK => getSafeBook(BOOK, deepCheck).CONTENTS) // returns null if fail
      .filter(BOOK => isBook(BOOK, deepCheck).CONTENTS) // removes null items
      : [...input]
      updateSafeData(childrenArray)
    }
    // Update RESULT
    RESULT.CONTENTS = safeBookListArray
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not check if input is book: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const getSafeBook = (input, deepCheck = true) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // BOOK
  }
  try {
    const safeBookObject = [...data.default[type]]
    const updateSafeData = bookFieldArray => {
      bookFieldArray.forEach(BOOK_FIELD => {
        [FIELD_TYPE, FIELD_VALUE] = BOOK_FIELD
        safeBookObject[FIELD_TYPE] = FIELD_VALUE
      })
    }
    // Return default book if fail shallow check
    // Return book with default values for fields that fail deep check
    // Return input if pass shallow check
    if (isBook(input).CONTENTS) {
      const childrenArray = deepCheck
      ? Object.entries(input)
      .map(bookFieldArray => getSafeBookField(...bookFieldArray).CONTENTS) // returns null if fail
      .filter(bookFieldArray => isBookField(...bookFieldArray).CONTENTS) // removes null items
      : {...input}
      updateSafeData(childrenArray)
    }
    // Update RESULT
    RESULT.CONTENTS = safeBookObject
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not check if input is book: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const getSafeBookField = (type, value) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // BOOK_FIELD
  }
  try {
    // Early exit if input is not in the form [string, value]
    if (!isObjectEntry([type, value])) throw 'Input is not an object entry'
    // Check if input is a BOOK_FIELD
    switch(type) {
      case CODE.FIELD_TYPE.TITLE:
      case CODE.FIELD_TYPE.TOTAL_PAGES:
      case CODE.FIELD_TYPE.YEAR:
      case CODE.FIELD_TYPE.AUTHOR_LIST:
      case CODE.FIELD_TYPE.SUBJECT_LIST:
        // Update RESULT
        // Return input if valid else default value
        RESULT.CONTENTS = isBookField(type, value).CONTENTS
        ? [type, value]
        : [type, data.default[type]]
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
        break;
      case CODE.FIELD_TYPE.ID:
        // Update RESULT
        // Return input if valid else new ID
        RESULT.CONTENTS = isBookField(type, value).CONTENTS
        ? [type, value]
        : [type, getUniqueInteger()]
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
        break;
      default:
        throw 'Invalid type'
    }
  } catch (error) {
    if (DEBUG_MODE) console.error('Could not check if input is book field: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

// DATA MANIPULATION SYSTEM
const resetBookList = () => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
  try {
    // Remove book list contents and push default values
    data.bookList.length = 0
    data.bookList.push(...data.default.bookList)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    console.error('Could not reset book list: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const replaceBookList = (input) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // new book list array
  }
  try {
    // Attempt to get safe book list
    const check = getSafeBookList(input, true)
    // Exit early if getSafeBookList fails else continue + replace book list
    if (check.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
    const safeBookListArray = check.CONTENTS
    resetBookList()
    data.bookList.push(...safeBookListArray)
    // Update RESULT
    RESULT.CONTENTS = safeBookListArray
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    console.error('Could not replace book list: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const searchBookList = ({...searchTermsObject}) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // searchResults
  }
  try {
    // Filters & refines BOOKLIST according to searchTerms
    const filteringLogic = (previousResults, currentSearchTerm) => {
      const safeData = getSafeData(currentSearchTerm, CODE.OBJ_TYPE.BOOKFIELD)
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
    const safeBookList = getSafeData(data.bookList, CODE.OBJ_TYPE.BOOK_LIST)
    const searchTermsArray = Object.entries(searchTermsObject)
    const searchResults = searchTermsArray.reduce(filteringLogic, safeBookList)
    // Update RESULT
    RESULT.CONTENTS = searchResults
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not complete search: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}
  
const addBook = ({...bookData}) => {
    const RESULT = { 
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null // new book instance added to book list
    }
    try {
      const check = getSafeBook(bookData, true)
      // Exit early if getSafeBook fails else continue
      if (check.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book'
      const safeBookObject = check.CONTENTS
      const BOOK = new Book(...safeBookObject)
      data.bookList.push(BOOK) // Add to book list
      // Update RESULT
      RESULT.CONTENTS = BOOK
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not add book to list: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

const deleteBook = (...idList) => {
    const RESULT = {
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null // target books for deletion
    }
    try {
      // Use safe IDs only
      const safeDeleteList = idList
      .filter(id => isBookField(CODE.FIELD_TYPE.ID, id).CONTENTS) // nulls are removed
      // Find books to be deleted from book list: check if book id is in safeDeleteList
      const targetBooks = data.bookList
      .filter(book => safeDeleteList.indexOf(book[CODE.FIELD_TYPE.ID]) > -1 )
      // Create new book list with target books removed
      const newBookList = data.bookList.filter(book => safeDeleteList.indexOf(book.bookNumber) < 0)
      // Update database
      replaceBookList(newBookList, CODE.OBJ_TYPE.BOOK_LIST)
      // Update RESULT
      RESULT.CONTENTS = targetBooks
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not delete books: ' + error)
      // Update RESULT
      RESULT.STATUS_TYPE = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

// BROWSER STORAGE SYSTEM
const saveToBrowser = () => {
    const RESULT = {
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null
    }
    try {
      // Sanitize data for storage
      const safeData = getSafeData(data.bookList, CODE.OBJ_TYPE.BOOK_LIST)
      const safeDataString = JSON.stringify(safeData)
      // Attempt to save
      localStorage.setItem(CODE.OBJ_TYPE.BOOK_LIST, safeDataString)
      // Update RESULT
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      if (CODE.DEBUG_MODE) console.error('Save to browser failed: ' + error)
      // Update RESULT
      RESULT = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }
  
const loadFromBrowser = () => {
    const RESULT = {
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null
    }
    try {
      // Check for stored data & sanitize, else use default if empty
      const dataFound = localStorage.getItem(CODE.DATASTORE_LABEL)
      const parsedData = dataFound ? JSON.parse(dataFound) : [...metaData.default.bookList]
      const safeData = getSafeData(parsedData, CODE.OBJ_TYPE.BOOK_LIST)
      updateBookList(safeData, CODE.OBJ_TYPE.BOOK_LIST)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      error => console.error('Load from browser failed: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  }

// SESSION STORAGE SYSTEM
const saveToSesssion = () => {
    const RESULT = {
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null
    }
    try {
      // Sanitize data for storage
      const safeData = getSafeData(data.bookList, CODE.OBJ_TYPE.BOOK_LIST)
      const safeDataString = JSON.stringify(safeData)
      // Attempt to save
      sessionStorage.setItem(CODE.OBJ_TYPE.BOOK_LIST, safeDataString)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      if (DEBUG_MODE) console.error('Save to session storage failed: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }
  
const loadFromSesssion = () => {
    const RESULT = {
      STATUS: CODE.STATUS_TYPE.WAIT,
      CONTENTS: null
    }
    try {
      // Check for stored data & sanitize, else use default if empty
      const dataFound = sessionStorage.getItem(CODE.DATASTORE_LABEL)
      const parsedData = dataFound ? JSON.parse(dataFound) : [...metaData.default.bookList]
      const safeData = getSafeData(parsedData, CODE.OBJ_TYPE.BOOK_LIST)
      updateBookList(safeData, CODE.OBJ_TYPE.BOOK_LIST)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      // Log error
      if (CODE.DEBUG_MODE) console.error('Load from session storage failed: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

// dataAPI
return {
  isBookList,
  isBook,
  isBookField,
  getSafeBookList,
  getSafeBook,
  getSafeBookField,
  resetBookList,
  replaceBookList,
  searchBookList,
  addBook,
  deleteBook,
  saveToBrowser,
  loadFromBrowser,
  saveToSesssion, 
  loadFromSesssion,
}
})()