export default CODE = (function() {
   // PUBLIC DICTIONARY
   return {
    DEBUG_MODE: true,
    STATUS_TYPE: {
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
      WAIT: 'WAIT'
    },
    OBJ_TYPE: {
      BOOK: 'BOOK',
      BOOK_LIST: 'BOOKLIST',
      BOOK_FIELD: 'BOOKFIELD'
    },
    MATCH_TYPE: {
      NONE: 'NONE',
      SOME: 'SOME',
      EXACT: 'EXACT'
    },
    FIELD_TYPE: {
      ID: 'id',
      TITLE: 'title',
      TOTAL_PAGES: 'totalPages',
      YEAR: 'year',
      AUTHOR_LIST: 'authorList',
      SUBJECT_LIST: 'subjectList'
    }
  }
}
)()