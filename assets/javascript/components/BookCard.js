//IMPORT
import displayAPI from '../modules/display'

 function BookCard({...bookData}) {
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
      deleteBtn.onclick = () => displayAPI.hideBook(bookId)
      // Edit Button
      editBtn.onclick = () => console.log('Edit modal activated')
    } catch (error) {
      console.error('Could not create BookCard component: ' + error)
      RESULT = CODE.STATUS_TYPE.FAILURE
    }
    return RESULT
  }