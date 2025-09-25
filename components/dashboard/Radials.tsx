"use client";

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export function Radials({ data }: { data: { name: string; value: number }[] }) {
  // expects values 0..100
  const colors = ["#a78bfa", "#22d3ee", "#38bdf8", "#f472b6", "#34d399"];
  return (
    <div className="card-blur rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Goal Progress</h3>
        <span className="text-xs text-black/60 dark:text-white/60">Radial</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.slice(0, 3).map((d, i) => (
          <div key={d.name} className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ ...d, fill: colors[i % colors.length] }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={8} />
                {/* center label */}
                <foreignObject x="35%" y="35%" width="30%" height="30%">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-sm font-semibold">{Math.round(d.value)}%</div>
                  </div>
                </foreignObject>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-center opacity-80">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
