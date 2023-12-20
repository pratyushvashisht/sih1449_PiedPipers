import React from "react";
import { defaults} from "chart.js/auto";
import { Line } from "react-chartjs-2";


defaults.maintainAspectRatio = false;
defaults.responsive = true;
const LineChart =({data})=> {
    return(

        <Line   data={{
            labels: data.map((data) => data.label),
            datasets: [
                {
                    label: "High",
                    data: data.map((data) => data.High),
                    backgroundColor: "rgba(12, 74, 110,0.7)",
                    borderColor: "rgb(12, 74, 110)",
                    fill:true,
                    borderWidth: 1,
                },
                {
                    label: "Moderate",
                    data: data.map((data) => data.Moderate),
                    backgroundColor: "rgba(2, 132, 199,0.7)",
                    borderColor: "rgb(2, 132, 199)",
                    fill:true,
                    borderWidth: 1,
                },

                {
                    label: "Low",
                    data: data.map((data) => data.Low),
                    backgroundColor: 'rgba(56, 189, 248,0.7)',
                    borderColor: "rgb(56, 189, 248)",
                    borderWidth: 1,
                    fill:true,
                },

            ],
        }}
                options={{
                    pointHitRadius:10,
                    elements: {
                        line: {
                            tension: 0.3,
                        },
                    },
                    plugins: {
                        title: {
                            text: "Monthly Record",
                        },
                    },
                }}
        />
    )
}
export default LineChart
