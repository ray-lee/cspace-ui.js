import { connect } from 'react-redux';
import get from 'lodash/get';
import SearchToSelectModal, { searchName } from '../../components/search/SearchToSelectModal';

import {
  setSearchToRelatePageSize,
} from '../../actions/prefs';

import {
  clearSearchToRelate,
  setSearchToRelateAdvanced,
  setSearchToRelateKeyword,
  setSearchToRelateRecordType,
  setSearchToRelateVocabulary,
} from '../../actions/searchToRelate';

import {
  clearSearchResults,
  search,
  setAllResultItemsSelected,
  setResultItemSelected,
} from '../../actions/search';

import {
  getAdvancedSearchBooleanOp,
  getAuthorityVocabCsid,
  getSearchToRelateAdvanced,
  getSearchToRelateKeyword,
  getSearchToRelateRecordType,
  getSearchToRelateVocabulary,
  getSearchToRelatePageSize,
  getSearchSelectedItems,
  getUserPerms,
} from '../../reducers';

const mapStateToProps = (state, ownProps) => {
  const searchToRelateRecordType = getSearchToRelateRecordType(state);

  return {
    keywordValue: getSearchToRelateKeyword(state),
    recordTypeValue: searchToRelateRecordType,
    vocabularyValue: getSearchToRelateVocabulary(state, searchToRelateRecordType),
    advancedSearchCondition: getSearchToRelateAdvanced(state),
    perms: getUserPerms(state),
    preferredAdvancedSearchBooleanOp:
      getAdvancedSearchBooleanOp(state) ||
      get(ownProps, ['config', 'defaultAdvancedSearchBooleanOp']),
    preferredPageSize: getSearchToRelatePageSize(state),
    selectedItems: getSearchSelectedItems(state, searchName),
    getAuthorityVocabCsid: (recordType, vocabulary) =>
      getAuthorityVocabCsid(state, recordType, vocabulary),
  };
};

const mapDispatchToProps = {
  clearSearchResults,
  search,
  onAdvancedSearchConditionCommit: setSearchToRelateAdvanced,
  onClearButtonClick: clearSearchToRelate,
  onKeywordCommit: setSearchToRelateKeyword,
  onRecordTypeCommit: setSearchToRelateRecordType,
  onVocabularyCommit: setSearchToRelateVocabulary,
  onItemSelectChange: setResultItemSelected,
  setAllItemsSelected: setAllResultItemsSelected,
  setPreferredPageSize: setSearchToRelatePageSize,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchToSelectModal);
