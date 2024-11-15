import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON, TileLayer, LayersControl, FeatureGroup, Circle, } from 'react-leaflet'
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import BaseMap from '../components/BaseMap.js';
import { BaseMapsLayers, mapCenter, maxBounds, setDragging, setInitialMapZoom } from '../helpers/mapFunction.js';


// import FiltererdJsonFeature from '../components/FiltererdJsonFeature.js';
// import SelectedFeatureHeading from '../components/SelectedFeatureHeading.js';
import { useLoaderContext } from '../contexts/LoaderContext.js';
import BarChart from '../components/charts/BarChart.js';
import LineChart from '../components/charts/LineChart.js';
import MonthlyBarChart from '../components/charts/MonthlyBarChart.js';
import FiltererdJsonFeature from '../components/FiltererdJsonFeature.js';
import { calculateAverageOfArray, fillDensityColor } from '../helpers/functions.js';
import DynamicLegend from '../components/legend/DynamicLegend.js';
import water_pressure_pipe from "../assets/data/water_pressure_pipe.json"
import water_pressure_structure from "../assets/data/water_pressure_structure.json"
import water_gravity_pipe from "../assets/data/water_gravity_pipe.json"
import DEWA_energy_consumption from "../assets/data/DEWA_energy_consumption.json"
import DEWA_recovery from "../assets/data/DEWA_recovery.json"
import BuildingTypeLegend from '../components/legend/BuildingTypeLegend.js';
import ReactApexChart from 'react-apexcharts';




const SingleSelectionsLayers = [
    {
        name: "DEWA Energy Consumption",
        value: "energy_consumption",
        data: DEWA_energy_consumption
    },
    {
        name: "DEWA Recovery Accounts",
        value: "recovery_accounts",
        data: DEWA_recovery
    }

,



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



const xData = [
    "Oct-21", "Nov-21", "Dec-21",
    "Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22", "Jul-22", "Aug-22", "Sep-22", "Oct-22", "Nov-22", "Dec-22",
    "Jan-23", "Feb-23", "Mar-23", "Apr-23", "May-23", "Jun-23", "Jul-23", "Aug-23", "Sep-23", "Oct-23", "Nov-23", "Dec-23",
    "Jan-24", "Feb-24", "Mar-24", "Apr-24", "May-24", "Jun-24", "Jul-24", "Aug-24"
];




const DEWAConsumption = () => {
    const [selectedBasemapLayer, setSelectedBasemapLayer] = useState(BaseMapsLayers[0]);
    const [selectedPoint, setSelectedPoint] = useState("3004574826");
    const [selectedPointData, setSelectedPointData] = useState(null);
    const [selectedData, setSelectedData] = useState(SingleSelectionsLayers[0].data);
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
        setSelectedSingleLayer(value);
        const selectedItem = SingleSelectionsLayers.find((item) => item.value === value)
        setSelectedData(selectedItem.data)
    };




    const handleBasemapSelection = (e) => {
        const selectedItem = BaseMapsLayers.find((item) => item.name === e.target.value);
        setSelectedBasemapLayer(selectedItem);
    };







    useEffect(() => {
        const filterFeatureData = () => {
            if (selectedPoint && selectedData) {
                const filteredData = selectedData.find((data) => data.ACCOUNT === selectedPoint);

                if (filteredData) {
                    setSelectedPointData(filteredData);
                } else {
                    setSelectedPointData(null);
                }
            }
        };
        filterFeatureData();
    }, [selectedPoint, selectedData]);





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





    function PointOnEachfeature(point, layer) {
        setSelectedPoint(point["ACCOUNT"]);
        if (point && point["ACCOUNT"]) {
            const popupContent = `
                    <div>
                        ACCOUNT: ${point["ACCOUNT"]}<br/>
                        PREMISE NO.: ${point["PREMISE_NO"]}<br/>
                        CATEGORY: ${point["CATEGORY"]}<br/>
                    </div>
                `;
            layer.bindTooltip(popupContent, { sticky: true });
        }
        layer.openTooltip();

    }

    const PointStyle = (feature) => {
        // Define a color mapping for each `blgNameEn`
        const colorMapping = {
            "Only water readings": "#1f78b4",
            "Only electricity readings": "#33a02c",
            "Both water & electricity readings ": "#eb9534",
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
                            // maxZoom={20}
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




                            {selectedSingleLayer === "energy_consumption" && (
                                <MarkerClusterGroup>
                                    {DEWA_energy_consumption && DEWA_energy_consumption.map((item, index) => {
                                        if (item.X !== null && item.Y !== null) {
                                            let fillColor;

                                            if (item.WATER && item.WATER !== "NA" && item.ELECTRICITY !== "NA") {
                                                fillColor = "#eb9534"; // Both water & electricity readings
                                            } else if (item.WATER && item.WATER !== "NA" && item.ELECTRICITY === "NA") {
                                                fillColor = "#1f78b4"; // Only water readings

                                            } else if (item.WATER && item.WATER === "NA" && item.ELECTRICITY !== "NA") {
                                                fillColor = "#33a02c"; // Only electricity readings
                                            } else {
                                                fillColor = "#cccccc"; // Default color if neither
                                            }



                                            return (
                                                <Circle
                                                    key={index}
                                                    center={[item.X, item.Y]}
                                                    radius={7}
                                                    color="none"
                                                    fillColor={fillColor}
                                                    fillOpacity={0.6}
                                                    eventHandlers={{
                                                        click: (e) => PointOnEachfeature(item, e.target) // Apply event handler
                                                    }}
                                                />
                                            );
                                        }
                                        return null; // Return null if X or Y is null
                                    })}
                                </MarkerClusterGroup>
                            )}





                            {selectedSingleLayer === "recovery_accounts" && (
                                <MarkerClusterGroup>
                                    {DEWA_recovery && DEWA_recovery.map((item, index) => {
                                        if (item.X !== null && item.Y !== null) {
                                            let fillColor;
                                            if (item.WATER !== "NA" && item.ELECTRICITY !== "NA") {
                                                fillColor = "#eb9534"; // Both water & electricity readings
                                            } else if (item.WATER !== "NA" && item.ELECTRICITY === "NA") {
                                                fillColor = "#1f78b4"; // Only water readings
                                            } else if (item.WATER === "NA" && item.ELECTRICITY !== "NA") {
                                                fillColor = "#33a02c"; // Only electricity readings
                                            } else {
                                                fillColor = "#cccccc"; // Default color if neither
                                            }
                                            // console.log(item)

                                            return (
                                                <Circle
                                                    key={index}
                                                    center={[item.X, item.Y]}
                                                    radius={7}
                                                    color="none"
                                                    fillColor={fillColor}
                                                    fillOpacity={0.6}
                                                    eventHandlers={{
                                                        click: (e) => PointOnEachfeature(item, e.target) // Apply event handler
                                                    }}
                                                />
                                            );
                                        }
                                        return null; // Return null if X or Y is null
                                    })}
                                </MarkerClusterGroup>
                            )}


                            {(selectedSingleLayer === "recovery_accounts" || selectedSingleLayer === "energy_consumption") && (
                                <div className="legend_container">
                                    Water and Electricity Consumption

                                    <div className="legend-color-container">
                                        <div className="legend_item">
                                            <span className="legend_item_square" style={{ backgroundColor: '#1f78b4' }} />
                                            <span className="legend-label">
                                                Only water readings
                                            </span>
                                        </div>
                                        <div className="legend_item">
                                            <span className="legend_item_square" style={{ backgroundColor: '#33a02c' }} />
                                            <span className="legend-label">
                                                Only electricity readings
                                            </span>
                                        </div>
                                        <div className="legend_item">
                                            <span className="legend_item_square" style={{ backgroundColor: '#eb9534' }} />
                                            <span className="legend-label">
                                                Both water & electricity readings
                                            </span>
                                        </div>
                                        <div className="legend_item">
                                            <span className="legend_item_square" style={{ backgroundColor: 'red' }} />
                                            <span className="legend-label">
                                                Selected Location
                                            </span>
                                        </div>

                                    </div>
                                </div>
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
                                    />
                                </>
                            )}

                            {selectedPointData && selectedPointData.X !== null && selectedPointData.Y !== null &&
                                <Circle
                                    center={[selectedPointData.X, selectedPointData.Y]}
                                    radius={7}
                                    color="none"

                                    fillColor="red"
                                    fillOpacity={1}
                                />
                            }

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

                    {!selectedPointData &&
                        <div className='card_container' >
                            <p>Please select a location.</p>
                        </div>}


                    {selectedPointData && (selectedSingleLayer === "recovery_accounts" || selectedSingleLayer === "energy_consumption") && (

                        < >
                            <div className='card_container' >
                                <div className='card_heading_container'>
                                    <div className='card_heading'>
                                        <h5>ACCOUNT: {selectedPointData.ACCOUNT} | Zone: {selectedPointData.Zone ? selectedPointData.Zone : "NA"} |
                                            METER NO: {selectedPointData.METER_NO ? selectedPointData.METER_NO : "NA"} | PREMISE NO: {selectedPointData.PREMISE_NO ? selectedPointData.PREMISE_NO : "NA"} </h5>
                                    </div>
                                </div>


                                {selectedPointData['ELECTRICITY'] !== "NA" && (
                                    <>
                                        <div className='plots_heading_container'>
                                            <div className='plots_heading'>
                                                <h5>Electricity Consumption (KWH)</h5>
                                            </div>
                                        </div>

                                        <ReactApexChart
                                            options={{
                                                chart: {
                                                    height: '100%',
                                                    type: 'line',
                                                    zoom: {
                                                        enabled: false, // Disable zoom on scroll
                                                    },
                                                },
                                                stroke: {
                                                    curve: 'straight',
                                                    width: 2,
                                                },
                                                xaxis: {
                                                    categories: xData, // Make sure xData is defined in your component
                                                    labels: {
                                                        rotate: -90,
                                                    },
                                                    tickPlacement: 'on',
                                                },
                                                yaxis: {
                                                    title: {
                                                        text: 'Electricity Consumption (KWH)',
                                                    },
                                                    labels: {
                                                        formatter: function (val) {
                                                            return Math.round(val); // Rounds to the nearest integer
                                                        },
                                                    },
                                                },
                                                tooltip: {
                                                    shared: true,
                                                    intersect: false,
                                                },
                                            }}
                                            series={[
                                                {
                                                    name: 'Electricity Consumption (KWH)',
                                                    type: 'line',
                                                    data: selectedPointData.ELECTRICITY,
                                                    color: '#02ab6d',
                                                },
                                            ]}
                                            type="line"
                                        />

                                    </>

                                )}

                                {selectedPointData['WATER'] !== "NA" && (
                                    <>
                                        <div className='plots_heading_container'>
                                            <div className='plots_heading'>
                                                <h5>Water consumption (IG)</h5>
                                            </div>
                                        </div>



                                        <ReactApexChart
                                            options={{
                                                chart: {
                                                    height: '100%',
                                                    type: 'line',
                                                    zoom: {
                                                        enabled: false, // Disable zoom on scroll
                                                    },
                                                },
                                                stroke: {
                                                    curve: 'straight',
                                                    width: 2,
                                                },
                                                xaxis: {
                                                    categories: xData, // Make sure xData is defined in your component
                                                    labels: {
                                                        rotate: -90,
                                                    },
                                                    tickPlacement: 'on',
                                                },
                                                yaxis: {
                                                    title: {
                                                        text: 'Water consumption (IG)',
                                                    },
                                                },
                                                labels: {
                                                    formatter: function (val) {
                                                        return Math.round(val); // Rounds to the nearest integer
                                                    },
                                                },
                                                tooltip: {
                                                    shared: true,
                                                    intersect: false,
                                                },
                                            }}
                                            series={[
                                                {
                                                    name: 'Water consumption (IG)',
                                                    type: 'line',
                                                    data: selectedPointData.WATER,
                                                    color: '#02ab6d',
                                                },
                                            ]}
                                            type="line"
                                        />

                                    </>

                                )}






                            </div>


                        </>
                    )}










                </div>

            </div>
        </div>
    )
}

export default DEWAConsumption