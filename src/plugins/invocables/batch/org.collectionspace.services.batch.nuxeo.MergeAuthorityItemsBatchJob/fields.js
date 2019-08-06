import { defineMessages } from 'react-intl';
import { computeCSID } from './utils';

 export default (configContext) => {
  const {
    CompoundInput,
    AutocompleteInput,
    TextInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  const {
    refNameToCsid,
  } = configContext.formatHelpers;

  const {
    Immutable,
  } = configContext.lib;

compute: args => computeCSID(args, refNameToCsid, Immutable);

   return {

    params: {
      [config]: {
        // compute: computeCSID,
        view: {
          type: CompoundInput,
        },
      },
      targetCSID: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.batch.Merge Authority Items.targetCSID.name',
              defaultMessage: 'Target record',
            },
          }),
          // formatValue: refNameToCsid,
          required: true,
          view: {
            type: AutocompleteInput,
            props: {
              source: 'person/all,organization/all',
            }
          },
        },
      },
    },
  };
};
