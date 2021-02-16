export const MapSources = [
            {
                id: "us_states",
                source: {
                    "url": "mapbox://am3081.1fysv9an",
                    "type": "vector"
                }
            },
            {
                id: "counties",
                source:{
                    "url":"mapbox://am3081.a8ndgl5n",
                    "type": "vector"
                }
            },
            {
                id:'cousubs',
                source:{
                    "url":"mapbox://am3081.8p6poh29",
                    "type":"vector"
                }
            },
            {
                id:'zipcodes',
                source:{
                    "url":"mapbox://am3081.5g46sdxi",
                    "type":"vector"
                }
            },
            {
                id:'tracts',
                source:{
                    "url":"mapbox://am3081.2x2v9z60",
                    "type":"vector"
                }
            }]

export const MapStyles = [{
                "id": "counties",
                "type": "fill",
                "source": "counties",
                "source-layer": "counties",
                "filter": ["match", ["get", "type"], ["geoid"], true, false],
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
            },
            {
                "id": "county-boundaries",
                "type": "line",
                "source": "counties",
                "source-layer": "counties",
                "layout": {},
                "paint": {
                    "line-color": 'rgba(0,0,0,0)',
                    'line-opacity':0.7,
                    'line-width':3
                    }
            },
            {
                "id": "cousubs",
                "type": "fill",
                "source": "cousubs",
                "source-layer": "cousubs",
                "filter": ["match", ["get", "type"],["geoid"],true, false],
                "layout": {},
                "paint": {
                    "fill-color": "hsl(0, 3%, 94%)",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        0,
                        1
                    ],
                    "fill-outline-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        "hsl(0, 4%, 85%)",
                        "hsl(0, 4%, 85%)"
                    ],
                }
            },
            {
                "id": "tracts",
                "type": "fill",
                "source": "tracts",
                "source-layer": "tracts",
                "filter": ["match", ["get", "type"],["geoid"],true, false],
                "layout": {},
                "paint": {
                    "fill-color": "hsl(0, 3%, 94%)",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        0,
                        1
                    ],
                    "fill-outline-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        "hsl(0, 4%, 85%)",
                        "hsl(0, 4%, 85%)"
                    ],
                }
            },
            {
                "id": "zipcodes",
                "type": "fill",
                "source": "zipcodes",
                "source-layer": "zipcodes",
                "filter": ["match", ["get", "type"],["ZCTA5CE10"],true, false],
                "layout": {},
                "paint": {
                    "fill-color": "hsl(0, 3%, 94%)",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        0,
                        1
                    ],
                    "fill-outline-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        "hsl(0, 4%, 85%)",
                        "hsl(0, 4%, 85%)"
                    ],
                }
            },
            {
                "id": "states",
                "type": "fill",
                "source": "us_states",
                "source-layer": "us_states",
                "filter": ["match", ["get", "type"], ["GEOID"], true, false],
                "layout": {},
                "paint": {
                    "fill-color": "rgba(0,0,0,0)",
                }
            },
            {
                "id": "state-boundaries",
                "type": "line",
                "source": "us_states",
                "source-layer": "us_states",
                "filter": ["match", ["get", "type"], ["GEOID"], true, false],
                "layout": {},
                "paint": {"line-color": "hsl(0, 0%, 72%)", "line-width": 0.5}
            },
            {
                "id": "county-points",
                "type": "symbol",
                "source": "us_states",
                "source-layer": "us_states",
                "filter": ["match", ["get", "type"], ["GEOID"], true, false],
                "layout": {
                    "text-field": ["to-string", ["get", "county_fips"]],
                    "text-font": ["Overpass Mono Bold", "Arial Unicode MS Regular"],
                    "visibility": "none"
                },
                "paint": {
                    "text-color": "hsl(0, 0%, 100%)",
                    "text-halo-color": "hsl(0, 0%, 6%)",
                    "text-halo-width": 1,
                    "text-opacity": ["step", ["zoom"], 0, 6, 1]
                }
            },
            {
                "id": "state-points",
                "type": "symbol",
                "source": "us_states",
                "source-layer": "us_states",
                "filter": ["match", ["get", "type"], ["state"], true, false],
                "layout": {
                    "text-field": ["to-string", ["get", "state_abbrev"]],
                    "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                },
                "paint": {
                    "text-color": "hsl(0, 0%, 25%)",
                    "text-opacity": ["step", ["zoom"], 1, 6, 0],
                    "text-halo-color": "hsl(0, 0%, 100%)",
                    "text-halo-width": 1
                }
            }]
