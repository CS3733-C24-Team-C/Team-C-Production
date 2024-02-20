import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart: React.FC = () => {
    const chartData = {
        series: [5, 10, 10, 20, 25, 30],
        options: {
            chart: {
                type: 'pie',
            },
            labels: ['Other', 'Maintenance', 'Patient relocation', 'Janitorial', 'Patient consultation', 'Medicine'],
        },
    };

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Requests statistics</h5>

            <div className="py-6" id="pie-chart">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="pie"
                    height={400}
                />
            </div>

            <div
                className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div className="flex justify-between items-center pt-5">

                    <button
                        id="dropdownDefaultButton"
                        data-dropdown-toggle="empTypeDropdown"
                        data-dropdown-placement="bottom"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                        type="button">
                        Employee role assigned
                        <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>

                    <div id="empTypeDropdown"
                         className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownDefaultButton">
                            <li>
                                <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Admin</a>
                            </li>
                            <li>
                                <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Employee</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChart;

