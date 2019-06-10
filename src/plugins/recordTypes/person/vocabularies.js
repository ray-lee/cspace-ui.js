import { defineMessages } from 'react-intl';

export default {
  all: {
    messages: defineMessages({
      name: {
        id: 'vocab.person.all.name',
        description: 'The name of the vocabulary.',
        defaultMessage: 'All',
      },
      collectionName: {
        id: 'vocab.person.all.collectionName',
        description: 'The name of a collection of records from the vocabulary.',
        defaultMessage: 'All Persons',
      },
      itemName: {
        id: 'vocab.person.all.itemName',
        description: 'The name of a record from the vocabulary.',
        defaultMessage: 'Person',
      },
    }),
    serviceConfig: {
      servicePath: '_ALL_',
    },
    type: 'all',
  },
  local: {
    messages: defineMessages({
      name: {
        id: 'vocab.person.local.name',
        description: 'The name of the vocabulary.',
        defaultMessage: 'Local',
      },
      collectionName: {
        id: 'vocab.person.local.collectionName',
        description: 'The name of a collection of records from the vocabulary.',
        defaultMessage: 'Local Persons',
      },
      itemName: {
        id: 'vocab.person.local.itemName',
        description: 'The name of a record from the vocabulary.',
        defaultMessage: 'Local Person',
      },
    }),
    serviceConfig: {
      servicePath: 'urn:cspace:name(person)',
    },
    sortOrder: 0,
  },
  ulan: {
    messages: defineMessages({
      name: {
        id: 'vocab.person.ulan.name',
        description: 'The name of the vocabulary.',
        defaultMessage: 'ULAN',
      },
      collectionName: {
        id: 'vocab.person.ulan.collectionName',
        description: 'The name of a collection of records from the vocabulary.',
        defaultMessage: 'ULAN Persons',
      },
      itemName: {
        id: 'vocab.person.ulan.itemName',
        description: 'The name of a record from the vocabulary.',
        defaultMessage: 'ULAN Person',
      },
    }),
    serviceConfig: {
      servicePath: 'urn:cspace:name(ulan_pa)',
    },
  },
};
