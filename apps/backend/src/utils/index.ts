import { readFileSync } from "fs";

/**
 * Escapes a value for use in a CSV file
 */
function escapeCSV(value: string | number | boolean) {
  if (typeof value === "string") {
    value = value.replace(/"/g, '""'); // Escape double quotes
    if (value.includes(",") || value.includes("\n")) {
      value = `"${value}"`; // Quote fields with commas or newlines
    }
  }
  return value;
}

/**
 * Parses data from a CSV file. Expects a CSV file with a header row, where each
 * column header is unique, and has LF line endings.
 *
 * @param {string} filePath - The file system path to the CSV file to be read.
 * @returns {Record<string, unknown>[]} An array of objects, where each object
 *                                      represents a row in the CSV file. Each
 *                                      object has keys corresponding to the
 *                                      column headers in the CSV file.
 **/
const readCSV = (filePath: string): Record<string, unknown>[] => {
  const fileContent = readFileSync(filePath, "utf8");
  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as Record<string, unknown>);
  });
};

function objectsToCSV(data: object[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map((field) => escapeCSV(field)).join(",");
  const csvRows = data.map((row) => {
    // @ts-expect-error - TS doesn't know that `row` has the same keys as `headers`
    return headers.map((fieldName) => escapeCSV(row[fieldName])).join(",");
  });
  return [csvHeaders, ...csvRows].join("\n");
}

export { objectsToCSV, readCSV };
