"use client";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@mui/material";

import { Chart } from "react-google-charts";

type Props = {
  fetchedPlayer: players;
};

const ModalValueChart = ({ fetchedPlayer }: Props) => {
  const last60DaysData = fetchedPlayer.marketValues.slice(-60);
  const percentage = 0.1;

  const chartData = [
    ["Date", "Market Value"],
    ...last60DaysData.map((entry) => [
      new Date(entry.date).toLocaleDateString("es-EU", {
        month: "short",
        day: "numeric",
      }),
      Number(entry.marketValue), // Ensure this is a number
    ]),
  ];

  const marketValueArray = last60DaysData.map((entry) => entry.marketValue);
  const minValue =
    Math.min(...marketValueArray) - Math.min(...marketValueArray) * percentage;
  const maxValue = Math.max(...marketValueArray) + Math.max(...marketValueArray) * percentage;

  return (
    <Card className="px-2 py-0 my-0 w-full flex  justify-center items-center rounded-full border-none shadow-none">
      <Chart
        width={"100%"}
        height={"100%"}
        chartType="AreaChart"
        loader={
          <div className="flex flex-col justify-between items-center gap-4">
            <p className="text-center text-sm">Cargando...</p>
            <CircularProgress color="inherit" className="m-auto" />
          </div>
        }
        data={chartData}
        options={{
          
          title: "Valor de mercado",
          series: {
            0: { color: "#1a202c" },
          },
          hAxis: {
            title: "Ultimos 60 dias",
            format: "short",
            textPosition: "none",
          },
          vAxis: {
            format: "short",
            
            viewWindow: {
              min: minValue,
              max: maxValue,
            }
            
          },
          chartArea: { width: "89%", height: "80%", top: 0, right: 3 },

          legend: "none",

          titlePosition: "none",
        }}
      />
     
    </Card>
  );
};

export default ModalValueChart;
