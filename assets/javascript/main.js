import database from './modules/database.js'

const bookList = document.querySelector('#bookList')
const bookCard = document.querySelector('#addBookCard')
const addBookForm = document.querySelector('#addBookCard form')

function toggleVisibility(element) {
  element.classList.toggle('hidden')
}

function addCard(event) {
  event.preventDefault()
  const bookNumber = 0
  const clone = bookCard.cloneNode(true)
  const submitBtn = clone.querySelector('[type="submit"]')
  const resetBtn = clone.querySelector('[type="reset"]')
  const containerBtn = clone.querySelector('.btn-container-action')
  // Default states
  clone.removeAttribute('id')
  toggleVisibility(containerBtn)
  submitBtn.innerText = 'Accept'
  resetBtn.innerText = 'Cancel'
  // Event listeners
  clone.onmouseenter = function() {
    toggleVisibility(containerBtn)
  }
  clone.onmouseleave = function() {
    toggleVisibility(containerBtn)
  }
  // Add to DOM
  bookList.appendChild(clone)
}

addBookForm.onsubmit = addCard