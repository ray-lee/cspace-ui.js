import fields from './fields';
import forms from './forms';

export default () => configContext => ({
  invocables: {
    report: {
      coreUOCbyRequesterObject: {
        fields: fields(configContext),
        forms: forms(configContext),
      },
    },
  },
});
