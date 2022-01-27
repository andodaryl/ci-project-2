// IMPORTS
import CODE from './modules/dictionary.js' // Public Dictionary
import databaseAPI from './modules/database.js'
import displayAPI from './modules/display.js'

// COMPONENTS
// addBookBtn
const addBookBtn = document.querySelector('#addBookBtn')
addBookBtn.onclick = () => {
  const bookId = 1
  const newBook = displayAPI.createCardBook(bookId)
  newBook === CODE.STATUS_FAILURE
  ? console.error('Book not created')
  : displayAPI.showBook(newBook)
}