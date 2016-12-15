import React, { Component } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

const styles = {
    buttonAdd: {
        marginRight: 20,
    },
    buttonPosition: {
        textAlign: 'right',
    }
};

export class ContentHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const title = this.props.title;
        const withAdd = (this.props.addButton)?this.props.addButton:false;
        const withRefresh = (this.props.refreshButton)?this.props.refreshButton:false;

        const withButton = withAdd || withRefresh;

        const addClickMethod = (this.props.addClickMethod)?this.props.addClickMethod:null;
        const refreshClickMethod = (this.props.refreshClickMethod)?this.props.refreshClickMethod:null;

        // The Refresh Button
        const refreshButton = (
            (withRefresh)?
                <FloatingActionButton style={styles.buttonAdd} onClick={() => refreshClickMethod()}>
                      <Refresh />
                </FloatingActionButton>
            :
                null
        )

        // The Add Button
        const addButton = (
            (withAdd)?
                <FloatingActionButton style={styles.buttonAdd} onClick={() => addClickMethod()}>
                      <ContentAdd />
                </FloatingActionButton>
            :
                null
        );


        return (
            <div className='row'>
                <div className="col-md-6"><h1>{title}</h1></div>
                    { withButton &&
                        <div className="col-md-6" style={styles.buttonPosition}>
                                {refreshButton}
                                {addButton}
                        </div>
                    }
            </div>

        );
    }
}

ContentHeader.propTypes = {
    title: React.PropTypes.string.isRequired,
    addButton: React.PropTypes.bool,
    refreshButton: React.PropTypes.bool,
    addClickMethod: React.PropTypes.func,
    refreshClickMethod: React.PropTypes.func,
};
