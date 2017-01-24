import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import Immutable from 'immutable';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { baseComponents as inputComponents } from 'cspace-input';
import { ConnectedPanel as Panel } from '../../containers/layout/PanelContainer';
import SearchResultTableContainer from '../../containers/search/SearchResultTableContainer';
import Pager from './Pager';
import styles from '../../../styles/cspace-ui/SearchPanel.css';

const { MiniButton } = inputComponents;

const messages = defineMessages({
  titleWithCount: {
    id: 'searchPanel.titleWithCount',
    defaultMessage: '{title}: {totalItems}',
  },
});

const propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  collapsed: PropTypes.bool,
  columnSetName: PropTypes.string,
  config: PropTypes.object,
  name: PropTypes.string,
  recordType: PropTypes.string,
  searchDescriptor: PropTypes.object,
  searchResult: PropTypes.instanceOf(Immutable.Map),
  listType: PropTypes.string,
  title: PropTypes.node,
  search: PropTypes.func,
  onSearchDescriptorChange: PropTypes.func,
};

const defaultProps = {
  listType: 'common',
};

const contextTypes = {
  router: PropTypes.object,
};

export default class SearchPanel extends Component {
  constructor() {
    super();

    this.renderFooter = this.renderFooter.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  componentDidUpdate(prevProps) {
    const {
      searchDescriptor: prevSearchDescriptor,
    } = prevProps;

    const {
      searchDescriptor,
    } = this.props;

    if (!isEqual(prevSearchDescriptor, searchDescriptor)) {
      this.search();
    }
  }

  handlePageChange(pageNum) {
    const {
      onSearchDescriptorChange,
      searchDescriptor,
    } = this.props;

    if (onSearchDescriptorChange) {
      onSearchDescriptorChange(merge({}, searchDescriptor, {
        searchQuery: {
          p: pageNum,
        },
      }));
    }
  }

  handlePageSizeChange(pageSize) {
    const {
      name,
      recordType,
      searchDescriptor,
      setPreferredPageSize,
      onSearchDescriptorChange,
    } = this.props;

    if (setPreferredPageSize) {
      setPreferredPageSize(recordType, name, pageSize);
    }

    if (onSearchDescriptorChange) {
      onSearchDescriptorChange(merge({}, searchDescriptor, {
        searchQuery: {
          p: 0,
          size: pageSize,
        },
      }));
    }
  }

  handleSortChange(sort) {
    const {
      onSearchDescriptorChange,
      searchDescriptor,
    } = this.props;

    if (onSearchDescriptorChange) {
      onSearchDescriptorChange(merge({}, searchDescriptor, {
        searchQuery: {
          sort,
        },
      }));
    }
  }

  handleSearchButtonClick() {
    const {
      router,
    } = this.context;

    if (router) {
      // Convert the search descriptor to a location.

      const {
        recordType,
        vocabulary,
        csid,
        subresource,
        searchQuery,
      } = this.props.searchDescriptor;

      const pathParts = ['/search', recordType, vocabulary, csid, subresource];
      const pathname = pathParts.filter(part => !!part).join('/');

      const query = Object.assign({}, searchQuery, {
        p: (searchQuery.p + 1).toString(),
        // Remove the size, so that the default/preferred setting for the search result page will
        // take effect.
        size: undefined,
      });

      router.push({
        pathname,
        query,
      });
    }
  }

  search() {
    const {
      columnSetName,
      config,
      listType,
      name,
      search,
      searchDescriptor
    } = this.props;

    if (search) {
      search(config, name, searchDescriptor, listType, columnSetName);
    }
  }

  renderButtons() {
    const {
      csid,
    } = this.props;

    return [
      // <MiniButton key="add">+</MiniButton>,
      <MiniButton
        className="material-icons"
        disabled={!csid}
        key="search"
        onClick={this.handleSearchButtonClick}
      >
        search
      </MiniButton>,
    ];
  }

  renderHeader() {
    const {
      config,
      listType,
      searchResult,
      title,
    } = this.props;

    const listTypeConfig = config.listTypes[listType];

    const totalItems = searchResult
      ? searchResult.getIn([listTypeConfig.listNodeName, 'totalItems'])
      : null;

    const headerContent = (typeof totalItems !== 'undefined' && totalItems !== null)
      ? <FormattedMessage {...messages.titleWithCount} values={{ title, totalItems }} />
      : title;

    return (
      <h3>{headerContent}</h3>
    );
  }

  renderFooter({ searchResult }) {
    const {
      config,
      listType,
    } = this.props;

    if (searchResult) {
      const listTypeConfig = config.listTypes[listType];
      const list = searchResult.get(listTypeConfig.listNodeName);

      const totalItems = parseInt(list.get('totalItems'), 10);
      const pageSize = parseInt(list.get('pageSize'), 10);
      const pageNum = parseInt(list.get('pageNum'), 10);
      const lastPage = Math.max(0, isNaN(totalItems) ? 0 : Math.ceil(totalItems / pageSize) - 1);

      return (
        <footer>
          <Pager
            currentPage={pageNum}
            lastPage={lastPage}
            pageSize={pageSize}
            pageSizeOptionListName="searchPanelPageSizes"
            windowSize={3}
            onPageChange={this.handlePageChange}
            onPageSizeChange={this.handlePageSizeChange}
          />
        </footer>
      );
    }

    return null;
  }

  render() {
    const {
      collapsed,
      columnSetName,
      config,
      listType,
      name,
      recordType,
      searchDescriptor,
    } = this.props;

    return (
      <Panel
        buttons={this.renderButtons()}
        className={styles.common}
        collapsible
        collapsed={collapsed}
        config={config}
        header={this.renderHeader()}
        name={name}
        recordType={recordType}
      >
        <SearchResultTableContainer
          columnSetName={columnSetName}
          listType={listType}
          recordType={recordType}
          searchName={name}
          searchDescriptor={searchDescriptor}
          renderFooter={this.renderFooter}
          onSortChange={this.handleSortChange}
        />
      </Panel>
    );
  }
}

SearchPanel.propTypes = propTypes;
SearchPanel.defaultProps = defaultProps;
SearchPanel.contextTypes = contextTypes;
