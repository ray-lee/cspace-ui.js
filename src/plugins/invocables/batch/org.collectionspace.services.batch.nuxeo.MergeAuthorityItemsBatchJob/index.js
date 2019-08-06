import fields from './fields';
import forms from './forms';

 export default () => (configContext) => {
  console.log(fields);
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


