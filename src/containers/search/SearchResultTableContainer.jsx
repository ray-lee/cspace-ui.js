import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import SearchResultTable from '../../components/search/SearchResultTable';
import withConfig from '../../enhancers/withConfig';

import {
  isSearchPending,
  getSearchResult,
  getSearchError,
} from '../../reducers';

const mapStateToProps = (state, ownProps) => {
  const {
    intl,
    config,
    recordType,
    searchName,
    searchDescriptor,
  } = ownProps;

  const formatterContext = {
    intl,
    config,
    recordType,
  };

  return {
    formatCellData: (column, data) =>
      (column.formatValue ? column.formatValue(data, formatterContext) : data),
    formatColumnLabel: column =>
      intl.formatMessage(column.messages.label),
    isSearchPending: isSearchPending(state, searchName, searchDescriptor),
    searchResult: getSearchResult(state, searchName, searchDescriptor),
    searchError: getSearchError(state, searchName, searchDescriptor),
  };
};

export const ConnectedSearchResultTable = connect(
  mapStateToProps,
)(SearchResultTable);

export default injectIntl(withConfig(ConnectedSearchResultTable));
