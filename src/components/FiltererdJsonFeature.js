import React, { useEffect } from 'react';
import { GeoJSON, Pane, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { mapCenter, setDragging, setInitialMapZoom } from '../helpers/mapFunction';
import Buildings_Footprint from "../assets/data/Buildings_Footprint.json"

const FiltererdJsonFeature = ({selectedFeatureName}) => {

    const map = useMap();
    const intialZoom = setInitialMapZoom()



    let filteredData = Buildings_Footprint.features.find(
        (feature) => feature.properties.primaryID === selectedFeatureName
    );




    return (
        // <Pane name="selected_features" style={{ zIndex: 1000 }}>
        <Pane name="selected_features">
            <GeoJSON
                key={`${selectedFeatureName}`}
                style={{ fillColor: 'none', weight: 4, color: 'yellow', fillOpacity: "0.4" }}
                data={filteredData}
            />
        </Pane>
    );
};

export default FiltererdJsonFeature;
