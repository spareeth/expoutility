import React from 'react';
import ReactApexChart from 'react-apexcharts';


const BarChart = ({selectedData}) => {

    const xData = [
        2019,2020,2021,2022,2023
    ];

    // Get corresponding values for each month
    const yData = [
        selectedData["TOTAL_2019"], selectedData["TOTAL_2020"], selectedData["TOTAL_2021"], selectedData["TOTAL_2022"], selectedData["TOTAL_2023"], 
    ];


    const options = {
        chart: {
            height: '100%',
            type: 'bar',
            zoom: {
                enabled: false, // Disable zoom on scroll
              },
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


        stroke: {
            curve: 'straight',
            width: 2
          },
        series: [
            {
                name: 'Rates (AED)',
                type: 'bar',
                data: yData,
                color: '#011a52',
                
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
                text: 'Rates (AED)'
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
        <div>
            <ReactApexChart options={options} series={options.series} type="bar" />
        </div>
    );
}

export default BarChart;
