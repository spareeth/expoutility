import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';


const MonthlyBarChart = ({ selectedData }) => {
    const [selectedMonth, setSelectedMonth] = useState('Jan');

    const handleMonthSelection = (e) => {
        setSelectedMonth(e.target.value)
    }

    const xData = [2021, 2022, 2023];

    // Define the y-axis data for each year
    const yData = [
        selectedData[`${selectedMonth}-21`] || 0, // Handle missing data with a default value of 0
        selectedData[`${selectedMonth}-22`] || 0,
        selectedData[`${selectedMonth}-23`] || 0,
    ];

    // Check if data for 2024 exists, and only add it if it exists
    if (selectedData[`${selectedMonth}-24`] && selectedData[`${selectedMonth}-24`] !== undefined && selectedData[`${selectedMonth}-24`] !== null) {
        xData.push(2024);
        yData.push(selectedData[`${selectedMonth}-24`]);
    }


    const options = {
        chart: {
            height: '100%',
            type: 'bar',
            zoom: {
                enabled: false, // Disable zoom on scroll
              },
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top', 
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return `${Math.round(val)}`;
            },
            offsetY: -20, 
            background: {
                enabled: true,
                foreColor: '#000', // Sets the text foreground color
                borderRadius: 2,
                padding: 4,
                opacity: 0.7,
                borderWidth: 1,
                borderColor: '#fff'
            }
        },
        series: [
            {
                name: `${selectedMonth} rates (AED)`,
                type: 'bar',
                data: yData,
                color: '#ba7c00',

            },
        ],
        xaxis: {

            categories: xData,
            labels: {
                rotate: 0,
            },
            tickPlacement: 'on',
        },


        yaxis: {
            title: {
                text: `Rates (AED) in ${selectedMonth} month`,
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

    };

    return (
        <>
            <div className='chart_year_container' >
                <label>Month: &nbsp; </label>
                <select value={selectedMonth} onChange={handleMonthSelection} style={{ marginRight: "10px" }}>
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                </select>

            </div>
            <ReactApexChart options={options} series={options.series} type="bar" />
        </>
    );
}

export default MonthlyBarChart;
