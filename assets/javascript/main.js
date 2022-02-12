// IMPORTS
import CODE from './modules/dictionary.js' // Public Dictionary
import dataAPI from './modules/database.js'
import displayAPI from './modules/display.js'
import bindModalCreate from './components/modalcreate.js'

const display = document.querySelector('#book-list')
const bookModal = document.querySelector('#bookModal')
const sampleBook = document.querySelector('[data-book-id="sampleBook"]')

// Create Book Card
const modalCreateBtn = document.querySelector('.btn-modal-activate[data-modal-action="add"]')
const modalCreateAction = bindModalCreate({display, bookModal, sampleBook})
modalCreateBtn.onclick = () => modalCreateAction()
