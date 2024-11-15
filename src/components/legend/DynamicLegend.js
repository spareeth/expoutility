import React from 'react';

const DynamicLegend = ({ ColorLegendsDataItem, setSelectedYear, selectedYear }) => {
    const { Title, Unit, Colors, Value } = ColorLegendsDataItem;

    const reversedColors = [...Colors].reverse();
    const reversedValues = [...Value].reverse();

    const handleYearSelection = (e) => {
        setSelectedYear(e.target.value)
    }



    return (
        <div className="legend_container">
            Annual variation of utility charges (AED) in year &nbsp;
            <select value={selectedYear} onChange={handleYearSelection} style={{ marginRight: "10px" }}>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>

            </select>


            <div className="legend-color-container">
            <div className="legend_item">
                <span
                    className="legend_item_square"
                    style={{ backgroundColor: "white" }}
                />
                <span className="legend-label">
                    No Data
                </span>
                </div>


                {reversedColors.map((color, index) => (
                    <div key={index} className="legend_item">
                        <span
                            className="legend_item_square"
                            style={{ backgroundColor: color }}
                        />
                        <span className="legend-label">
                            {index === reversedColors.length - 1 ? `> ${reversedValues[index]}` :
                                // index === 0 ? `< ${reversedValues[index]}` :
                                `${reversedValues[index]} — ${reversedValues[index + 1]}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicLegend;
