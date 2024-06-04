"use client";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@mui/material";

import { Chart } from "react-google-charts";

type Props = {
  fetchedPlayer: players;
};

export default function PlayerValueChart  ({ fetchedPlayer }: Props) {
  const last60DaysData = (fetchedPlayer.marketValues as any[])?.slice(-60) || [];
  const percentage = 0.1;

  const chartData = [
    ["Date", "Market Value"],
    ...last60DaysData.map((entry: { date: string | number | Date; marketValue: any; }) => [
      new Date(entry.date).toLocaleDateString("es-EU", {
        month: "short",
        day: "numeric",
      }),
      Number(entry.marketValue), 
    ]),
  ];

  const marketValueArray = last60DaysData.map((entry) => entry.marketValue);
  const minValue =
    Math.min(...marketValueArray) - Math.min(...marketValueArray) * percentage;
  const maxValue =
    Math.max(...marketValueArray) + Math.max(...marketValueArray) * percentage;

  return (
    <Card className="px-2 py-0 my-0 w-full h-56 md:h-96 flex justify-center items-center rounded-full border-none shadow-none">
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
          curveType: "function",
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
            },
          },
          chartArea: { width: "80%", height: "90%", top: 0 },
          

          legend: "none",

          titlePosition: "none",
        }}
      />
    </Card>
  );
};
