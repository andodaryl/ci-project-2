// IMPORT
import CODE from '../modules/dictionary.js'
import displayAPI from '../modules/display.js'
import dataAPI from '../modules/database.js'
import bindModalEdit from './modaledit.js'

// EXPORT book card generator
export default ({display, sampleBook, bookModal}) => (bookData) => {
   const RESULT = {
     STATUS: CODE.STATUS_TYPE.WAIT,
     CONTENTS: null // BookCard Element
   }
   try {   
     const checkSafeBook = dataAPI.getSafeBookList(bookData)
     // Exit early if data is unsafe
     if (checkSafeBook.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book'
     const safeBook = checkSafeBook.CONTENTS
     const safeBookId = safeBook[CODE.FIELD_TYPE.ID]
     // Create component & target sub-components
     const clone = sampleBook.cloneNode(true)
     const actionBtnContainer = clone.querySelector('.action-btn-container')
     const deleteBtn = actionBtnContainer.querySelector('[data-action-type="delete"]')
     const editBtn = actionBtnContainer.querySelector('[data-action-type="edit"]')
     // Default component states
     clone.setAttribute('data-book-id', safeBookId)
     clone.classList.toggle('d-none')
     clone.removeAttribute('aria-hidden')
     displayAPI.toggleVisibility(actionBtnContainer, true)
     // Component behaviours
     // Container
     clone.onmouseenter = () => displayAPI.toggleVisibility(actionBtnContainer, true)
     clone.onmouseleave = () => displayAPI.toggleVisibility(actionBtnContainer, false)
     // Delete Button
     deleteBtn.onclick = () => displayAPI.deleteBook(safeBookId)
     // Edit Button
     const modalEditAction = bindModalEdit({display, sampleBook, bookModal})
     editBtn.onclick = () => modalEditAction(safeBook)
    //  Update RESULT
    RESULT.CONTENTS = clone
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
   } catch (error) {
     if (CODE.DEBUG_MODE) console.error('Could not create BookCard component: ' + error)
    //  Update RESULT
     RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
   } finally {
     return RESULT
   }
 }