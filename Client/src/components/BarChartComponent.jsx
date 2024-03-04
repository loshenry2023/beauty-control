import React, { useState } from "react";
import Loader from "./Loader";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Componente del gráfico de barras
function BarChartComponent({ data, colors, name }) {
  const [isLoading, setIsLoading] = useState(true);

  if (!data) {
    return null;
  }

  const prices = data.map((item) => parseFloat(item.price));
  const maxY = Math.ceil(Math.max(...prices) / 10) * 10;

  const formatYAxisTick = (tick) => {
    return tick;
  };
  

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            domain={[0, maxY]}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill={colors[0]} name={name} barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
