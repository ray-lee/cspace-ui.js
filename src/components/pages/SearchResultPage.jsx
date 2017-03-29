import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { locationShape, routerShape } from 'react-router/lib/PropTypes';
import get from 'lodash/get';
import Immutable from 'immutable';
import ErrorPage from './ErrorPage';
import SearchResultTitleBar from '../search/SearchResultTitleBar';
import PageSizeChooser from '../search/PageSizeChooser';
import Pager from '../search/Pager';
import SearchResultTableContainer from '../../containers/search/SearchResultTableContainer';
import { validateLocation } from '../../helpers/configHelpers';
import styles from '../../../styles/cspace-ui/SearchResultPage.css';
import headerStyles from '../../../styles/cspace-ui/SearchResultTableHeader.css';
import pageBodyStyles from '../../../styles/cspace-ui/PageBody.css';
import searchResultSidebarStyles from '../../../styles/cspace-ui/SearchResultSidebar.css';

const messages = defineMessages({
  error: {
    id: 'searchResultPage.error',
    defaultMessage: 'Error: {message}',
  },
  editSearch: {
    id: 'searchResultPage.editSearch',
    defaultMessage: 'Revise search',
  },
});

export const searchName = 'searchResultPage';
// FIXME: Make default page size configurable
const defaultPageSize = 20;

const propTypes = {
  location: locationShape,
  params: PropTypes.objectOf(PropTypes.string),
  preferredPageSize: PropTypes.number,
  search: PropTypes.func,
  setPreferredPageSize: PropTypes.func,
  setSearchPageAdvanced: PropTypes.func,
  setSearchPageKeyword: PropTypes.func,
};

const contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape,
};

export default class SearchResultPage extends Component {
  constructor() {
    super();

    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handleEditSearchLinkClick = this.handleEditSearchLinkClick.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentDidMount() {
    if (!this.normalizeQuery()) {
      const {
        location,
        setPreferredPageSize,
      } = this.props;

      if (setPreferredPageSize) {
        const {
          query,
        } = location;

        setPreferredPageSize(parseInt(query.size, 10));
      }

      this.search();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.params.recordType !== prevProps.params.recordType ||
      this.props.params.vocabulary !== prevProps.params.vocabulary ||
      this.props.params.csid !== prevProps.params.csid ||
      this.props.params.subresource !== prevProps.params.subresource ||
      this.props.location.query !== prevProps.location.query
    ) {
      if (!this.normalizeQuery()) {
        const {
          location,
          setPreferredPageSize,
        } = this.props;

        if (setPreferredPageSize) {
          const {
            query,
          } = location;

          setPreferredPageSize(parseInt(query.size, 10));
        }

        this.search();
      }
    }
  }

  getSearchDescriptor() {
    // FIXME: Make the search descriptor consistently an Immutable. Currently only the advanced
    // search condition is an Immutable. The whole search descriptor gets converted to an Immutable
    // when stored in the Redux store, but components expect it to be an object (except for the
    // advanced search condition, which is always Immutable). This is confusing.

    // FIXME: Refactor this into a wrapper component that calculates the search descriptor from
    // location and params, and passes it into a child. This will eliminate the multiple calls to
    // this method from the various render methods in this class.

    const {
      location,
      params,
    } = this.props;

    const searchQuery = Object.assign({}, location.query, {
      p: parseInt(location.query.p, 10) - 1,
      size: parseInt(location.query.size, 10),
    });

    const advancedSearchCondition = location.query.as;

    if (advancedSearchCondition) {
      searchQuery.as = Immutable.fromJS(JSON.parse(advancedSearchCondition));
    }

    const searchDescriptor = {
      searchQuery,
    };

    ['recordType', 'vocabulary', 'csid', 'subresource'].forEach((param) => {
      const value = params[param];

      if (typeof value !== 'undefined') {
        searchDescriptor[param] = value;
      }
    });

    return searchDescriptor;
  }

  getListType(searchDescriptor) {
    if (searchDescriptor) {
      const { subresource } = searchDescriptor;

      if (subresource) {
        const {
          config,
        } = this.context;

        return get(config, ['subresources', subresource, 'listType']);
      }
    }

    return 'common';
  }

  normalizeQuery() {
    const {
      location,
      preferredPageSize,
    } = this.props;

    const {
      query,
    } = location;

    const {
      router,
    } = this.context;

    if (router) {
      const normalizedQueryParams = {};

      const pageSize = parseInt(query.size, 10);

      if (isNaN(pageSize) || pageSize < 1) {
        const normalizedPageSize = preferredPageSize || defaultPageSize;

        normalizedQueryParams.size = normalizedPageSize.toString();
      } else if (pageSize > 2500) {
        // Services layer max is 2500
        normalizedQueryParams.size = '2500';
      } else if (pageSize.toString() !== query.size) {
        normalizedQueryParams.size = pageSize.toString();
      }

      const pageNum = parseInt(query.p, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        normalizedQueryParams.p = '1';
      } else if (pageNum.toString() !== query.p) {
        normalizedQueryParams.p = pageNum.toString();
      }

      if (Object.keys(normalizedQueryParams).length > 0) {
        const newQuery = Object.assign({}, query, normalizedQueryParams);

        router.replace({
          pathname: location.pathname,
          query: newQuery,
        });

        return true;
      }
    }

    return false;
  }

  handleEditSearchLinkClick() {
    // Transfer this search descriptor's search criteria to advanced search.

    const {
      setSearchPageAdvanced,
      setSearchPageKeyword,
    } = this.props;

    if (setSearchPageKeyword || setSearchPageAdvanced) {
      const searchDescriptor = this.getSearchDescriptor();
      const { searchQuery } = searchDescriptor;

      if (setSearchPageKeyword) {
        const {
          kw,
        } = searchQuery;

        setSearchPageKeyword(kw);
      }

      if (setSearchPageAdvanced) {
        const {
          as: advancedSearchCondition,
        } = searchQuery;

        setSearchPageAdvanced(advancedSearchCondition);
      }
    }
  }

  handlePageChange(pageNum) {
    const {
      location,
    } = this.props;

    const {
      router,
    } = this.context;

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          p: (pageNum + 1).toString(),
        }),
      });
    }
  }

  handlePageSizeChange(pageSize) {
    const {
      location,
      setPreferredPageSize,
    } = this.props;

    const {
      router,
    } = this.context;

    if (setPreferredPageSize) {
      setPreferredPageSize(pageSize);
    }

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          p: '1',
          size: pageSize.toString(),
        }),
      });
    }
  }

  handleSortChange(sort) {
    const {
      location,
    } = this.props;

    const {
      router,
    } = this.context;

    if (router) {
      router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, {
          sort,
        }),
      });
    }
  }

  search() {
    const {
      search,
    } = this.props;

    const {
      config,
    } = this.context;

    const searchDescriptor = this.getSearchDescriptor();
    const listType = this.getListType(searchDescriptor);

    if (search) {
      search(config, searchName, searchDescriptor, listType);
    }
  }

  renderEditLink() {
    const searchDescriptor = this.getSearchDescriptor();

    const {
      recordType,
      vocabulary,
    } = searchDescriptor;

    const vocabularyPath = vocabulary ? `/${vocabulary}` : '';
    const path = `/search/${recordType}${vocabularyPath}`;

    return (
      <Link to={path} onClick={this.handleEditSearchLinkClick}>
        <FormattedMessage {...messages.editSearch} />
      </Link>
    );
  }

  renderHeader({ searchError, searchResult }) {
    if (searchError) {
      // FIXME: Make a proper error page
      const message = searchError.get('code') || '';

      return (
        <header className={headerStyles.error}>
          <FormattedMessage {...messages.error} values={{ message }} />
          <p>{this.renderEditLink()}</p>
        </header>
      );
    }

    let pageSize = null;
    let message = null;

    if (searchResult) {
      const {
        config,
      } = this.context;

      const searchDescriptor = this.getSearchDescriptor();
      const listType = this.getListType(searchDescriptor);
      const listTypeConfig = config.listTypes[listType];
      const { listNodeName } = listTypeConfig;

      const list = searchResult.get(listNodeName);
      const totalItems = parseInt(list.get('totalItems'), 10);

      if (isNaN(totalItems)) {
        message = (
          <FormattedMessage {...listTypeConfig.messages.searching} />
        );
      } else {
        const pageNum = parseInt(list.get('pageNum'), 10);

        pageSize = parseInt(list.get('pageSize'), 10);

        const startNum = (pageNum * pageSize) + 1;
        const endNum = Math.min((pageNum * pageSize) + pageSize, totalItems);

        message = (
          <FormattedMessage
            {...listTypeConfig.messages.resultCount}
            values={{
              totalItems,
              startNum,
              endNum,
            }}
          />
        );
      }
    }

    if (pageSize === null) {
      const searchDescriptor = this.getSearchDescriptor();

      pageSize = searchDescriptor.searchQuery.size;
    }

    const content = (
      <div>
        {message}
        {message ? ' | ' : ''}
        {this.renderEditLink()}
      </div>
    );

    const pageSizeChooser = (
      <PageSizeChooser
        pageSize={pageSize}
        onPageSizeChange={this.handlePageSizeChange}
      />
    );

    return (
      <header className={headerStyles.normal}>
        {content}
        {pageSizeChooser}
      </header>
    );
  }

  renderFooter({ searchResult }) {
    if (searchResult) {
      const {
        config,
      } = this.context;

      const searchDescriptor = this.getSearchDescriptor();
      const listType = this.getListType(searchDescriptor);
      const listTypeConfig = config.listTypes[listType];
      const { listNodeName } = listTypeConfig;

      const list = searchResult.get(listNodeName);

      const totalItems = parseInt(list.get('totalItems'), 10);
      const pageNum = parseInt(list.get('pageNum'), 10);
      const pageSize = parseInt(list.get('pageSize'), 10);
      const lastPage = Math.max(0, isNaN(totalItems) ? 0 : Math.ceil(totalItems / pageSize) - 1);

      return (
        <footer>
          <Pager
            currentPage={pageNum}
            lastPage={lastPage}
            pageSize={pageSize}
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
      config,
    } = this.context;

    const searchDescriptor = this.getSearchDescriptor();
    const listType = this.getListType(searchDescriptor);

    const {
      recordType,
      vocabulary,
      csid,
      subresource,
    } = searchDescriptor;

    const validation = validateLocation(config, { recordType, vocabulary, csid, subresource });

    if (validation.error) {
      return (
        <ErrorPage error={validation.error} />
      );
    }

    return (
      <div className={styles.common}>
        <SearchResultTitleBar
          config={config}
          searchDescriptor={searchDescriptor}
          searchName={searchName}
        />
        <div className={pageBodyStyles.common}>
          <SearchResultTableContainer
            config={config}
            listType={listType}
            searchName={searchName}
            searchDescriptor={searchDescriptor}
            recordType={recordType}
            renderHeader={this.renderHeader}
            renderFooter={this.renderFooter}
            onSortChange={this.handleSortChange}
          />
          <div className={searchResultSidebarStyles.common} />
        </div>
      </div>
    );
  }
}

SearchResultPage.propTypes = propTypes;
SearchResultPage.contextTypes = contextTypes;
