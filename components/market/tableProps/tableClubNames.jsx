import React from "react";

const getShortName = (name) => {
  const teamShortNames = {
      21: 'ALA',
      1: 'ALM',
      2: 'ATM',
      3: 'ATH',
      4: 'BAR',
      5: 'BET',
      6: 'CEL',
      9: 'GET',
      10: 'GRA',
      13: 'OSA',
      14: 'RAY',
      15: 'RMA',
      16: 'RSO',
      17: 'SEV',
      18: 'VAL',
      20: 'VIL',
      31: 'LPA',
      162: 'CAD',
      28: 'GIR',
      33: 'MLL',
    };  
    return teamShortNames[name] || '';
  }

export default (props) => {
  const cellValue = props.value;
  const shortName = getShortName(cellValue); 

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center align-middle ">
        {shortName}
      </div>
    </div>
  );
};