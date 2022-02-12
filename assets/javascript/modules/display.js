// IMPORTS
import CODE from './dictionary.js'
import dataAPI from './database.js'
import bindBookCard from '../components/bookcard.js'

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
    data.bookList = [...safeBookList]
    syncDisplay()
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

const addBook = (bookData) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // new book
  }
  try {
    const checkBook = dataAPI.getSafeBook(bookData)
    // Early exit if getSafeBook fails else continue
    if (checkBook.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book'
    const safeBook = checkBook.CONTENTS
    const checkBookList = dataAPI.getSafeBookList(data.bookList)
    // Early exit if getSafeBookList fails else continue
    if (checkBookList.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
    const safeBookList = checkBookList.CONTENTS
    // Delete book from book list if book id exists
    const id = safeBook[CODE.FIELD_TYPE.ID]
    const bookExists = safeBookList.some(book => book[CODE.FIELD_TYPE.ID] === id)
    if (bookExists) deleteBook(id)
    // Create new book list
    const newBookList = [...safeBookList, safeBook] // concat new book with old book list
    replaceBookList(newBookList)
    // Update RESULT
    RESULT.CONTENTS = safeBook
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not add book to display BOOKLIST: ' + error)
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
    .filter(id => dataAPI.isBookField(CODE.FIELD_TYPE.ID, id).CONTENTS) // nulls are removed
    // Find books to be deleted from book list: check if book id is in safeDeleteList
    const targetBooks = data.bookList
    .filter(book => safeDeleteList.indexOf(book[CODE.FIELD_TYPE.ID]) > -1 )
    // Create new book list with target books removed
    const newBookList = data.bookList.filter(book => 
      safeDeleteList.indexOf(book[CODE.FIELD_TYPE.ID]) < 0)
    // Update datastore
    replaceBookList(newBookList)
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

// BOOK SYSTEM
const toggleVisibility = (element, visible = null) => {
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
    CONTENTS: null // id list of books displayed
  }
    try {
      // Sanitize data
      const checkBooklist = dataAPI.getSafeBookList(data.bookList)
      if (checkBooklist.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
      const safeBookList = checkBooklist.CONTENTS
      // Use safe IDs only
      const safeIdList = bookIdList
      .filter(id => dataAPI.isBookField(CODE.FIELD_TYPE.ID, id).CONTENTS) // nulls are removed
      // Only target existing books
      const targetIdList = safeBookList
      .filter(BOOK => safeIdList.includes(BOOK[CODE.FIELD_TYPE.ID]))
      // Show BookCard for valid targets
      targetIdList.forEach(id => {
        const attribute = `[data-book-id="${id}"]`
        const BookCard = document.querySelector(attribute)
        toggleVisibility(BookCard, true)
      });
      // Update RESULT
      RESULT.CONTENTS = targetIdList
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
      CONTENTS: null // id list of books displayed
    }
      try {
        // Sanitize data
        const checkBooklist = dataAPI.getSafeBookList(data.bookList)
        if (checkBooklist.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
        const safeBookList = checkBooklist.CONTENTS
        // Use safe IDs only
        const safeIdList = bookIdList
        .filter(id => dataAPI.isBookField(CODE.FIELD_TYPE.ID, id).CONTENTS) // nulls are removed
        // Only target existing books
        const targetIdList = safeBookList
        .filter(BOOK => safeIdList.includes(BOOK[CODE.FIELD_TYPE.ID]))
        // Show BookCard for valid targets
        targetIdList.forEach(id => {
          const attribute = `[data-book-id="${id}"]`
          const BookCard = document.querySelector(attribute)
          toggleVisibility(BookCard, false)
        });
        // Update RESULT
        RESULT.CONTENTS = targetIdList
        RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
      } catch (error) {
        if (CODE.DEBUG_MODE) console.error('Could not hide target books: ' + error)
        // Update RESULT
        RESULT = CODE.STATUS_TYPE.FAILURE
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
      const display = document.querySelector('#book-list')
      const cardBookList = display.querySelectorAll('[data-book-id]')
      const safeIdList = []
      for (let index = 0; index < cardBookList.length; index++) {
        const CardBook = cardBookList[index];
        const id = CardBook.getAttribute('data-book-id')
        const safeBookFieldArray = dataAPI.getSafeBookField(CODE.FIELD_TYPE.ID, id).CONTENTS
        const safeId = safeBookFieldArray[1]
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

const syncDisplay = () => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // id list of books displayed
  }
    try {
      // Get id list of books displayed
      const displayedBooksIdList = checkDisplay().CONTENTS // includes error check
      // Find & sanitise ids of BookCards to display
      const checkBookList = dataAPI.getSafeBookList(data.bookList)
      if (checkBookList.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book list'
      const safeBookList = checkBookList.CONTENTS
      // Get id list
      const targetIdList = safeBookList.map(book => book[CODE.FIELD_TYPE.ID])
      // Remove books currently on display
      displayedBooksIdList.forEach(
        id => {
          const prop = `[data-book-id="${id}"]`
          const bookCard = document.querySelector(prop)
          console.log(bookCard)
          bookCard.remove()
        })
      // Append books from display book list
      const display = document.querySelector('#book-list')
      const bookModal = document.querySelector('#bookModal')
      const sampleBook = document.querySelector('[data-book-id="sampleBook"]')
      const generateBookCard = bindBookCard({display, sampleBook, bookModal})
      targetIdList.forEach(
        id => {
          const safeBookData = safeBookList.find(book => book[CODE.FIELD_TYPE.ID === id])
          const newBookCard = generateBookCard(safeBookData)
          display.append(newBookCard)
        })
      // Update RESULT
      RESULT.CONTENTS = targetIdList
      RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      if (CODE.DEBUG_MODE) console.error('Could not display target books: ' + error)
      // Update RESULT
      RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
    } finally {
      return RESULT
    }
  }

return {
  resetBookList,
  syncBookList,
  replaceBookList,
  addBook,
  deleteBook,
  toggleVisibility,
  showBook,
  hideBook,
  checkDisplay,
  syncDisplay,
}
})()