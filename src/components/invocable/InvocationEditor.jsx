import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { defineMessages, FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import InvocationDescriptorEditor from './InvocationDescriptorEditor';
import { getCommonFieldValue } from '../../helpers/recordDataHelpers';
import RecordFormContainer from '../../containers/record/RecordFormContainer';
import styles from '../../../styles/cspace-ui/InvocationEditor.css';

const messages = defineMessages({
  loading: {
    id: 'invocationEditor.loading',
    description: 'Message displayed when invocable metadata is loading.',
    defaultMessage: 'Loading…',
  },
  noDescription: {
    id: 'invocationEditor.noDescription',
    description: 'Message displayed when an invocable has no description.',
    defaultMessage: 'Description not provided.',
  },
});

const renderLoading = () => (
  <div className={styles.pending}>
    <FormattedMessage {...messages.loading} />
  </div>
);

const propTypes = {
  config: PropTypes.object,
  initialInvocationDescriptor: PropTypes.instanceOf(Immutable.Map),
  metadata: PropTypes.instanceOf(Immutable.Map),
  paramData: PropTypes.instanceOf(Immutable.Map),
  recordType: PropTypes.string,
  createNewRecord: PropTypes.func,
};

export default class InvocationEditor extends Component {
  componentDidMount() {
    this.initRecord();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.metadata !== this.props.metadata) {
      this.initRecord();
    }
  }

  getSupportedModes() {
    const {
      metadata,
    } = this.props;

    const modes = [];

    if (getCommonFieldValue(metadata, 'supportsNoContext') === 'true') {
      modes.push('nocontext');
    }

    if (getCommonFieldValue(metadata, 'supportsSingleDoc') === 'true') {
      modes.push('single');
    }

    if (getCommonFieldValue(metadata, 'supportsDocList') === 'true') {
      modes.push('list');
    }

    if (getCommonFieldValue(metadata, 'supportsGroup') === 'true') {
      modes.push('group');
    }

    return ['nocontext', 'single', 'list', 'group'];
    // return modes;
  }

  initRecord() {
    const {
      createNewRecord,
    } = this.props;

    createNewRecord();
  }

  render() {
    const {
      config,
      initialInvocationDescriptor,
      metadata,
      paramData,
      recordType,
    } = this.props;

    if (!metadata) {
      return renderLoading();
    }

    const invocableNameGetter = get(config, ['recordTypes', recordType, 'invocableName']);
    const invocableName = invocableNameGetter && invocableNameGetter(metadata);

    const paramRecordTypeConfig = get(config, ['invocables', recordType, invocableName]);

    const description = getCommonFieldValue(metadata, 'notes')
      || <FormattedMessage {...messages.noDescription} />;

    return (
      <div className={styles.common}>
        <p>{description}</p>

        <InvocationDescriptorEditor
          config={config}
          invocationDescriptor={initialInvocationDescriptor}
          modes={this.getSupportedModes()}
        />

        <RecordFormContainer
          config={config}
          csid=""
          data={paramData}
          recordType="invocable"
          recordTypeConfig={paramRecordTypeConfig}
        />
      </div>
    );
  }
}

InvocationEditor.propTypes = propTypes;
