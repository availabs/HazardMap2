import React ,{useEffect} from 'react'
import {Table, useFalcor} from '@availabs/avl-components'

function FemaSevereWeather(){
    console.log(useFalcor)
    // const [falcor, falcorCache] = useFalcor;
    //
    // useEffect(() => {
    //     async function fetchData() {
    //         const response = await falcor.get(['fema','severe','weather','mapping','counts'])
    //         console.log(response)
    //
    //     }
    //
    //     return fetchData();
    // }, []);

    return (
        <div>Hello from a component!</div>
    )
}

export default FemaSevereWeather
