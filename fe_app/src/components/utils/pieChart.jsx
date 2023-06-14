import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart() {
    const Data = {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
        {
            label: "% Lifts Open",
            data: [33, 40, 80, 90, 100, 60]
            //borderColor: "rgba(19, 49, 92, 1)",
            //backgroundColor: "rgba(19, 49, 92,0.2)",
        },
        {
            label: "% Trails Open",
            data: [15, 30, 60, 95, 95, 45]
            //borderColor: "rgba(141, 169, 196, 1)",
            //backgroundColor: "rgba(141, 169, 196,0.2)",
        },
        {
            label: "% Terrain Open",
            data: [9, 23, 65, 83, 90, 34]
            //borderColor: "rgba(19, 64, 116, 1)",
            //backgroundColor: "rgba(19, 64, 116,0.2)",
        }
        ]
    };
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
      <Pie
        data={Data}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020",
            },
          },
        }}
      />
    </div>
  );
}
export default PieChart;
