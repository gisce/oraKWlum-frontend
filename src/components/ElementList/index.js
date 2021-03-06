import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import { CheckedTag } from '../CheckedTag';
import { Tag } from '../Tag';
import ElementGraph from '../ElementGraph';

import {adaptProposalData} from '../../utils/graph';
import { dispatchNewRoute} from '../../utils/http_functions';
import {capitalize} from '../../utils/misc';

const element_colors = {
    'proposal': 'accepted',
    'historical': 'base',
    'comparation': 'denied',
    'concatenation': 'pending',
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1024,
    overflowY: 'none',
  },
  gridTile: {
    cursor: 'pointer',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  aggregations: {
      display: 'flex',
  },
  proposalMessage: {
      marginLeft: 15,
  },
};


export class ElementList extends Component {
    constructor(props) {
        super(props);

        const defaultAggregation = "001";

        this.state = {
            open: false,
            title: props.title,
            aggregationSelected: props.aggregations[defaultAggregation].id,
        };

        props.aggregations[defaultAggregation].selected = true;
    }

    changeProposalAggregation = (event, agg) => {
        //initialize selection of all elements
        const aggregations = this.props.aggregations;
        Object.keys(aggregations).map( function(agg, i) {
            aggregations[agg].selected = false;
        });

        //select current
        aggregations[agg].selected=true;

        //save it to change the graph
        this.setState({
            aggregationSelected: agg,
        });
    };

    render() {
        console.debug("render ElementList");
        const {proposals, sameWidth, width, aggregations} = this.props;

	const with_graph = (this.props.with_graph)?this.props.with_graph:true;

        const max_width=1024;
        const max_height=300;

        const desiredSize = (width == "small")? 0 : 1;
        const howManyBig = (sameWidth)? desiredSize * 1000000 : desiredSize * 1;

        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        // The Proposal Aggregations List
        const withPicture=true;
        const offset = 0;
        const size = 12;
        const aggregationsStyle = (withPicture)?styles.aggregations:styles.aggregationsRight;

        const changeProposalAggregation=this.changeProposalAggregation;
        const aggregationSelected = this.state.aggregationSelected;

        const onclick = (this.props.onClick) ? this.props.onClick : false;

        const proposalAggregations = (
            aggregations &&
                <div
                    id="aggregationsList"
                    className={"col-md-offset-"+ (offset) + " col-md-" + size + " col-lg-offset-"+ (offset) + " col-lg-" + size}
                    style={aggregationsStyle}>
                {
                    Object.keys(aggregations).map( function(agg, i) {
                        return (
                            <div key={"aggregationDivTag_"+i} onClick={(e) => changeProposalAggregation(e, agg)}>
                                 <Tag
                                     key={"aggregationTag_"+i}
                                     tag={aggregations[agg].lite}
                                     selected={aggregations[agg].selected}
                                     readOnly/>
                             </div>
                         );
                    })
                }
                </div>

        )

        // Last Proposals (the first bug, the other ones 2 per row)
        const lastProposals = proposals.map((tile, index) => {
                const {selected} = tile;

                let result, components;

                if ('prediction' in tile && tile.prediction != null && tile.prediction != undefined && 'result' in tile.prediction) {
                    const predictionAdapted = adaptProposalData(tile.prediction['result']);

		    //Fix bug with non-existent aggretate for current proposal, fetch the first one available
                    const current = (aggregationSelected in predictionAdapted)?predictionAdapted[aggregationSelected] : predictionAdapted[ Object.keys(predictionAdapted)[0] ];

                    result = current.result;
                    components = current.components;
                }

                const pastday_str = days[new Date(tile.days_range[0]).getDay()];
                const pastday = new Date(tile.days_range[0]).toLocaleDateString();

                const title = tile.name
                const subtitle = <span>{pastday_str} {pastday}</span>

                const element_type = {
                    color: element_colors[tile.element_type],
                    lite: tile.element_type.toUpperCase().slice(0,3),
                    full: tile.element_type.toUpperCase(),
                }

                const proposalTag = (
                    <div style={styles.wrapper}>
                        {(selected)? <CheckedTag/> : null}
                        <Tag tag={element_type} lite={true} />
                    </div>
                )

                const the_graph = (with_graph && tile.prediction && Object.keys(tile.prediction).length >0 ) ?
                    (
                        <ElementGraph
                              stacked={true}
                              data={result}
                              components={components}
                              width={ index < howManyBig ? max_width : max_width/2 }
                              height={ index < howManyBig ? max_height : max_height/2.3 }
                              isLite
                        />
                    )
                :
                    (
                         <p style={styles.proposalMessage}>
                             {
                             (tile.status.lite == "RUN")?
                                 <span><b>Prediction is runnig!</b><br/>Refresh it passed a few seconds...</span>
                             :
                                 (tile.status.lite == "ERROR")?
                                     <span>Prediction have errors</span>
                                     :
                                     <span>Prediction not ready</span>
                             }
                         </p>
                    )

                return (
                    <GridTile
                        key={tile.id}
                        title={title}
                        subtitle={subtitle}
                        actionIcon={proposalTag}
                        actionPosition="right"
                        titlePosition="top"
                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        cols={index < howManyBig ? 2 : 1}
                        rows={index < howManyBig ? 2 : 1}
                        onClick={(event) => (onclick)? onclick(index, tile.id, title) : dispatchNewRoute(tile.url, event)}
                        style={styles.gridTile}
                    >
                        <div><br/><br/><br/><br/></div>

                        {the_graph}

                    </GridTile>
                );
        });

        const ElementList = () => (
          <div style={styles.root}>
            <GridList
              cols={2}
              cellHeight={200}
              padding={1}
              style={styles.gridList}
            >
            <Subheader>{this.state.title}</Subheader>
              {lastProposals}
            </GridList>
          </div>
        );

        return (
            <div>
                <div className="row">{proposalAggregations}</div>
                <div className="row"><ElementList /></div>
            </div>
        );
    }
}

ElementList.propTypes = {
    sameWidth: PropTypes.bool,
    width: PropTypes.string,
    onClick: PropTypes.func,
};
