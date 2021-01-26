import React  from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from "utils/redux-falcor-new";
import {withRouter} from "react-router";
import AvlMap from "../../components/AvlMap";
import TestLayer from './test'
class NationalLanding extends React.Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!


        this.TestLayer = TestLayer({active:true})
    }




    render() {

        return (
            <div className='flex flex-col lg:flex-row h-screen box-border w-full -mt-4 fixed overflow-auto'>
                <div className='flex-auto h-full order-last lg:order-none'>
                    <div className='h-full'>
                        <AvlMap
                            layers={[
                                this.TestLayer
                            ]}
                            height={'90%'}
                            center={[0, 0]}
                            zoom={4}
                            year={2018}
                            fips={''}
                            styles={[
                                {name: 'Blank', style: 'mapbox://styles/am3081/ckaml4r1e1uip1ipgtx5vm9zk'}
                            ]}
                            sidebar={false}
                            attributes={false}

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
    };
};
const mapDispatchToProps = {

};
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NationalLanding))

export default [
    {
        path: '/test',
        mainNav: true,
        exact: false,
        name: 'Maps',
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

