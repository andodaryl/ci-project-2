//IMPORT
import CODE from '../modules/dictionary.js'
import dataAPI from '../modules/database.js'
import bindAddBookAction from './addbook.js'

// EXPORT add book card behaviour
export default ({display, sampleBook, bookModal}) => () => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null
  }
  try {
    // Create book data from modal inputs
    const props = {
      [CODE.FIELD_TYPE.TITLE]: `[data-book-prop="${CODE.FIELD_TYPE.TITLE}"]`,
      [CODE.FIELD_TYPE.AUTHOR_LIST]: `[data-book-prop="${CODE.FIELD_TYPE.AUTHOR_LIST}"]`,
      [CODE.FIELD_TYPE.SUBJECT_LIST]: `[data-book-prop="${CODE.FIELD_TYPE.SUBJECT_LIST}"]`,
      [CODE.FIELD_TYPE.YEAR]: `[data-book-prop="${CODE.FIELD_TYPE.YEAR}"]`,
      [CODE.FIELD_TYPE.TOTAL_PAGES]:  `[data-book-prop="${CODE.FIELD_TYPE.TOTAL_PAGES}"]`,
    }

    const title = bookModal.querySelector(props[CODE.FIELD_TYPE.TITLE]).value 
    const authorList = bookModal.querySelector(props[CODE.FIELD_TYPE.AUTHOR_LIST]).value 
    const year = bookModal.querySelector(props[CODE.FIELD_TYPE.YEAR]).value 
    const totalPages = bookModal.querySelector(props[CODE.FIELD_TYPE.TOTAL_PAGES]).value 
    const subjectList = bookModal.querySelector(props[CODE.FIELD_TYPE.SUBJECT_LIST]).value 
    const bookData = {title, authorList, year, totalPages, subjectList}

    const checkBook = dataAPI.getSafeBook(bookData)
    if (checkBook.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book from modal'
    const safeBook = checkBook.CONTENTS

    // Create Button on Modal
    const addBookBtn = bookModal.querySelector('#addBookBtn')
    addBookBtn.setAttribute('data-book-action', 'create')
    addBookBtn.innerText = 'create'
    // Listener events
    const addBookAction = bindAddBookAction({display, sampleBook, bookModal})
    addBookBtn.onclick = () => addBookAction(safeBook)
    // Update RESULT
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not edit book modal details: ' + error)
    // Update RESULT
    RESULT.STATUS =  CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}