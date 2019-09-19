import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    CompoundInput,
    OptionPickerInput,
    TermPickerInput,
    DateInput,
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
      OutputMIME: {
        [config]: {
          defaultValue: 'application/pdf',
          messages: defineMessages({
            name: {
              id: 'field.report.coreUOCApprovalStatus.OutputMIME.name',
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
      AuthBy: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.report.coreUOCApprovalStatus.AuthBy.name',
              defaultMessage: 'Authorized by',
            },
          }),
          view: {
            type: AutocompleteInput,
            props: {
              source: 'person/local,person/shared,organization/local,organization/shared',
              showQuickAdd: false,
            },
          },
        },
      },
      AuthStatus: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.report.coreUOCApprovalStatus.AuthStatus.name',
              defaultMessage: 'Authorization status',
            },
          }),
          view: {
            type: TermPickerInput,
            props: {
              source: 'uocauthorizationstatuses',
            },
          },
        },
      },
      StartDate: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.report.coreUOCApprovalStatus.StartDate.name',
              defaultMessage: 'Earliest requested date',
            },
          }),
          view: {
            type: DateInput,
          },
        },
      },
      EndDate: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.report.coreUOCApprovalStatus.EndDate.name',
              defaultMessage: 'Latest requested date',
            },
          }),
          view: {
            type: DateInput,
          },
        },
      },
    },
  };
};
