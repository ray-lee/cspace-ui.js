import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { components as inputComponents } from 'cspace-input';
import styles from '../../../styles/cspace-ui/RunButton.css';

const { Button } = inputComponents;

const messages = defineMessages({
  label: {
    id: 'runButton.label',
    description: 'Label of the run button.',
    defaultMessage: 'Run…',
  },
});

const propTypes = {
  isRunnable: PropTypes.bool,
  isModified: PropTypes.bool,
  isRunning: PropTypes.bool,
  onClick: PropTypes.func,
};

export default function RunButton(props) {
  const {
    isRunnable,
    isModified,
    isRunning,
    onClick,
  } = props;

  if (!isRunnable) {
    return null;
  }

  return (
    <Button
      className={styles.common}
      disabled={isRunning || isModified}
      icon
      name="run"
      onClick={onClick}
    >
      <FormattedMessage {...messages.label} />
    </Button>
  );
}

RunButton.propTypes = propTypes;
