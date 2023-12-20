
import React from "react";
import { Doughnut } from "react-chartjs-2";


 const PieChart =({data})=> {
    return(

        <Doughnut data={{
            labels: data.map((data) => data.label),
            datasets: [
                {
                    label: "Count",
                    data: data.map((data) => data.value),
                    backgroundColor: [
                        "rgba(132, 204, 22,0.8)",
                        "rgba(249, 115, 22, 0.8)",
                        "rgba(153, 27, 27,0.8)",

                    ],
                    borderColor: [
                        "rgba(132, 204, 22,0.6)",
                        "rgba(249, 115, 22, 0.6)",
                        "rgba(153, 27, 27,0.6)",
                    ],
                    borderRadius:2,

                },
            ],
        }}
                  options={{
                      cutoutPercentage: 10,
                      plugins: {
                          title: {
                              text: "Current Severity",
                          },
                      },
                  }}
        />
    )
 }

export default PieChart;
