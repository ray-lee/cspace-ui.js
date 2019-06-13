import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  BATCH_INVOKE_STARTED,
  BATCH_INVOKE_FULFILLED,
  BATCH_INVOKE_REJECTED,
  SHOW_NOTIFICATION,
} from '../../../src/constants/actionCodes';

import {
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS,
} from '../../../src/constants/notificationStatusCodes';

import {
  configureCSpace,
} from '../../../src/actions/cspace';

import {
  invoke,
} from '../../../src/actions/batch';

const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiImmutable);
chai.should();

const config = {
  invocables: {
    batch: {
      paramBatch: {},
    },
  },
  recordTypes: {
    batch: {
      invocableName: data =>
        data.getIn(['document', 'ns2:batch_common', 'name']),
    },
    group: {
      serviceConfig: {
        objectName: 'Group',
      },
    },
  },
};

const mockStore = configureMockStore([thunk]);

describe('batch action creator', function suite() {
  describe('invoke', function actionSuite() {
    const store = mockStore({
      record: Immutable.fromJS({
        '': {
          data: {
            current: {
              params: {
                foo: 'abc',
                bar: 'def',
              },
            },
          },
        },
      }),
      user: Immutable.Map(),
    });

    before(() =>
      store.dispatch(configureCSpace())
        .then(() => store.clearActions())
    );

    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      store.clearActions();
      moxios.uninstall();
    });

    it('should invoke a batch job in single mode', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'single',
              singleCSID: recordCsid,
            },
          });
        });
    });

    it('should invoke a batch job in list mode', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: [
          recordCsid,
        ],
        mode: 'list',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'list',
              listCSIDs: {
                csid: [
                  '1234',
                ],
              },
            },
          });
        });
    });

    it('should invoke a batch job in nocontext mode', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
        },
      });

      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        mode: 'nocontext',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'nocontext',
            },
          });
        });
    });

    it('should send parameters', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
          'ns2:batch_common': {
            name: 'paramBatch',
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const request = moxios.requests.mostRecent();

          request.url.should.equal(`/cspace-services/batch/${batchCsid}`);

          const data = JSON.parse(request.config.data);

          data.should.deep.equal({
            'ns2:invocationContext': {
              '@xmlns:ns2': 'http://collectionspace.org/services/common/invocable',
              docType: 'Group',
              mode: 'single',
              singleCSID: recordCsid,
              params: {
                param: [
                  { key: 'foo', value: 'abc' },
                  { key: 'bar', value: 'def' },
                ],
              },
            },
          });
        });
    });

    it('should call the onValidationSuccess callback if parameter validation succeeds', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
          'ns2:batch_common': {
            name: 'paramBatch',
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      let onValidationSuccessCalled = false;

      const handleValidationSuccess = () => {
        onValidationSuccessCalled = true;
      };

      return store.dispatch(
        invoke(config, batchMetadata, invocationDescriptor, handleValidationSuccess)
      )
        .then(() => {
          onValidationSuccessCalled.should.equal(true);
        });
    });

    it('should not dispatch any actions when parameter validation fails', function test() {
      const invalidDataStore = mockStore({
        notification: Immutable.Map(),
        record: Immutable.fromJS({
          '': {
            validation: {
              params: {
                baz: {
                  '[error]': {
                    code: 'ERR_MISSING_REQ_FIELD',
                  },
                },
              },
            },
            data: {
              current: {
                params: {
                  foo: 'abc',
                  bar: 'def',
                },
              },
            },
          },
        }),
        user: Immutable.Map(),
      });

      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
          'ns2:batch_common': {
            name: 'paramBatch',
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      return invalidDataStore.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          assert.fail('action should be rejected');
        })
        .catch(() => {
          const request = moxios.requests.mostRecent();

          expect(request).to.equal(undefined);
        });
    });

    it('should dispatch BATCH_INVOKE_FULFILLED when an invocation completes successfully', function test() {
      moxios.stubRequest(/./, {
        status: 200,
        response: {},
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const actions = store.getActions();
          actions.should.have.lengthOf(4);

          actions[0].type.should.equal(BATCH_INVOKE_STARTED);
          actions[0].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[1].type.should.equal(SHOW_NOTIFICATION);
          actions[1].payload.status.should.equal(STATUS_PENDING);

          actions[2].type.should.equal(BATCH_INVOKE_FULFILLED);
          actions[2].meta.should.deep.equal({
            csid: batchCsid,
            numAffected: undefined,
          });

          actions[3].type.should.equal(SHOW_NOTIFICATION);
          actions[3].payload.status.should.equal(STATUS_SUCCESS);
        });
    });

    it('should dispatch BATCH_INVOKE_REJECTED when an invocation fails', function test() {
      moxios.stubRequest(/./, {
        status: 400,
      });

      const batchCsid = 'abcd';

      const batchMetadata = Immutable.fromJS({
        document: {
          'ns2:collectionspace_core': {
            uri: `/batch/${batchCsid}`,
          },
        },
      });

      const recordCsid = '1234';
      const recordType = 'group';

      const invocationDescriptor = Immutable.Map({
        recordType,
        csid: recordCsid,
        mode: 'single',
      });

      return store.dispatch(invoke(config, batchMetadata, invocationDescriptor))
        .then(() => {
          const actions = store.getActions();
          actions.should.have.lengthOf(4);

          actions[0].type.should.equal(BATCH_INVOKE_STARTED);
          actions[0].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[1].type.should.equal(SHOW_NOTIFICATION);
          actions[1].payload.status.should.equal(STATUS_PENDING);

          actions[2].type.should.equal(BATCH_INVOKE_REJECTED);
          actions[2].meta.should.deep.equal({
            csid: batchCsid,
          });

          actions[3].type.should.equal(SHOW_NOTIFICATION);
          actions[3].payload.status.should.equal(STATUS_ERROR);
        });
    });
  });
});
