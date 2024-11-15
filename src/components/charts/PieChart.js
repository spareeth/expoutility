import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ landCoverValues, colorPallete, ClassesName }) => {


  const options = {
    labels: ClassesName,
    colors: colorPallete,
    legend: {
      show: true,
      position: 'bottom'
    },
    toolbar: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => `${parseFloat(value.toFixed(0)).toLocaleString()} ha`
      }
    },

  };

  const series = landCoverValues;


  const downloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Landcover Class,Area (ha)\r\n";
    ClassesName.forEach((cls, index) => {
        csvContent += `${cls},${parseFloat(landCoverValues[index].toFixed(0)).toLocaleString()}\r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "land_cover_data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}


  return (
    <div className=''>
      <div className='chart_download_btn'>
      <button onClick={downloadCsv}>Download CSV</button>
      </div>
      
      <ReactApexChart 
        options={options}
        series={series}
        type="pie"
      />
    </div>
  );
}

export default PieChart;
