import React from 'react';
import ReactApexChart from 'react-apexcharts';


const LineChart = ({ selectedData }) => {

    const xData = [
        "Jan-21", "Feb-21", "Mar-21", "Apr-21", "May-21", "Jun-21", "Jul-21", "Aug-21", "Sep-21", "Oct-21", "Nov-21", "Dec-21",
        "Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22", "Jul-22", "Aug-22", "Sep-22", "Oct-22", "Nov-22", "Dec-22",
        "Jan-23", "Feb-23", "Mar-23", "Apr-23", "May-23", "Jun-23", "Jul-23", "Aug-23", "Sep-23", "Oct-23", "Nov-23", "Dec-23",
        "Jan-24", "Feb-24", "Mar-24", "Apr-24", "May-24", "Jun-24", "Jul-24", "Aug-24"
    ];

    // Get corresponding values for each month
    const yData = [
        selectedData["Jan-21"], selectedData["Feb-21"], selectedData["Mar-21"], selectedData["Apr-21"], selectedData["May-21"], selectedData["Jun-21"],
        selectedData["Jul-21"], selectedData["Aug-21"], selectedData["Sep-21"], selectedData["Oct-21"], selectedData["Nov-21"], selectedData["Dec-21"],
        selectedData["Jan-22"], selectedData["Feb-22"], selectedData["Mar-22"], selectedData["Apr-22"], selectedData["May-22"], selectedData["Jun-22"],
        selectedData["Jul-22"], selectedData["Aug-22"], selectedData["Sep-22"], selectedData["Oct-22"], selectedData["Nov-22"], selectedData["Dec-22"],
        selectedData["Jan-23"], selectedData["Feb-23"], selectedData["Mar-23"], selectedData["Apr-23"], selectedData["May-23"], selectedData["Jun-23"],
        selectedData["Jul-23"], selectedData["Aug-23"], selectedData["Sep-23"], selectedData["Oct-23"], selectedData["Nov-23"], selectedData["Dec-23"],
        selectedData["Jan-24"], selectedData["Feb-24"], selectedData["Mar-24"], selectedData["Apr-24"], selectedData["May-24"], selectedData["Jun-24"],
        selectedData["Jul-24"], selectedData["Aug-24"]
    ];

    const options = {
        chart: {
            height: '100%',
            type: 'line',
            zoom: {
                enabled: false, // Disable zoom on scroll
            },
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        series: [
            {
                name: 'Rates (AED)',
                type: 'line',
                data: yData,
                color: '#02ab6d',

            },
        ],
        xaxis: {

            categories: xData,
            labels: {
                rotate: -90,
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
            <ReactApexChart options={options} series={options.series} type="line" />
        </div>
    );
}

export default LineChart;
