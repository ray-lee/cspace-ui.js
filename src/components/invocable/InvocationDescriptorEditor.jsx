import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Col, Cols, Row } from 'cspace-layout';
import SearchToSelectModalContainer from '../../containers/search/SearchToSelectModalContainer';
import InvocationTargetInput from './InvocationTargetInput';
import ModePickerInput from './ModePickerInput';

const propTypes = {
  config: PropTypes.object,
  invocationDescriptor: PropTypes.instanceOf(Immutable.Map),
  modes: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  invocationDescriptor: Immutable.Map(),
};

export default class InvocationDescriptorEditor extends Component {
  constructor(props) {
    super(props);

    this.handleModePickerCommit = this.handleModePickerCommit.bind(this);
    this.handleSearchModalCancelButtonClick = this.handleSearchModalCancelButtonClick.bind(this);
    this.openSearchModal = this.openSearchModal.bind(this);

    const {
      invocationDescriptor,
    } = props;

    this.state = {
      invocationDescriptor,
    };
  }

  handleSearchModalCancelButtonClick() {
    this.setState({
      isSearchModalOpen: false,
    });
  }

  handleModePickerCommit(path, value) {
    const {
      invocationDescriptor,
    } = this.state;

    this.setState({
      invocationDescriptor: invocationDescriptor.set('mode', value),
    });
  }

  openSearchModal() {
    this.setState({
      isSearchModalOpen: true,
    });
  }

  render() {
    const {
      config,
      modes,
    } = this.props;

    const {
      invocationDescriptor,
      isSearchModalOpen,
    } = this.state;

    const mode = invocationDescriptor.get('mode');

    return (
      <div>
        <Row>
          <ModePickerInput
            modes={modes}
            value={mode}
            onCommit={this.handleModePickerCommit}
          />

          <InvocationTargetInput
            mode={mode}
            openSearchModal={this.openSearchModal}
          />
        </Row>

        <SearchToSelectModalContainer
          allowedServiceTypes={['object', 'procedure', 'authority']}
          config={config}
          isOpen={isSearchModalOpen}
          defaultRecordTypeValue="collectionobject"
          singleSelect={mode === 'single' || mode === 'group'}
          onCancelButtonClick={this.handleSearchModalCancelButtonClick}
          onCloseButtonClick={this.handleSearchModalCancelButtonClick}
        />
      </div>
    );
  }
}

InvocationDescriptorEditor.propTypes = propTypes;
InvocationDescriptorEditor.defaultProps = defaultProps;
