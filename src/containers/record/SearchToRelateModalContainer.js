import { connect } from 'react-redux';
import SearchToRelateModal from '../../components/record/SearchToRelateModal';

import {
  setSearchToRelatePageSize,
} from '../../actions/prefs';

import {
  setSearchToRelateAdvanced,
  setSearchToRelateKeyword,
  setSearchToRelateRecordType,
  setSearchToRelateVocabulary,
} from '../../actions/searchToRelate';

import {
  search,
} from '../../actions/search';

import {
  getSearchToRelateAdvanced,
  getSearchToRelateKeyword,
  getSearchToRelateRecordType,
  getSearchToRelateVocabulary,
  getSearchToRelatePageSize,
} from '../../reducers';

const mapStateToProps = (state) => {
  const recordType = getSearchToRelateRecordType(state);

  return {
    keywordValue: getSearchToRelateKeyword(state),
    recordTypeValue: recordType,
    vocabularyValue: getSearchToRelateVocabulary(state, recordType),
    advancedSearchCondition: getSearchToRelateAdvanced(state),
    preferredPageSize: getSearchToRelatePageSize(state),
  };
};

const mapDispatchToProps = {
  search,
  onAdvancedSearchConditionCommit: setSearchToRelateAdvanced,
  onKeywordCommit: setSearchToRelateKeyword,
  onRecordTypeCommit: setSearchToRelateRecordType,
  onVocabularyCommit: setSearchToRelateVocabulary,
  setPreferredPageSize: setSearchToRelatePageSize,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchToRelateModal);
