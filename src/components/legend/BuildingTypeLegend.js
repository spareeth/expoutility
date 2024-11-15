import React from 'react';

const BuildingTypeLegend = ({ ColorLegendsDataItem }) => {
    const { Colors, Labels } = ColorLegendsDataItem;

    const reversedColors = [...Colors].reverse();
    const reversedLabels = [...Labels].reverse();





    return (
        <div className="legend_container">
            Buildings



            <div className="legend-color-container">



                {reversedColors.map((color, index) => (
                    <div key={index} className="legend_item">
                        <span
                            className="legend_item_square"
                            style={{ backgroundColor: color }}
                        />
                        <span className="legend-label">
                            {reversedLabels[index]}
                        </span>
                    </div>
                ))}

                <div className="legend_item">
                    <span
                        className="legend_item_square"
                        style={{ backgroundColor: "#cccccc" }}
                    />
                    <span className="legend-label">
                        Other
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BuildingTypeLegend;
