// IMPORT
import CODE from '../modules/dictionary.js'
import displayAPI from '../modules/display.js'

// EXPORT book card generator
export default createBookCard = ({...bookData}) => {
   const RESULT = {
     STATUS: CODE.STATUS_TYPE.WAIT,
     CONTENTS: null // BookCard
   }
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
     deleteBtn.onclick = () => displayAPI.hideBook(bookId)
     // Edit Button
     editBtn.onclick = () => console.log('Edit modal activated')
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