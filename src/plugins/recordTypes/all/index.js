import { defineMessages } from 'react-intl';
import columns from './columns';

export default () => () => ({
  recordTypes: {
    all: {
      columns,
      isCreatable: false,
      messages: {
        record: defineMessages({
          recordNameTitle: {
            id: 'record.all.nameTitle',
            description: 'The name of the record when used as a title.',
            defaultMessage: 'All Records',
          },
          resultsTitle: {
            id: 'record.all.resultsTitle',
            description: 'The name of the record when used as a title describing search results.',
            defaultMessage: 'All Records',
          },
        }),
      },
      serviceConfig: {
        servicePath: 'servicegroups/common/items',
        serviceType: 'utility',
      },
    },
  },
});
