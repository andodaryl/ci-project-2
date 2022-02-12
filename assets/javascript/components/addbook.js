//IMPORT
import CODE from '../modules/dictionary.js'
import displayAPI from '../modules/display.js'
import dataAPI from '../modules/database.js'
import bindBookCard from './bookcard.js'

// EXPORT add book card behaviour
export default ({display, sampleBook, bookModal}) => (bookData) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // newBookCard
  }
  try {
    // Prepare data
    // Modal edit: update dataAPI, sync displayAPI
    const checkBook = dataAPI.getSafeBook(bookData)
    if (checkBook.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not get safe book'
    const safeBook = checkBook.CONTENTS
    const generateBookCard = bindBookCard({display, sampleBook, bookModal})
    const checkBookCard = generateBookCard(safeBook)
    if (checkBookCard.STATUS === CODE.STATUS_TYPE.FAILURE) throw 'Could not generate book card'
    const newBookCard = checkBookCard.CONTENTS
    // Book actions
    displayAPI.addBook(safeBook) // update booklist
    dataAPI.addBook(safeBook) // update booklist
    // Update RESULT
    RESULT.CONTENTS = newBookCard
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not add book card: ' + error)
    // Update RESULT
    RESULT.STATUS =  CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}