import React from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  title: string;
  series: number[];
  labels: string[];
}

const PieChart: React.FC<PieChartProps> = ({ title, series, labels }) => {
  return (
    <div className="max-w-lg w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
        {title}
      </h5>

      <div className="py-6" id="pie-chart">
        <ReactApexChart
          options={{ labels }}
          series={series}
          type="pie"
          height={400}
        />
      </div>
    </div>
  );
};

export { PieChart };
