import { defineMessages } from 'react-intl';

export default {
  conceptTermStatuses: {
    values: [
      'provisional',
      'under review',
      'accepted',
      'rejected',
    ],
    messages: defineMessages({
      provisional: {
        id: 'option.conceptTermStatuses.provisional',
        defaultMessage: 'provisional',
      },
      'under review': {
        id: 'option.conceptTermStatuses.under review',
        defaultMessage: 'under review',
      },
      accepted: {
        id: 'option.conceptTermStatuses.accepted',
        defaultMessage: 'accepted',
      },
      rejected: {
        id: 'option.conceptTermStatuses.rejected',
        defaultMessage: 'rejected',
      },
    }),
  },
  conceptTermTypes: {
    values: [
      'descriptor',
      'alternate descriptor',
      'used for term',
    ],
    messages: defineMessages({
      descriptor: {
        id: 'option.conceptTermTypes.descriptor',
        defaultMessage: 'descriptor',
      },
      'alternate descriptor': {
        id: 'option.conceptTermTypes.alternate descriptor',
        defaultMessage: 'alternate descriptor',
      },
      'used for term': {
        id: 'option.conceptTermTypes.used for term',
        defaultMessage: 'used for term',
      },
    }),
  },
  conceptHistoricalStatuses: {
    values: [
      'current',
      'historical',
      'both',
      'unknown',
    ],
    messages: defineMessages({
      current: {
        id: 'option.conceptHistoricalStatuses.current',
        defaultMessage: 'current',
      },
      historical: {
        id: 'option.conceptHistoricalStatuses.historical',
        defaultMessage: 'historical',
      },
      both: {
        id: 'option.conceptHistoricalStatuses.both',
        defaultMessage: 'both',
      },
      unknown: {
        id: 'option.conceptHistoricalStatuses.unknown',
        defaultMessage: 'unknown',
      },
    }),
  },
};
