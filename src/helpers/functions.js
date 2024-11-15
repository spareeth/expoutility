
export    const fillDensityColor = (ColorLegendsDataItem, density) => {
  if (!ColorLegendsDataItem) return null;

  // Check for density explicitly considering 0 as a valid value
  if (density !== undefined && density !== null) {
    const valueColorsMap = ColorLegendsDataItem.Value.map((value, index) => ({ value, color: ColorLegendsDataItem.Colors[index] }));

    for (let i = 0; i < valueColorsMap.length; i++) {
      if (density > valueColorsMap[i].value) {
        return valueColorsMap[i].color;
      }
    }

    // Default to the last color if no match found
    return ColorLegendsDataItem.Colors[ColorLegendsDataItem.Colors.length - 1];
  } else {
    return "white";
  }
};



export const calculateAverageOfArray = (arr) => {
  if (arr==="NA") {
      return 0;
  }
  if (arr.length === 0) {
    return 0;
}

  const sum = arr.reduce((total, num) => total + num, 0);
  const average = sum / arr.length;
  return parseFloat(average.toFixed(3));
};
