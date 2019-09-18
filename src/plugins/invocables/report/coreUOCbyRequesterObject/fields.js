import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    CompoundInput,
    OptionPickerInput,
    TextInput,
    AutocompleteInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  return {
    params: {
      [config]: {
        view: {
          type: CompoundInput,
        },
      },
      Requester: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.coreUOCbyRequesterObject.Requester.name',
              defaultMessage: 'Requester',
            },
          }),
          view: {
            type: AutocompleteInput,
            props: {
              source: 'concept/activity,concept/archculture,concept/ethculture,concept/ethusecode,concept/material,concept/objectclass,concept/objectname',
              showQuickAdd: false,
            },
          },
        },
      },
      ObjectNumber: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.coreUOCbyRequesterObject.ObjectNumber.name',
              defaultMessage: 'Object number',
            },
          }),
          view: {
            type: TextInput,
          },
        },
      },
      OutputMIME: {
        [config]: {
          defaultValue: 'application/pdf',
          messages: defineMessages({
            name: {
              id: 'field.coreUOCbyRequesterObject.OutputMIME.name',
              defaultMessage: 'Output format',
            },
          }),
          required: true,
          view: {
            type: OptionPickerInput,
            props: {
              source: 'uocApprovalStatusMIMETypes',
            },
          },
        },
      },
    },
  };
};
