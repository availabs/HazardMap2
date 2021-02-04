import {connect} from "react-redux";
import {reduxFalcor} from "../../utils/redux-falcor-new";
import React from "react";
import {withRouter} from "react-router";
import config from "../StormEvents/components/config";
import {Table} from '@availabs/avl-components'
import get from 'lodash.get';
import {fnum} from "../../utils/sheldusUtils";
import * as d3 from "d3";
import StackedBarGraph from './components/bar'
import {Header} from "@availabs/avl-components/dist/components";
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)
var _ = require('lodash')

const severeWeatherTableCols = [
    {
        Header: 'County Name',
        accessor: 'county',
    },
    {
        Header: 'Total Damage',
        accessor: 'total_damage',
        Cell: (data) => {
            return <div style={{textAlign: 'center'}}>{fnum(get(data, `row.values.total_damage`, ''))}</div>
        },
        disableFilters: true
    },
    {
        Header: 'Number of Events',
        accessor: 'num_events',
        Cell: (data) => {
            return <div style={{textAlign: 'center'}}>{fmt(get(data, `row.values.num_events`, ''))}</div>
        },
        disableFilters: true
    },
    {
        Header: 'Number of Severe Events',
        accessor: 'num_severe_events',
        Cell: (data) => {
            return <div style={{textAlign: 'center'}}>{fmt(get(data, `row.values.num_severe_events`, ''))}</div>
        },
        disableFilters: true
    }
];

const femaTableCols = [
    {
        Header: 'County Name',
        accessor: 'county_name',
    },
    {
        Header: 'Total Spending',
        accessor: 'total_cost',
        Cell: (data) => {
            return <div style={{textAlign: 'center'}}>{fnum(get(data, `row.values.total_cost`, ''))}</div>
        },
        disableFilters: true
    },
    {
        Header: 'Number of Declarations',
        accessor: 'num_declarations',
        Cell: (data) => {
            return <div style={{textAlign: 'center'}}>{fmt(get(data, `row.values.num_declarations`, ''))}</div>
        },
        disableFilters: true
    },
];
class Rankings extends React.Component {

    constructor(props) {
        super(props);

        this.state= {
            hazard: null
        }
    }
    fetchFalcorDeps(){
       return this.props.falcor.get(['geo',config.fips,'counties','geoid'],['fema','disasters','length'])
           .then(response => {
               let length = get(response,['json','fema','disasters','length'],null)
               let graph = get(response, ['json','geo'],null)
               if(graph && length){
                   this.counties = Object.values(graph)
                       .reduce((out, state) => {
                           if (state.counties) {
                               out = [...out, ...state.counties]
                           }
                           return out
                       }, [])
                   this.props.falcor.get(['geo',this.counties,'name'])
                       .then(response =>{
                           this.props.falcor.get(['fema','disasters','byIndex',[{from:0,to:length-1}],[
                               "name",
                               "year",
                               "geoid",
                               "total_cost",
                               "disaster_number",
                               "disaster_type"
                           ]]).then(response =>{
                               return response
                           })
                           return response
                       })
               }
               if(this.counties.length > 0){
                   let chunks = _.chunk(this.counties,20),requests = []
                   chunks.forEach(chunk =>{
                       requests.push(['severeWeather',chunk,config.hazards,'allTime',['total_damage','num_events','num_severe_events']])
                   })
                   return requests.reduce((a, c, cI) => a.then(() => {
                       this.props.falcor.get(c)
                           .then(response =>{
                               return response
                           })
                   }), Promise.resolve())

               }
           })
    }

    processSevereWeatherData(){
        let geo = get(this.props.falcorCache,['geo'],null)
        let severeWeatherData = get(this.props.falcorCache,['severeWeather'],null)
        let data = []

        if(geo && severeWeatherData){
            if(this.state.hazard){
                Object.keys(severeWeatherData).filter(d => d !== '$__path').forEach(item =>{
                    data.push({
                        'county': geo[item] ? geo[item].name : '',
                        'total_damage': get(severeWeatherData,[item,this.state.hazard,'allTime','total_damage'],0),
                        'num_events': get(severeWeatherData,[item,this.state.hazard,'allTime','num_events'],0),
                        'num_severe_events': get(severeWeatherData,[item,this.state.hazard,'allTime','num_severe_events'],0)
                    })
                })
                data = data.filter(d => d['total_damage'] !== 0)
            }
            else{
                Object.keys(severeWeatherData).filter(d => d!== '$__path').forEach(item =>{
                    config.hazards.forEach(hazard =>{
                        data.push({
                            'county': geo[item] ? geo[item].name : '',
                            'total_damage': get(severeWeatherData,[item,hazard,'allTime','total_damage'],0),
                            'num_events': get(severeWeatherData,[item,hazard,'allTime','num_events'],0),
                            'num_severe_events': get(severeWeatherData,[item,hazard,'allTime','num_severe_events'],0)
                        })
                    })
                })
                data = _(data)
                    .groupBy('county')
                    .map((item,id) =>

                        (
                            {
                            'county': id,
                            'total_damage': _.sumBy(item,'total_damage'),
                            'num_events': _.sumBy(item,'num_events'),
                            'num_severe_events': _.sumBy(item,'num_severe_events')
                        }
                        )
                    ).value()
            }
        }
        return data
    }
    processFemaDisasterData(){
        let geo = get(this.props.falcorCache,['geo'],null)
        let femaData = get(this.props.falcorCache,['fema','disasters','byId'],null)
        let data = []
        if(geo && femaData){
            if(this.state.hazard){
                Object.keys(femaData).filter(d => d !== '$__path').forEach(item =>{
                    if(get(femaData,[item,'disaster_type','value'],'') === this.state.hazard){
                        data.push({
                            'county':  get(femaData,[item,'geoid','value'],''), //geo[femaData[item].geoid.value].name,
                            'county_name': geo[get(femaData,[item,'geoid','value'],'')] ? geo[get(femaData,[item,'geoid','value'],'')].name : get(femaData,[item,'geoid','value'],''),
                            'total_cost': get(femaData,[item,'total_cost','value'],0),
                        })
                    }

                })

                let count  = _.countBy(data,'county')
                data.map((item,i) =>{
                    item['num_declarations'] = count[item.county] || 0
                })
            }else{
                Object.keys(femaData).filter(d => d !== '$__path').forEach(item =>{
                    data.push({
                        'county':  get(femaData,[item,'geoid','value'],''),
                        'county_name': geo[get(femaData,[item,'geoid','value'],'')] ? geo[get(femaData,[item,'geoid','value'],'')].name : get(femaData,[item,'geoid','value'],''),
                        'total_cost': get(femaData,[item,'total_cost','value'],0),
                    })
                })

                let count  = _.countBy(data,'county')
                data.map((item,i) =>{
                    item['num_declarations'] = count[item.county] || 0
                })
                data = _(data)
                    .groupBy('county')
                    .map((item,id) =>

                        (
                            {
                                'county': id,
                                'county_name': item.reduce((a,c) => c['county_name'] ? c['county_name'] : a,''),
                                'total_cost': _.sumBy(item,'total_cost'),
                                'num_declarations': _.sumBy(item,'num_declarations'),
                            }
                        )
                    ).value()
            }
        }
        return data
    }

    render(){
        let severeWeatherData = this.processSevereWeatherData()
        let femaData = this.processFemaDisasterData()

        return(
<<<<<<< HEAD
            <div className='max-w-7xl mx-auto'>
                <div className='w-full'>
                    <select
                        className="rounded-lg py-3 px-3 border-2 border-gray-200 w-full bg-white"
                        onChange={(e) =>{
                            let hazard = e.target.value
                            this.setState({
                                hazard: hazard === 'All Hazards' ? null : hazard
                            })
                        }}
                    >
                        <option value={null}>All Hazards</option>
                        {config.Hazards.map((d,i) =>{
                            return(
                                <option value={d.value} key={i}>
                                    {d.name}
                                </option>
                            )
                        })}
                    </select>
                    {severeWeatherData && severeWeatherData.length > 0 ?
                        <div>
                            <h4>SevereWeather Data Loss By County</h4>
                            <Table
                                defaultPageSize={100}
                                showPagination={true}
                                columns={severeWeatherTableCols}
                                data={severeWeatherData}
                                initialPageSize={100}
                                minRows={severeWeatherData.length}
                                sortOrder={'desc'}
                            />
                        </div>
=======
            <div>
                <select
                    className="rounded-lg py-3 px-3 border-2 border-gray-200 my-5 w-64 bg-white"
                    onChange={(e) =>{
                        let hazard = e.target.value
                        this.setState({
                            hazard: hazard === 'All Hazards' ? null : hazard
                        })
                    }}
                >
                    <option value={null}>All Hazards</option>
                    {config.Hazards.map((d,i) =>{
                        return(
                            <option value={d.value} key={i}>
                                {d.name}
                            </option>
                        )
                    })}
                </select>
                <Header title={'Storm Events County wise Data'}/>
                <StackedBarGraph
                    data = {severeWeatherData}
                    hazard = {this.state.hazard}
                />
                <Header title={'Storm Events Rankings'}/>
                {severeWeatherData && severeWeatherData.length > 0 ?
                    <Table
                        defaultPageSize={100}
                        showPagination={true}
                        columns={severeWeatherTableCols}
                        data={severeWeatherData}
                        initialPageSize={100}
                        minRows={severeWeatherData.length}
                        sortOrder={'desc'}
                    />
                    :
                    <div>
                        Loading ....
                    </div>
                }
                <Header title={'Fema Disaster Data Rankings'}/>
                {
                    femaData && femaData.length > 0 ?
                        <Table
                            defaultPageSize={100}
                            showPagination={true}
                            columns={femaTableCols}
                            data={femaData}
                            initialPageSize={100}
                            minRows={femaData.length}
                            sortOrder={'desc'}
                        />
>>>>>>> 0a91e69e7b5bea957d22e109f4484cb22b3a0995
                        :
                        <div>
                            Loading ....
                        </div>
                    }
                    {
                        femaData && femaData.length > 0 ?
                            <div>
                                <h4>Fema Disaster Spending By County</h4>
                                <Table
                                    defaultPageSize={100}
                                    showPagination={true}
                                    columns={femaTableCols}
                                    data={femaData}
                                    initialPageSize={100}
                                    minRows={femaData.length}
                                    sortOrder={'desc'}
                                />
                            </div>
                            :
                            <div>
                                Loading ....
                            </div>

                    }
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        falcorCache: state.falcorCache,
    };
};
const mapDispatchToProps = {

};
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Rankings))

export default [
    {
        path: '/rankings',
        mainNav: true,
        exact: false,
        name: 'Rankings',
        authed:false,
        component:withRouter(ConnectedComponent),
        layoutSettings: {
            fixed: true,
            maxWidth: '',//'max-w-7xl',
            headerBar: false,
            nav: 'top'
        }
    }
]
