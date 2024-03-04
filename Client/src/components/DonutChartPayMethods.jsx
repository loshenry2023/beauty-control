import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function DonutChartPayMethods({ data, title }) {
  const formatNumber = (number) => {
    return number.toLocaleString("es-CO");
  };

  const totalValue = formatNumber(
    data.reduce((acc, entry) => acc + entry.value, 0)
  );

  const colors = [
    "#FA98C0",
    "#AB5AFA",
    "#76D1FA",
    "#5AA3FA",
    "#EFB8FA",
    "#A908F9",
  ];

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-lg font-bold mb-5 text-center dark:text-darkText">
        {title}
      </h2>
      <ResponsiveContainer className="flex flex-row" width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={120}
            // paddingAngle={1}
            fill="#8884d8"
            fontSize={14}
            label={({ value, percent }) =>
              value !== 0 ? `${(percent * 100).toFixed(2)}%` : ""
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`} // pruebo a entry.name como clave
                fill={
                  entry.value !== null && entry.value !== undefined
                    ? colors[index % colors.length]
                    : "rgba(0, 0, 0, 0)"
                }
              />
            ))}
          </Pie>
          <foreignObject
            x="40%"
            y="40%"
            width="20%"
            height="20%"
            className="  flex flex-row items-center justify-center "
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                background: "#fff",
                // border: "2px solid #000",
                borderRadius: "5px",
              }}
              className=" flex flex-row items-center justify-center text-center"
            >
              <text
                x="50%"
                y="50%"
                fontSize="14"
                fontWeight="bold"
                fill="#000"
                // className=" pt-4 "
              >
                {totalValue === "0"
                  ? "Sin información nueva"
                  : `Total: $${totalValue}`}
              </text>
            </div>
          </foreignObject>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonutChartPayMethods;
