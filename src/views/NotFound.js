import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/auth';

import {FormattedHTMLMessage} from 'react-intl';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class NotFound extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        return (
            <div className="col-md-8">
                <h1>
                <FormattedHTMLMessage id="NotFound.notfound" defaultMessage="Not Found"/>
                </h1>

                <h3>
                <FormattedHTMLMessage id="NotFound.detail" defaultMessage="Detail:"/>
                </h3>
                <pre>{ JSON.stringify(this.props, null, 2) }</pre>


            </div>
        );
    }
}

export default NotFound;
