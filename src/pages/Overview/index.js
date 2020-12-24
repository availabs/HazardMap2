import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash.get';
import StackedBarGraph from "./components/StackedBarGraph";
import {setActiveStateGeoid} from "store/modules/stormEvents";
import {Header} from "@availabs/avl-components";
import SvgMapComponent from "./layers/SvgMapComponent";
import SevereWeatherCountyTable from "./components/SevereWeatherCountyTable";
import FemaDisastersTotalCountyTable from "./components/FemaDisastersTotalCountyTable";
import FemaDisastersIndividualCountyTable from "./components/FemaDisastersIndividualCountyTable";
import {reduxFalcor}  from "utils/redux-falcor-new";
import {withRouter} from "react-router-dom";
let years = []
const start_year = 1996
const end_year = 2019
for (let i = start_year; i <= end_year; i++) {
    years.push(i)
}
const FEMA_COUNTY_ATTRIBUTES =[
    'ia_ihp_amount',
    'ia_ihp_count',
    'pa_project_amount',
    'pa_federal_share_obligated',
    'hma_prop_actual_amount_paid',
    'hma_prop_number_of_properties',
    'hma_proj_project_amount',
    'hma_proj_project_amount_count',
    'hma_proj_federal_share_obligated',
    'hma_proj_federal_share_obligated_count',
    'total_cost',
    "total_disasters"
];

const hazards = [
    {value:'wind', name:'Wind'},
    {value:'wildfire', name:'Wildfire'},
    {value:'tsunami', name:'Tsunami/Seiche'},
    {value:'tornado', name:'Tornado'},
    {value:'riverine', name:'Flooding'},
    {value:'lightning', name:'Lightning'},
    {value:'landslide', name:'Landslide'},
    {value:'icestorm', name:'Ice Storm'},
    {value:'hurricane', name:'Hurricane'},
    {value:'heatwave', name:'Heat Wave'},
    {value:'hail', name:'Hail'},
    {value:'earthquake', name:'Earthquake'},
    {value:'drought', name:'Drought'},
    {value:'avalanche', name:'Avalanche'},
    {value:'coldwave', name:'Coldwave'},
    {value:'winterweat', name:'Snow Storm'},
    {value:'volcano', name:'Volcano'},
    {value:'coastal', name:'Coastal Hazards'}
]
class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount(){
        this.fetchFalcorDeps()
    }

    componentDidUpdate(prevProps,prevState,s){

        if(this.props.activeCountyGeoid !== prevProps.activeCountyGeoid){
            this.fetchFalcorDeps()
        }
    }

    async fetchFalcorDeps() {

        let geoid = this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid
        this.hazards = hazards.reduce((a,c) =>{
            a.push(c.value)
            return a
        },[])
        const name = await this.props.falcor.get(['geo',geoid,['name']])
        const severeWeather = await this.props.falcor.get(["severeWeather",geoid,this.hazards,years,['total_damage']])
        const sba = await this.props.falcor.get(["sba","all",geoid,this.hazards,years,['total_loss']])
        const fema_disasters_combined = await this.props.falcor.get(["fema","disasters",geoid,this.hazards,years,FEMA_COUNTY_ATTRIBUTES])
        const fema_disasters_length = await this.props.falcor.get(['fema','disasters','length'])
        let length = get(fema_disasters_length,['json','fema','disasters','length'])
        let  fema_disasters_by_id = {}
        if(length){
            fema_disasters_by_id = await this.props.falcor.get(['fema','disasters','byIndex',[{from:0,to:length-1}],["name",
                "year",
                "geoid",
                "total_cost",
                "disaster_type"]])
        }
        return {
            name,
            severeWeather,
            sba,
            fema_disasters_combined,
            fema_disasters_by_id

        }
    }

    processSevereWeatherData(){
        let geoid = this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid
        let graph = get(this.props.falcorCache,['severeWeather',geoid],null)
        let graph_data = []
        if(graph) {
            graph_data = years.reduce((a, year) => {
                a.push({
                    'year': year.toString(),
                })
                return a
            }, [])
            Object.keys(graph).forEach(hazard => {
                graph_data.forEach(item => {
                    item[hazard] = get(graph, [hazard,item.year,'total_damage'], 0)
                })
            })
        }
        return graph_data
    }

    processSbaData(){
        let geoid = this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid
        let graph = get(this.props.falcorCache,['sba','all',geoid],null)
        let graph_data = []
        if(graph) {
            graph_data = years.reduce((a, year) => {
                a.push({
                    'year': year.toString(),
                })
                return a
            }, [])
            Object.keys(graph).forEach(hazard => {
                graph_data.forEach(item => {
                    item[hazard] = get(graph, [hazard,item.year,'total_loss'], 0)
                })
            })
        }
        return graph_data

    }

    processFemaDisasterData(){
        let geoid = this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid
        let graph = get(this.props.falcorCache,['fema','disasters','byId'],null)
        let graph_data = []
        if(graph) {
            graph_data = years.reduce((a, year) => {
                a.push({
                    'year': year.toString(),
                })
                return a
            }, [])
            graph_data.forEach(d =>{
                hazards.forEach(hazard =>{
                    d[hazard.value] = 0
                })
            })
            graph_data.forEach(d =>{
                hazards.forEach(hazard =>{
                    Object.values(graph).filter(d => d !== '$__path').forEach(item =>{
                        if(item.year && get(item,['year','value'],0).toString() === d.year
                            && get(item,['disaster_type','value'],'') === hazard.value
                            && get(item,['geoid','value'],'') === geoid
                        ){
                            d[hazard.value] += parseFloat(get(item,['total_cost','value'],0))
                        }
                    })
                })
            })
        }
        return graph_data
    }

    processFemaDisastersCombined(){
        let geoid = this.props.activeCountyGeoid ? this.props.activeCountyGeoid : this.props.match.params.geoid
        let graph = get(this.props.falcorCache,['fema','disasters',geoid],null)
        let graph_data = []
        if(graph) {
            graph_data = years.reduce((a, year) => {
                a.push({
                    'year': year.toString(),
                })
                return a
            }, [])
            Object.keys(graph).forEach(hazard => {
                graph_data.forEach(item => {
                    item[hazard] = get(graph, [hazard,item.year,'total_cost','value'], 0)
                })
            })
        }
        return graph_data
    }

    render() {

        return (
            <div className='w-full h-full overflow-y-scroll overflow-x-hidden'>
                <div className="max-w-7xl mx-auto">
                    <div className="flex-initial">
                        <SvgMapComponent/>
                    </div>
                    <div>
                        <Header title = {'Severe Weather Data'}/>
                        <StackedBarGraph
                            data={this.processSevereWeatherData()}
                        />
                    </div>
                    <div>
                        <SevereWeatherCountyTable
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid : this.props.match.params.geoid}
                        />
                    </div>
                    <div>
                        <Header title = {'SBA ALL Data'}/>
                        <StackedBarGraph
                            data={this.processSbaData()}
                        />
                    </div>
                    
                    <div>
                        <Header title = {'Fema Disaster Summaries'}/>
                        <StackedBarGraph
                            data={this.processFemaDisastersCombined()}
                        />
                    </div>
                    <div>
                        <div className="text-sm">Disaster Declaration Summaries V2 & Fema Web Disaster Summaries</div>
                        <FemaDisastersTotalCountyTable
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid}
                        />
                    </div>
                    <div>
                        <div className="text-sm">Individual and Households Programs Valid Registration</div>
                        <FemaDisastersIndividualCountyTable
                            type={'ia'}
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid}
                        />
                    </div>
                    <div>
                        <div className="text-sm">Public Assistance Applicants V1 & Public Assistance Funded Projects Details V1</div>
                        <FemaDisastersIndividualCountyTable
                            type={'pa'}
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid}
                        />
                    </div>
                    <div>
                        <div className="text-sm">Hazard Mitigation Assistance Projects V2</div>
                        <FemaDisastersIndividualCountyTable
                            type={'hmgp_projects'}
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid}
                        />
                    </div>
                    <div>
                        <div className="text-sm">Hazard Mitigation Assistance Mitigated Properties V2</div>
                        <FemaDisastersIndividualCountyTable
                            type={'hmgp_properties'}
                            geoid ={this.props.activeCountyGeoid ? this.props.activeCountyGeoid :this.props.match.params.geoid}
                        />
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        falcorCache: state.falcorCache,
        activeCountyGeoid : state.overview.activeCountyGeoid,
        activeStateAbbrev : state.stormEvents.activeStateAbbrev,
        graph: state.graph,
        hazards: get(state.graph, 'riskIndex.hazards.value', [])
    };
};
const mapDispatchToProps = {
    setActiveStateGeoid
};
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Overview))

export default [

    {
        path: '/overview/:geoid',
        mainNav: false,
        exact: true,
        name: 'Overview',
        layoutSettings: {
            fixed: true,
            maxWidth: '',//'max-w-7xl',
            headerBar: false,
            nav: 'top',
            theme: 'flat',
        },
        component: withRouter(ConnectedComponent)
    },


]
