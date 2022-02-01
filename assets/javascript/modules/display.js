// IMPORTS
import databaseAPI from './database.js'
import CODE from './dictionary.js' // Public Dictionary

// CONFIG
const config = {
  bookList: []
}

// ELEMENTS
const display = document.querySelector('#display')
const sampleBook = document.querySelector('[data-book-id="sampleBook"]')
const addBookModalForm = document.querySelector('#addBookModal > form')
const addBookBtn = document.querySelector('#addBookBtn')

// EVENT LISTENERS
addBookBtn.onclick = () => {
  const id = CODE.FIELD_TYPE.ID
  const title = CODE.FIELD_TYPE.TITLE
  const authorList = CODE.FIELD_TYPE.AUTHORLIST
  const subjectList = CODE.FIELD_TYPE.SUBJECTLIST
  const totalPages = CODE.FIELD_TYPE.TOTALPAGES
  const year = CODE.FIELD_TYPE.YEAR
  const bookData = {
    [id]: addBookModalForm.querySelector[`data-book-prop="${id}"`].value,
    [title]: addBookModalForm.querySelector[`data-book-prop="${title}"`].value,
    [authorList]: addBookModalForm.querySelector[`data-book-prop="${authorList}"`].value,
    [subjectList]: addBookModalForm.querySelector[`data-book-prop="${subjectList}"`].value,
    [totalPages]: addBookModalForm.querySelector[`data-book-prop="${totalPages}"`].value,
    [year]: addBookModalForm.querySelector[`data-book-prop="${year}"`].value,
  }
  addBookData(bookData)
  showBook(bookData.id)
}

// DISPLAY
const displayAPI = {
  toggleVisibility(element, visible = null) {
    visible === true
    ? element.classList.remove('hidden')
    : visible === false
    ? element.classList.add('hidden')
    : element.classList.toggle('hidden')
  },
  createBookCard({...bookData}) {
    let RESULT // newBookCard or STATUS_FAILURE
    try {
      const BOOK = bookData
      const safeBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
      const bookExists = config.bookList
      .some(BOOK => BOOK[CODE.FIELD_TYPE.ID] === safeBook[CODE.FIELD_TYPE.ID])
      // Exit early if book does not exist in display bookList
      if (!bookExists) throw 'Book with id[' + safeBook[CODE.FIELD_TYPE.ID] + '] does not exist'
      // Create BookCard
      const newBookCard = components.BookCard(safeBook)
      RESULT = newBookCard
    } catch (error) {
      console.error('Could not create book card: ' + error)
      RESULT =  CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  addBookData({...bookData}) {
    let RESULT // newBookList or STATUS_FAILURE
    try {
      const BOOKLIST = [...config.bookList]
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
      RESULT = newBookList
    } catch (error) {
      console.error('Could not add book to display BOOKLIST: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  removeBookData(...bookIdList) {
    let RESULT // newBookList or STATUS_FAILURE
    try {
      // Sanitize data
      const BOOKLIST = config.bookList
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
      RESULT = newBookList
    } catch (error) {
      console.error('Could not create book list with target books removed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  updateBookData(...bookList) {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Sanitize data
      const BOOKLIST = bookList
      const safeBookList = databaseAPI.getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      // Clear display bookList & push new books
      config.bookList.length = 0
      config.bookList.push(...safeBookList)
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      console.error('Could not update display book list: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  showBook(...bookIdList) {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Sanitize data
      const BOOKLIST = [...config.bookList]
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
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      console.error('Could not display target books: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  hideBook(...bookIdList) {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Sanitize data
      const safeIdList = bookIdList.map(id => {
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        const safeField = databaseAPI.getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
        const safeId = safeField[0]
        return safeId
      })
      const BOOKLIST = [...config.bookList]
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
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      console.error('Could not hide target books: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  checkDisplay() {
    let RESULT // displayedBooksIdList or STATUS_FAILURE
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
      RESULT = displayedBooksIdList
    } catch (error) {
      console.error('Could not retrieve books being displayed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  updateDisplay() {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      // Get id list of books displayed
      const displayedBooksIdList = this.checkDisplay() // includes error check
      // Find & sanitise ids of BookCards to display
      const BOOKLIST = [config.bookList]
      const safeBookList = databaseAPI.getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      // Remove books currently on display
      this.hideBook(...displayedBooksIdList)
      // Display safe books from display book list
      this.showBook(...safeBookList)
      RESULT = CODE.STATUS_TYPE.SUCCESS
    } catch (error) {
      console.error('Could not retrieve books being displayed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  }
}

export default displayAPI