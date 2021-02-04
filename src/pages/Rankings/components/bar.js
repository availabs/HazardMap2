import React from 'react';
import { connect } from 'react-redux';
import {reduxFalcor} from "../../../utils/redux-falcor-new";
import {ResponsiveBar} from '@nivo/bar'
import { fnum } from "utils/sheldusUtils"

const start_range = 0
const end_range = 1000000000
let range = []
for (var i = start_range; i <= end_range; i+=100000000){
    range.push({
        'range': `${fnum(i)}-${i+100000000 >= end_range ? 'and above': fnum(i+100000000)}`,
        'low': i,
        'high': `${i+100000000 > end_range ? Infinity : i+100000000 }`
    })
}

class StackedBarGraph extends React.Component {
    processData(){
        let data = []
        let graph = this.props.data.length>0 ? this.props.data : null
        if(graph){
            data = range.reduce((acc,r) =>{
                acc.push(graph.reduce((a,c) =>{
                    if(r.low <= c['total_damage'] && c['total_damage'] <= r.high){
                        a['count'] = a['count'] + 1 || 0
                        a['range'] = r.range
                    }
                    return a
                },{}))
                return acc
            },[])
        }


        return data
    }
    render(){
        let data = this.processData()
        if(this.props.data.length > 0){
            return(
                <div style={ { width: this.props.width ? this.props.width : '70%', height: this.props.height ? this.props.height : "400px" } }>
                    <ResponsiveBar
                        data={data}
                        keys={['count']}
                        indexBy="range"
                        margin={{ top: 40, right: 70, bottom: 50, left: 70 }}
                        padding={0.5}
                        colors={{ scheme: 'nivo' }}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        enableLabel={false}
                        enableGridX={false}
                        enableGridY= {false}
                        axisTop={null}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '# Counties',
                            legendPosition: 'middle',
                            legendOffset: -45
                        }}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Range',
                            legendPosition: 'middle',
                            legendOffset: 35,
                            format: v => v
                        }}
                        axisRight={null}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelFormat={d=> `${fnum(d)}`}
                        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        tooltipFormat={value => value}
                    />

                </div>
            )
        }else{
            return (
                <div>
                    Loading ...
                </div>
            )
        }

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        falcorCache: state.falcorCache,
    };
};
const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(StackedBarGraph))
