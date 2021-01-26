import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from "utils/redux-falcor-new";
import get from 'lodash.get';
import { fnum } from "utils/sheldusUtils"
import hazardcolors from "constants/hazardColors";
import {stormEventsData} from "../../StormEvents/DataFetching/StormEventsDataFecthing";
import {sbaData} from "../../StormEvents/DataFetching/SBADataFetching";
import {femaDisastersData} from "../../StormEvents/DataFetching/FEMADisastersDataFetching";
import config from "../../StormEvents/components/config";
import {Table} from "@availabs/avl-components";
import * as d3 from "d3";
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

let hazard = ''
class HazardListTable extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            isLoading : true,
            currentHazard :hazard,
            severeWeather: [
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Hazard</div>),
                    accessor: 'name',
                    disableFilters: true,
                    Cell: (data) => {
                        hazard =  config.Hazards.reduce((a,c) => c.name === data.row.original.name ? c.value: a,'')
                        return this.handleHazardOnClick(data,hazard)
                    }

                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Total Damage-{this.props.year}</div>),
                    accessor: 'total_damage',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.total_damage', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Yearly Avg Damage</div>),
                    accessor: 'annualized_damage',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.annualized_damage', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12}}># Episodes</div>),
                    accessor: 'num_episodes',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fmt(get(data,'row.values.num_episodes', ''))}</div>
                    }
                },
            ],
            sba:[{
                Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Hazard</div>),
                accessor: 'name',
                disableFilters: true,
                Cell: (data) => {
                    hazard =  config.Hazards.reduce((a,c) => c.name === data.row.original.name ? c.value: a,'')
                    return this.handleHazardOnClick(data,hazard)
                }

            },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Total Loss - ${this.props.year}</div>),
                    accessor: 'total_loss',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.total_loss', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>$ Loan</div>),
                    accessor: 'loan_total',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.loan_total', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}># Loans</div>),
                    accessor: 'num_loans',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fmt(get(data,'row.values.num_loans', ''))}</div>
                    }
                }],
            fema:[
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>Hazard</div>),
                    accessor: 'name',
                    disableFilters: true,
                    Cell: (data) => {
                        hazard =  config.Hazards.reduce((a,c) => c.name === data.row.original.name ? c.value: a,'')
                        return this.handleHazardOnClick(data,hazard)
                    }

                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>IHA - ${this.props.year}</div>),
                    accessor: 'ia_ihp_amount',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.ia_ihp_amount', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>PA - ${this.props.year}</div>),
                    accessor: 'pa_project_amount',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fnum(get(data,'row.values.pa_project_amount', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>HMGP - ${this.props.year}</div>),
                    accessor: 'hma_total_amount',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fmt(get(data,'row.values.hma_total_amount', ''))}</div>
                    }
                },
                {
                    Header: (<div style={{fontSize: 12, lineHeight:"150%"}}>$Total Cost Summaries</div>),
                    accessor: 'total_cost_summaries',
                    disableFilters: true,
                    Cell: (data) => {
                        return <div>{fmt(get(data,'row.values.total_cost_summaries', ''))}</div>
                    }
                }
            ],
        }

    }

    handleHazardOnClick(data,hazard){
        return (
            <div style={{cursor: 'pointer'}} className={`bg-white  ${this.props.activeHazard === hazard ? 'border-blue-500 whitespace-nowrap' : 'border-gray-200 whitespace-nowrap' }` }>
                <div style={{backgroundColor:hazardcolors[hazard]}} className='w-3 h-3 mr-2 inline-block'
                     onClick={(e) =>{
                         e.persist()
                         if(this.state.currentHazard !== hazard){
                             this.props.setHazard(hazard)
                             this.setState({
                                 currentHazard : hazard
                             })
                         }else{
                             this.props.setHazard(null)
                         }
                     }}>
                </div>
                {data.row.original.name}
            </div>
        )
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    componentDidUpdate(oldProps){
        if(oldProps.hazard !== this.props.hazard){
            this.fetchFalcorDeps()
        }
        if(oldProps.geoid !== this.props.geoid){
            this.fetchFalcorDeps()
        }
        if(oldProps.year !== this.props.year){
            this.fetchFalcorDeps()
        }
        if(oldProps.data_type !== this.props.data_type){
            this.fetchFalcorDeps()
        }
    }

    async fetchFalcorDeps(){
        switch (this.props.data_type) {
            case 'sba':
                return sbaData(this.props.type,config[this.props.data_type].data_columns,this.props.geoid,'counties',config['hazards'],this.props.year)
            case 'stormevents':
                return stormEventsData(this.props.type,config[this.props.data_type].data_columns,this.props.geoid,'counties',config['hazards'],this.props.year)// "" is for the whole country
            case 'fema':
                return femaDisastersData(this.props.type,config[this.props.data_type].data_columns,this.props.geoid,'counties',config['hazards'],this.props.year)
            default:
                return Promise.resolve({})
        }

    }

    processData(){
        const graph = this.props.geoid ? get(this.props.falcorCache,`${config[this.props.data_type].fetch_url}.${this.props.geoid}`,null) :
                get(this.props.falcorCache,`${config[this.props.data_type].fetch_url}.[""]`,null)
        let header_columns =["name","value",...config[this.props.data_type].table_column]
        let data = []
        if(graph){
            data = Object.keys(graph).map(hazard =>{
                return header_columns.reduce((a,header) =>{
                    config['Hazards'].forEach(item =>{
                        if(item.value === hazard){
                            switch(header) {
                                case 'name':
                                    a[header] = item.name
                                    break;
                                case 'value':
                                    a[header] = item.value
                                    break;
                                case 'annualized_damage':
                                    a[header] = get(graph,[item.value,"allTime",header],0)
                                    break;
                                default :
                                    a[header] = get(graph,[item.value,this.props.year,header],0)
                            }

                        }
                    })
                    return a
                },{})
            })

        }

        return data
    }

    processFemaData(){
        const graph = this.props.geoid ? get(this.props.falcorCache,`${config[this.props.data_type].fetch_url}`,null) :
            get(this.props.falcorCache,`${config[this.props.data_type].fetch_url}.[""]`,null)
        const graphById = get(this.props.falcorCache,`${config[this.props.data_type].fetch_url}.byId`,null)
        let graph_data = []
        let femaData = []
        let attributes = ["name", "value", ...config[this.props.data_type].table_column]
        if(graphById && graph) {
            graph_data = config['Hazards'].reduce((a, c) => {
                a.push({
                    'hazard': c.value,
                    'count' : 0
                })
                return a
            }, [])
            graph_data.map(d =>{
                let sum = 0
                return Object.keys(graphById).filter(d => d !== '$__path').forEach(item =>{
                    if(this.props.year === 'allTime') {
                        if(get(graphById[item],['disaster_type','value'],'').toString() === d.hazard) {
                            sum += +get(graphById[item],['total_cost','value'],0)
                            return d['total_cost_summaries'] = sum
                        }
                    }else{
                        if(get(graphById[item],['disaster_type','value'],'').toString() === d.hazard && get(graphById[item],['year','value'],'').toString() === this.props.year.toString()){
                            sum += +get(graphById[item],['total_cost','value'],0)
                            return d['total_cost_summaries'] = sum
                        }
                    }

                })
            })
            if(this.props.geoid){
                config['Hazards'].forEach(hazard =>{
                    let total_cost = 0
                    let total_cost_summaries = 0
                    let ia_total = 0
                    let pa_total = 0
                    let hmgp_total = 0
                    Object.keys(graph).filter(d => d!== '$__path').forEach(item =>{
                        //total_cost += get(graph[item],[hazard.value,this.props.year,'total_cost','value'],0)
                        ia_total += get(graph[item],[hazard.value,this.props.year,'ia_ihp_amount','value'],0)
                        pa_total += get(graph[item],[hazard.value,this.props.year,'pa_project_amount','value'],0)
                        hmgp_total += (get(graph[item],[hazard.value,this.props.year,'hma_prop_actual_amount_paid','value'],0) + get(graph[item],[hazard.value,this.props.year,'hma_proj_project_amount','value'],0))
                        total_cost_summaries += get(graph[item],[hazard.value,this.props.year,'total_cost_summaries','value'],0)
                    })
                    femaData.push({
                        'name': hazard.name,
                        'value': hazard.value,
                        //'total_cost': total_cost,
                        'ia_ihp_amount': ia_total,
                        'pa_project_amount': pa_total,
                        'hma_total_amount': hmgp_total,
                        'total_cost_summaries': total_cost_summaries
                    })
                })
            }else{
                femaData =Object.keys(graph).filter(d => d!=="$__path").map(hazard => {
                    return attributes.reduce((a, header) => {
                        config['Hazards'].forEach(item => {
                            if (item.value === hazard) {
                                if (header === 'name' || header === 'value') {
                                    a[header] = item[header]
                                }
                                else if(header === 'hma_total_amount'){

                                    a[header] = get(graph[hazard], [this.props.year,'hma_prop_actual_amount_paid','value'], 0) + get(graph[hazard], [this.props.year,'hma_proj_project_amount','value'], 0)
                                }
                                else {
                                    a[header] = get(graph[hazard], [this.props.year, header,'value'], 0)
                                }
                            }
                        })
                        return a
                    }, {})
                })

            }

            graph_data.forEach(dd =>{
                femaData.map(d =>{
                    if(d.value === dd.hazard){
                        d['total_cost_summaries'] = dd.total_cost_summaries || 0

                    }
                    return d
                })
            })
        }
        return femaData

    }

    render(){
        const data = this.props.data_type !== 'fema' ?
            this.processData() : this.processFemaData()

        return(
                <div className="align-left inline min-w-full overflow-hidden"
                    key={0}>
                    <Table
                        defaultPageSize={20}
                        showPagination={false}
                        columns={this.props.data_type === 'stormevents' ? this.state.severeWeather : this.props.data_type === 'sba' ? this.state.sba : this.state.fema}
                        data={data}
                        initialPageSize={20}
                        minRows={data.length}
                        sortBy={config[this.props.data_type].measure}
                        sortOrder={'desc'}
                    />
                    {/*<table className="min-w-full">*/}
                    {/*    <thead>*/}
                    {/*    <tr>*/}
                    {/*        <th className="px-2 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase ">*/}
                    {/*            Hazard*/}
                    {/*        </th>*/}
                    {/*        {config[this.props.data_type].table_header.map((header,i) =>{*/}
                    {/*            if(header === 'Damage' || header === 'Total Loss' || header === 'Actual Amount Paid' || header === 'IHA' || header === 'PA' || header === 'HMGP'){*/}
                    {/*                return (*/}
                    {/*                    <th className="px-2 text-right py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase "*/}
                    {/*                        key={i}*/}
                    {/*                    >*/}
                    {/*                        {header}-{this.props.year}*/}
                    {/*                    </th>*/}
                    {/*                )}else{*/}
                    {/*                    return(*/}
                    {/*                        <th className="px-2 text-right py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase "*/}
                    {/*                            key={i}*/}
                    {/*                        >*/}
                    {/*                            {header}*/}
                    {/*                        </th>*/}
                    {/*                    )*/}
                    {/*                }*/}
                    {/*            })}*/}

                    {/*    </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {/*    {   data.length ?*/}
                    {/*        data*/}
                    {/*        .filter(d => Object.keys(d).length !== 0)*/}
                    {/*        .sort((a,b) => b[config[this.props.data_type].sort] - a[config[this.props.data_type].sort])*/}
                    {/*        .map((hazard,i) =>{*/}
                    {/*            return(*/}
                    {/*                <tr className={`bg-white  ${this.props.activeHazard === hazard.value ? 'border-b-2 border-blue-500' : 'border-b border-gray-200' }` }*/}
                    {/*                    key={i} id={hazard.value}>*/}
                    {/*                    <td className="px-4 py-2 whitespace-nowrap text-md leading-5 font-base text-gray-900" key={i}>*/}
                    {/*                        <div*/}
                    {/*                            className="hover:text-blue-600 cursor-pointer"*/}
                    {/*                            onClick={(e) =>{*/}
                    {/*                                e.persist()*/}
                    {/*                                if(this.state.currentHazard !== hazard.value){*/}
                    {/*                                    this.props.setHazard(hazard.value)*/}
                    {/*                                    this.setState({*/}
                    {/*                                        currentHazard : hazard.value*/}
                    {/*                                    })*/}
                    {/*                                }else{*/}
                    {/*                                    this.props.setHazard(null)*/}
                    {/*                                }*/}

                    {/*                            }}*/}
                    {/*                            >*/}
                    {/*                            <div style={{backgroundColor:hazardcolors[hazard.value]}} className='w-3 h-3 mr-2 inline-block' />{hazard.name}*/}
                    {/*                        </div>*/}
                    {/*                    </td>*/}
                    {/*                    {config[this.props.data_type].table_column.map((column,i) =>{*/}
                    {/*                        return (*/}
                    {/*                            <td className="px-1 py-2 whitespace-no-wrap text-sm leading-5 font-base text-gray-900 text-right" key={i}>*/}
                    {/*                                {!column.includes("num") ? fnum(hazard[column]) : fmt(hazard[column])}*/}
                    {/*                            </td>*/}
                    {/*                        )*/}
                    {/*                    })}*/}

                    {/*                </tr>*/}
                    {/*            )*/}
                    {/*        })*/}
                    {/*    :*/}
                    {/*        null*/}
                    {/*        }*/}
                    {/*    </tbody>*/}
                    {/*</table>*/}

                </div>
        )
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        falcorCache : state.falcorCache,
        geoid:ownProps.geoid,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardListTable))
