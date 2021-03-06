/* global window */

import Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import chaiAsPromised from 'chai-as-promised';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import getSession from '../../../src/helpers/session';
import { MODAL_LOGIN } from '../../../src/constants/modalNames';

import {
  CSPACE_CONFIGURED,
  PREFS_LOADED,
  SYSTEM_INFO_READ_FULFILLED,
  SYSTEM_INFO_READ_REJECTED,
  ACCOUNT_PERMS_READ_FULFILLED,
  ACCOUNT_ROLES_READ_FULFILLED,
  AUTH_VOCABS_READ_STARTED,
  AUTH_VOCABS_READ_FULFILLED,
  RESET_LOGIN,
  OPEN_MODAL,
} from '../../../src/constants/actionCodes';

import {
  configureCSpace,
  createSession,
  setSession,
  readSystemInfo,
} from '../../../src/actions/cspace';

chai.use(chaiAsPromised);
chai.should();

const mockStore = configureMockStore([thunk]);

describe('cspace action creator', () => {
  describe('configureCSpace', () => {
    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should create a CSpace session and make it the active session', () => {
      const store = mockStore({
        user: Immutable.Map(),
      });

      const cspaceConfig = {
        foo: 'bar',
        serverUrl: 'http://something.org',
      };

      store.dispatch(configureCSpace(cspaceConfig));

      const session = getSession();

      session.should.be.an('object');
      session.config().should.have.property('url', 'http://something.org');
    });

    it('should dispatch CSPACE_CONFIGURED, ACCOUNT_PERMS_READ_FULFILLED, ACCOUNT_ROLES_READ_FULFILLED, PREFS_LOADED, and AUTH_VOCABS_READ_FULFILLED', () => {
      moxios.stubRequest(/.*/, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        user: Immutable.Map(),
      });

      const cspaceConfig = {
        foo: 'bar',
        serverUrl: 'http://something.org',
        recordTypes: {
          person: {
            serviceConfig: {
              servicePath: 'personauthorities',
              serviceType: 'authority',
            },
          },
        },
      };

      // Set a stored cspace-client username.

      window.localStorage.setItem('cspace-client', JSON.stringify({
        'cspace-ui': {
          [cspaceConfig.serverUrl]: {
            username: 'user@collectionspace.org',
          },
        },
      }));

      store.dispatch(configureCSpace(cspaceConfig));

      return new Promise((resolve) => {
        window.setTimeout(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(6);

          actions[0].should
            .include({ type: CSPACE_CONFIGURED })
            .and.have.property('payload')
            .that.has.property('url', 'http://something.org');

          actions[1].should.include({ type: ACCOUNT_PERMS_READ_FULFILLED });
          actions[2].should.include({ type: ACCOUNT_ROLES_READ_FULFILLED });
          actions[3].should.include({ type: PREFS_LOADED });
          actions[4].should.include({ type: AUTH_VOCABS_READ_STARTED });
          actions[5].should.include({ type: AUTH_VOCABS_READ_FULFILLED });

          window.localStorage.removeItem('cspace-client');

          resolve();
        }, 0);
      });
    });

    it('should resolve if the readAccountPerms query returns a 401 error', () => {
      moxios.stubRequest(/\/accounts\/0\/accountperms/, {
        status: 401,
        response: {},
      });

      const store = mockStore({
        user: Immutable.Map(),
      });

      const cspaceConfig = {
        foo: 'bar',
        serverUrl: 'http://something.org',
        recordTypes: {
          person: {
            serviceConfig: {
              servicePath: 'personauthorities',
              serviceType: 'authority',
            },
          },
        },
      };

      // Set a stored cspace-client username.

      window.localStorage.setItem('cspace-client', JSON.stringify({
        'cspace-ui': {
          [cspaceConfig.serverUrl]: {
            username: 'user@collectionspace.org',
          },
        },
      }));

      return store.dispatch(configureCSpace(cspaceConfig))
        .then(() => Promise.resolve());
    });

    it('should reject if the readAccountPerms query returns an error other than 401', () => {
      moxios.stubRequest(/\/accounts\/0\/accountperms/, {
        status: 500,
        response: {},
      });

      const store = mockStore({
        user: Immutable.Map(),
      });

      const cspaceConfig = {
        foo: 'bar',
        serverUrl: 'http://something.org',
        recordTypes: {
          person: {
            serviceConfig: {
              servicePath: 'personauthorities',
              serviceType: 'authority',
            },
          },
        },
      };

      // Set a stored cspace-client username.

      window.localStorage.setItem('cspace-client', JSON.stringify({
        'cspace-ui': {
          [cspaceConfig.serverUrl]: {
            username: 'user@collectionspace.org',
          },
        },
      }));

      return store.dispatch(configureCSpace(cspaceConfig))
        .catch(() => Promise.resolve());
    });

    it('should configure an onError callback that is a function', () => {
      const store = mockStore({
        user: Immutable.Map(),
      });

      store.dispatch(configureCSpace());

      const session = getSession();
      const config = session.config();

      config.onError.should.be.a('function');
    });
  });

  describe('onError callback', () => {
    const store = mockStore({
      notification: Immutable.Map(),
      user: Immutable.Map(),
    });

    store.dispatch(configureCSpace());

    const { onError } = getSession().config();

    afterEach(() => {
      store.clearActions();
    });

    it('should reject with the error', () => {
      const error = new Error();

      onError(error).should.eventually.be.rejectedWith(error);
    });

    it('should dispatch RESET_LOGIN and OPEN_MODAL if the error is an invalid token 401 error', () => {
      const error = {
        response: {
          status: 401,
          data: {
            error: 'invalid_token',
          },
        },
      };

      onError(error);

      const actions = store.getActions();

      actions.length.should.equal(2);

      actions[0].should.deep.equal({
        type: RESET_LOGIN,
        meta: {
          username: '',
        },
      });

      actions[1].should.deep.equal({
        type: OPEN_MODAL,
        meta: {
          name: MODAL_LOGIN,
        },
      });
    });
  });

  describe('createSession', () => {
    it('should return a cspace session', () => {
      const username = 'user@collectionspace.org';
      const password = 'topsecret';

      const session = createSession(username, password);

      session.should.be.an('object');
      session.config().should.have.property('username', username);
    });
  });

  describe('setSession', () => {
    it('should create a CSPACE_CONFIGURED action', () => {
      const username = 'user@collectionspace.org';
      const password = 'topsecret';

      const session = createSession(username, password);

      setSession(session).should
        .include({ type: CSPACE_CONFIGURED })
        .and.have.property('payload')
        .that.has.property('username', username);
    });

    it('should update the active session', () => {
      const username = 'user@collectionspace.org';
      const password = 'topsecret';

      const session = createSession(username, password);

      setSession(session);

      getSession().should.equal(session);
    });
  });

  describe('readSystemInfo', () => {
    const store = mockStore({
      cspace: Immutable.Map(),
      // user: Immutable.Map(),
    });

    const tenantId = '123';

    const config = {
      tenantId,
    };

    const systemInfoUrl = `/cspace-services/systeminfo?tid=${tenantId}`;

    before(() => store.dispatch(configureCSpace())
      .then(() => store.clearActions()));

    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      store.clearActions();
      moxios.uninstall();
    });

    it('should dispatch SYSTEM_INFO_READ_FULFILLED on success', () => {
      moxios.stubRequest(systemInfoUrl, {
        status: 200,
        response: {
          'ns2:system_info_common': {
            version: {
              major: '5',
              minor: '1',
            },
          },
        },
      });

      return store.dispatch(readSystemInfo(config))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SYSTEM_INFO_READ_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {
                'ns2:system_info_common': {
                  version: {
                    major: '5',
                    minor: '1',
                  },
                },
              },
            },
          });
        });
    });

    it('should dispatch SYSTEM_INFO_READ_REJECTED on error', () => {
      moxios.stubRequest(systemInfoUrl, {
        status: 404,
        response: {},
      });

      return store.dispatch(readSystemInfo(config))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].type.should.equal(SYSTEM_INFO_READ_REJECTED);
        });
    });
  });
});
