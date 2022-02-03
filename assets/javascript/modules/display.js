// IMPORTS
import CODE from './dictionary.js'
import dataAPI from './database.js'

export default (function() {
// ELEMENTS
const display = document.querySelector('#display')

// DATASTORE SYSTEM
const data = {
  bookList: []
}

const resetBookList = () => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // old book list
  }
  try {
    data.bookList.length = 0
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

const replaceBookList = (bookList) => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // new book list
  }
  try {
    const check = dataAPI.getSafeBookList(bookList)
    // Early exit if getSafeBookList fails else continue
    if (check.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
    const safeBookList = check.CONTENTS
    resetBookList()
    data.bookList = [...safeBookList]
    // Update RESULT
    RESULT.CONTENTS = safeBookList
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    console.error('Could not reset book list: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const syncBookList = () => {
  const RESULT = { 
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
  try {
    const check = dataAPI.readBookList()
    // Early exit if readBookList fails else continue
    if (check.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not read book list'
    const safeBookList = check.CONTENTS
    replaceBookList(safeBookList)
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


const addBookData = (bookData) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // newBookList 
  }
  try {
    const BOOKLIST = [...data.bookList]
    const BOOK = bookData
    const safeBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
    const newBookList = []
    const updateNewBookList = (BOOKLIST) => {
      newBookList.push(...BOOKLIST)
    }
    // Check if book exists in display book list
    const existingBook = BOOKLIST
    .some(BOOK => BOOK[CODE.FIELD_TYPE.ID] === safeBook[CODE.FIELD_TYPE.ID])
    // Replace existing book with new version else add new book to list
    if (existingBook) {
      const bookListWithoutExistingBook = this.removeBookData(safeBook[CODE.FIELD_TYPE.ID])
      updateNewBookList(...bookListWithoutExistingBook, safeBook)
    } else {
      updateNewBookList(...BOOKLIST, safeBook)
    }
    // Update RESULT
    RESULT.CONTENTS = newBookList
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not add book to display BOOKLIST: ' + error)
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

const removeBookData = (...bookIdList) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // newBookList 
  }
  try {
    // Sanitize data
    const BOOKLIST = data.bookList
    const safeIdList = bookIdList.map(id => {
      const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
      const safeField = databaseAPI.getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
      const safeId = safeField[1]
      return safeId
    })
    const safeBookList = databaseAPI.getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
    // Get newBookList which excludes target books
    const newBookList = safeBookList
    .filter(BOOK => !safeIdList.includes(BOOK[CODE.OBJ_TYPE.ID]))
    // Update RESULT
    RESULT.CONTENTS = newBookList
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not remove books: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}

// BOOK SYSTEM
const  toggleVisibility = (element, visible = null) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
  try {
    visible === true
    ? element.classList.remove('hidden')
    : visible === false
    ? element.classList.add('hidden')
    : element.classList.toggle('hidden') 
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not toggle visibility: ' + error)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
  }

const showBook = (...bookIdList) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null 
  }
    try {
      // Sanitize data
      const BOOKLIST = [...data.bookList]
      const safeBookList = databaseAPI.getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      const safeIdList = bookIdList.map(id => {
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        const safeField = databaseAPI.getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
        const safeId = safeField[0]
        return safeId
      })
      // Only target existing books
      const validIdList = safeBookList
      .filter(BOOK => safeIdList.includes(BOOK[CODE.FIELD_TYPE.ID]))
      // Show BookCard for valid targets
      for (let index = 0; index < validIdList.length; index++) {
        const validId = validIdList[index];
        const BOOK = safeBookList.find(BOOK => BOOK[CODE.FIELD_TYPE.ID] === validId)
        const newBookCard = this.createBookCard(BOOK)
        // Show BookCard in display for target book
        display.appendChild(newBookCard)
      }
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not display target books: ' + error)
      // Update RESULT
      RESULT = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

const hideBook = (...bookIdList) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // newBookList 
  }
    try {
      // Sanitize data
      const safeIdList = bookIdList.map(id => {
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        const safeField = databaseAPI.getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
        const safeId = safeField[0]
        return safeId
      })
      const BOOKLIST = [...data.bookList]
      const safeBookList = databaseAPI.getSafeData(BOOKLIST, DOC.OBJ_TYPE.BOOKLIST)
      // Only target existing books
      const validIdList = safeBookList
      .filter(BOOK => safeIdList.includes(BOOK[CODE.FIELD_TYPE.ID]))
      // Delete target BookCards
      for (let index = 0; index < validIdList.length; index++) {
        const validId = validIdList[index];
        const BookCard = display.querySelector(`data-book-id="${validId}"`)
        BookCard.remove()        
      }
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not hide target books: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

// BOOK LIST SYSTEM
const checkDisplay = () => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // displayedBooksIdList 
  }
    try {
      // Find & sanitise ids of BookCards on display
      const cardBookList = display.querySelectorAll(['data-book-id'])
      const safeIdList = []
      for (let index = 0; index < cardBookList.length; index++) {
        const CardBook = cardBookList[index];
        const id = CardBook.getAttribute('data-book-id')
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        const safeField = databaseAPI.checkDataIntegrity(BOOKFIELD, CODE.FIELD_TYPE)
        const safeId = safeField[1]
        safeIdList.push(safeId) // Use safeId
      }
      // Return books on display
      const displayedBooksIdList = safeIdList
      // Update RESULT
      RESULT.CONTENTS = displayedBooksIdList
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      console.error('Could not retrieve books being displayed: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

const updateDisplay = () => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
    try {
      // Get id list of books displayed
      const displayedBooksIdList = this.checkDisplay() // includes error check
      // Find & sanitise ids of BookCards to display
      const BOOKLIST = [data.bookList]
      const safeBookList = databaseAPI.getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      // Remove books currently on display
      this.hideBook(...displayedBooksIdList)
      // Display safe books from display book list
      this.showBook(...safeBookList)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not retrieve books being displayed: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

return {
  toggleVisibility,
  syncBookList,
  replaceBookList,
  addBookData,
  removeBookData,
  showBook,
  hideBook,
  checkDisplay,
  updateDisplay,
}
})()