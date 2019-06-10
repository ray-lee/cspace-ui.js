import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { defineMessages, FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import InvocationDescriptorEditor from './InvocationDescriptorEditor';
import { getRecordTypeNameByServiceObjectName } from '../../helpers/configHelpers';
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
  invocationDescriptor: PropTypes.instanceOf(Immutable.Map),
  metadata: PropTypes.instanceOf(Immutable.Map),
  paramData: PropTypes.instanceOf(Immutable.Map),
  recordType: PropTypes.string,
  createNewRecord: PropTypes.func,
  onInvocationDescriptorCommit: PropTypes.func,
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

    if (getCommonFieldValue(metadata, 'supportsDocList') === 'true') {
      modes.push('list');
    }

    if (getCommonFieldValue(metadata, 'supportsGroup') === 'true') {
      modes.push('group');
    }

    if (getCommonFieldValue(metadata, 'supportsSingleDoc') === 'true') {
      modes.push('single');
    }

    return modes;
  }

  getSupportedRecordTypes() {
    const {
      config,
      metadata,
    } = this.props;

    const forDocTypesContainer = getCommonFieldValue(metadata, 'forDocTypes');

    let forDocTypes = forDocTypesContainer && forDocTypesContainer.get('forDocType');

    if (forDocTypes) {
      if (!Immutable.List.isList(forDocTypes)) {
        forDocTypes = Immutable.List.of(forDocTypes);
      }

      const recordTypes = forDocTypes.map(
        forDocType => getRecordTypeNameByServiceObjectName(config, forDocType)
      ).toJS();

      return recordTypes;
    }

    return [];
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
      invocationDescriptor,
      metadata,
      paramData,
      recordType,
      onInvocationDescriptorCommit,
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
          invocationDescriptor={invocationDescriptor}
          modes={this.getSupportedModes()}
          recordTypes={this.getSupportedRecordTypes()}
          onCommit={onInvocationDescriptorCommit}
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
