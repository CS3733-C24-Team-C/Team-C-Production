import React from "react";
import ReactApexChart from "react-apexcharts";

interface StackedHorizontalBarChartProps {
    series: {
        type: string;
        data: number[];
    }[];
    labels: string[];
}

const StackedHorizontalBarChart: React.FC<StackedHorizontalBarChartProps> = ({ series, labels }) => {
    const options= {
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            stackType: "100%",
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        stroke: {
            width: 1,
            colors: ["#fff"],
        },
        xaxis: {
            categories: labels,
        },
        yaxis: {
            title: {
                text: "Request Types",
            },
        }
    };

    return (
        <div className="max-w-3xl w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
                Request types completion status
            </h5>

            <div className="py-6">
                <ReactApexChart options={options} series={series} type="bar" height={400} />
            </div>
        </div>
    );
};

export {StackedHorizontalBarChart};
