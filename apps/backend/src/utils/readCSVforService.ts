import { readFileSync } from 'fs';

const readCSV = (filePath: string): Record<string, unknown>[] => {
    const fileContent = readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').map((line) => line.trim()).filter((line) => line);

    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
        const values = parseCSVLine(line);

        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {} as Record<string, unknown>);
    });
};

const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let currentField = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === ',' && !isWithinQuotes(line, i)) {
            values.push(currentField.trim());
            currentField = '';
        } else {
            currentField += char;
        }
    }

    // Add the last field after the loop
    values.push(currentField.trim());

    return values;
};

const isWithinQuotes = (line: string, index: number): boolean => {
    let withinQuotes = false;
    for (let i = 0; i < index; i++) {
        if (line[i] === '"') {
            withinQuotes = !withinQuotes;
        }
    }
    return withinQuotes;
};

export { readCSV };
