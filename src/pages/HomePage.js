import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON, TileLayer, LayersControl, FeatureGroup, Circle, } from 'react-leaflet'
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import BaseMap from '../components/BaseMap';
import { BaseMapsLayers, mapCenter, maxBounds, setDragging, setInitialMapZoom } from '../helpers/mapFunction';
import Buildings_Footprint from "../assets/data/Buildings_Footprint.json"
import BuildingData from "../assets/data/BuildingData.json"
// import FiltererdJsonFeature from '../components/FiltererdJsonFeature.js';
// import SelectedFeatureHeading from '../components/SelectedFeatureHeading.js';
import { useLoaderContext } from '../contexts/LoaderContext.js';
import BarChart from '../components/charts/BarChart.js';
import LineChart from '../components/charts/LineChart.js';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.js';
import FiltererdJsonFeature from '../components/FiltererdJsonFeature.js';
import { fillDensityColor } from '../helpers/functions.js';
import DynamicLegend from '../components/legend/DynamicLegend.js';
import water_pressure_pipe from "../assets/data/water_pressure_pipe.json"
import water_pressure_structure from "../assets/data/water_pressure_structure.json"
import water_gravity_pipe from "../assets/data/water_gravity_pipe.json"
import BuildingTypeLegend from '../components/legend/BuildingTypeLegend.js';




const SingleSelectionsLayers = [
    {
        name: "Utility Charges variation",
        value: "utility_charges",
    },
    {
        name: "Buildings",
        value: "buildings",
    },



]

const MultipleSelectionLayers = [
    {
        name: "Water Gravity Pipe",
        value: "water_gravity_pipe",
    },
    {
        name: "Water Pressure Pipe",
        value: "water_pressure_pipe",
    },
    {
        name: "Water Pressure Structure",
        value: "water_pressure_structure",
    },

]



const HomePage = () => {
    const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);
    const [selectedBuilding, setSelectedBuilding] = useState("5201");
    const [selectedData, setSelectedData] = useState(null);
    const [selectedYear, setSelectedYear] = useState('2023');

    const [selectedSingleLayer, setSelectedSingleLayer] = useState(SingleSelectionsLayers[0].value);
    const [selectedMultiLayer, setSelectedMultiLayer] = useState([SingleSelectionsLayers[0].value]);

    const { setIsLoading } = useLoaderContext();


    const handleMultiLayerSelection = (e) => {
        const value = e.target.value;


        // Allow multiple selections for multi-selection layers
        if (selectedMultiLayer.includes(value)) {
            setSelectedMultiLayer(selectedMultiLayer.filter((item) => item !== value));
        } else {
            setSelectedMultiLayer([...selectedMultiLayer, value]);
        }

    };

    const handleSingleLayerSelection = (e) => {
        const value = e.target.value;

        // Set only the selected value, replacing any previous selection
        setSelectedSingleLayer(value);
    };




    const handleBasemapSelection = (e) => {
        const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
        setSelectedBasemapLayer(selectedItem);
    };

    // const filterFeatureData = () => {
    //     if (selectedFeatureName) {
    //         const filteredData = BuildingData.find((data) => data.PrimaryID === parseInt(selectedFeatureName));
    //         if (filteredData) {
    //             setSelectedData(filteredData);
    //         } else {
    //             console.warn('No data found for the selected asset code:', selectedFeatureName);
    //         }
    //     }
    // }


    useEffect(() => {
        const filterFeatureData = () => {
            if (selectedBuilding) {
                const filteredData = BuildingData.filter((data) => data.PrimaryID === parseInt(selectedBuilding));
                if (filteredData) {
                    setSelectedData(filteredData);
                } else {
                    console.warn('No data found for the selected asset code:', selectedBuilding);
                }
            }
        };
        filterFeatureData();
    }, [selectedBuilding]);


    const ColorLegendsDataItem = {
        Title: "Annual variation of utility charges",
        Unit: "",
        Value: [80000, 60000, 40000, 20000, 10000, 5000, 0],
        Colors: ["#ca001b", "#ff7c3d", "#ffc469", "#fffbb1", "#c8ecf4", "#5ba8d2", "#345ead"],

    }

    const BuiuldingNameColorItem = {
        Title: "Annual variation of utility charges",
        Unit: "",
        Labels: ["Chiller Sustainability Dist", "Chiller Opportunity Dist", "Chiller Mobility Dist", "Signatures", "F&B", "Common Area"],
        Colors: ["#1f78b4", "#33a02c", "#e31a1c", "#ff7f00", "#6a3d9a", "#b15928",],

    }





    function DistrictOnEachfeature(feature, layer) {
        // Determine the property name to use based on selectedView

        // Click event handler
        layer.on('click', function (e) {
            setSelectedBuilding(feature.properties["primaryID"]);
            if (feature.properties && feature.properties["primaryID"]) {
                const popupContent = `
                    <div>
                        Primary ID: ${feature.properties["primaryID"]}<br/>
                        District: ${feature.properties["district"]}<br/>
                        Building Name: ${feature.properties["blgNameEn"]}<br/>
                    </div>
                `;
                layer.bindTooltip(popupContent, { sticky: true });
            }
            layer.openTooltip();

        });
    }

    const BuildingStyle = (feature) => {
        // Define a color mapping for each `blgNameEn`
        const colorMapping = {
            "Chiller Sustainability Dist": "#1f78b4",
            "Chiller Opportunity Dist": "#33a02c",
            "Chiller Mobility Dist": "#e31a1c",
            "Signatures": "#ff7f00",
            "F&B": "#6a3d9a",
            "Common Area": "#b15928"
        };

        // Get the color based on `blgNameEn`
        const color = colorMapping[feature.properties['blgNameEn']] || "#cccccc"; // Default color if not matched

        return {
            fillColor: color,
            weight: 2,
            color: "black", // Border color
            opacity: 1,
            fillOpacity: 1,
        };
    };





    const DistrictStyle = (feature) => {

        const getDensityFromData = (id) => {
            const DataItem = BuildingData && BuildingData.find((item) => item.PrimaryID === parseInt(id));
            return DataItem && DataItem[`TOTAL_${selectedYear}`];
        };

        const density = getDensityFromData(feature.properties.primaryID);


        return {
            fillColor: fillDensityColor(ColorLegendsDataItem, density),
            // fillColor: selectedTime !== '' ? Annual_Density(density) : "none",
            weight: 1,
            opacity: 1,
            color: "black",
            // dashArray: "2",
            fillOpacity: 1,
        };

    };







    return (
        <div className='dasboard_page_container'>
            <div className='main_dashboard'>


                <div className='right_panel_equal' >
                    <div className='card_container' style={{ height: "100%" }}>

                        <MapContainer
                            fullscreenControl={true}
                            center={mapCenter}
                            style={{ width: '100%', height: "100%", backgroundColor: 'white', border: 'none', margin: 'auto' }}
                            zoom={setInitialMapZoom()}
                            // maxBounds={maxBounds}
                            zoomSnap={0.5}
                            maxZoom={20}
                            minZoom={setInitialMapZoom() - 1}
                            keyboard={false}
                            dragging={setDragging()}
                            // attributionControl={false}
                            // scrollWheelZoom={false}

                            doubleClickZoom={false}
                        >

                            <div className='map_layer_manager'>
                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                            <button className="accordion-button map_layer_collapse " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                Base Map
                                            </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                            <div className="accordion-body map_layer_collapse_body">
                                                {BaseMapsLayers.map((option, index) => (
                                                    <div key={index} className="form-check">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            id={option.name}
                                                            name="data_type"
                                                            value={option.name}
                                                            checked={selectedBasemapLayer?.name === option.name}
                                                            onChange={handleBasemapSelection}
                                                        />
                                                        <label htmlFor={option.name}>{option.name}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                            <button className="accordion-button map_layer_collapse" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                                                Layers
                                            </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingTwo">
                                            <div className="accordion-body map_layer_collapse_body">

                                                {SingleSelectionsLayers.map((item, index) => (
                                                    <div key={index} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id={item.value}
                                                            value={item.value}
                                                            checked={selectedSingleLayer.includes(item.value)}
                                                            onChange={handleSingleLayerSelection}
                                                        />
                                                        <label htmlFor={item.value}>{item.name}</label>
                                                    </div>
                                                ))}
                                                <hr />

                                                {MultipleSelectionLayers.map((item, index) => (
                                                    <div key={index} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={item.value}
                                                            value={item.value}
                                                            checked={selectedMultiLayer.includes(item.value)}
                                                            onChange={(e) => handleMultiLayerSelection(e)} // Pass false for multi-selection
                                                        />
                                                        <label htmlFor={item.value}>{item.name}</label>
                                                    </div>
                                                ))}



                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>






                            {selectedBasemapLayer && selectedBasemapLayer.url && (
                                <TileLayer
                                    key={selectedBasemapLayer.url}
                                    attribution={selectedBasemapLayer.attribution}
                                    url={selectedBasemapLayer.url}
                                    subdomains={selectedBasemapLayer.subdomains}
                                />
                            )}


                            {selectedSingleLayer === "utility_charges" && ColorLegendsDataItem && (
                                <>
                                    <DynamicLegend ColorLegendsDataItem={ColorLegendsDataItem} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

                                    <GeoJSON
                                        key={selectedYear}
                                        // style={{ fillColor: '#265073', weight: 2, color: 'blue', fillOpacity: "0.5" }}
                                        style={DistrictStyle}
                                        data={Buildings_Footprint.features}
                                        onEachFeature={DistrictOnEachfeature}
                                    />
                                    <FiltererdJsonFeature selectedFeatureName={selectedBuilding} />

                                </>
                            )}

                            {selectedSingleLayer === "buildings" && (
                                <>
                                    <BuildingTypeLegend ColorLegendsDataItem={BuiuldingNameColorItem} />
                                    <GeoJSON
                                        key={selectedYear}
                                        // style={{ fillColor: '#265073', weight: 2, color: 'blue', fillOpacity: "0.5" }}
                                        style={BuildingStyle}
                                        data={Buildings_Footprint.features}
                                        onEachFeature={DistrictOnEachfeature}
                                    />
                                    <FiltererdJsonFeature selectedFeatureName={selectedBuilding} />

                                </>
                            )}

                           

                            

                            {selectedMultiLayer.includes("water_gravity_pipe") && (
                                <>

                                    <GeoJSON
                                        data={water_gravity_pipe.features}
                                        style={{
                                            fillColor: 'none',
                                            weight: 2,
                                            color: 'blue',
                                            interactive: true, // Ensure interaction is enabled for events
                                        }}
                                    // onEachFeature={(feature, layer) => {
                                    //   // Click event handler
                                    //   layer.on('hover', function (e) {
                                    //     if (feature.properties && feature.properties["Layer"]) {
                                    //       const popupContent = `
                                    //         <div>
                                    //           Layer: ${feature.properties["Layer"]}<br/>
                                    //         </div>
                                    //       `;
                                    //       layer.bindTooltip(popupContent, { sticky: true });
                                    //     }
                                    //     layer.openTooltip();
                                    //   });
                                    // }}
                                    />
                                </>
                            )}

                            {selectedMultiLayer.includes("water_pressure_pipe") && (
                                <>
                                    <GeoJSON data={water_pressure_pipe.features} style={{
                                        fillColor: 'none',
                                        weight: 2,
                                        color: 'purple',
                                        interactive: false
                                    }} />

                                </>
                            )}

                            {selectedMultiLayer.includes("water_pressure_structure") && (
                                <>
                                    {water_pressure_structure && water_pressure_structure.features.map((item, index) => (
                                        <Circle
                                            key={index}
                                            center={[
                                                item.geometry.coordinates[1],
                                                item.geometry.coordinates[0],
                                            ]}
                                            radius={2}
                                            color="black"
                                            fillColor="blue"
                                            fillOpacity={0.6}
                                        />
                                    ))}

                                </>
                            )}




                            <BaseMap />
                        </MapContainer>
                    </div>
                </div>

                <div className='left_panel_equal'>


                    {/* <select className="form-select" aria-label="Default select example">
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select> */}


                    {selectedData && (selectedSingleLayer === "buildings" || selectedSingleLayer === "utility_charges") && selectedData.length > 0 && (

                        < >
                            {selectedData.map((data, index) => (
                                <div className='card_container' key={index}>
                                    <div className='card_heading_container'>
                                        <div className='card_heading'>
                                            <h5>PrimaryID: {data.PrimaryID} | Zone: {data.Zone ? data.Zone: "NA"} | Building Name: {data.blgNameEn ? data.blgNameEn : "NA" }  </h5>
                                        </div>
                                    </div>



                                    <div className='plots_heading_container'>
                                        <div className='plots_heading'>
                                            <h5>Annual Rates</h5>
                                        </div>
                                    </div>
                                    <BarChart selectedData={data} />

                                    <div className='plots_heading_container'>
                                        <div className='plots_heading'>
                                            <h5>Monthly Rates</h5>
                                        </div>
                                    </div>
                                    <LineChart selectedData={data} />

                                    <div className='plots_heading_container'>
                                        <div className='plots_heading'>
                                            <h5>Compare rates over years</h5>
                                        </div>
                                    </div>
                                    <MonthlyBarChart
                                        selectedData={data} />
                                </div>
                            ))}

                        </>
                    )}






                </div>

            </div>
        </div>
    )
}

export default HomePage