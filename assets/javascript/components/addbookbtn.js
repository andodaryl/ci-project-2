//IMPORT
import CODE from '../modules/dictionary.js'
import displayAPI from '../modules/display.js'

// EXPORT add book card behaviour
export default (bookData) => {
  const RESULT = {
    STATUS: CODE.STATUS_TYPE.WAIT,
    CONTENTS: null // newBookCard
  }
  try {
    const BOOK = bookData
    const safeBook = databaseAPI.getSafeData(BOOK, CODE.OBJ_TYPE.BOOK)
    const bookExists = config.bookList
    .some(BOOK => BOOK[CODE.FIELD_TYPE.ID] === safeBook[CODE.FIELD_TYPE.ID])
    // Exit early if book does not exist in display bookList
    if (!bookExists) throw 'Book with id[' + safeBook[CODE.FIELD_TYPE.ID] + '] does not exist'
    // Create BookCard
    const newBookCard = components.BookCard(safeBook)
    // Update RESULT
    RESULT.CONTENTS = newBookCard
    RESULT.STATUS = CODE.STATUS_TYPE.SUCCESS
  } catch (error) {
    if (CODE.DEBUG_MODE) console.error('Could not create book card: ' + error)
    // Update RESULT
    RESULT.STATUS =  CODE.STATUS_TYPE.FAILURE
  } finally {
    return RESULT
  }
}