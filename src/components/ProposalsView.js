import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/proposals';
import { debug } from '../utils/debug';

import { dispatchNewRoute} from '../utils/http_functions';

import { ProposalList } from './ProposalList';
import { ContentHeader } from './ContentHeader';

function mapStateToProps(state) {
    return {
        data: state.proposals,
        allAggregations: state.proposals.allAggregations,
        token: state.auth.token,
        loaded: state.proposals.loaded,
        isFetching: state.proposals.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProposalsView extends React.Component {
    componentDidMount() {
        const debug = localStorage.getItem('debug');
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedDataProposals(token);
    }

    refreshData() {
        this.fetchData();
    }

    addProposal() {
        console.log("add new proposal");
        dispatchNewRoute("/proposals/new");
    }

    render() {
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading Proposals...</h1>
                    :
                    <div>
                        <ContentHeader
                            title="Proposals List"
                            addButton={true}
                            addClickMethod={() => this.addProposal()}

                            refreshButton={true}
                            refreshClickMethod={() => this.refreshData()}
                        />

                        <ProposalList
                            title="Last proposals"
                            proposals={this.props.data.data}
                            aggregations={this.props.allAggregations}
                            path={this.props.location.pathname}
                        />

                    </div>
                }
            {debug(this.props)}
            </div>
        );
    }
}

ProposalsView.propTypes = {
    fetchProtectedDataProposals: React.PropTypes.func,
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
