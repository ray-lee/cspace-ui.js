import fields from './fields';
import forms from './forms';

 export default () => (configContext) => {
  return {
    invocables: {
      batch: {
        'org.collectionspace.services.batch.nuxeo.MergeAuthorityItemsBatchJob': {
          fields: fields(configContext),
          forms: forms(configContext),
        },
      },
    },
  }
}


