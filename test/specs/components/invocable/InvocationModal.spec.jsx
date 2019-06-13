/* global document */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider as StoreProvider } from 'react-redux';
import InvocationModal from '../../../../src/components/invocable/InvocationModal';
import createTestContainer from '../../../helpers/createTestContainer';
import ConfigProvider from '../../../../src/components/config/ConfigProvider';

const expect = chai.expect;

chai.should();

const mockStore = configureMockStore([thunk]);

const store = mockStore({
  searchToSelect: Immutable.Map(),
  prefs: Immutable.Map(),
  record: Immutable.Map(),
  search: Immutable.Map(),
  user: Immutable.Map(),
});

const csid = '1234';

const reportData = Immutable.fromJS({
  document: {
    'ns2:collectionspace_core': {
      uri: `/reports/${csid}`,
    },
    'ns2:reports_common': {
      name: 'Test Report',
    },
  },
});

const config = {
  recordTypes: {
    report: {
      messages: {
        record: {
          invokeUnsaved: {
            id: 'report.invokeUnsaved',
            defaultMessage: 'Unsaved changes!',
          },
          name: {
            id: 'report.name',
            defaultMessage: 'Report',
          },
        },
      },
      title: data =>
        data.getIn(['document', 'ns2:reports_common', 'name']),
    },
  },
};

const invocationDescriptor = Immutable.Map({
  mode: 'single',
});

describe('InvocationModal', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render a modal', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              csid={csid}
              data={reportData}
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    document.querySelector('.ReactModal__Content--after-open').should.not.equal(null);

    unmountComponentAtNode(this.container);
  });

  it('should render nothing if isOpen is false', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen={false}
              csid={csid}
              data={reportData}
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    expect(this.container.firstElementChild).to.equal(null);
    expect(document.querySelector('.ReactModal__Content--after-open')).to.equal(null);
  });

  it('should render nothing if data is not supplied', function test() {
    render(
      <IntlProvider locale="en">
        <ConfigProvider config={config}>
          <StoreProvider store={store}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen={false}
              recordType="report"
            />
          </StoreProvider>
        </ConfigProvider>
      </IntlProvider>, this.container);

    expect(this.container.firstElementChild).to.equal(null);
    expect(document.querySelector('.ReactModal__Content--after-open')).to.equal(null);
  });

  it('should render a title using the data', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              isRecordModified
              data={reportData}
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const modal = document.querySelector('.ReactModal__Content--after-open');

    modal.querySelector('h1').textContent.should.equal('Test Report');

    unmountComponentAtNode(this.container);
  });

  it('should render the record name as the title if no title is found in the data', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              isRecordModified
              data={Immutable.Map()}
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const modal = document.querySelector('.ReactModal__Content--after-open');

    modal.querySelector('h1').textContent.should.equal('Report');

    unmountComponentAtNode(this.container);
  });

  it('should render a no-break space as the title if data is undefined', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              isRecordModified
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const modal = document.querySelector('.ReactModal__Content--after-open');

    modal.querySelector('header > div').textContent.should.equal(' ');

    unmountComponentAtNode(this.container);
  });

  it('should render an unsaved warning if isRecordModified is true', function test() {
    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              isRecordModified
              data={reportData}
              recordType="report"
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const modal = document.querySelector('.ReactModal__Content--after-open');

    modal.querySelector('.cspace-ui-Warning--common').textContent.should.equal('Unsaved changes!');

    unmountComponentAtNode(this.container);
  });

  it('should call onInvokeButtonClick when the invoke button is clicked', function test() {
    let invokeButtonClicked;

    const handleInvokeButtonClick = () => {
      invokeButtonClicked = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={csid}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              data={reportData}
              recordType="report"
              onInvokeButtonClick={handleInvokeButtonClick}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    const modal = document.querySelector('.ReactModal__Content--after-open');
    const button = modal.querySelector('button[name="invoke"]');

    Simulate.click(button);

    invokeButtonClicked.should.equal(true);

    unmountComponentAtNode(this.container);
  });

  it('should call readRecord when opened', function test() {
    let readRecordCalled;

    const readRecord = () => {
      readRecordCalled = true;
    };

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              initialInvocationDescriptor={invocationDescriptor}
              csid={csid}
              isOpen={false}
              data={reportData}
              recordType="report"
              readRecord={readRecord}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    render(
      <IntlProvider locale="en">
        <StoreProvider store={store}>
          <ConfigProvider config={config}>
            <InvocationModal
              config={config}
              csid={`${csid}999`}
              initialInvocationDescriptor={invocationDescriptor}
              isOpen
              data={reportData}
              recordType="report"
              readRecord={readRecord}
            />
          </ConfigProvider>
        </StoreProvider>
      </IntlProvider>, this.container);

    readRecordCalled.should.equal(true);

    unmountComponentAtNode(this.container);
  });
});
