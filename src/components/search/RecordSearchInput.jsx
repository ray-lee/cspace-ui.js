import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  components as inputComponents,
} from 'cspace-input';

const { ChooserInput } = inputComponents;

const propTypes = {
  openSearchModal: PropTypes.func,
};

export default class RecordSearchInput extends Component {
  constructor(props) {
    super(props);

    this.formatValue = this.formatValue.bind(this);
    this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);
  };

  formatValue(value) {
    return value;
  }

  handleChooseButtonClick() {
    const {
      openSearchModal,
    } = this.props;

    if (openSearchModal) {
      openSearchModal();
    }
  }

  render() {
    return (
      <ChooserInput
        formatValue={this.formatValue}
        onChooseButtonClick={this.handleChooseButtonClick}
        {...this.props}
      />
    );
  }
}

RecordSearchInput.propTypes = propTypes;
