// IMPORTS
import databaseAPI from './database.js'
import CODE from './dictionary.js' // Public Dictionary

// CONFIG
const config = {
  BOOKLIST: []
}

// ELEMENTS
const display = document.querySelector('#display')
const sampleBook = document.querySelector('[data-book-id="sampleBook"]')

// COMPONENTS
const components = {
  BookCard({...bookData}) {
    let RESULT // BookCard or STATUS_FAILURE
    try {   
      const BOOK = bookData
      const safeBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
      // Exit early if data is unsafe
      if (safeBook === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe data'
      const bookId = safeBook[CODE.FIELD_TYPE.ID]
      // Create component & target sub-components
      const clone = sampleBook.cloneNode(true)
      const actionBtnContainer = clone.querySelector('.action-btn-container')
      const deleteBtn = actionBtnContainer.querySelector('[data-action-type="delete"]')
      const editBtn = actionBtnContainer.querySelector('[data-action-type="edit"]')
      // Default component states
      clone.setAttribute('data-book-id', bookId)
      clone.classList.toggle('d-none')
      clone.removeAttribute('aria-hidden')
      databaseAPI.toggleVisibility(actionBtnContainer, true)
      // Component behaviours
      // Container
      clone.onmouseenter = () => databaseAPI.toggleVisibility(actionBtnContainer, true)
      clone.onmouseleave = () => databaseAPI.toggleVisibility(actionBtnContainer, false)
      // Delete Button
      deleteBtn.onclick = () => displayAPI.removeBook(bookId)
      // Edit Button
      editBtn.onclick = () => console.log('Edit modal activated')
    } catch (error) {
      console.error('Could not create BookCard component: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  }
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
    let RESULT // BOOK or STATUS_FAILURE
    try {
      const BOOK = bookData
      const safeBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
      const bookExists = config.BOOKLIST
      .some(BOOK => BOOK[CODE.FIELD_TYPE.ID] === safeBook[CODE.FIELD_TYPE.ID])
      // Exit early if book does not exist in display BOOKLIST
      if (!bookExists) throw 'Book with id[' + safeBook[CODE.FIELD_TYPE.ID] + '] does not exist'
      // Create book card
      const newBookCard = components.BookCard(safeBook)
      RESULT = newBookCard
    } catch (error) {
      console.error('Could not create book card: ' + error)
      RESULT =  CODE.STATUS_TYPE.FAILURE
    }
  },
  addBookData({...bookData}) {
    let RESULT // newBOOKLIST or STATUS_FAILURE
    try {
      const BOOK = bookData
      const safeNewBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
      const oldBOOKLIST = [...config.BOOKLIST]
      const newBOOKLIST = []
      const updateNewBOOKLIST = (BOOKLIST) => {
        newBOOKLIST.push(...BOOKLIST)
      }
      // Check if book exists in display book list
      const existingBook = oldBOOKLIST
      .some(BOOK => BOOK[CODE.FIELD_TYPE.ID] === safeNewBook[CODE.FIELD_TYPE.ID])
      // Replace existing book with new version else add new book to list
      if (existingBook) {
        const existingBookRemoved = this.removeBookData(safeNewBook[CODE.FIELD_TYPE.ID])
        updateNewBOOKLIST(...existingBookRemoved, safeNewBook)
      } else {
        updateNewBOOKLIST(...oldBOOKLIST, safeNewBook)
      }
      RESULT = newBOOKLIST
    } catch (error) {
      console.error('Could not add book to display BOOKLIST: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  removeBookData(...bookIdList) {
    let RESULT // newBOOKLIST or STATUS_FAILURE
    try {
      // Get BOOKLIST excluding books with target ids
      const safeIdList = bookIdList.map(id => {
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
      })
      const newBOOKLIST = config.BOOKLIST
      .filter(BOOK => !safeIdList.includes(BOOK[CODE.OBJ_TYPE.ID]))
      // Return book list with target books removed
      RESULT = newBOOKLIST
    } catch (error) {
      console.error('Could not create book list with target books removed: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  },
  updateBookData(...BOOKLIST) {
    let RESULT // STATUS_SUCCESS or FAILURE
    try {
      const safeBOOKLIST = getSafeData(BOOKLIST, CODE.OBJ_TYPE.BOOKLIST)
      // Clear BOOKLIST & push new books
      config.BOOKLIST.length = 0
      config.BOOKLIST.push(...safeBOOKLIST)
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
      const BOOKLIST = [...config.BOOKLIST]
      // Sanitize data
      const safeIdList = bookIdList.map(id => {
        const BOOKFIELD = [CODE.FIELD_TYPE.ID, id]
        const safeField = getSafeData(BOOKFIELD, CODE.OBJ_TYPE.BOOKFIELD)
        const safeId = safeField[0]
        return safeId
      })
      // Only target existing books
      const validIdList = BOOKLIST
      .filter(BOOK => safeIdList.includes(BOOK[CODE.FIELD_TYPE.ID]))
      for (let index = 0; index < validIdList.length; index++) {
        const validId = validIdList[index];
        const BOOK = BOOKLIST.find(BOOK => BOOK[CODE.FIELD_TYPE.ID] === validId)
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
    try {
      for (let index = 0; index < bookIdList.length; index++) {
        const bookId = bookIdList[index];
        const targetBook = document.querySelector(`[data-book-id="${bookId}"]`)
        targetBook.remove()
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export default displayAPI