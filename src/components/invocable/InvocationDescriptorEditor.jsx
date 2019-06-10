import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import SearchToSelectModalContainer from '../../containers/search/SearchToSelectModalContainer';
import InvocationTargetInput from './InvocationTargetInput';
import ModePickerInput from './ModePickerInput';
import styles from '../../../styles/cspace-ui/InvocationDescriptorEditor.css';

const propTypes = {
  config: PropTypes.object,
  invocationDescriptor: PropTypes.instanceOf(Immutable.Map),
  modes: PropTypes.arrayOf(PropTypes.string),
  recordTypes: PropTypes.arrayOf(PropTypes.string),
  onCommit: PropTypes.func,
};

const defaultProps = {
  invocationDescriptor: Immutable.Map(),
};

export default class InvocationDescriptorEditor extends Component {
  constructor(props) {
    super(props);

    this.handleModePickerCommit = this.handleModePickerCommit.bind(this);
    this.handleSearchModalAccept = this.handleSearchModalAccept.bind(this);
    this.handleSearchModalCancelButtonClick = this.handleSearchModalCancelButtonClick.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);

    this.state = {
      isSearchModalOpen: false,
    };
  }

  handleSearchModalAccept(selectedItems, searchDescriptor) {
    const {
      invocationDescriptor,
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(
        invocationDescriptor
          .set('recordType', searchDescriptor.get('recordType'))
          .set('items', selectedItems)
      );
    }

    this.setState({
      isSearchModalOpen: false,
    });
  }

  handleSearchModalCancelButtonClick() {
    this.setState({
      isSearchModalOpen: false,
    });
  }

  handleModePickerCommit(path, value) {
    const {
      invocationDescriptor,
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(invocationDescriptor.set('mode', value));
    }
  }

  openSearchModal() {
    this.setState({
      isSearchModalOpen: true,
    });
  }

  render() {
    const {
      config,
      invocationDescriptor,
      modes,
      recordTypes,
    } = this.props;

    const {
      isSearchModalOpen,
    } = this.state;

    const mode = invocationDescriptor.get('mode');
    const recordType = invocationDescriptor.get('recordType');
    const allowedRecordTypes = (mode === 'group') ? ['group'] : recordTypes;

    return (
      <div className={styles.common}>
        <div>
          <ModePickerInput
            modes={modes}
            value={mode}
            onCommit={this.handleModePickerCommit}
          />

          <InvocationTargetInput
            config={config}
            mode={mode}
            openSearchModal={this.openSearchModal}
            value={invocationDescriptor.get('items')}
          />
        </div>

        <SearchToSelectModalContainer
          // allowedServiceGroups={['object', 'procedure', 'authority']}
          allowedRecordTypes={allowedRecordTypes}
          config={config}
          isOpen={isSearchModalOpen}
          defaultRecordTypeValue={allowedRecordTypes && allowedRecordTypes[0]}
          recordTypeValue={recordType}
          singleSelect={mode === 'single' || mode === 'group'}
          onAccept={this.handleSearchModalAccept}
          onCancelButtonClick={this.handleSearchModalCancelButtonClick}
          onCloseButtonClick={this.handleSearchModalCancelButtonClick}
        />
      </div>
    );
  }
}

InvocationDescriptorEditor.propTypes = propTypes;
InvocationDescriptorEditor.defaultProps = defaultProps;
