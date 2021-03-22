import React ,{useEffect} from 'react'
import {Table} from '@availabs/avl-components'
import {connect} from "react-redux";
import {reduxFalcor} from "../../../utils/redux-falcor-new";
import get from "lodash.get";

const FemaSevereWeatherMapping =  React.forwardRef((props,ref) =>{
        useEffect(() => {
            async function fetchData() {
                return await props.falcor.get(['femaSevereWeather', 'mapping', 'counts'])
            }

            return fetchData();
        }, []);

        const [columns,data] = femaSevereWeatherTable(props)
        return (
            <div>
                <Table
                    defaultPageSize={20}
                    showPagination={true}
                    columns={columns}
                    data={data}
                    initialPageSize={20}
                    minRows={10}
                    sortBy={'num_events_in_swd'}
                    sortOrder={'desc'}
                />
            </div>

        )
})


const femaSevereWeatherTable = (props) => {

    const columns = [
            {
                Header: (<div>Disaster Number</div>),
                accessor: 'disaster_number',
                disableFilters: true,
            },
            {
                Header: (<div>Declaration Title</div>),
                accessor: 'fema_declaration_title',
                disableFilters: true,

            },
            {
                Header: (<div># Severe weather Mappings</div>),
                accessor: 'num_events_in_swd',
                disableFilters: true,
            }
        ]

    let data = []
    const graph = get(props.falcorCache,['femaSevereWeather', 'mapping', 'counts','value'],null)
    if(graph){
        data = graph.reduce((a,c) =>{
            a.push({
                'disaster_number' : c['fema_disaster_number'] || '',
                'fema_declaration_title': c['fema_declaration_title'] || '',
                'num_events_in_swd': c['num_events_in_swd'] || 0

            })
            return a
        },[])
    }
    return [columns,data]
}

const mapStateToProps = (state, ownProps) => {
    return {
        falcorCache: state.falcorCache,
    };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FemaSevereWeatherMapping))
