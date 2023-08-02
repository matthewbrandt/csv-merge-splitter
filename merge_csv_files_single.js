const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

async function mergeCSVFiles(filePattern, outputFileName) {
  const dataFolderPath = path.join(__dirname, 'data');
  const csvFiles = fs.readdirSync(dataFolderPath)
    .filter(file => file.match(filePattern));

  const outputStream = fs.createWriteStream(outputFileName);

  for (let i = 0; i < csvFiles.length; i++) {
    const file = csvFiles[i];
    const filePath = path.join(dataFolderPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Skip headers for all files except the first one
    const startIndex = i === 0 ? 0 : fileContent.indexOf('\n') + 1;

    // Append data rows to the output file
    outputStream.write(fileContent.slice(startIndex));
    console.log(`File ${file} processed successfully`);
  }

  outputStream.end();
}

const filePattern = /.*\.csv/; // Replace with the pattern matching your CSV files
const outputFileName = 'merged_data.csv'; // Replace with the desired output filename

mergeCSVFiles(filePattern, outputFileName);
