const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

function formatDate(dateString) {
  const [month, day, year] = dateString.split('/');
  return `${day}_${month}_${year}`;
}

async function convertDateFormat(inputFileName, outputFileName) {
  const fileContent = fs.readFileSync(inputFileName, 'utf-8');
  const outputData = [];

  Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    step: (row) => {
      const formattedDate = formatDate(row.data.M_D_YYYY);
      const newRow = {
        ...row.data,
        M_D_YYYY: formattedDate,
      };
      outputData.push(newRow);
    },
    complete: () => {
      const outputCSV = Papa.unparse(outputData);
      fs.writeFileSync(outputFileName, outputCSV, 'utf-8');
    },
  });
}

const inputFileName = 'merged_data_part4.csv'; // Replace with your input CSV file
const outputFileName = 'merged_data_part4_corr.csv'; // Replace with the desired output CSV filename

convertDateFormat(inputFileName, outputFileName);
