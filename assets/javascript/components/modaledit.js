//IMPORT
import CODE from '../modules/dictionary.js'
import displayAPI from '../modules/display.js'
import dataAPI from '../modules/database.js'
import bindAddBookAction from './addbook.js'

// EXPORT add book card behaviour
export default ({display, sampleBook, bookModal}) => (bookData) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
  try {
    // Sanitize data
    const checkBook = dataAPI.getSafeBook(bookData)
    if (checkBook.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book'
    const safeBook = checkBook.CONTENTS
    // Done Button on Modal
    const addBookBtn = bookModal.querySelector('#addBookBtn')
    addBookBtn.setAttribute('data-book-action', 'edit')
    addBookBtn.innerText = 'done'
    // Listener events
    const addBookAction = bindAddBookAction({display, sampleBook, bookModal})
    addBookBtn.onclick = () => addBookAction(safeBook)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not carry out modal behaviour: ' + error)
    RESULT.STATUS = CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}