function convertTimestampToString(timestamp){
    const the_hour = new Date(timestamp);

    return "" +
        ("0" + the_hour.getHours()).slice(-2) +
        ":" +
        ("0" + the_hour.getMinutes()).slice(-2)
    ;

}

export function adaptProposalData(proposalData) {
    let result={};

    Object.keys(proposalData).map( function(current_aggregation, j) {
            const aggregation = proposalData[current_aggregation];

            //initialize result for each aggregation
            result[current_aggregation]={}
            result[current_aggregation]['result']=[];
            result[current_aggregation]['average']=[];

            let tmp_result={}; //the result temp dict
            let tmp_average={}; //the average temp dict

            //the stacked components for the aggregation values ie F1, F5D, ... or F1,girona; F5D,girona; F1,barcelona; F5D,barcelona
            result[current_aggregation]['components']={};

            //set current aggregation ID and fields
            result[current_aggregation]['aggregation']=aggregation['aggregation']['fields'];
            result[current_aggregation]['aggregationID']=aggregation['aggregation']['id'];

            //Adapt the SUM
            const the_sum = aggregation['result'];
            the_sum.map( function(entry, i) {
                const hour=entry['hour'];
                const amount=entry['amount'];
                const avg=entry['average'];
                const title=entry['title'];

                // initialize result hour with an empty dict
                if (!tmp_result[hour])
                    tmp_result[hour]={total: 0, name: hour};
                tmp_result[hour][title] = amount;
                tmp_result[hour]["total"] += amount;

                // initialize average hour with an empty dict
                if (!tmp_average[hour])
                    tmp_average[hour]={total: 0, name: hour};
                tmp_average[hour][title] = avg;
                tmp_average[hour]["total"] += avg;


                result[current_aggregation]['components'][title] = {
                    'title': title,
                };
            });

            //Adapt the tmp_result dict to an ordered list (based on the timestamp, incremental)
            Object.keys(tmp_result).sort().map( function( tmp_entry, i) {
                result[current_aggregation]['result'][i] = tmp_result[tmp_entry];
                result[current_aggregation]['average'][i] = tmp_average[tmp_entry];

                //Convert datetime to hour strings
                const hour_string = convertTimestampToString(parseInt(tmp_entry));
                result[current_aggregation]['result'][i]['name'] = hour_string;
                result[current_aggregation]['average'][i]['name'] = hour_string;
            });
    });

    return result;
}
