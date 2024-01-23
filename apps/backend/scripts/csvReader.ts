import { readFileSync } from 'fs';


/**
 * Reads data from a CSV file and returns it as an array of objects.
 *
 * @param {string} filePath - The file system path to the CSV file to be read.
 *
 * @returns {any[]} An array of objects, where each object represents a row from the CSV file,
 *                  with keys corresponding to the column headers and values corresponding to the
 *                  data in each column.
 *
 **/


export function readCSV(filePath: string): any[] {
    //Read the file
    const fileContent = readFileSync(filePath, 'utf8');

    //Split the file content by new line to get the rows
    const lines = fileContent.split('\n');

    //Extract headers
    const headers = lines[0].split(',');

    //Parse each line
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {} as any);
    });

    return data;
}
