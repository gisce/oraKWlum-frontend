import React, { Component } from 'react'

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const styles = {
};

export class AggregationsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            aggregations: props.aggregations,
            groupSelected: false,
            oneSelected: false,
        };

        this.selectedAggregations = [];
    }

    newAggregation(e) {
        e.preventDefault();
        console.log("new");
    }

    editAggregation(e) {
        e.preventDefault();
        console.log("edit");
    }

    deleteAggregation(e) {
        e.preventDefault();
        console.log("delete");
    }

    handleSelection(selections) {
        const aggregations = this.state.aggregations;

        switch( selections ) {
            case "all":
                this.selectedAggregations = aggregations.map(function(selected, index) {
                    return selected._id;
                });
                break;

            case "none":
                this.selectedAggregations = [];
                break;

            default:
                this.selectedAggregations = selections.map(function(selected, index) {
                    return aggregations[selected]._id;
                });
                break;
        };

    }

    render() {

        const {aggregations, groupSelected, oneSelected} = this.state;

        const actions = [
            <RaisedButton
              key="createButton"
              label='New'
              primary={true}
              onTouchTap={(e) => this.newAggregation(e)}
              disabled={oneSelected || groupSelected}
            />
        ,
            <RaisedButton
              key="editButton"
              label='Edit'
              primary={true}
              onTouchTap={(e) => this.editAggregation(e)}
              disabled={!oneSelected}
            />
        ,
            <RaisedButton
              key="deleteButton"
              label='Delete'
              primary={true}
              onTouchTap={(e) => this.deleteAggregation(e)}
              disabled={!groupSelected}
            />
        ]


        return  (
            <div>
                <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={true}
                    onRowSelection={(agg) => this.handleSelection(agg)}
                >
                    <TableHeader
                        displaySelectAll={true}
                        enableSelectAll={true}
                    >
                      <TableRow>
                          <TableHeaderColumn>Name</TableHeaderColumn>
                          <TableHeaderColumn>DB Fields</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>

                    <TableBody
                        stripedRows={false}
                        deselectOnClickaway={false}
                    >
                {
                    aggregations.map(function(agg, index) {
                        return (
                            <TableRow key={"tableRow_"+index}>
                                <TableRowColumn>{agg.name}</TableRowColumn>
                                <TableRowColumn>
                                    {
                                        agg.db_fields.map(function(field, index){
                                            const separator = (index==0)? "":", ";
                                            return separator + field;
                                        })
                                    }
                                </TableRowColumn>
                            </TableRow>
                        )
                    })
                }
                    </TableBody>
                </Table>

            {
                    this.state.aggregations_error_text &&
                    <div>
                        <TextField
                            id="aggregationError"
                            style={{marginTop: 0}}
                            floatingLabelText=""
                            value=""
                            errorText={this.state.aggregations_error_text}
                        />
                        <br/>
                        <br/>
                    </div>
            }

            {actions}

            </div>
        );
    }
}

AggregationsList.propTypes = {
    aggregations: React.PropTypes.array.isRequired,
};