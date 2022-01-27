// IMPORTS
import databaseAPI from './database.js'
import CODE from './dictionary.js' // Public Dictionary

const display = document.querySelector('#display')
const sampleBook = document.querySelector('[data-book-id="sampleBook"]')

const displayAPI = {
toggleVisibility(element) {
  element.classList.toggle('hidden')
},  
createCardBook(bookId) {
  if (!bookId) {
    console.error('Invalid bookId')
    return CODE.STATUS_FAILURE
  } // Exit early if invalid input
  const clone = sampleBook.cloneNode(true)
  const actionBtnContainer = clone.querySelector('.action-btn-container')
  const deleteBtn = actionBtnContainer.querySelector('[data-action-type="delete"]')
  const editBtn = actionBtnContainer.querySelector('[data-action-type="edit"]')
  // Bind functions
  this.toggleVisibility = this.toggleVisibility.bind(this)
  this.removeBook = this.removeBook.bind(this)
  // Default states
  clone.setAttribute('data-book-id', bookId)
  clone.classList.toggle('visually-hidden')
  this.toggleVisibility(actionBtnContainer)
  // Component behaviour
  // container
  clone.onmouseenter = () => this.toggleVisibility(actionBtnContainer)
  clone.onmouseleave = () => this.toggleVisibility(actionBtnContainer)
  // action buttons
  deleteBtn.onclick = () => {
    this.removeBook(bookId)
  }
  editBtn.onclick = () => {
    console.log('Edit button clicked')
  }
  // Return new clone
  return clone
},
showBook(...bookList) {
  for (let index = 0; index < bookList.length; index++) {
    const book = bookList[index];
    display.appendChild(book)
  }
},
removeBook(...bookIdList) {
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