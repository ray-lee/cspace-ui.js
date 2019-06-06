import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import OptionPickerInput from '../record/OptionPickerInput';

import {
  components as inputComponents,
} from 'cspace-input';

const messages = defineMessages({
  label: {
    id: 'modePickerInput.label',
    description: 'Label of the invocation mode picker.',
    defaultMessage: 'Run on',
  },
});

const modeMessages = defineMessages({
  nocontext: {
    id: 'modePickerInput.mode.nocontext',
    defaultMessage: 'all records',
  },
  single: {
    id: 'modePickerInput.mode.single',
    defaultMessage: 'single record',
  },
  list: {
    id: 'modePickerInput.mode.list',
    defaultMessage: 'record list',
  },
  group: {
    id: 'modePickerInput.mode.group',
    defaultMessage: 'group',
  },
});

const { Label } = inputComponents;

export default function ModePickerInput(props) {
  const {
    modes,
    value,
    ...remainingProps
  } = props;

  const options = modes.map(mode => (
    { value: mode, message: modeMessages[mode] }
  ));

  return (
    <OptionPickerInput
      blankable={false}
      label={<Label><FormattedMessage {...messages.label} /></Label>}
      options={options}
      value={value}
      {...remainingProps}
    />
  );
};
