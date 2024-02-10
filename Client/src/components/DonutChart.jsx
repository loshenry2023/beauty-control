import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const colors = [
  "#FA98C0",
  "#AB5AFA",
  "#76D1FA",
  "#5AA3FA",
  "#EFB8FA",
  "#A908F9",
];

function DonutChart({ data, title }) {
  const [showDetails, setShowDetails] = useState(false);

  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="w-80 p-4 shadow-sm shadow-black rounded mt-10">
      <h2 className="w-full text-lg font-bold text-center dark:text-darkText">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#000"
            // paddingAngle={1}
            label={({ value, percent }) =>
              value !== 0 ? `${(percent * 100).toFixed(2)}%` : ""
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fontSize={12}
                fill={
                  entry.value !== null && entry.value !== undefined
                    ? colors[index % colors.length]
                    : "rgba(0, 0, 0, 0)"
                }
              />
            ))}
          </Pie>
          <foreignObject x="40%" y="40%" width="20%" height="20%">
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                background: "#fff",
                // border: "2px solid #000",
                borderRadius: "5px",
              }}
              className=" flex flex-row items-center justify-center text-center px-2"
            >
              <text
                x="50%"
                y="50%"
                fontWeight="bold"
                fill="#000"
                className=" text-center "
              >
                {" "}
                {`Total: ${totalValue}`}
              </text>
            </div>
          </foreignObject>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col items-center justify-center">
        <button
          className=" rounded-xl border p-0.5 w-40 sm:mt-0 dark:text-darkText"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Ocultar Detalles" : "Mostrar Detalles"}
        </button>
        {showDetails && (
          <ul className="mt-2">
            {data.map((entry) => (
              <div
                className=""
                key={`legend-${entry.name}`} // probe entry.name como clave
                style={{ marginBottom: "10px" }}
              >
                <li className="text-md dark:text-darkText">
                  <span
                    style={{
                      display:
                        entry && entry.name && entry.name.includes("Total")
                          ? "none"
                          : "inline-block",
                      width: "12px",
                      height: "12px",
                      backgroundColor:
                        colors[data.indexOf(entry) % colors.length],
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  ></span>
                  {entry ? `${entry.name}: ${entry.value}` : ""}
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DonutChart;
