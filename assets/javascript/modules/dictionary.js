export default CODE = (function() {
   // PUBLIC DICTIONARY
   return {
    STATUS_TYPE: {
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE',
    },
    OBJ_TYPE: {
      BOOK: 'BOOK',
      BOOKLIST: 'BOOKLIST',
      BOOKFIELD: 'BOOKFIELD'
    },
    MATCH_TYPE: {
      NONE: 'NONE',
      SOME: 'SOME',
      EXACT: 'EXACT'
    },
    FIELD_TYPE: {
      ID: 'id',
      TITLE: 'title',
      TOTALPAGES: 'totalPages',
      YEAR: 'year',
      AUTHORLIST: 'authorList',
      SUBJECTLIST: 'subjectList'
    }
  }
}
)()