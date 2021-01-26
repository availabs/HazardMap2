import React from "react"
import MapLayer from "components/AvlMap/MapLayer"
import get from "lodash.get"
import * as d3 from "d3";
var _ = require('lodash')




class MapsLayer extends MapLayer {


    onAdd(map) {
        this.map = map
        this.onLoadBounds = map.getBounds()
        this.fetchData().then(d => this.render(map,d))
    }

    fetchData() {
        return Promise.resolve({})
    }



    render(map,data) {

        // else{
        //     this.loading = true
        // }
    }
}

export default (props = {}) =>
    new MapsLayer("Maps Layer", {
        active:true,
        ...props,
        sources: [{
            id: "counties",
            source: {
                "url": "mapbox://am3081.1ggw4eku",
                "type": "vector"
            }
        }],
        layers: [{
    "id": "counties",
        "type": "fill",
        "source": "counties",
        "source-layer": "counties",
        "filter": ["match", ["get", "type"], ["county_fips"], true, false],
        "layout": {},
    "paint": {
        "fill-color": "hsl(0, 3%, 94%)",
            'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.1,
            1
        ],
        /*"fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0,
            1
        ],
        ,*/
    }
}],

    })
