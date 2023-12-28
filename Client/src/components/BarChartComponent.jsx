import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Componente del gráfico de barras
function BarChartComponent({ data, colors, name }) {
  console.log(data);
  const prices = data.map((item) => parseFloat(item.price));

  const maxY = Math.ceil(Math.max(...prices) / 10) * 10;
  const formatYAxisTick = (tick) => {
    // Personaliza el formato de las etiquetas del eje Y según tus necesidades
    return `$${tick.toFixed(2)}`; // Formato de ejemplo
  };
  return (
    <ResponsiveContainer width="80%" height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="dateModification"
          tickFormatter={(tick) => new Date(tick).toLocaleString()}
        />
        <YAxis
          tickFormatter={formatYAxisTick}
          domain={[0, maxY]}
          tickCount={Math.ceil(maxY / 10) + 1}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="price" fill={colors[0]} name={name} barSize={25} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;
