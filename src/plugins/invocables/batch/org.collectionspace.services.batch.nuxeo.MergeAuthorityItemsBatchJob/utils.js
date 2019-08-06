import { refNameToCsid } from "../../../../helpers/refNameHelpers";

export const computeCSID = ({ data }, refNameToCsid, Immutable) => {
  console.log(data);
  const refName = data.get('ns2:collectionobjects_batch').get('params').get('targetCSID');


  return Immutable.fromJS({
    'ns2:batch_common': {
      targetCSID: 'Hello',
    },
  });
};
