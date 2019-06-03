import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import get from 'lodash/get';
import { Col, Cols, Row } from 'cspace-layout';
import ModePickerInput from './ModePickerInput';

const propTypes = {
  invocationDescriptor: PropTypes.shape({
    mode: PropTypes.string,
  }),
  modes: PropTypes.arrayOf(PropTypes.string),
};

export default class InvocationDescriptorEditor extends Component {
  render() {
    const {
      invocationDescriptor,
      modes,
    } = this.props;

    return (
      <Row>
        <ModePickerInput
          modes={modes}
          value={get(invocationDescriptor, 'mode')}
        />

        <Col />
      </Row>
    );
  }
}

InvocationDescriptorEditor.propTypes = propTypes;
