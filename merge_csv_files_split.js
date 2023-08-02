const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const MAX_OUTPUT_FILE_SIZE = 100 * 1000 * 1000; // slightly less than 100 MB

async function mergeCSVFiles(filePattern, outputFileName) {
  const dataFolderPath = path.join(__dirname, 'data');
  const csvFiles = fs.readdirSync(dataFolderPath)
    .filter(file => file.match(filePattern));

  let currentOutputSize = 0;
  let currentOutputFileIndex = 1;

  for (let i = 0; i < csvFiles.length; i++) {
    const file = csvFiles[i];
    const filePath = path.join(dataFolderPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Skip headers for all files except the first one
    const startIndex = i === 0 ? 0 : fileContent.indexOf('\n') + 1;

    // Calculate the size of the chunk to be written to the current output file
    const chunkSize = fileContent.length - startIndex;

    if (currentOutputSize + chunkSize > MAX_OUTPUT_FILE_SIZE) {
      // Create a new output file if the current chunk exceeds the size limit
      currentOutputFileIndex++;
      currentOutputSize = 0;
    }

    const currentOutputFileName = `merged_data_part${currentOutputFileIndex}.csv`;
    const outputStream = fs.createWriteStream(currentOutputFileName, { flags: 'a' });

    // Write the chunk to the current output file
    outputStream.write(fileContent.slice(startIndex));
    console.log(`File ${file} processed successfully`);

    // Update the current output size
    currentOutputSize += chunkSize;
  }
}

const filePattern = /.*\.csv/; // Replace with the pattern matching your CSV files
const outputFileName = 'merged_data.csv'; // Replace with the desired output filename

mergeCSVFiles(filePattern, outputFileName);
