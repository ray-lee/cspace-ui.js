import Immutable from 'immutable';

import {
  CLEAR_SEARCH_TO_SELECT,
  SET_SEARCH_TO_SELECT_ADVANCED,
  SET_SEARCH_TO_SELECT_KEYWORD,
  SET_SEARCH_TO_SELECT_RECORD_TYPE,
  SET_SEARCH_TO_SELECT_VOCABULARY,
} from '../constants/actionCodes';

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case SET_SEARCH_TO_SELECT_ADVANCED:
      return state.set('advanced', Immutable.fromJS(action.payload));
    case SET_SEARCH_TO_SELECT_KEYWORD:
      return state.set('keyword', action.payload);
    case SET_SEARCH_TO_SELECT_RECORD_TYPE:
      return state.set('recordType', action.payload).delete('advanced');
    case SET_SEARCH_TO_SELECT_VOCABULARY:
      return state.setIn(['vocabulary', state.get('recordType')], action.payload);
    case CLEAR_SEARCH_TO_SELECT:
      return state.delete('advanced').delete('keyword');
    default:
      return state;
  }
};

export const getAdvanced = state => state.get('advanced');
export const getKeyword = state => state.get('keyword');
export const getRecordType = state => state.get('recordType');
export const getVocabulary = (state, recordType) => state.getIn(['vocabulary', recordType]);
