import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import OptionControlledInput from '../../components/input/OptionControlledInput';
import { getOptions } from '../../reducers';

const mapStateToProps = (state, ownProps) => ({
  options: getOptions(state, ownProps.optionListName),
});

const mapDispatchToProps = {};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    /* eslint-disable no-unused-vars */
    optionListName,
    /* eslint-enable no-unused-vars */
    ...remainingOwnProps
  } = ownProps;

  return {
    ...remainingOwnProps,
    ...stateProps,
    ...dispatchProps,
  };
};

export const ConnectedOptionControlledInput = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OptionControlledInput);

const IntlAwareConnectedOptionControlledInput = injectIntl(ConnectedOptionControlledInput);

IntlAwareConnectedOptionControlledInput.propTypes = {
  ...OptionControlledInput.propTypes,
  optionListName: PropTypes.string,
};

export default IntlAwareConnectedOptionControlledInput;
